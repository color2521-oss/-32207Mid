
import React from 'react';
import { ExamInfo } from '../types';
import { ExternalLink } from 'lucide-react';

interface Props {
  info: ExamInfo;
}

const ExamHeader: React.FC<Props> = ({ info }) => {
  return (
    <header className="bg-white shadow-lg mb-6 border-b-4 border-pink-500 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo and School Name Section */}
          <div className="flex items-center gap-4">
            <a 
              href="http://www.nws.ac.th" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group relative flex-shrink-0"
              title="ไปที่เว็บไซต์โรงเรียนหนองบัวแดงวิทยา"
            >
              <div className="absolute -inset-1 bg-pink-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <img 
                src="https://img5.pic.in.th/file/secure-sv1/nw_logo-removebg.png" 
                alt="School Logo" 
                className="w-16 h-16 md:w-20 md:h-20 object-contain relative transform group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink size={12} className="text-pink-500" />
              </div>
            </a>
            
            <div className="text-center md:text-left">
              <h1 className="text-lg md:text-xl font-bold text-gray-800 leading-tight">
                {info.school}
              </h1>
              <p className="text-pink-600 font-semibold text-sm md:text-base">
                {info.title}
              </p>
            </div>
          </div>

          {/* Subject and Score Badge */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-xs md:text-sm font-bold shadow-sm">
              {info.subject}
            </div>
            <div className="bg-yellow-100 text-yellow-800 px-3 py-0.5 rounded-md text-xs font-bold border border-yellow-200">
              {info.scoreInfo}
            </div>
          </div>
        </div>
      </div>
      
      {/* Instruction Banner */}
      <div className="bg-gray-50 border-t border-gray-100 py-2 px-4">
        <p className="text-center text-xs text-gray-500 italic max-w-4xl mx-auto">
          <span className="font-bold text-gray-700">คำชี้แจง:</span> {info.instruction}
        </p>
      </div>
    </header>
  );
};

export default ExamHeader;
