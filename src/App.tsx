import React from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { TryOnButton } from './components/TryOnButton';
import { TryOnResult } from './components/TryOnResult';
import { useTryOn } from './hooks/useTryOn';

function App() {
  const {
    humanImage,
    clothImage,
    loading,
    error,
    resultImage,
    setHumanImage,
    setClothImage,
    handleTryOn,
  } = useTryOn();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Header />
        
        <UploadSection
          onHumanImageSelect={setHumanImage}
          onClothImageSelect={setClothImage}
        />

        <TryOnButton
          onClick={handleTryOn}
          disabled={loading || !humanImage || !clothImage}
        />

        <TryOnResult
          loading={loading}
          error={error || undefined}
          imageUrl={resultImage || undefined}
        />
      </div>
    </div>
  );
}

export default App;