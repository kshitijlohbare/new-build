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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{practice.name}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300">{practice.description}</p>
          
          {practice.duration && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Duration: {practice.duration} minutes
            </p>
          )}
          
          {practice.source && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Source: {practice.source}
            </p>
          )}
        </div>

        {practice.benefits && practice.benefits.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Benefits</h3>
            <ul className="list-disc pl-5 space-y-1">
              {practice.benefits.map((benefit, index) => (
                <li key={index} className="text-gray-600 dark:text-gray-300">
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {practice.steps && practice.steps.length > 0 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">Steps</h3>
              <span className="text-sm text-gray-500">
                Progress: {Math.round(stepProgress)}%
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${stepProgress}%` }}
              ></div>
            </div>

            <ol className="space-y-6">
              {practice.steps.map((step, index) => (
                <li key={index} className="border-l-2 pl-4 border-gray-300 dark:border-gray-600">
                  <div className="flex items-center mb-2">
                    <div 
                      className="w-6 h-6 mr-3 flex-shrink-0"
                      onClick={() => toggleStepCompletion(practiceId, index)}
                    >
                      <input 
                        type="checkbox" 
                        checked={step.completed || false}
                        onChange={() => toggleStepCompletion(practiceId, index)}
                        className="w-5 h-5 cursor-pointer accent-blue-600"
                      />
                    </div>
                    <h4 className="font-medium text-lg">{step.title}</h4>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 ml-9">{step.description}</p>
                  
                  {step.imageUrl && (
                    <div className="mt-3 ml-9">
                      <img 
                        src={step.imageUrl} 
                        alt={`Step ${index + 1}`} 
                        className="rounded-lg max-h-48 object-cover"
                      />
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PracticeDetailPopup;
