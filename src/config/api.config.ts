export const API_CONFIG = {
  BASE_URL: 'https://api-stunt.kling.ai/v1',  // Volledige URL, geen relatief pad
  ACCESS_KEY_ID: '06a812be73584662bffdf955756dc4d2',
  ACCESS_KEY_SECRET: '3821b442e6c34577a0c4b6eda1eafa40',
  TIMEOUT: 120000,
} as const;

export const API_ENDPOINTS = {
  TRY_ON: '/images/kolors-virtual-try-on',
} as const;