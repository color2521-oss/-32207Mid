import React, { useState, useEffect } from 'react';
import { QUESTIONS, PASS_SCORE, MAX_RAW_SCORE, EXAM_INFO, GOOGLE_SCRIPT_URL } from './constants';
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
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  
  // Initialize with DEFAULT config first, then try to load from local storage
  const [examInfo, setExamInfo] = useState<ExamInfo>(() => {
    try {
      const saved = localStorage.getItem('exam_info_config');
      return saved ? { ...EXAM_INFO, ...JSON.parse(saved) } : EXAM_INFO;
    } catch (error) {
      return EXAM_INFO;
    }
  });

  // Fetch Global Configuration from Google Sheet (for students)
  useEffect(() => {
    const fetchGlobalConfig = async () => {
      try {
        // We assume the script handles ?type=setting to return JSON
        const response = await fetch(`${GOOGLE_SCRIPT_URL}?type=setting`);
        const data = await response.json();
        
        // Validate if data has necessary fields
        if (data && data.school && data.title) {
           setExamInfo(prev => ({
             ...prev,
             ...data
           }));
           // Update local cache
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
    // Also save to localStorage immediately for the admin
    localStorage.setItem('exam_info_config', JSON.stringify(newInfo));
  };

  const handleStartExam = (info: StudentInfo) => {
    // Shuffle options for each question
    const shuffledQuestions = QUESTIONS.map(q => {
      // Create pairs of (option, originalIndex)
      const optionsWithIndex = q.options.map((opt, i) => ({ opt, originalIndex: i }));
      
      // Shuffle the options array using Fisher-Yates
      for (let i = optionsWithIndex.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsWithIndex[i], optionsWithIndex[j]] = [optionsWithIndex[j], optionsWithIndex[i]];
      }
      
      // Extract shuffled options
      const newOptions = optionsWithIndex.map(o => o.opt);
      
      // Find the new index of the correct answer
      const newCorrectIndex = optionsWithIndex.findIndex(o => o.originalIndex === q.correctAnswerIndex);
      
      return {
        ...q,
        options: newOptions,
        correctAnswerIndex: newCorrectIndex
      };
    });

    setCurrentQuestions(shuffledQuestions);
    setStudentInfo(info);
    setAnswers({});
    setView('exam');
    window.scrollTo(0, 0);
  };

  const handleSelectAnswer = (qId: number, optionIndex: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    // Use currentQuestions which contains the shuffled state and corrected indices
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
      let bestRaw = prev.rawScore;
      let bestWeighted = prev.weightedScore;
      let isPassed = prev.passed;

      if (currentScore > prev.rawScore) {
          bestRaw = currentScore;
          bestWeighted = weighted;
      }
      if (passed) isPassed = true;
      
      recordToSave = {
        ...prev,
        studentName: studentInfo.name,
        room: roomSafeValue,
        rawScore: bestRaw,
        weightedScore: bestWeighted,
        passed: isPassed,
        attempts: prev.attempts + 1,
        timestamp: Date.now()
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
        timestamp: Date.now()
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
    setView('exam');
    window.scrollTo(0, 0);
  };

  const handleBackToHome = () => {
    setStudentInfo(null);
    setAnswers({});
    setRawScore(0);
    setView('info');
  };

  const allAnswered = currentQuestions.length > 0 && currentQuestions.length === Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {view !== 'admin' && <ExamHeader info={examInfo} />}

      <main className="container mx-auto px-4 flex-grow pb-10">
        
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
            <div className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center sticky top-2 z-10 border border-blue-200">
               <div>
                 <span className="font-bold text-gray-700 block">{studentInfo.name}</span>
                 <span className="text-sm text-gray-500">ห้อง {studentInfo.room} เลขที่ {studentInfo.number}</span>
               </div>
               <div className="text-right">
                 <span className="text-sm text-gray-500 mr-2">ทำไปแล้ว</span>
                 <span className="font-bold text-blue-600 text-xl">{Object.keys(answers).length}</span>
                 <span className="text-gray-400">/{currentQuestions.length}</span>
               </div>
            </div>

            {currentQuestions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                selectedOption={answers[q.id] ?? null}
                onSelect={handleSelectAnswer}
              />
            ))}

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleFinishExam}
                disabled={!allAnswered}
                className={`py-4 px-12 rounded-full font-bold text-lg shadow-lg transition-transform transform ${
                  allAnswered
                    ? 'bg-green-600 hover:bg-green-700 text-white hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {allAnswered ? 'ส่งคำตอบ' : 'กรุณาทำข้อสอบให้ครบทุกข้อ'}
              </button>
            </div>
          </div>
        )}

        {view === 'result' && (
          <ResultCard 
            rawScore={rawScore} 
            onRetry={handleRetry} 
            onHome={handleBackToHome}
          />
        )}

        {view === 'admin' && (
          <AdminPanel 
            currentExamInfo={examInfo}
            onUpdateExamInfo={handleUpdateExamInfo}
            onLogout={() => setView('info')} 
          />
        )}
      </main>

      <footer className="bg-white py-6 border-t border-gray-200 text-center">
        <p className="text-gray-700 font-medium text-sm">นายวัชรินทร์ ไมตรีแพน ครู ผู้ออกข้อสอบ</p>
        <p className="text-gray-400 text-xs mt-1">copy right @2025</p>
      </footer>
    </div>
  );
};

export default App;