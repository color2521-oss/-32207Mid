import React from 'react';
import { Question } from '../types';
import { VisualComponent } from '../constants';

interface Props {
  question: Question;
  selectedOption: number | null;
  onSelect: (qId: number, optionIndex: number) => void;
}

const QuestionCard: React.FC<Props> = ({ question, selectedOption, onSelect }) => {
  const choices = ['ก', 'ข', 'ค', 'ง', 'จ'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6 transition-all hover:shadow-md">
      <div className="flex gap-3 mb-4">
        <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-700 font-bold rounded-full">
          {question.id}
        </span>
        <div className="flex-grow">
          <p className="text-lg text-gray-800 font-medium mb-2">{question.text}</p>
          {question.visualType && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100 flex justify-center">
              <VisualComponent type={question.visualType} />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 ml-11">
        {question.options.map((option, idx) => (
          <label 
            key={idx} 
            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
              selectedOption === idx 
                ? 'bg-blue-50 border-blue-500 text-blue-800' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              name={`question-${question.id}`}
              value={idx}
              checked={selectedOption === idx}
              onChange={() => onSelect(question.id, idx)}
              className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 mr-3"
            />
            <span className="font-medium mr-2 text-gray-500">{choices[idx]}.</span>
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;