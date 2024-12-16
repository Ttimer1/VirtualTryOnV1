import { API_CONFIG, API_ENDPOINTS, getAuthHeader } from '../config/api.config';
import { logger } from '../utils/logger';
import type { KlingAIResponse } from '../types/api';

class APIService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      logger.error('API Error Response:', errorData);
      throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.code !== 0) {
      logger.error('API Business Error:', data);
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  }

  async createTryOnTask(humanImage: string, clothImage: string): Promise<KlingAIResponse> {
    try {
      logger.info('Creating try-on task');
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.TRY_ON}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader(),
        },
        body: JSON.stringify({
          model_name: 'kolors-virtual-try-on-v1',
          human_image: humanImage,
          cloth_image: clothImage,
        }),
      });

      return this.handleResponse<KlingAIResponse>(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error('Failed to create try-on task', { error: errorMessage });
      throw new Error(`Failed to create try-on task: ${errorMessage}`);
    }
  }

  async checkTaskStatus(taskId: string): Promise<KlingAIResponse> {
    try {
      logger.info(`Checking task status for ${taskId}`);
      
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TRY_ON}/${taskId}`,
        {
          headers: {
            'Authorization': getAuthHeader(),
          },
        }
      );

      return this.handleResponse<KlingAIResponse>(response);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      logger.error('Failed to check task status', { error: errorMessage });
      throw new Error(`Failed to check task status: ${errorMessage}`);
    }
  }
}

export const apiService = new APIService();