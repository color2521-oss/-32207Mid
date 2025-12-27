
import React from 'react';
import { CheckCircle, XCircle, RefreshCw, Home, User, AlertTriangle, ShieldCheck } from 'lucide-react';
import { PASS_SCORE, MAX_RAW_SCORE, MAX_WEIGHTED_SCORE } from '../constants';
import { StudentInfo } from '../types';

interface Props {
  student: StudentInfo;
  rawScore: number;
  switchCount: number;
  onRetry: () => void;
  onHome: () => void;
}

const ResultCard: React.FC<Props> = ({ student, rawScore, switchCount, onRetry, onHome }) => {
  const passed = rawScore >= PASS_SCORE;
  const weightedScore = rawScore / 2;

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-xl border-t-8 border-t-pink-500 text-center animate-fade-in-up">
      {/* Student Identity Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <div className="flex items-center justify-center gap-2 mb-1 text-pink-600">
          <User size={18} />
          <span className="text-sm font-bold uppercase tracking-wider">ข้อมูลผู้เข้าสอบ</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800">{student.name}</h3>
        <p className="text-gray-500 font-medium">ห้อง {student.room} เลขที่ {student.number}</p>
      </div>

      {/* Score and Status */}
      <div className="mb-4 flex justify-center">
        {passed ? (
          <CheckCircle className="w-16 h-16 text-green-500" />
        ) : (
          <XCircle className="w-16 h-16 text-red-500" />
        )}
      </div>
      
      <h2 className={`text-2xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
        {passed ? 'คุณสอบผ่าน' : 'สอบไม่ผ่าน'}
      </h2>
      
      <div className="my-6 py-5 bg-gradient-to-b from-white to-gray-50 rounded-lg border border-gray-100 shadow-inner">
        <p className="text-gray-400 mb-1 text-xs font-bold uppercase">คะแนนดิบที่ได้</p>
        <p className="text-3xl font-bold text-gray-800 mb-3">
          {rawScore} <span className="text-base text-gray-400 font-normal">/ {MAX_RAW_SCORE}</span>
        </p>
        
        <div className="w-1/2 h-px bg-gray-200 mx-auto my-3"></div>
        
        <p className="text-pink-500 mb-1 text-xs font-bold uppercase">คะแนนเก็บสุทธิ (หาร 2)</p>
        <p className="text-4xl font-bold text-pink-600">
          {weightedScore} <span className="text-lg text-pink-300 font-normal">/ {MAX_WEIGHTED_SCORE}</span>
        </p>
      </div>

      {/* Exam Behavior Detection */}
      <div className={`mb-6 p-3 rounded-lg border flex items-center justify-between ${switchCount === 0 ? 'bg-green-50 border-green-100' : 'bg-yellow-50 border-yellow-200'}`}>
        <div className="flex items-center gap-2">
          {switchCount === 0 ? (
            <ShieldCheck size={18} className="text-green-600" />
          ) : (
            <AlertTriangle size={18} className="text-yellow-600" />
          )}
          <span className={`text-sm font-bold ${switchCount === 0 ? 'text-green-700' : 'text-yellow-700'}`}>
            พฤติกรรมการสอบ
          </span>
        </div>
        <div className="text-right">
          <span className={`text-xs font-bold block ${switchCount === 0 ? 'text-green-600' : 'text-yellow-600'}`}>
            {switchCount === 0 ? 'ไม่พบการสลับหน้าจอ' : `ตรวจพบการสลับหน้าจอ ${switchCount} ครั้ง`}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {!passed ? (
          <div className="space-y-4">
            <button
              onClick={onRetry}
              className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg transform active:scale-95"
            >
              <RefreshCw size={20} />
              ทำแบบทดสอบใหม่
            </button>
            <p className="text-red-500 font-medium text-xs animate-pulse">
              * คะแนนไม่ถึงเกณฑ์ขั้นต่ำ ({PASS_SCORE} คะแนน) กรุณาทำใหม่
            </p>
          </div>
        ) : (
          <button
            onClick={onHome}
            className="flex items-center justify-center gap-2 w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md"
          >
            <Home size={20} />
            กลับหน้าหลัก
          </button>
        )}
      </div>

      {passed && (
        <div className="mt-4 flex items-center justify-center gap-2 text-green-600 bg-green-50 py-2 rounded-full border border-green-100">
          <CheckCircle size={14} />
          <span className="text-xs font-bold">บันทึกคะแนนในระบบคลาวด์แล้ว</span>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
