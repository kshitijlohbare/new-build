import { useState } from "react";

interface Practice {
  id: number;
  name: string;
  duration?: number;
  completed: boolean;
}

const DailyPracticesSimple = () => {
  const [practices, setPractices] = useState<Practice[]>([
    { id: 1, name: "outdoor walking", duration: 30, completed: false },
    { id: 2, name: "outdoor walking", duration: 30, completed: false },
    { id: 3, name: "cold shower plunge", completed: true },
    { id: 4, name: "cold shower plunge", completed: true },
    { id: 5, name: "morning sunlight exposure", completed: false },
    { id: 6, name: "morning sunlight exposure", completed: false },
    { id: 7, name: "digital minimalism", duration: 120, completed: true },
    { id: 8, name: "digital minimalism", duration: 120, completed: true },
    { id: 9, name: "outdoor walking", duration: 30, completed: false },
    { id: 10, name: "outdoor walking", duration: 30, completed: false },
  ]);

  const handleToggleCompletion = (id: number) => {
    setPractices(prev =>
      prev.map(practice =>
        practice.id === id
          ? { ...practice, completed: !practice.completed }
          : practice
      )
    );
  };

  // Split practices into left and right columns
  const leftPractices = practices.filter((_, index) => index % 2 === 0);
  const rightPractices = practices.filter((_, index) => index % 2 === 1);

  return (
    <div className="flex flex-col gap-5 p-5 bg-[rgba(83,252,255,0.1)] rounded-[20px] w-full overflow-hidden">
      {/* Title section */}
      <div className="flex justify-between items-center">
        <h2 className="text-center font-happy-monkey text-black text-3xl lowercase flex-1">your daily practices</h2>
        <div className="bg-white p-[10px] rounded-[10px] border border-[#04C4D5] shadow-[1px_2px_4px_rgba(4,196,213,0.5)] flex items-center gap-2">
          <span className="text-[#148BAF] font-happy-monkey text-[16px] lowercase">add new practice</span>
        </div>
      </div>
      
      {/* Practice lists in two columns */}
      <div className="flex gap-5 flex-col md:flex-row">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-5">
          {leftPractices.map(practice => (
            <div 
              key={practice.id}
              className="flex justify-between items-center p-[10px_20px] bg-white rounded-[10px] shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)]"
            >
              <div className="flex items-center gap-[10px]">
                <span className="font-happy-monkey text-[#148BAF] text-base lowercase">{practice.name}</span>
                {practice.duration && (
                  <div className="px-[8px] py-[2px] bg-[#F7FFFF] border border-[#148BAF] rounded-[4px] flex items-center gap-1">
                    <span className="text-[#148BAF] font-happy-monkey text-sm lowercase">{practice.duration} min</span>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="#148BAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              <button 
                onClick={() => handleToggleCompletion(practice.id)}
                className={`min-w-[136px] px-[8px] py-[2px] rounded-[4px] whitespace-nowrap ${
                  practice.completed 
                    ? 'bg-[#148BAF] border border-[#04C4D5] shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)] py-1' 
                    : 'bg-white border border-[#04C4D5] py-1'
                }`}
              >
                <span className={`font-happy-monkey text-[16px] lowercase ${
                  practice.completed ? 'text-white' : 'text-[#148BAF]'
                }`}>
                  {practice.completed ? 'completed' : 'mark complete'}
                </span>
              </button>
            </div>
          ))}
        </div>
        
        {/* Right column */}
        <div className="flex-1 flex flex-col gap-5">
          {rightPractices.map(practice => (
            <div 
              key={practice.id}
              className="flex justify-between items-center p-[10px_20px] bg-white rounded-[10px] shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)]"
            >
              <div className="flex items-center gap-[10px]">
                <span className="font-happy-monkey text-[16px] lowercase">{practice.name}</span>
                {practice.duration && (
                  <div className="px-[8px] py-[2px] bg-[#F7FFFF] border border-[#148BAF] rounded-[4px] flex items-center gap-1">
                    <span className="text-[#148BAF] font-happy-monkey text-[14px] lowercase">{practice.duration} min</span>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L5 5L9 1" stroke="#148BAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
              <button 
                onClick={() => handleToggleCompletion(practice.id)}
                className={`min-w-[136px] px-[8px] py-[2px] rounded-[4px] whitespace-nowrap ${
                  practice.completed 
                    ? 'bg-[#148BAF] shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)]' 
                    : 'bg-white border border-[#04C4D5]'
                }`}
              >
                <span className={`font-happy-monkey text-[16px] lowercase ${
                  practice.completed ? 'text-white' : 'text-[#148BAF]'
                }`}>
                  {practice.completed ? 'completed' : 'mark complete'}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyPracticesSimple;