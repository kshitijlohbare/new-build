import React, { useState } from 'react';
import { usePractices } from '../../context/PracticeContext';
import { X, Clock, BookOpen, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';

interface SimplePracticePopupProps {
  practiceId: number | null;
  onClose: () => void;
}

const SimplePracticePopup: React.FC<SimplePracticePopupProps> = ({ practiceId, onClose }) => {
  const { practices, addPractice } = usePractices();
  const practice = practices.find(p => p.id === practiceId);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  
  // Log every click for debugging
  const logClick = (label: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Clicked ${label}`);
    
    // Return true to allow default handling
    return true;
  };
  
  // Handle specific actions
  const handleClose = (e: React.MouseEvent) => {
    logClick('close button')(e);
    onClose();
  };
  
  const handleToggleDaily = (e: React.MouseEvent) => {
    logClick('toggle daily')(e);
    if (!practice) return;
    addPractice({ ...practice, isDaily: !practice.isDaily });
  };
  
  const showStepDetail = (index: number) => (e: React.MouseEvent) => {
    logClick(`step ${index}`)(e);
    setCurrentStep(index);
  };
  
  const goToNextStep = (e: React.MouseEvent) => {
    logClick('next step')(e);
    if (currentStep !== null && practice?.steps && currentStep < practice.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const goToPrevStep = (e: React.MouseEvent) => {
    logClick('prev step')(e);
    if (currentStep !== null && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const backToAllSteps = (e: React.MouseEvent) => {
    logClick('back to all steps')(e);
    setCurrentStep(null);
  };
  
  if (!practice) return null;
  
  // Simple icon mapping function
  const renderIcon = (icon?: string) => {
    const iconMap: Record<string, string> = {
      'shower': '🚿', 'sun': '☀️', 'moleskine': '📓', 'book': '📚',
      'relax': '😌', 'tree': '🌳', 'calendar': '📅', 'review': '📋',
      'disconnect': '🔌', 'screen': '📱', 'caffeine': '☕', 'smelling': '👃',
      'sparkles': '✨', 'anchor': '⚓', 'brain': '🧠'
    };
    
    return iconMap[icon || ''] || '📝';
  };
  
  return (
    <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white p-4 md:p-6 relative">
        {/* Top action buttons row */}
        <div className="flex justify-end mb-2">
          <button
            onClick={handleToggleDaily}
            className={`mr-2 px-4 py-1 rounded-full font-happy-monkey text-sm lowercase flex items-center ${
              practice.isDaily
                ? 'bg-white/20 text-white border border-white/50 hover:bg-white/30'
                : 'bg-white text-[#148BAF] hover:bg-white/90'
            }`}
          >
            {practice.isDaily ? 'remove daily' : 'add to daily'}
          </button>
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-white/40 hover:bg-white/60 text-white active:scale-95 shadow border border-white/30"
            aria-label="Close popup"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex items-center mb-2">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 flex items-center justify-center mr-4 shadow-lg">
            <span className="text-2xl">{renderIcon(practice.icon)}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-happy-monkey font-bold">{practice.name}</h2>
        </div>
        
        <p className="text-white/90 text-sm md:text-base">{practice.description}</p>
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-4 md:p-6">
        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {practice.duration && (
            <div className="bg-[rgba(4,196,213,0.1)] p-3 rounded-xl flex items-center">
              <div className="w-9 h-9 rounded-full bg-[#04C4D5]/20 flex items-center justify-center mr-3">
                <Clock size={18} className="text-[#148BAF]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-[#148BAF] font-happy-monkey text-sm">{practice.duration} minutes</p>
              </div>
            </div>
          )}
          
          {practice.source && (
            <div className="bg-[rgba(4,196,213,0.1)] p-3 rounded-xl flex items-center">
              <div className="w-9 h-9 rounded-full bg-[#04C4D5]/20 flex items-center justify-center mr-3">
                <BookOpen size={18} className="text-[#148BAF]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Source</p>
                <p className="text-[#148BAF] font-happy-monkey text-sm">{practice.source}</p>
              </div>
            </div>
          )}
        </div>

        {/* Steps navigation */}
        {currentStep === null && practice.steps && practice.steps.length > 0 ? (
          <div className="mb-3">
            <h3 className="text-base md:text-lg font-bold text-[#148BAF] flex items-center mb-3">
              <CheckCircle size={18} className="mr-2" /> Steps to Follow
            </h3>
            
            {/* Step cards list */}
            <div className="grid grid-cols-1 gap-3">
              {practice.steps.map((step, index) => (
                <div 
                  key={index}
                  onClick={showStepDetail(index)}
                  className="bg-white border border-gray-200 hover:border-[#04C4D5] rounded-xl p-4 cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">Step {index + 1}: {step.title}</h4>
                      <p className="text-gray-600 text-sm line-clamp-2">{step.description}</p>
                    </div>
                    <ArrowRight className="text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : currentStep !== null && practice.steps && practice.steps[currentStep] ? (
          <div>
            {/* Back button */}
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={backToAllSteps}
                className="flex items-center text-[#148BAF] hover:bg-[rgba(4,196,213,0.1)] px-3 py-2 rounded"
              >
                <ArrowLeft size={18} className="mr-2" />
                <span>Back to all steps</span>
              </button>
              <div className="text-sm text-gray-500">
                Step {currentStep + 1} of {practice.steps.length}
              </div>
            </div>
            
            {/* Step navigation */}
            <div className="flex justify-between mb-4">
              <button 
                onClick={goToPrevStep}
                disabled={currentStep === 0}
                className={`p-3 rounded-full ${
                  currentStep === 0 ? 'text-gray-300' : 'text-[#148BAF] hover:bg-[rgba(4,196,213,0.1)]'
                }`}
              >
                <ArrowLeft size={24} />
              </button>
              
              <button 
                onClick={goToNextStep}
                disabled={currentStep === practice.steps.length - 1}
                className={`p-3 rounded-full ${
                  currentStep === practice.steps.length - 1 ? 'text-gray-300' : 'text-[#148BAF] hover:bg-[rgba(4,196,213,0.1)]'
                }`}
              >
                <ArrowRight size={24} />
              </button>
            </div>
            
            {/* Step content */}
            <div className="bg-white border border-[rgba(4,196,213,0.2)] rounded-xl overflow-hidden">
              <div className="p-4">
                <h3 className="text-xl font-happy-monkey text-[#148BAF] mb-3">
                  {practice.steps[currentStep].title}
                </h3>
                <p className="text-gray-700">
                  {practice.steps[currentStep].description}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      
      {/* We've removed the footer and moved buttons to the header */}
    </div>
  );
};

export default SimplePracticePopup;
