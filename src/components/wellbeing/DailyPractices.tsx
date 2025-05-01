import { useState } from "react";

// SVG ICONS
const icons = {
  shower: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="30" fill="#89EEFF" />
      <g><circle cx="15" cy="10" r="5" fill="#007A99" /><rect x="12.5" y="15" width="5" height="10" rx="2.5" fill="#007A99" /></g>
    </svg>
  ),
  sun: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="15" r="8" fill="#FFD600" />
      <g stroke="#007A99" strokeWidth="2">
        <line x1="15" y1="2" x2="15" y2="7" />
        <line x1="15" y1="23" x2="15" y2="28" />
        <line x1="3" y1="15" x2="8" y2="15" />
        <line x1="23" y1="15" x2="28" y2="15" />
      </g>
    </svg>
  ),
  moleskine: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="20" height="20" rx="3" fill="#007A99" />
      <rect x="8" y="8" width="14" height="14" rx="2" fill="white" />
    </svg>
  ),
  smelling: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="15" cy="20" rx="7" ry="4" fill="#007A99" />
      <path d="M15 10 Q17 15 15 20 Q13 15 15 10" stroke="#007A99" strokeWidth="2" fill="none" />
    </svg>
  ),
};

type IconType = keyof typeof icons;

interface Practice {
  id: number;
  icon: IconType;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  completed: boolean;
}

const PRACTICE_DATA: Practice[] = [
  {
    id: 1,
    icon: "shower",
    title: "improve your morning mood",
    subtitle: "cold shower plunge",
    description: "improve your mental health with practices shared by andrew huberman and naval ravikant",
    benefits: [
      "increases alertness and focus",
      "boosts mood through dopamine release",
    ],
    completed: false,
  },
  {
    id: 2,
    icon: "moleskine",
    title: "decrease disappointment",
    subtitle: "gratitude journal",
    description: "improve your mental health with practices shared by andrew huberman and naval ravikant",
    benefits: [
      "increases alertness and focus",
      "boosts mood through dopamine release",
    ],
    completed: true,
  },
  {
    id: 3,
    icon: "sun",
    title: "waking up to most active self",
    subtitle: "morning sunlight exposure",
    description: "improve your mental health with practices shared by andrew huberman and naval ravikant",
    benefits: [
      "increases alertness and focus",
      "boosts mood through dopamine release",
    ],
    completed: false,
  },
  {
    id: 4,
    icon: "smelling",
    title: "release stress and anxiety",
    subtitle: "focus breathing exercise (3:3:6)",
    description: "improve your mental health with practices shared by andrew huberman and naval ravikant",
    benefits: [
      "increases alertness and focus",
      "boosts mood through dopamine release",
    ],
    completed: true,
  },
  // More copies of the same practices for demonstration
  {
    id: 5,
    icon: "shower",
    title: "improve your morning mood",
    subtitle: "cold shower plunge",
    description: "improve your mental health with practices shared by andrew huberman and naval ravikant",
    benefits: [
      "increases alertness and focus",
      "boosts mood through dopamine release",
    ],
    completed: true,
  },
  {
    id: 6,
    icon: "sun",
    title: "waking up to most active self",
    subtitle: "morning sunlight exposure",
    description: "improve your mental health with practices shared by andrew huberman and naval ravikant",
    benefits: [
      "increases alertness and focus",
      "boosts mood through dopamine release",
    ],
    completed: false,
  },
  {
    id: 7,
    icon: "smelling",
    title: "release stress and anxiety",
    subtitle: "focus breathing exercise (3:3:6)",
    description: "improve your mental health with practices shared by andrew huberman and naval ravikant",
    benefits: [
      "increases alertness and focus", 
      "boosts mood through dopamine release",
    ],
    completed: false,
  },
  {
    id: 8,
    icon: "moleskine",
    title: "decrease disappointment",
    subtitle: "gratitude journal",
    description: "improve your mental health with practices shared by andrew huberman and naval ravikant",
    benefits: [
      "increases alertness and focus",
      "boosts mood through dopamine release",
    ],
    completed: true,
  },
];

