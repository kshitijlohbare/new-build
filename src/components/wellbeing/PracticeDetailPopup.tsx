import React from 'react';
import { usePractices } from '../../context/PracticeContext';
import { X } from 'lucide-react';

interface PracticeDetailPopupProps {
  practiceId: number;
  onClose: () => void;
}

const PracticeDetailPopup: React.FC<PracticeDetailPopupProps> = ({ practiceId, onClose }) => {
  const { practices, toggleStepCompletion, getStepProgress } = usePractices();
  const practice = practices.find(p => p.id === practiceId);

  if (!practice) return null;

  const stepProgress = getStepProgress(practiceId);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 p-2 md:p-4">
      <div className="bg-white rounded-lg p-3 md:p-5 max-w-xl w-full max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl md:text-2xl font-semibold">{practice.name}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 transition-colors active:scale-95"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mb-3">
          <p className="text-gray-600 text-sm md:text-base leading-tight">{practice.description}</p>
          
          <div className="flex flex-wrap gap-x-4 mt-2">
            {practice.duration && (
              <p className="text-xs md:text-sm text-gray-500">
                Duration: {practice.duration} minutes
              </p>
            )}
            
            {practice.source && (
              <p className="text-xs md:text-sm text-gray-500">
                Source: {practice.source}
              </p>
            )}
          </div>
        </div>

        {practice.benefits && practice.benefits.length > 0 && (
          <div className="mb-4">
            <h3 className="text-base md:text-lg font-semibold mb-1">Benefits</h3>
            <ul className="list-disc pl-5 space-y-0.5">
              {practice.benefits.map((benefit, index) => (
                <li key={index} className="text-gray-600 text-sm md:text-base leading-tight">
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {practice.steps && practice.steps.length > 0 && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-base md:text-lg font-semibold">Steps</h3>
              <span className="text-xs md:text-sm text-gray-500">
                Progress: {Math.round(stepProgress)}%
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div 
                className="bg-[#148BAF] h-2 rounded-full transition-all duration-300" 
                style={{ width: `${stepProgress}%` }}
              ></div>
            </div>

            <ol className="space-y-3 md:space-y-4">
              {practice.steps.map((step, index) => (
                <li key={index} className="border-l-2 pl-3 border-gray-300">
                  <div className="flex items-center mb-1">
                    <div 
                      className="w-5 h-5 mr-2 flex-shrink-0"
                      onClick={() => toggleStepCompletion(practiceId, index)}
                    >
                      <input 
                        type="checkbox" 
                        checked={step.completed || false}
                        onChange={() => toggleStepCompletion(practiceId, index)}
                        className="w-4 h-4 cursor-pointer accent-[#148BAF]"
                      />
                    </div>
                    <h4 className="font-medium text-base md:text-lg leading-tight">{step.title}</h4>
                  </div>
                  
                  <p className="text-gray-600 ml-7 text-sm md:text-base leading-tight">{step.description}</p>
                  
                  {step.imageUrl && (
                    <div className="mt-2 ml-7">
                      <img 
                        src={step.imageUrl} 
                        alt={`Step ${index + 1}`} 
                        className="rounded-lg max-h-40 object-cover"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#148BAF] text-white rounded-md hover:bg-[#0e6d89] text-sm md:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeDetailPopup;
