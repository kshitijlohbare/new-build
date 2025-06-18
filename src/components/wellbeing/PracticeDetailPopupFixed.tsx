import React, { useState, useEffect, useRef } from 'react';
import { usePractices } from '../../context/PracticeContext';
import { X, Clock, BookOpen, Award, CheckCircle, ArrowLeft, ArrowRight, User, ExternalLink } from 'lucide-react';
import './PracticeDetailPopup.css';

interface PracticeDetailPopupProps {
  practiceId: number | null;
  onClose: () => void;
}

const PracticeDetailPopupFixed: React.FC<PracticeDetailPopupProps> = ({ practiceId, onClose }) => {
  const { practices, addPractice } = usePractices();
  const practice = practices.find(p => p.id === practiceId);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);
  
  // Create refs for buttons that need direct DOM access
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const dailyToggleRef = useRef<HTMLButtonElement>(null);
  const closeFooterBtnRef = useRef<HTMLButtonElement>(null);
  const popupContentRef = useRef<HTMLDivElement>(null);
  
  // Add console logging for debugging
  console.log('Rendering PracticeDetailPopupFixed with practiceId:', practiceId);

  useEffect(() => {
    // Trigger entrance animation
    setAnimateIn(true);
    
    // Log initial render
    console.log('PracticeDetailPopupFixed mounted');
    
    // Add direct click handlers to critical buttons
    const addDirectClickHandlers = () => {
      if (closeButtonRef.current) {
        closeButtonRef.current.addEventListener('click', handleCloseDirectly, true);
      }
      
      if (dailyToggleRef.current) {
        dailyToggleRef.current.addEventListener('click', handleToggleDailyDirectly, true);
      }
      
      if (closeFooterBtnRef.current) {
        closeFooterBtnRef.current.addEventListener('click', handleCloseDirectly, true);
      }
      
      // Handle dynamic step navigation buttons
      if (backButtonRef.current) {
        backButtonRef.current.addEventListener('click', handleBackToSteps, true);
      }
      
      if (nextButtonRef.current) {
        nextButtonRef.current.addEventListener('click', handleNextStep, true);
      }
      
      if (prevButtonRef.current) {
        prevButtonRef.current.addEventListener('click', handlePrevStep, true);
      }
    };
    
    // Run after a short delay to ensure all refs are set
    setTimeout(addDirectClickHandlers, 100);
    
    // Prevent body scrolling
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Clean up event listeners and restore scrolling
      document.body.style.overflow = '';
      
      if (closeButtonRef.current) {
        closeButtonRef.current.removeEventListener('click', handleCloseDirectly, true);
      }
      
      if (dailyToggleRef.current) {
        dailyToggleRef.current.removeEventListener('click', handleToggleDailyDirectly, true);
      }
      
      if (closeFooterBtnRef.current) {
        closeFooterBtnRef.current.removeEventListener('click', handleCloseDirectly, true);
      }
      
      if (backButtonRef.current) {
        backButtonRef.current.removeEventListener('click', handleBackToSteps, true);
      }
      
      if (nextButtonRef.current) {
        nextButtonRef.current.removeEventListener('click', handleNextStep, true);
      }
      
      if (prevButtonRef.current) {
        prevButtonRef.current.removeEventListener('click', handlePrevStep, true);
      }
      
      console.log('PracticeDetailPopupFixed unmounted');
    };
  }, []);
  
  // Update event handlers when currentStep changes
  useEffect(() => {
    const updateStepNavHandlers = () => {
      if (currentStep !== null) {
        if (backButtonRef.current) {
          backButtonRef.current.removeEventListener('click', handleBackToSteps, true);
          backButtonRef.current.addEventListener('click', handleBackToSteps, true);
        }
        
        if (nextButtonRef.current) {
          nextButtonRef.current.removeEventListener('click', handleNextStep, true);
          nextButtonRef.current.addEventListener('click', handleNextStep, true);
        }
        
        if (prevButtonRef.current) {
          prevButtonRef.current.removeEventListener('click', handlePrevStep, true);
          prevButtonRef.current.addEventListener('click', handlePrevStep, true);
        }
      }
    };
    
    setTimeout(updateStepNavHandlers, 50);
  }, [currentStep]);

  // Direct DOM event handlers
  const handleCloseDirectly = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Close button clicked directly');
    setAnimateOut(true);
    setTimeout(onClose, 300);
  };
  
  const handleToggleDailyDirectly = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggle daily button clicked directly');
    if (!practice) return;
    addPractice({ ...practice, isDaily: !practice.isDaily });
  };
  
  const handleBackToSteps = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Back to steps clicked directly');
    setCurrentStep(null);
  };
  
  const handleNextStep = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentStep !== null && practice?.steps && currentStep < practice.steps.length - 1) {
      console.log('Next step clicked directly');
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handlePrevStep = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentStep !== null && currentStep > 0) {
      console.log('Previous step clicked directly');
      setCurrentStep(currentStep - 1);
    }
  };

  // React handlers (backup)
  const handleClose = () => {
    console.log('Close handler called via React');
    setAnimateOut(true);
    setTimeout(onClose, 300);
  };

  // Removed unused handleToggleDaily function in favor of direct DOM event handler

  const showStepDetail = (index: number) => {
    console.log('Showing step detail for index:', index);
    setCurrentStep(index);
  };

  // Render icon for practice
  const renderPracticeIcon = (icon?: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'shower': '🚿',
      'sun': '☀️',
      'moleskine': '📓',
      'book': '📚',
      'relax': '😌',
      'tree': '🌳',
      'calendar': '📅',
      'review': '📋',
      'disconnect': '🔌',
      'screen': '📱',
      'caffeine': '☕',
      'smelling': '👃',
      'sparkles': '✨',
      'anchor': '⚓',
      'brain': '🧠'
    };
    
    if (!icon) return null;
    return (
      <span className="text-2xl sm:text-3xl">{iconMap[icon] || '📝'}</span>
    );
  };

  // Handle outside clicks
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // If no practice found, return nothing
  if (!practice) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[1000] bg-black/60 p-2 md:p-4"
      onClick={handleOverlayClick}
      style={{ touchAction: 'none' }}
    >
      <div 
        ref={popupContentRef}
        className={`bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-xl transform transition-all duration-300 ease-out ${
          animateIn && !animateOut ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } ${animateOut ? 'scale-95 opacity-0' : ''} relative z-[1001]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white p-4 md:p-6 relative">
          <button
            ref={closeButtonRef}
            className="absolute right-3 top-3 p-2 rounded-full bg-white/40 hover:bg-white/60 transition-colors text-white active:scale-95 shadow-sm border border-white/30 z-[1010]"
            aria-label="Close"
            style={{ touchAction: 'manipulation' }}
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center mb-2">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/20 flex items-center justify-center mr-4 shadow-lg">
              {renderPracticeIcon(practice.icon)}
            </div>
            <h2 className="text-xl md:text-2xl font-happy-monkey font-bold">{practice.name}</h2>
          </div>
          
          <p className="text-white/90 text-sm md:text-base">{practice.description}</p>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-4 md:p-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative">
          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {practice.duration && (
              <div className="bg-gradient-to-b from-[rgba(4,196,213,0.1)] to-[rgba(4,196,213,0.05)] p-3 rounded-xl flex items-center">
                <div className="w-9 h-9 rounded-full bg-[#04C4D5] bg-opacity-20 flex items-center justify-center mr-3">
                  <Clock size={18} className="text-[#148BAF]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-[#148BAF] font-happy-monkey text-sm">{practice.duration} minutes</p>
                </div>
              </div>
            )}
            
            {practice.source && (
              <div className="bg-gradient-to-b from-[rgba(4,196,213,0.1)] to-[rgba(4,196,213,0.05)] p-3 rounded-xl flex items-center">
                <div className="w-9 h-9 rounded-full bg-[#04C4D5] bg-opacity-20 flex items-center justify-center mr-3">
                  <BookOpen size={18} className="text-[#148BAF]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Source</p>
                  <p className="text-[#148BAF] font-happy-monkey text-sm">{practice.source}</p>
                </div>
              </div>
            )}
            
            {practice.points && (
              <div className="bg-gradient-to-b from-[rgba(4,196,213,0.1)] to-[rgba(4,196,213,0.05)] p-3 rounded-xl flex items-center">
                <div className="w-9 h-9 rounded-full bg-[#04C4D5] bg-opacity-20 flex items-center justify-center mr-3">
                  <Award size={18} className="text-[#148BAF]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Points</p>
                  <p className="text-[#148BAF] font-happy-monkey text-sm">{practice.points} points</p>
                </div>
              </div>
            )}
            
            {practice.userCreated && (
              <div className="bg-gradient-to-b from-[rgba(4,196,213,0.1)] to-[rgba(4,196,213,0.05)] p-3 rounded-xl flex items-center">
                <div className="w-9 h-9 rounded-full bg-[#04C4D5] bg-opacity-20 flex items-center justify-center mr-3">
                  <User size={18} className="text-[#148BAF]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created by</p>
                  <p className="text-[#148BAF] font-happy-monkey text-sm">You</p>
                </div>
              </div>
            )}
          </div>

          {/* Benefits section */}
          {practice.benefits && practice.benefits.length > 0 && (
            <div className="bg-gradient-to-b from-[#F7FFFF] to-white rounded-xl border border-[rgba(4,196,213,0.2)] p-4 mb-6 shadow-sm">
              <h3 className="text-base md:text-lg font-bold text-[#148BAF] mb-3 flex items-center">
                <Award size={18} className="mr-2" /> Benefits
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {practice.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <div className="text-[#04C4D5] mr-2 mt-0.5">•</div>
                    <p className="text-gray-700 text-sm md:text-base">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Steps section */}
          {currentStep === null && practice.steps && practice.steps.length > 0 && (
            <div className="mb-3">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base md:text-lg font-bold text-[#148BAF] flex items-center">
                  <CheckCircle size={18} className="mr-2" /> Steps to Follow
                </h3>
                <div className="bg-[rgba(4,196,213,0.1)] px-3 py-1 rounded-full">
                  <span className="text-xs text-[#148BAF] font-happy-monkey">
                    {practice.steps.length} {practice.steps.length === 1 ? 'step' : 'steps'}
                  </span>
                </div>
              </div>
              
              {/* Steps cards */}
              <div className="grid grid-cols-1 gap-3">
                {practice.steps.map((step, index) => (
                  <div 
                    key={index}
                    onClick={() => showStepDetail(index)}
                    className="relative bg-white border border-gray-200 hover:border-[rgba(4,196,213,0.3)] rounded-xl p-4 cursor-pointer transition-all duration-200 group hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transform"
                    style={{ touchAction: 'manipulation' }}
                  >
                    {/* Step number badge */}
                    <div className="absolute -left-2 -top-2 w-6 h-6 rounded-full bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                      {index + 1}
                    </div>
                    
                    <div className="ml-2">
                      <div className="flex items-start">
                        {/* Title and description */}
                        <div className="flex-1">
                          <h4 className="font-medium text-base md:text-lg mb-1 text-gray-800">
                            {step.title}
                          </h4>
                          <p className="text-gray-600 text-sm line-clamp-2">{step.description}</p>
                          
                          {/* Preview image thumbnail if available */}
                          {step.imageUrl && (
                            <div className="mt-2 overflow-hidden rounded-lg h-20 w-20 bg-gray-100 flex-shrink-0">
                              <img 
                                src={step.imageUrl} 
                                alt={`Step ${index + 1} thumbnail`}
                                className="h-full w-full object-cover hover:scale-110 transition-transform duration-300"
                                loading="eager"
                              />
                            </div>
                          )}
                        </div>
                        
                        {/* View details arrow */}
                        <div className="text-gray-400 group-hover:text-[#148BAF] transition-colors flex-shrink-0">
                          <ArrowRight size={22} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Step Detail View */}
          {currentStep !== null && practice.steps && practice.steps[currentStep] && (
            <div className="animate-fade-in transform transition-transform duration-300">
              {/* Navigation header */}
              <div className="flex justify-between items-center mb-4">
                <button 
                  ref={backButtonRef}
                  className="flex items-center text-[#148BAF] hover:text-[#04C4D5] transition-all transform active:scale-[0.98] hover:bg-[rgba(4,196,213,0.05)] px-3 py-2 rounded-md"
                  aria-label="Back to all steps"
                  style={{ touchAction: 'manipulation' }}
                >
                  <ArrowLeft size={18} className="mr-2" />
                  <span className="text-sm font-medium">Back to all steps</span>
                </button>
                <div className="text-sm text-gray-500">
                  Step {currentStep + 1} of {practice.steps.length}
                </div>
              </div>
              
              {/* Step navigation */}
              <div className="flex justify-between mb-4 step-navigation">
                <button 
                  ref={prevButtonRef}
                  disabled={currentStep === 0}
                  className={`p-3 rounded-full transition-all transform ${
                    currentStep === 0 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-[#148BAF] hover:bg-[rgba(4,196,213,0.1)] active:scale-[0.95]'
                  }`}
                  aria-label="Previous step"
                  style={{ touchAction: 'manipulation' }}
                >
                  <ArrowLeft size={24} />
                </button>
                
                <button 
                  ref={nextButtonRef}
                  disabled={currentStep === practice.steps.length - 1}
                  className={`p-3 rounded-full transition-all transform ${
                    currentStep === practice.steps.length - 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-[#148BAF] hover:bg-[rgba(4,196,213,0.1)] active:scale-[0.95]'
                  }`}
                  aria-label="Next step"
                  style={{ touchAction: 'manipulation' }}
                >
                  <ArrowRight size={24} />
                </button>
              </div>
              
              {/* Step content */}
              <div className="bg-white rounded-xl border border-[rgba(4,196,213,0.2)] overflow-hidden">
                {practice.steps && practice.steps[currentStep]?.imageUrl && (
                  <div className="w-full h-52 bg-gray-200 relative">
                    <img 
                      src={practice.steps[currentStep].imageUrl} 
                      alt={practice.steps[currentStep].title || `Step ${currentStep + 1}`}
                      className="w-full h-full object-cover" 
                      loading="eager"
                    />
                  </div>
                )}
                
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
          )}

          {/* External links */}
          {practice.source && practice.source.toLowerCase().includes('huberman') && (
            <a 
              href="https://hubermanlab.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center text-[#148BAF] text-sm mt-6 hover:underline"
            >
              Learn more about Dr. Andrew Huberman's work <ExternalLink size={14} className="ml-1" />
            </a>
          )}
          
          {practice.source && practice.source.toLowerCase().includes('naval') && (
            <a 
              href="https://nav.al/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center text-[#148BAF] text-sm mt-6 hover:underline"
            >
              Learn more about Naval Ravikant's work <ExternalLink size={14} className="ml-1" />
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[rgba(4,196,213,0.2)] p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <button
            ref={dailyToggleRef}
            className={`px-6 py-3 rounded-lg font-happy-monkey transition-all shadow-[0_2px_8px_rgba(4,196,213,0.3)] text-base lowercase ${
              practice.isDaily
                ? 'bg-white text-[#148BAF] border-2 border-[#04C4D5] hover:bg-gray-100'
                : 'bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white hover:from-[#03b1c1] hover:to-[#0f7a99]'
            }`}
            aria-label={practice.isDaily ? "Remove from daily practices" : "Add to daily practices"}
            style={{ touchAction: 'manipulation' }}
          >
            {practice.isDaily ? 'remove from daily practices' : 'add to daily practices'}
          </button>
          <div className="flex gap-2">
            <button
              ref={closeFooterBtnRef}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-[#148BAF] rounded-lg font-happy-monkey transition-all shadow-[0_2px_8px_rgba(4,196,213,0.1)] text-base lowercase"
              aria-label="Close popup"
              style={{ touchAction: 'manipulation' }}
            >
              close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeDetailPopupFixed;
