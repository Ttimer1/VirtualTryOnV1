import React from 'react';
import { Shirt } from 'lucide-react';

export function Header() {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <Shirt className="h-12 w-12 text-indigo-600" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Virtual Try-On
      </h1>
      <p className="text-lg text-gray-600">
        Upload your photo and try on clothes virtually
      </p>
    </div>
  );
}