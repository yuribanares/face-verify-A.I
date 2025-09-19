
import React, { useRef, useState } from 'react';
import { UploadIcon, AlertTriangleIcon } from './icons';

interface ImageUploaderProps {
  onUpload: (imageSrc: string) => void;
  uploadedImage: string | null;
  onRemove: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, uploadedImage, onRemove }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size should not exceed 5MB.');
        return;
      }
      
      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          onUpload(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full flex flex-col items-center p-6 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
      <h2 className="text-xl font-bold mb-4 text-teal-300">Step 2: Upload Photo</h2>
      <div 
        className="w-full aspect-video rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center relative cursor-pointer border-2 border-dashed border-gray-600 hover:border-teal-400 transition-colors duration-200"
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        {uploadedImage ? (
          <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-400">
            <UploadIcon className="w-12 h-12 mx-auto mb-2" />
            <p className="font-semibold">Click to upload image</p>
            <p className="text-sm">PNG, JPG, WEBP up to 5MB</p>
          </div>
        )}
      </div>
      {error && (
        <div className="mt-2 text-center text-red-400 p-2 flex items-center gap-2">
            <AlertTriangleIcon className="w-5 h-5"/>
            <span>{error}</span>
        </div>
      )}
      <div className="mt-4 w-full">
        {uploadedImage ? (
          <button
            onClick={onRemove}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Change Image
          </button>
        ) : (
            <button
            onClick={handleClick}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
            >
             <UploadIcon className="w-6 h-6" />
             Select Image
           </button>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
