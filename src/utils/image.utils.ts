export const validateImage = (file: File): string | null => {
  if (!file.type.startsWith('image/')) {
    return 'File must be an image';
  }

  if (file.size > 10 * 1024 * 1024) { // 10MB
    return 'Image must be smaller than 10MB';
  }

  return null;
};

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};