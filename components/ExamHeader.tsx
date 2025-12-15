import React from 'react';
import { ExamInfo } from '../types';

interface Props {
  info: ExamInfo;
}

const ExamHeader: React.FC<Props> = ({ info }) => {
  return (
    <header className="bg-white shadow-md p-4 mb-6 border-t-4 border-pink-500">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
        <img 
          src="https://img5.pic.in.th/file/secure-sv1/nw_logo-removebg.png" 
          alt="School Logo" 
          className="w-16 h-16 object-contain"
        />
        <div className="text-center md:text-left">
          <h1 className="text-xl font-bold text-gray-800">{info.school}</h1>
          <p className="text-sm text-gray-600">{info.title}</p>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-gray-700 space-y-1 text-center">
        <p className="font-semibold">{info.subject}</p>
        <p className="font-bold text-pink-600">{info.scoreInfo}</p>
        <p className="italic text-xs mt-2">{info.instruction}</p>
      </div>
    </header>
  );
};

export default ExamHeader;