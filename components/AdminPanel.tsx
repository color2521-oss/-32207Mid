
import React, { useState, useEffect } from 'react';
import { ExamRecord, ExamInfo } from '../types';
import { ADMIN_PASSWORD, EXAM_INFO, GOOGLE_SCRIPT_URL } from '../constants';
import { Lock, LogOut, FileSpreadsheet, Settings, Save, RotateCcw, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  currentExamInfo: ExamInfo;
  onUpdateExamInfo: (info: ExamInfo) => void;
  onLogout: () => void;
}

const AdminPanel: React.FC<Props> = ({ currentExamInfo, onUpdateExamInfo, onLogout }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'report' | 'settings'>('report');
  
  const [data, setData] = useState<ExamRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterRoom, setFilterRoom] = useState<string>('all');

  const [editInfo, setEditInfo] = useState<ExamInfo>(currentExamInfo);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    setEditInfo(currentExamInfo);
  }, [currentExamInfo]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(GOOGLE_SCRIPT_URL);
      const sheetData = await response.json();
      
      if (Array.isArray(sheetData)) {
         setData(sheetData);
      } else {
         const storedData = localStorage.getItem('exam_results');
         if (storedData) setData(JSON.parse(storedData));
      }
    } catch (error) {
      const storedData = localStorage.getItem('exam_results');
      if (storedData) setData(JSON.parse(storedData));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeTab === 'report') {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('รหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    onUpdateExamInfo(editInfo);

    try {
        const payload = {
            type: 'setting',
            ...editInfo
        };
        await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(payload)
        });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
        setSaveStatus('error');
    }
  };

  const handleResetSettings = () => {
    if(window.confirm('ต้องการรีเซ็ตค่าทั้งหมดเป็นค่าเริ่มต้นใช่หรือไม่?')) {
       setEditInfo(EXAM_INFO);
       onUpdateExamInfo(EXAM_INFO);
    }
  };

  const getDisplayRoom = (room: string | any) => {
    if (!room) return "";
    const strRoom = String(room);
    if (strRoom.match(/^\d{4}-\d{2}-\d{2}T/)) {
       const date = new Date(strRoom);
       return `5/${date.getMonth() + 1}`;
    }
    return strRoom.replace(/^'/, '');
  };

  const formatDateTime = (ts: number | string) => {
    if (!ts) return '-';
    const date = new Date(ts);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredData = data
    .map(item => ({
      ...item,
      displayRoom: getDisplayRoom(item.room)
    }))
    .filter(item => filterRoom === 'all' || item.displayRoom === `5/${filterRoom}`)
    .sort((a, b) => {
      try {
        const roomA = parseInt(a.displayRoom.split('/')[1] || "0");
        const roomB = parseInt(b.displayRoom.split('/')[1] || "0");
        if (roomA !== roomB) return roomA - roomB;
      } catch (e) {}
      return a.number - b.number;
    });

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-3 rounded-full">
            <Lock className="w-6 h-6 text-gray-600" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-center mb-6">สำหรับครูผู้สอน</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="ใส่ Pin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-lg"
          >
            เข้าสู่ระบบ
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="w-full text-gray-500 text-sm hover:underline mt-2"
          >
            กลับหน้าหลัก
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center flex-wrap gap-4">
        <div className="flex space-x-4">
          <button 
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${activeTab === 'report' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-white'}`}
          >
            <FileSpreadsheet className="w-5 h-5" />
            <span className="font-bold">รายงานผลสอบ</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${activeTab === 'settings' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-white'}`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-bold">ตั้งค่าข้อความ</span>
          </button>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-1 bg-red-600/20 text-red-100 border border-red-500/30 rounded hover:bg-red-600 hover:text-white text-sm transition-all ml-auto"
        >
          <LogOut size={16} /> ออกจากระบบ
        </button>
      </div>

      {activeTab === 'report' && (
        <>
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center">
              <label className="font-medium mr-2 text-gray-700">เลือกห้อง:</label>
              <select
                className="px-3 py-1 border border-gray-300 rounded focus:ring-blue-500"
                value={filterRoom}
                onChange={(e) => setFilterRoom(e.target.value)}
              >
                <option value="all">ทั้งหมด</option>
                {[...Array(13)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>5/{i + 1}</option>
                ))}
              </select>
              <span className="ml-4 text-sm text-gray-500">
                นักเรียนทั้งหมด: {filteredData.length} คน
              </span>
            </div>
            
            <button 
               onClick={fetchData} 
               disabled={loading}
               className="flex items-center gap-1 text-sm bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-50"
            >
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
               รีเฟรชข้อมูล
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                <tr>
                  <th className="p-3 border-b font-semibold">เลขที่</th>
                  <th className="p-3 border-b font-semibold">ห้อง</th>
                  <th className="p-3 border-b font-semibold">ชื่อ-นามสกุล / เวลาสอบ</th>
                  <th className="p-3 border-b font-semibold text-center">คะแนนดิบ</th>
                  <th className="p-3 border-b font-semibold text-center">คะแนนสุทธิ</th>
                  <th className="p-3 border-b font-semibold text-center">จำนวนครั้ง</th>
                  <th className="p-3 border-b font-semibold text-center">สลับหน้าจอ</th>
                  <th className="p-3 border-b font-semibold text-center">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-500">
                      <div className="flex justify-center items-center gap-2">
                        <Loader2 className="animate-spin" /> กำลังโหลดข้อมูล...
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-mono">{record.number}</td>
                      <td className="p-3">{record.displayRoom}</td>
                      <td className="p-3">
                        <div className="font-medium text-gray-900">{record.studentName}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDateTime(record.timestamp)}
                        </div>
                      </td>
                      <td className="p-3 text-center">{record.rawScore}</td>
                      <td className="p-3 text-center font-bold text-blue-600">{record.weightedScore}</td>
                      <td className="p-3 text-center">{record.attempts}</td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <span className={`font-bold ${record.switchCount > 0 ? 'text-red-500' : 'text-green-600'}`}>
                            {record.switchCount || 0} ครั้ง
                          </span>
                          {record.switchCount > 0 && (
                            <div className="flex items-center gap-1 text-[10px] text-red-400 mt-0.5">
                              <AlertTriangle size={10} /> ส่อทุจริต
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            record.passed
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {record.passed ? 'ผ่าน' : 'ไม่ผ่าน'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-gray-400">
                      ไม่พบข้อมูลนักเรียน
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'settings' && (
        <div className="p-6">
          <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-gray-800">แก้ไขข้อความส่วนหัว</h3>
               <button type="button" onClick={handleResetSettings} className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1">
                 <RotateCcw size={14}/> รีเซ็ตค่าเริ่มต้น
               </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อโรงเรียน</label>
              <input type="text" value={editInfo.school} onChange={e => setEditInfo({...editInfo, school: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">หัวข้อการสอบ</label>
              <input type="text" value={editInfo.title} onChange={e => setEditInfo({...editInfo, title: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดวิชา</label>
              <input type="text" value={editInfo.subject} onChange={e => setEditInfo({...editInfo, subject: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">คำชี้แจง</label>
              <textarea value={editInfo.instruction} onChange={e => setEditInfo({...editInfo, instruction: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={3} required />
            </div>
            <div className="pt-4 flex items-center justify-end gap-3">
              {saveStatus === 'saving' && <span className="text-gray-500 text-sm"><Loader2 className="w-4 h-4 animate-spin inline mr-1"/> กำลังบันทึกออนไลน์...</span>}
              <button type="submit" disabled={saveStatus === 'saving'} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:bg-blue-400">
                <Save size={18} /> บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
