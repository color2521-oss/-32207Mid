import React from 'react';
import { Question } from './types';
import { Triangle, Star, Square, PenTool, MousePointer, MoreHorizontal, Maximize, Palette, Crop, Grip, MousePointer2 } from 'lucide-react';

export const PASS_SCORE = 16;
export const MAX_RAW_SCORE = 30;
export const MAX_WEIGHTED_SCORE = 15;
export const ADMIN_PASSWORD = "12345";
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwcHxAze6wXMvRWgVbQrhC72Jevec91zimvDkCEE9fu8-w9jwLK1JcWRqmxBMqMNuRz/exec";

export const EXAM_INFO = {
  school: "โรงเรียนหนองบัวแดงวิทยา อำเภอหนองบัวแดง จังหวัดชัยภูมิ",
  title: "แบบทดสอบวัดผลกลางภาค ประจำภาคเรียนที่ 2 ปีการศึกษา 2568",
  subject: "รายวิชา อินโฟกราฟิก 2 รหัสวิชา ว32207 ชั้นมัธยมศึกษาปีที่ 5",
  scoreInfo: "คะแนนเต็ม 15 คะแนน เวลาที่ใช้ 40 นาที",
  instruction: "คำชี้แจง : แบบทดสอบแบบปรนัย 5 ตัวเลือก จำนวน 30 ข้อ (คะแนนเต็ม 15 คะแนน)"
};

