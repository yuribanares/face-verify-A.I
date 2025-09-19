
import React from 'react';
import { ComparisonResult } from '../types';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface ResultDisplayProps {
  result: ComparisonResult | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  if (!result) return null;

  const isMatch = result.match;
  const cardBg = isMatch ? 'bg-green-900/50 border-green-500' : 'bg-red-900/50 border-red-500';
  const textColor = isMatch ? 'text-green-300' : 'text-red-300';
  const Icon = isMatch ? CheckCircleIcon : XCircleIcon;

  return (
    <div className={`w-full max-w-2xl p-6 rounded-2xl border ${cardBg} transition-all duration-500 ease-in-out transform animate-fade-in`}>
      <div className="flex flex-col items-center text-center">
        <Icon className={`w-16 h-16 ${textColor} mb-4`} />
        <h3 className={`text-3xl font-bold ${textColor}`}>
          {isMatch ? "Match Found" : "No Match Found"}
        </h3>
        <p className="mt-2 text-lg text-gray-300">
          {result.reasoning}
        </p>
      </div>
    </div>
  );
};

export default ResultDisplay;
