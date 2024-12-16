import React from 'react';
import { Loader2 } from 'lucide-react';

interface TryOnResultProps {
  loading: boolean;
  error?: string;
  imageUrl?: string;
}

export function TryOnResult({ loading, error, imageUrl }: TryOnResultProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-gray-600">Processing your virtual try-on...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        <p>{error}</p>
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt="Virtual try-on result"
          className="w-full h-auto"
        />
      </div>
    );
  }

  return null;
}