// Answer Mapping: ก=0, ข=1, ค=2, ง=3, จ=4
// Based on provided key:
// 1ง, 2ก, 3ค, 4ค, 5ค, 6ก, 7ข, 8ข, 9ง, 10ค
// 11ก, 12ก, 13ก, 14ก, 15ก, 16ค, 17ค, 18ก, 19ง, 20ก
// 21ข, 22ก
// Generated Logic for 23-30 based on standard Illustrator knowledge matching the text context.

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "ข้อใดใช้สร้างวัตถุที่เป็นรูปทรงสามเหลี่ยม ?",
    visualType: "triangle",
    options: ["Ellipse Tool", "Flare Tool", "Rectangle Tool", "Polygon Tool", "ไม่มีข้อถูก"],
    correctAnswerIndex: 3 // ง
  },
  {
    id: 2,
    text: "ข้อใดใช้สร้างวัตถุที่เป็นรูปทรงดาว ?",
    visualType: "star",
    options: ["Star Tool", "Flare Tool", "Rectangle Tool", "Polygon Tool", "Ellipse Tool"],
    correctAnswerIndex: 0 // ก
  },
  {
    id: 3,
    text: "ข้อใดใช้สร้างวัตถุที่เป็นรูป มุมโค้ง ?",
    visualType: "rounded-rect",
    options: ["Star Tool", "Flare Tool", "Rounded Rectangle", "Polygon Tool", "Ellipse Tool"],
    correctAnswerIndex: 2 // ค
  },
  {
    id: 4,
    text: "ข้อใดคือหน้าที่ของกลุ่มเครื่องมือ Selection Tool ?",
    options: ["การสร้างวัตถุแบบพิเศษ", "การตกแต่งภาพ", "การเลือกวัตถุ", "การเปลี่ยนโหมดการแสดงผล", "การเปลี่ยนสีวัตถุ"],
    correctAnswerIndex: 2 // ค
  },
  {
    id: 5,
    text: "เครื่องมือนี้เรียกว่า ?",
    visualType: "icon-pen",
    options: ["Curvature tool", "Shape Builder", "Pen tool", "Select Tool", "Eye Dropper"],
    correctAnswerIndex: 2 // ค
  },
  {
    id: 6,
    text: "Pen Tool (P) ใช้สำหรับทำอะไรใน ?",
    options: ["วาดเส้นตรงและเส้นโค้ง", "เลือกสีพื้นหลัง", "เปลี่ยนขนาดของวัตถุ", "วาดรูปทรงเรขาคณิต", "สร้างเงาให้กับวัตถุ"],
    correctAnswerIndex: 0 // ก
  },
  {
    id: 7,
    text: "Pen Tool ใช้เพื่อสร้างเส้นตรงได้อย่างไร ?",
    options: ["กดและลากเมาส์เพื่อสร้างเส้นโค้ง", "คลิกจุดเริ่มต้นและจุดสิ้นสุด", "ใช้ Shift เพื่อสร้างเส้นตรง", "ใช้ Alt ค้างเพื่อเพิ่มจุด", "คลิกหลายๆ ครั้งในพื้นที่เดียวกัน"],
    correctAnswerIndex: 1 // ข
  },
  {
    id: 8,
    text: "ต้องการแก้ไขเส้นหรือจุด anchor ที่วาดด้วย Pen Tool ควรใช้เครื่องมือใด?",
    options: ["Selection Tool", "Direct Selection Tool", "Shape Builder Tool", "Curvature Tool", "Magic Wand Tool"],
    correctAnswerIndex: 1 // ข
  },
  {
    id: 9,
    text: "การกด Alt ค้างขณะใช้ Pen Tool มีผลอย่างไร?",
    options: ["ลบจุด", "เปลี่ยน anchor point ให้โค้ง", "ทำให้เส้นตรง", "เปลี่ยนทิศทาง handle", "วาดวงกลมอัตโนมัติ"],
    correctAnswerIndex: 3 // ง
  },
  {
    id: 10,
    text: "เครื่องมือใดเหมาะกับการวาดเส้นที่มีมุมชัดเจน ?",
    options: ["Curvature tool", "Shape Builder", "Pen tool", "Pencil Tool", "Eye Dropper"],
    correctAnswerIndex: 2 // ค
  },
  {
    id: 11,
    text: "การสร้างเส้นโค้งด้วย Pen Tool ทำอย่างไร ?",
    options: ["คลิกและลาก", "คลิกแล้วคลิก", "ใช้ Shift ค้าง", "ใช้ปุ่ม Spacebar", "ใช้ Alt ค้างและลาก"],
    correctAnswerIndex: 0 // ก
  },
  {
    id: 12,
    text: "เครื่องมือนนี้คือ ?",
    visualType: "icon-curvature", 
    options: ["Curvature tool", "Shape Builder", "Pen tool", "Pencil Tool", "Eye Dropper"],
    correctAnswerIndex: 0 // ก 
  },
  {
    id: 13,
    text: "Curvature Tool ใช้สำหรับอะไร ?",
    options: ["สร้างเส้นโค้งที่ลื่นไหล", "วาดเส้นตรงหลายเส้น", "แก้ไขสีวัตถุ", "ลบเส้น path", "แปลงเส้นเป็นรูปทรง"],
    correctAnswerIndex: 0 // ก
  },
  {
    id: 14,
    text: "ข้อใดคือความแตกต่างของ Pen Tool และ Curvature Tool?",
    options: ["Pen Tool วาดเส้นตรงและโค้งได้ แต่ Curvature ใช้สร้างเส้นโค้งเท่านั้น", "Curvature Tool ใช้สำหรับลบรูปทรง", "Pen Tool ใช้สร้างเฉพาะเส้นโค้ง", "Curvature Tool ใช้สร้างจุดมุมเท่านั้น", "ทั้งสองเหมือนกันทุกอย่าง"],
    correctAnswerIndex: 0 // ก
  },
  {
    id: 15,
    text: "คีย์ลัดเครื่องมือ Selection Tool คือ ?",
    options: ["(V)", "(P)", "(A)", "(O)", "(M)"],
    correctAnswerIndex: 0 // ก
  },
  {
    id: 16,
    text: "คีย์ลัดของเครื่องมือ Direct-Selection Tools คือข้อใด?",
    options: ["(V)", "(P)", "(A)", "(O)", "(M)"],
    correctAnswerIndex: 2 // ค
  },
  {
    id: 17,
    text: "การคัดลอกโดยการคลิกเมาร์ลากวัตถุสามารถทำได้โดย วิธีใด ?",
    options: ["กด Alt + Shift ค้างไว้แล้วคลิกลากวัตถุ", "กด Shift ค้างไว้แล้วคลิกลากวัตถุ", "กด Alt ค้างไว้แล้วคลิกลากวัตถุ", "กด Ctrl +Alt ค้างไว้แล้วคลิกลากวัตถุ", "กด Ctrl ค้างไว้แล้วคลิกลากวัตถุ"],
    correctAnswerIndex: 2 // ค
  },
  {
    id: 18,
    text: "จากข้อ 17 ข้อใดคือคีย์ลัดในการ Past หรือ วาง วัตถุ ?",
    options: ["Ctrl + D", "Ctrl + A", "Ctrl + G", "Ctrl + P", "Ctrl + C"],
    correctAnswerIndex: 0 // ก (Based on user confirmation 18 = Ctrl+D)
  },
  {
    id: 19,
    text: "คำสั่งในการย้ายวัตถุไปอยู่ด้านหน้าสุดคือ ?",
    options: ["คลิกขวา>Arrange>Sent to Back", "คลิกขวา>Arrange>Bring to Back", "คลิกขวา>Arrange>Sent to Bring", "คลิกขวา>Arrange>Bring to Front", "คลิกขวา>Arrange>Sent Backward"],
    correctAnswerIndex: 3 // ง
  },
  {
    id: 20,
    text: "คำสั่งในการย้ายวัตถุไปอยู่ด้านหลังสุดคือ ?",
    options: ["คลิกขวา>Arrange>Sent to Back", "คลิกขวา>Arrange>Bring to Back", "คลิกขวา>Arrange>Sent to Bring", "คลิกขวา>Arrange>Bring to Front", "คลิกขวา>Arrange>Sent Backward"],
    correctAnswerIndex: 0 // ก
  },
  {
    id: 21,
    text: "เครื่องมือที่ช่วยปรับแต่งเส้นให้บิดงอหรือโค้งคือ เครื่องมือใด ?",
    options: ["Selection Tools", "Direct-Selection Tools", "Rectangle Tool", "Rounded Rectangle Tool", "Polygon Tool"],
    correctAnswerIndex: 1 // ข
  },
  {
    id: 22,
    text: "ข้อใดคือคีย์ลัดของเครื่องมือ Pen Tool?",
    visualType: "icon-pen",
    options: ["(P)", "(V)", "(A)", "(T)", "(H)"],
    correctAnswerIndex: 0 // ก
  },
  {
    id: 23,
    text: "เครื่องมือในการดูดสี คือข้อใด ?",
    visualType: "icon-eyedropper",
    options: ["Width Tool", "Type Tool", "Scale Tool", "Hand Tool", "Eye Dropper Tool"],
    correctAnswerIndex: 4 // จ
  },
  {
    id: 24,
    text: "ข้อใดคือการจัดกลุ่มให้กับวัตถุ ?",
    options: ["คลิกเลือกวัตถุ 1 ชิ้น > Object > Group", "ไปที่เมนู Object > Group", "คลิกเลือกวัตถุทุกชิ้น > Object > Lock", "คลิกเลือกวัตถุทุกชิ้น > Object > Group", "คลิกเลือกวัตถุ 1 ชิ้น > Object > Ungroup"],
    correctAnswerIndex: 3 // ง
  },
  {
    id: 25,
    text: "จากภาพคือเครื่องมือใด ?",
    visualType: "icon-width",
    options: ["Width Tool", "Type Tool", "Scale Tool", "Hand Tool", "Shape Builder Tool"],
    correctAnswerIndex: 4 // จ (Shape Builder Tool)
  },
  {
    id: 26,
    text: "Shape Builder Tool สามารถใช้งานได้เมื่อใด ?",
    options: ["เมื่อเลือกวัตถุแค่ 1 ชิ้น", "เมื่อไม่มีเส้นทับกัน", "เมื่อเลือกหลายวัตถุพร้อมกัน", "เมื่ออยู่ในโหมด Outline", "เมื่อล็อกวัตถุอยู่"],
    correctAnswerIndex: 2 // ค
  },
  {
    id: 27,
    text: "ถ้าต้องการเชื่อมต่อวัตถุหลาย ๆ ชิ้นเข้าเป็นชิ้นเดียวกัน ต้องใช้เครื่องมือใด?",
    options: ["Pathfinder", "Shape Builder Tool", "Width Tool", "Type Tool", "ถูกทั้ง ข้อ ก และข้อ ข"],
    correctAnswerIndex: 1 // ข (User specified Shape Builder Tool)
  },
  {
    id: 28,
    text: "ถ้าต้องการลบวัตถุหรือเส้น โดยใช้เครื่องมือ Shape Builder Tool ต้องกดคีย์ใดด้วย ?",
    options: ["Shift", "Ctrl", "Alt", "Enter", "Shift + Alt"],
    correctAnswerIndex: 2 // ค
  },
  {
    id: 29,
    text: "คำสั่ง Fit on Screen ใช้ทำอะไร ?",
    options: ["ซ่อนวัตถุที่เลือก", "ปรับหน้าต่างงานให้พอดีกับหน้าจอ", "ย้ายวัตถุไปไว้ด้านหลังสุด", "รวมวัตถุสองชิ้นขึ้นไป", "ลงสีสำหรับพื้นหลัง"],
    correctAnswerIndex: 1 // ข
  },
  {
    id: 30,
    text: "จากภาพ หมายถึง ?",
    visualType: "icon-color",
    options: ["ซ่อนวัตถุที่เลือก", "Copy วัตถุ", "ย้ายวัตถุไปไว้ด้านหลังสุด", "ไม่เติมสีใดๆ", "ลงสีสำหรับพื้นหลัง"],
    correctAnswerIndex: 3 // ง (User specified ไม่เติมสีใดๆ which is index 3. Note: Options order is [0,1,2,3,4])
  },
];

