import React from 'react';
import { ImageUpload } from './ImageUpload';

interface UploadSectionProps {
  onHumanImageSelect: (base64: string) => void;
  onClothImageSelect: (base64: string) => void;
}

export function UploadSection({ onHumanImageSelect, onClothImageSelect }: UploadSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <ImageUpload
        label="Upload Your Photo"
        onImageSelect={onHumanImageSelect}
      />
      <ImageUpload
        label="Upload Clothing"
        onImageSelect={onClothImageSelect}
      />
    </div>
  );
}