
export interface StudentInfo {
  name: string;
  room: string;
  number: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex: number; // 0=ก, 1=ข, 2=ค, 3=ง, 4=จ
  visualType?: 'triangle' | 'star' | 'rounded-rect' | 'icon-pen' | 'icon-select' | 'icon-width' | 'icon-color' | 'icon-curvature' | 'icon-eyedropper' | 'icon-shape-builder' | 'generic';
}

export interface ExamRecord {
  id: string; // unique key composite of room-number
  studentName: string;
  room: string;
  number: number;
  rawScore: number; // Max 30
  weightedScore: number; // Max 15
  attempts: number;
  passed: boolean;
  timestamp: number;
  switchCount: number; // จำนวนครั้งที่สลับหน้าจอ
}

export interface ExamInfo {
  school: string;
  title: string;
  subject: string;
  scoreInfo: string;
  instruction: string;
}
