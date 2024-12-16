import { API_CONFIG, API_ENDPOINTS } from './constants';

export async function createTryOnTask(humanImage: string, clothImage: string) {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.TRY_ON}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_CONFIG.ACCESS_KEY_ID}:${API_CONFIG.ACCESS_KEY_SECRET}`,
    },
    body: JSON.stringify({
      model_name: 'kolors-virtual-try-on-v1',
      human_image: humanImage,
      cloth_image: clothImage,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create try-on task');
  }

  return response.json();
}

export async function checkTaskStatus(taskId: string) {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TRY_ON}/${taskId}`,
    {
      headers: {
        'Authorization': `${API_CONFIG.ACCESS_KEY_ID}:${API_CONFIG.ACCESS_KEY_SECRET}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to check task status');
  }

  return response.json();
}