export const VisualComponent = ({ type }: { type: string }) => {
    switch (type) {
        case 'triangle': return <Triangle size={48} className="text-blue-600 fill-blue-100 mx-auto my-2" />;
        case 'star': return <Star size={48} className="text-yellow-500 fill-yellow-100 mx-auto my-2" />;
        case 'rounded-rect': return <div className="w-12 h-12 border-2 border-blue-600 rounded-lg bg-blue-100 mx-auto my-2"></div>;
        case 'icon-pen': return <img src="https://i.pinimg.com/736x/52/18/88/52188846ce3a6a5322f825e06caf7a40.jpg" alt="Pen Tool" className="w-24 h-24 object-contain mx-auto my-2 opacity-80" />;
        case 'icon-select': return <MousePointer size={48} className="text-gray-700 mx-auto my-2" />;
        case 'icon-width': return <img src="https://static.thenounproject.com/png/1457300-200.png" alt="Width Tool" className="w-24 h-24 object-contain mx-auto my-2 opacity-80" />;
        case 'icon-color': return (
          <svg width="48" height="48" viewBox="0 0 48 48" className="mx-auto my-2">
            <rect x="2" y="2" width="44" height="44" fill="white" stroke="#374151" strokeWidth="2" />
            <line x1="2" y1="46" x2="46" y2="2" stroke="#DC2626" strokeWidth="3" />
          </svg>
        );
        case 'icon-curvature': return <img src="https://static.thenounproject.com/png/1457229-200.png" alt="Curvature Tool" className="w-24 h-24 object-contain mx-auto my-2 opacity-80" />;
        case 'icon-eyedropper': return <img src="https://static.thenounproject.com/png/177491-200.png" alt="Eye Dropper Tool" className="w-24 h-24 object-contain mx-auto my-2 opacity-80" />;
        case 'icon-shape-builder': return <img src="https://static.thenounproject.com/png/366367-200.png" alt="Shape Builder Tool" className="w-24 h-24 object-contain mx-auto my-2 opacity-80" />;
        default: return <div className="w-12 h-12 border border-dashed border-gray-400 mx-auto my-2 flex items-center justify-center">?</div>;
    }
}
