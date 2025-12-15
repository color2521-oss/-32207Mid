import React from 'react';
import { CheckCircle, XCircle, RefreshCw, Home } from 'lucide-react';
import { PASS_SCORE, MAX_RAW_SCORE, MAX_WEIGHTED_SCORE } from '../constants';

interface Props {
  rawScore: number;
  onRetry: () => void;
  onHome: () => void;
}

const ResultCard: React.FC<Props> = ({ rawScore, onRetry, onHome }) => {
  const passed = rawScore >= PASS_SCORE;
  const weightedScore = rawScore / 2;

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-xl border-t-8 border-t-pink-500 text-center animate-fade-in-up">
      <div className="mb-6 flex justify-center">
        {passed ? (
          <CheckCircle className="w-20 h-20 text-green-500" />
        ) : (
          <XCircle className="w-20 h-20 text-red-500" />
        )}
      </div>
      
      <h2 className={`text-3xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
        {passed ? 'คุณสอบผ่าน' : 'สอบอีกครั้ง'}
      </h2>
      
      <div className="my-8 py-6 bg-gray-50 rounded-lg border border-gray-100">
        <p className="text-gray-500 mb-1">คะแนนดิบที่ได้</p>
        <p className="text-4xl font-bold text-gray-800 mb-4">
          {rawScore} <span className="text-lg text-gray-400 font-normal">/ {MAX_RAW_SCORE}</span>
        </p>
        
        <div className="w-3/4 h-px bg-gray-300 mx-auto my-4"></div>
        
        <p className="text-gray-500 mb-1">คะแนนเก็บ (หาร 2)</p>
        <p className="text-4xl font-bold text-pink-600">
          {weightedScore} <span className="text-lg text-pink-300 font-normal">/ {MAX_WEIGHTED_SCORE}</span>
        </p>
      </div>

      <div className="space-y-3">
        {!passed && (
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            <RefreshCw size={20} />
            ทำแบบทดสอบใหม่
          </button>
        )}
        
        <button
          onClick={onHome}
          className="flex items-center justify-center gap-2 w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          <Home size={20} />
          กลับหน้าหลัก
        </button>
      </div>

      {passed && (
        <p className="text-gray-500 italic mt-4">บันทึกคะแนนเรียบร้อยแล้ว</p>
      )}
    </div>
  );
};

export default ResultCard;