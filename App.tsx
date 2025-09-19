
import React, { useState } from 'react';
import WebcamCapture from './components/WebcamCapture';
import ImageUploader from './components/ImageUploader';
import ResultDisplay from './components/ResultDisplay';
import Loader from './components/Loader';
import { AlertTriangleIcon } from './components/icons';
import { compareFaces } from './services/geminiService';
import type { ComparisonResult } from './types';

function App() {
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = (imageSrc: string) => {
    setSelfieImage(imageSrc);
    setComparisonResult(null);
    setError(null);
  };

  const handleUpload = (imageSrc: string) => {
    setUploadedImage(imageSrc);
    setComparisonResult(null);
    setError(null);
  };
  
  const handleRetake = () => {
    setSelfieImage(null);
    setComparisonResult(null);
    setError(null);
  };

  const handleRemoveUploaded = () => {
    setUploadedImage(null);
    setComparisonResult(null);
    setError(null);
  };

  const handleCompare = async () => {
    if (!selfieImage || !uploadedImage) return;

    setIsLoading(true);
    setError(null);
    setComparisonResult(null);

    try {
      const result = await compareFaces(selfieImage, uploadedImage);
      setComparisonResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetAll = () => {
    setSelfieImage(null);
    setUploadedImage(null);
    setComparisonResult(null);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">
          Face Match AI
        </h1>
        <p className="mt-2 text-lg text-gray-400">Verify identity with cutting-edge AI face comparison.</p>
      </header>

      <main className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {!comparisonResult && !isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
              <WebcamCapture onCapture={handleCapture} selfieImage={selfieImage} onRetake={handleRetake} />
              <ImageUploader onUpload={handleUpload} uploadedImage={uploadedImage} onRemove={handleRemoveUploaded} />
            </div>
        )}
        
        <div className="w-full max-w-2xl flex flex-col items-center space-y-4">
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative flex items-center gap-3 w-full" role="alert">
              <AlertTriangleIcon className="w-6 h-6"/>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isLoading && <Loader text="AI is comparing images..." />}

          {comparisonResult && <ResultDisplay result={comparisonResult} />}

          {!isLoading && !comparisonResult && (
             <button
                onClick={handleCompare}
                disabled={!selfieImage || !uploadedImage}
                className="w-full max-w-md bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Compare Faces
              </button>
          )}

          {(comparisonResult || error) && (
              <button
                onClick={resetAll}
                className="w-full max-w-md bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 mt-4"
              >
                Start New Comparison
              </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
