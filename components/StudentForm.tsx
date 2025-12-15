import React, { useState } from 'react';
import { StudentInfo } from '../types';
import { BookOpen } from 'lucide-react';

interface Props {
  onStart: (info: StudentInfo) => void;
}

const StudentForm: React.FC<Props> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('1');
  const [number, setNumber] = useState('1');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart({ 
        name, 
        room: `5/${room}`, 
        number 
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
      <div className="flex justify-center mb-6">
        <div className="bg-pink-100 p-4 rounded-full">
          <BookOpen className="w-8 h-8 text-pink-600" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">ข้อมูลผู้สอบ</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
            placeholder="กรอกชื่อ-นามสกุล"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ห้อง</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            >
              {[...Array(13)].map((_, i) => (
                <option key={i + 1} value={i + 1}>5/{i + 1}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">เลขที่</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            >
              {[...Array(40)].map((_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-6 shadow-md"
        >
          เริ่มทำแบบทดสอบ
        </button>
      </form>
    </div>
  );
};

export default StudentForm;