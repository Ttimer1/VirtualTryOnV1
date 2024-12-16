import { API_CONFIG, API_ENDPOINTS } from '../../config/api.config';
import { createApiHeaders, handleNetworkError } from '../../utils/api.utils';
import { handleApiResponse } from './response.handler';
import { logger } from '../../utils/logger';
import type { ApiResponse, TaskResult } from './types';

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
      
      // Debug request details
      console.log(`Request URL: ${API_CONFIG.BASE_URL}${API_ENDPOINTS.TRY_ON}`);
      console.log('Request Headers:', createApiHeaders());
      
      // Gebruik de echte image data en valideer deze
      if (!this.validateImageSize(humanImage) || !this.validateImageSize(clothImage)) {
        throw new Error('Image size exceeds 10MB limit');
      }
  
      // Clean de base64 data
      const cleanHumanImage = this.cleanBase64Image(humanImage);
      const cleanClothImage = this.cleanBase64Image(clothImage);
  
      const requestBody = {
        model_name: 'kolors-virtual-try-on-v1',
        human_image: cleanHumanImage,
        cloth_image: cleanClothImage,
      };
      
      console.log('Complete Request:', {
        method: 'POST',
        headers: createApiHeaders(),
        body: JSON.stringify(requestBody, null, 2)
      });
  
      return await this.fetchWithTimeout<TaskResult>(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TRY_ON}`,
        {
          method: 'POST',
          headers: createApiHeaders(),
          body: JSON.stringify(requestBody),
        }
      );
    } catch (error) {
      console.error('Full error details:', error);
      const processedError = handleNetworkError(error);
      logger.error('Failed to create try-on task', { error: processedError.message });
      throw processedError;
    }
  }

  async checkStatus(taskId: string): Promise<ApiResponse<TaskResult>> {
    try {
      logger.info(`Checking task status for ${taskId}`);
      
      // Debug request details
      console.log(`Status Check URL: ${API_CONFIG.BASE_URL}${API_ENDPOINTS.TRY_ON}/${taskId}`);
      console.log('Status Check Headers:', createApiHeaders(false));
      
      return await this.fetchWithTimeout<TaskResult>(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TRY_ON}/${taskId}`,
        {
          headers: createApiHeaders(false),
        }
      );
    } catch (error) {
      console.error('Status Check Error Details:', error);
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
      // Debug fetch request
      console.log('Fetch Request:', { 
        url,
        method: options.method,
        headers: options.headers,
      });
      
      const response = await fetch(url, requestInit);
      console.log('Fetch Response Status:', response.status);
      
      // Verwijder deze regel:
      // console.log('Raw Response:', await response.text());
      
      const result = await handleApiResponse<T>(response);
      
      const timeoutId = (requestInit.signal as any).timeoutId;
      if (timeoutId) clearTimeout(timeoutId);
      
      return result;
    } catch (error) {
      // ... rest blijft hetzelfde {
      console.error('Fetch Error:', error);
      const timeoutId = (requestInit.signal as any).timeoutId;
      if (timeoutId) clearTimeout(timeoutId);
      
      throw error;
    }
  }
}

export const tryOnService = new TryOnService();