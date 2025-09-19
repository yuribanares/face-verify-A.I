
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraIcon, AlertTriangleIcon } from './icons';

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
  selfieImage: string | null;
  onRetake: () => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, selfieImage, onRetake }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: 'user' } });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } else {
        setError("Your browser does not support camera access.");
      }
    } catch (err) {
      console.error("Error accessing camera: ", err);
      if (err instanceof Error && err.name === "NotAllowedError") {
        setError("Camera permission denied. Please enable camera access in your browser settings.");
      } else {
        setError("Could not access the camera. Please ensure it is not in use by another application.");
      }
    }
  }, []);

  useEffect(() => {
    if (!selfieImage) {
      startCamera();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selfieImage]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(dataUrl);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-indigo-300">Step 1: Take a Selfie</h2>
      <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center relative">
        {error && !selfieImage && (
          <div className="text-center text-red-400 p-4">
            <AlertTriangleIcon className="w-12 h-12 mx-auto mb-2" />
            <p className="font-semibold">Camera Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        {selfieImage ? (
          <img src={selfieImage} alt="Captured Selfie" className="w-full h-full object-cover" />
        ) : (
          <video ref={videoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${error ? 'hidden' : 'block'}`}></video>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden"></canvas>
      <div className="mt-4 w-full">
        {selfieImage ? (
          <button
            onClick={onRetake}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Retake Photo
          </button>
        ) : (
          <button
            onClick={capturePhoto}
            disabled={!!error || !stream}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <CameraIcon className="w-6 h-6" />
            Capture
          </button>
        )}
      </div>
    </div>
  );
};

export default WebcamCapture;
