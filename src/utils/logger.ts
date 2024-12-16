type LogData = {
  error?: unknown;
  [key: string]: unknown;
};

export const logger = {
  error: (message: string, data?: LogData) => {
    console.error(`[Error] ${message}`, data);
  },
  info: (message: string, data?: LogData) => {
    console.info(`[Info] ${message}`, data);
  },
  warn: (message: string, data?: LogData) => {
    console.warn(`[Warning] ${message}`, data);
  },
};