import { Link } from "react-router-dom";
import { usePractices } from "../../context/PracticeContext";

const MobileDailyPractices = () => {
  // Consume context
  const { practices, togglePracticeCompletion, isLoading } = usePractices();

  // Filter practices for display (show only daily practices)
  const displayedPractices = practices.filter(practice => practice.isDaily === true);
  
  // Calculate completion percentage
  const completedCount = displayedPractices.filter(p => p.completed).length;
  const totalCount = displayedPractices.length || 1; // Prevent division by zero
  const completionPercentage = Math.round((completedCount / totalCount) * 100);
  
  if (isLoading) {
    return (
      <div className="wellness-section flex flex-col items-start p-0 gap-5 w-[360px] mx-auto">
        <div className="progress-bar flex flex-row items-center p-0 gap-2.5 w-full h-24" id="progress-bar-container">
          <div className="w-[24px] h-6 bg-white border border-white flex items-center justify-center font-happy-monkey text-[#148BAF]">3</div>
          <div className="flex items-center justify-center p-0 gap-2.5 flex-grow relative h-24">
            <div className="w-full h-6 relative">
              {/* Rotated progress bar */}
              <div className="absolute top-0 left-0 w-full h-6 origin-left">
                <div className="relative w-full h-24 origin-top-left transform-gpu">
                  <div className="absolute top-0 left-0 h-6 w-full bg-gradient-to-r from-[#49DAEA] to-[rgba(196,254,255,0.2)] rounded">
                    <div className="font-happy-monkey font-normal text-sm leading-4 lowercase text-white absolute left-2 top-1">10%</div>
                    {/* Star with points */}
                    <div className="absolute w-6 h-6 right-16 top-0">
                      <div className="absolute w-[20px] h-[20px] bg-[#49DADD] rounded-[2px] flex items-center justify-center">
                        <span className="font-happy-monkey text-xs leading-4 text-[#FCDF4D]">888</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[66px] h-[19px] font-happy-monkey font-normal text-base leading-[19px] lowercase text-[#148BAF]">1000 pts</div>
        </div>
        
        <div className="practices-title flex flex-row justify-center items-center p-0 gap-2.5 w-full h-[29px]">
          <h2 className="w-full h-[29px] font-happy-monkey font-normal text-2xl leading-[29px] text-center lowercase text-black">
            your daily practices
          </h2>
        </div>
        
        <div className="daily-practice-list flex flex-col items-start p-5 gap-5 w-full bg-[rgba(83,252,255,0.1)] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] rounded-[20px]">
          <div className="practices-list flex flex-col items-start p-0 gap-2.5 w-full h-[190px]">
            <div className="flex items-center justify-center h-full w-full">
              <p className="text-center text-[#148BAF] font-happy-monkey lowercase">
                Loading practices...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Check for empty daily practices and show a message
  if (displayedPractices.length === 0) {
    return (
      <div className="wellness-section flex flex-col items-start p-0 gap-5 w-[360px] mx-auto">
        <div className="progress-bar flex flex-row items-center p-0 gap-2.5 w-full h-24" id="progress-bar-container">
          <div className="w-[24px] h-6 bg-white border border-white flex items-center justify-center font-happy-monkey text-[#148BAF]">3</div>
          <div className="flex items-center justify-center p-0 gap-2.5 flex-grow relative h-24">
            <div className="w-full h-6 relative">
              {/* Rotated progress bar */}
              <div className="absolute top-0 left-0 w-full h-6 origin-left">
                <div className="relative w-full h-24 origin-top-left transform-gpu">
                  <div className="absolute top-0 left-0 h-6 w-full bg-gradient-to-r from-[#49DAEA] to-[rgba(196,254,255,0.2)] rounded">
                    <div className="font-happy-monkey font-normal text-sm leading-4 lowercase text-white absolute left-2 top-1">0%</div>
                    {/* Star with points */}
                    <div className="absolute w-6 h-6 right-16 top-0">
                      <div className="absolute w-[20px] h-[20px] bg-[#49DADD] rounded-[2px] flex items-center justify-center">
                        <span className="font-happy-monkey text-xs leading-4 text-[#FCDF4D]">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[66px] h-[19px] font-happy-monkey font-normal text-base leading-[19px] lowercase text-[#148BAF]">0 pts</div>
        </div>
        
        <div className="practices-title flex flex-row justify-center items-center p-0 gap-2.5 w-full h-[29px]">
          <h2 className="w-full h-[29px] font-happy-monkey font-normal text-2xl leading-[29px] text-center lowercase text-black">
            your daily practices
          </h2>
        </div>
        
        <div className="daily-practice-list flex flex-col items-start p-5 gap-5 w-full bg-[rgba(83,252,255,0.1)] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] rounded-[20px]">
          <div className="practices-list flex flex-col items-start p-0 gap-2.5 w-full h-[190px]">
            <div className="flex flex-col items-center justify-center h-full w-full">
              <p className="text-center text-[#148BAF] font-happy-monkey lowercase mb-4">you don't have any daily practices yet</p>
              <Link 
                to="/Practices"
                className="inline-block bg-white hover:bg-[#F7FFFF] rounded-lg px-4 py-1.5 text-[#148BAF] font-happy-monkey text-sm lowercase border border-[#04C4D5] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] transition-all"
              >
                add daily practice
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="wellness-section flex flex-col items-start p-0 gap-5 w-[360px] mx-auto" id="daily-practices-section">
      {/* Progress bar */}
      <div className="progress-bar flex flex-row items-center p-0 gap-2.5 w-full h-24" id="progress-bar-container">
        <div className="w-[24px] h-6 bg-white border border-white flex items-center justify-center font-happy-monkey text-[#148BAF]">3</div>
        <div className="flex items-center justify-center p-0 gap-2.5 flex-grow relative h-24">
          <div className="w-full h-6 relative">
            {/* Rotated progress bar */}
            <div className="absolute top-0 left-0 w-full h-6 origin-left">
              <div className="relative w-full h-24 origin-top-left -rotate-90 transform-gpu">
                <div className="absolute top-0 left-0 h-6 w-full bg-gradient-to-r from-[#49DAEA] to-[rgba(196,254,255,0.2)] rounded">
                  <div className="font-happy-monkey font-normal text-sm leading-4 lowercase text-white absolute left-2 top-1">{completionPercentage}%</div>
                  {/* Star with points */}
                  <div className="absolute w-6 h-6 right-16 top-0">
                    <div className="absolute w-[20px] h-[20px] bg-[#49DADD] rounded-[2px] flex items-center justify-center">
                      <span className="font-happy-monkey text-xs leading-4 text-[#FCDF4D]">{completedCount * 88}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[66px] h-[19px] font-happy-monkey font-normal text-base leading-[19px] lowercase text-[#148BAF]">1000 pts</div>
      </div>
      
      {/* Practices title */}
      <div className="practices-title flex flex-row justify-center items-center p-0 gap-2.5 w-full h-[29px]">
        <h2 className="w-full h-[29px] font-happy-monkey font-normal text-2xl leading-[29px] text-center lowercase text-black">
          your daily practices
        </h2>
      </div>
      
      {/* Daily practice to-do list */}
      <div className="daily-practice-list flex flex-col items-start p-5 gap-5 w-full bg-[rgba(83,252,255,0.1)] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] rounded-[20px]">
        <div className="practices-list flex flex-col items-start p-0 gap-2.5 w-full">
          {/* Practice items */}
          {displayedPractices.map((practice, index) => (
            <div 
              key={practice.id} 
              className={`practice-item flex flex-row justify-between items-center p-2.5 gap-1 w-full h-10 ${
                index % 2 === 0 ? 'bg-white' : 'bg-[rgba(83,252,255,0.1)]'
              } shadow-[1px_2px_4px_rgba(73,218,234,0.5)] rounded-[10px] mb-2.5`}
            >
              {/* Practice name section */}
              <div className="practice-name flex flex-row items-center p-0 gap-2.5 w-[200px] h-5 mx-auto">
                <div className="flex flex-row items-center gap-2.5 w-full h-5">
                  <div className="flex flex-row justify-center items-center p-0 w-[15px] h-[15px] rounded">
                    <div className="w-[15px] h-[15px] relative">
                      <div className="absolute w-5 h-5 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#49DADD]">
                        <div className="absolute w-[17px] h-4 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 font-happy-monkey text-sm leading-4 flex items-end lowercase text-[#FCDF4D]">88</div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[132px] h-[18px] font-happy-monkey font-normal text-base leading-[18px] lowercase text-black truncate">
                    {practice.name}
                  </div>
                  <div className="box-border flex flex-row justify-center items-center py-0.5 px-1 gap-0.5 w-[33px] h-5 bg-white border border-[#04C4D5] rounded">
                    <svg className="w-[15px] h-[15px]" viewBox="0 0 15 15">
                      <g>
                        <path d="M-2 8.8h15v6H-2z" fill="#04C4D5" />
                        <path d="M1.78 2h3.9v4.54h-3.9z" fill="#04C4D5" />
                      </g>
                    </svg>
                    <div className="w-2 h-4 font-happy-monkey font-normal text-sm leading-4 lowercase text-[#04C4D5]">2</div>
                  </div>
                </div>
              </div>
              
              {/* Duration and completion buttons */}
              <div className="flex flex-row items-center p-0 gap-1 w-[115px] h-5 mx-auto">
                <div className="box-border flex flex-row justify-center items-center py-0.5 px-2 gap-2.5 w-[76px] h-5 bg-white border border-[#04C4D5] rounded">
                  <div className="w-[60px] h-4 font-happy-monkey font-normal text-sm leading-4 lowercase text-[#148BAF]">
                    30 min ^
                  </div>
                </div>
                <button
                  onClick={() => togglePracticeCompletion(practice.id)}
                  className={`flex flex-row justify-center items-center py-0.5 px-2 gap-2.5 w-[35px] h-5 ${
                    practice.completed 
                      ? 'bg-[#148BAF]' 
                      : 'bg-white border border-[#04C4D5]'
                  } rounded`}
                >
                  <svg 
                    className="w-[19px] h-4" 
                    viewBox="0 0 19 16" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M2 8L7 13L17 3" 
                      stroke={practice.completed ? "#FCDF4D" : "#04C4D5"} 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          
          {/* Link to all practices */}
          <div className="flex justify-center w-full mt-2">
            <Link 
              to="/Practices"
              className="inline-block bg-white hover:bg-[#F7FFFF] rounded-lg px-4 py-1.5 text-[#148BAF] font-happy-monkey text-sm lowercase border border-[#04C4D5] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] transition-all"
            >
              view all practices
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDailyPractices;