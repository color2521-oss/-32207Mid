
import React, { useState, useEffect } from 'react';
import { QUESTIONS, PASS_SCORE, EXAM_INFO, GOOGLE_SCRIPT_URL } from './constants';
import { StudentInfo, ExamRecord, Question, ExamInfo } from './types';
import ExamHeader from './components/ExamHeader';
import StudentForm from './components/StudentForm';
import QuestionCard from './components/QuestionCard';
import ResultCard from './components/ResultCard';
import AdminPanel from './components/AdminPanel';
import { ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'info' | 'exam' | 'result' | 'admin'>('info');
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [rawScore, setRawScore] = useState(0);
  const [switchCount, setSwitchCount] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  
  const [examInfo, setExamInfo] = useState<ExamInfo>(() => {
    try {
      const saved = localStorage.getItem('exam_info_config');
      return saved ? { ...EXAM_INFO, ...JSON.parse(saved) } : EXAM_INFO;
    } catch (error) {
      return EXAM_INFO;
    }
  });

  // Detection logic for tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && view === 'exam') {
        setSwitchCount(prev => prev + 1);
        console.warn("Tab switch detected!");
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [view]);

  useEffect(() => {
    const fetchGlobalConfig = async () => {
      try {
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?type=setting`);
        const data = await response.json();
        if (data && data.school && data.title) {
           setExamInfo(prev => ({ ...prev, ...data }));
           localStorage.setItem('exam_info_config', JSON.stringify(data));
        }
      } catch (error) {
        console.log("Could not fetch global config, using defaults/local.");
      }
    };
    fetchGlobalConfig();
  }, []);

  const handleUpdateExamInfo = (newInfo: ExamInfo) => {
    setExamInfo(newInfo);
    localStorage.setItem('exam_info_config', JSON.stringify(newInfo));
  };

  const handleStartExam = (info: StudentInfo) => {
    const shuffledQuestions = QUESTIONS.map(q => {
      const optionsWithIndex = q.options.map((opt, i) => ({ opt, originalIndex: i }));
      for (let i = optionsWithIndex.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
      }
      const newOptions = optionsWithIndex.map(o => o.opt);
      const newCorrectIndex = optionsWithIndex.findIndex(o => o.originalIndex === q.correctAnswerIndex);
      return { ...q, options: newOptions, correctAnswerIndex: newCorrectIndex };
    });

    setCurrentQuestions(shuffledQuestions);
    setStudentInfo(info);
    setAnswers({});
    setSwitchCount(0);
    setView('exam');
    window.scrollTo(0, 0);
  };

  const handleSelectAnswer = (qId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    currentQuestions.forEach(q => {
      if (answers[q.id] === q.correctAnswerIndex) {
        score++;
      }
    });
    return score;
  };

  const handleFinishExam = () => {
    const score = calculateScore();
    setRawScore(score);
    saveResult(score);
    setView('result');
    window.scrollTo(0, 0);
  };

  const saveResult = (currentScore: number) => {
    if (!studentInfo) return;
    const dbKey = 'exam_results';
    const existingDataStr = localStorage.getItem(dbKey);
    let db: ExamRecord[] = existingDataStr ? JSON.parse(existingDataStr) : [];
    const recordId = `${studentInfo.room}-${studentInfo.number}`;
    const existingRecordIndex = db.findIndex(r => r.id === recordId);
    const passed = currentScore >= PASS_SCORE;
    const weighted = currentScore / 2;
    const roomSafeValue = `'${studentInfo.room}`;
    let recordToSave: ExamRecord;

    if (existingRecordIndex > -1) {
      const prev = db[existingRecordIndex];
      let bestRaw = Math.max(prev.rawScore, currentScore);
      let isPassed = prev.passed || passed;
      recordToSave = {
        ...prev,
        studentName: studentInfo.name,
        room: roomSafeValue,
        rawScore: bestRaw,
        weightedScore: bestRaw / 2,
        passed: isPassed,
        attempts: prev.attempts + 1,
        timestamp: Date.now(),
        switchCount: switchCount
      };
      db[existingRecordIndex] = recordToSave;
    } else {
      recordToSave = {
        id: recordId,
        studentName: studentInfo.name,
        room: roomSafeValue,
        number: parseInt(studentInfo.number),
        rawScore: currentScore,
        weightedScore: weighted,
        passed: passed,
        attempts: 1,
        timestamp: Date.now(),
        switchCount: switchCount
      };
      db.push(recordToSave);
    }
    localStorage.setItem(dbKey, JSON.stringify(db));
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(recordToSave),
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' }
    }).catch(err => console.error("Failed to sync to Google Sheet", err));
  };

  const handleRetry = () => {
    setAnswers({});
    setSwitchCount(0);
    setView('exam');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setStudentInfo(null);
    setAnswers({});
    setRawScore(0);
    setSwitchCount(0);
    setView('info');
  };

  const allAnswered = currentQuestions.length > 0 && currentQuestions.length === Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {view !== 'admin' && <ExamHeader info={examInfo} />}

      <main className={`container mx-auto px-4 flex-grow pb-10 ${view === 'exam' ? 'pt-4' : 'pt-8'}`}>
        {view === 'info' && (
          <div className="animate-fade-in">
             <StudentForm onStart={handleStartExam} />
             <div className="text-center mt-8">
               <button 
                 onClick={() => setView('admin')}
                 className="text-gray-400 hover:text-gray-600 text-sm flex items-center justify-center gap-1 mx-auto"
               >
                 <ShieldCheck size={14} /> สำหรับครูผู้สอน
               </button>
             </div>
          </div>
        )}

        {view === 'exam' && studentInfo && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex justify-between items-center sticky top-[130px] md:top-[100px] z-40 border-l-4 border-l-blue-500 transition-all">
               <div>
                 <span className="font-bold text-gray-800 block">{studentInfo.name}</span>
                 <span className="text-xs text-gray-500">ห้อง {studentInfo.room} เลขที่ {studentInfo.number}</span>
               </div>
               <div className="text-right">
                 <div className="text-xs text-gray-400 mb-1">ความคืบหน้า</div>
                 <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600 text-xl">{Object.keys(answers).length}</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-500 font-medium">{currentQuestions.length}</span>
                 </div>
               </div>
            </div>

            <div className="space-y-4">
              {currentQuestions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  selectedOption={answers[q.id] ?? null}
                  onSelect={handleSelectAnswer}
                />
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center">
              {!allAnswered && (
                <p className="text-red-500 text-sm mb-4 animate-bounce">
                  * ยังทำไม่ครบทุกข้อ (ขาดอีก {currentQuestions.length - Object.keys(answers).length} ข้อ)
                </p>
              )}
              <button
                onClick={handleFinishExam}
                disabled={!allAnswered}
                className={`py-4 px-16 rounded-full font-bold text-xl shadow-xl transition-all transform active:scale-95 ${
                  allAnswered
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white hover:shadow-2xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed grayscale'
                }`}
              >
                {allAnswered ? 'ส่งคำตอบและดูผลสอบ' : 'กรุณาทำข้อสอบให้ครบ'}
              </button>
            </div>
          </div>
        )}

        {view === 'result' && studentInfo && (
          <ResultCard 
            student={studentInfo}
            rawScore={rawScore} 
            switchCount={switchCount}
            onRetry={handleRetry} 
            onHome={handleBackToHome}
          />
        )}

        {view === 'admin' && (
          <div className="mt-4">
            <AdminPanel 
              currentExamInfo={examInfo}
              onUpdateExamInfo={handleUpdateExamInfo}
              onLogout={() => setView('info')} 
            />
          </div>
        )}
      </main>

      <footer className="bg-white py-6 border-t border-gray-200 text-center">
        <p className="text-gray-700 font-bold text-sm">นายวัชรินทร์ ไมตรีแพน</p>
        <p className="text-gray-500 text-xs">ครูผู้สอน/ผู้ออกข้อสอบ</p>
        <p className="text-gray-400 text-[10px] mt-2 tracking-widest uppercase">© 2025 Nong Bua Daeng Witthaya School</p>
      </footer>
    </div>
  );
};

export default App;