const FILTERS = [
  { label: "feeling stressed", active: false },
  { label: "i am anxious", active: false },
  { label: "finding hard to focus", active: true },
  { label: "guided practice", active: false },
  { label: "guided practice", active: false },
  { label: "guided practice", active: false },
];

const DailyPractices = () => {
  const [practices, setPractices] = useState<Practice[]>(PRACTICE_DATA);
  // Add state to track expanded cards (optional, for full "See More" functionality)
  // const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  const handleToggleCompletion = (id: number) => {
    setPractices(prev =>
      prev.map(practice =>
        practice.id === id
          ? { ...practice, completed: !practice.completed }
          : practice
      )
    );
  };

  // Function to handle "See More" click (optional)
  // const handleSeeMore = (id: number) => {
  //   setExpandedCardId(id);
  //   // Potentially open a modal here
  // };

  return (
    <div className="w-full flex flex-col gap-6 p-3 bg-transparent">
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2 w-full">
        {FILTERS.map((filter, idx) => (
          <div
            key={idx}
            className={`flex-1 min-w-[120px] px-4 py-2 rounded-[10px] font-happy-monkey text-base lowercase text-center border-[1px] border-[#49DADD] ${
              filter.active
                ? 'bg-[#148BAF] text-white'
                : 'bg-white text-[#04C4D5]'
            }`}
          >
            {filter.label}
          </div>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
        {practices.map((practice) => (
          <div
            key={practice.id}
            className="w-full p-[10px] bg-[rgba(83,252,255,0.10)] shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)] rounded-[10px] flex flex-col gap-[20px] h-full"
          >
            {/* Card Content */}
            <div className="flex flex-col gap-[10px] flex-grow">
              {/* Header Section */}
              <div className="w-full p-[4px] rounded-[8px] flex flex-col items-center">
                <div className="w-full flex items-center gap-[10px]">
                  <div>{icons[practice.icon]}</div>
                  <div className="flex-1 text-center text-[#148BAF] font-happy-monkey text-sm lowercase">
                    {practice.title}
                  </div>
                </div>
                <div className="w-full text-black font-happy-monkey text-base text-center lowercase">
                  {practice.subtitle}
                </div>
              </div>
              
              {/* Description Section */}
              <div className="flex flex-col gap-[10px]">
                <div className="text-[#148BAF] font-happy-monkey text-[14px] lowercase line-clamp-2">
                  {practice.description}
                </div>
                <div className="text-[#148BAF] font-happy-monkey text-[14px] lowercase">
                  <span>Key benefits<br/></span>
                  <span className="line-clamp-3">
                    {practice.benefits.map((benefit, idx) => (
                      <span key={idx}>{benefit}<br/></span>
                    ))}
                  </span>
                  <button 
                    className="text-xs text-black hover:underline lowercase mt-1"
                  >
                    see more
                  </button>
                </div>
              </div>
            </div>
            
            {/* Button Section */}
            <div className="w-full flex flex-col gap-[10px]">
              <div className="w-full p-[8px] bg-white shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)] rounded-[8px] border border-[#49DADD] flex justify-center items-center">
                <span className="text-center text-[#148BAF] font-happy-monkey text-base lowercase">
                  Guided Practice
                </span>
              </div>
              <div 
                onClick={() => handleToggleCompletion(practice.id)}
                className={`w-full p-[8px] ${
                  practice.completed 
                    ? 'bg-[#148BAF] text-white border border-[#49DADD]' 
                    : 'bg-[#F7FFFF] text-[#148BAF] border border-[#49DADD]'
                } rounded-[8px] flex justify-center items-center cursor-pointer`}
              >
                <span className="text-center font-happy-monkey text-base lowercase">
                  {practice.completed ? 'Completed' : 'Mark as Complete'}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {/* Empty cards */}
        <div className="flex flex-col bg-white rounded-[10px] p-3"></div>
        <div className="flex flex-col bg-white rounded-[10px] p-3"></div>
        <div className="flex flex-col bg-white rounded-[10px] p-3"></div>
      </div>
    </div>
  );
};

export default DailyPractices;