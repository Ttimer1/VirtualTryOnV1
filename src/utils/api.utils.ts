import { API_CONFIG } from '../config/api.config';
export const getAuthHeader = () => {
  return `${API_CONFIG.ACCESS_KEY_ID}:${API_CONFIG.ACCESS_KEY_SECRET}`;
};

export const createApiHeaders = (includeContentType = true) => {
  const headers: Record<string, string> = {
    'Authorization': `${API_CONFIG.ACCESS_KEY_ID}:${API_CONFIG.ACCESS_KEY_SECRET}`,
    'Access-Control-Allow-Origin': '*',
  };
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
};

export const handleNetworkError = (error: unknown): Error => {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return new Error('Network error: Please check your internet connection and try again');
  }
  
  if (error instanceof DOMException && error.name === 'AbortError') {
    return new Error('Request timed out. Please try again');
  }
  
  return error instanceof Error ? error : new Error('Unknown error occurred');
};

// try-on.service.ts
export class TryOnService {
  private cleanBase64Image(imageData: string): string {
    return imageData.replace(/^data:image\/\w+;base64,/, '');
  }

  private validateImageSize(base64: string): boolean {
    // Check if image size is under 10MB
    const sizeInBytes = (base64.length * 3) / 4;
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB <= 10;
  }

  private createRequestInit(options: RequestInit = {}): RequestInit {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    const signal = controller.signal;
    (signal as any).timeoutId = timeoutId;

    return {
      ...options,
      signal,
    };
  }

  async createTask(humanImage: string, clothImage: string): Promise<ApiResponse<TaskResult>> {
    try {
      logger.info('Creating try-on task');
      
      // Clean and validate images
      const cleanHumanImage = this.cleanBase64Image(humanImage);
      const cleanClothImage = this.cleanBase64Image(clothImage);

      if (!this.validateImageSize(cleanHumanImage) || !this.validateImageSize(cleanClothImage)) {
        throw new Error('Image size exceeds 10MB limit');
      }

      return await this.fetchWithTimeout<TaskResult>(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TRY_ON}`,
        {
          method: 'POST',
          headers: createApiHeaders(),
          body: JSON.stringify({
            model_name: 'kolors-virtual-try-on-v1',
            human_image: cleanHumanImage,
            cloth_image: cleanClothImage,
          }),
        }
      );
    } catch (error) {
      const processedError = handleNetworkError(error);
      logger.error('Failed to create try-on task', { error: processedError.message });
      throw processedError;
    }
  }

  async checkStatus(taskId: string): Promise<ApiResponse<TaskResult>> {
    try {
      logger.info(`Checking task status for ${taskId}`);
      
      return await this.fetchWithTimeout<TaskResult>(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TRY_ON}/${taskId}`,
        {
          headers: createApiHeaders(false),
        }
      );
    } catch (error) {
      const processedError = handleNetworkError(error);
      logger.error('Failed to check task status', { error: processedError.message });
      throw processedError;
    }
  }

  private async fetchWithTimeout<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const requestInit = this.createRequestInit(options);
    
    try {
      const response = await fetch(url, requestInit);
      const result = await handleApiResponse<T>(response);
      
      const timeoutId = (requestInit.signal as any).timeoutId;
      if (timeoutId) clearTimeout(timeoutId);
      
      return result;
    } catch (error) {
      const timeoutId = (requestInit.signal as any).timeoutId;
      if (timeoutId) clearTimeout(timeoutId);
      
      throw error;
    }
  }
}