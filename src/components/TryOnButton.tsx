import React from 'react';

interface TryOnButtonProps {
  onClick: () => void;
  disabled: boolean;
}

export function TryOnButton({ onClick, disabled }: TryOnButtonProps) {
  return (
    <div className="text-center mb-8">
      <button
        onClick={onClick}
        disabled={disabled}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Try On Clothing
      </button>
    </div>
  );
}