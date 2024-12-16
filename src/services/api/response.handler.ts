import { logger } from '../../utils/logger';
import type { ApiResponse } from './types';

export async function handleApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    const responseText = await response.text();
    console.log('Complete Server Response:', responseText); // Log de ruwe response

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = responseText; // Bewaar de ruwe tekst als parsing faalt
      }
      
      const errorDetails = {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorData
      };

      console.log('Detailed Error Information:', errorDetails);
      logger.error('API Error Response:', errorDetails);
      
      throw new Error(
        errorData?.message || 
        errorData?.error || 
        errorData || 
        `HTTP error! status: ${response.status}`
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Invalid JSON response: ${responseText}`);
    }
    
    return data;
  } catch (error) {
    console.error('Complete Error Details:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
    throw error;
  }
}