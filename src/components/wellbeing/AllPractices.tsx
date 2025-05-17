import { useState, useEffect } from 'react';
import { usePractices, Practice } from '../../context/PracticeContext';
import { useToast } from '@/hooks/useToast';
import AddPracticeDialog from './AddPracticeDialog';

// Import the icons from DailyPractices or create a common icons file
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
  sparkles: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 5L17 12L24 15L17 18L15 25L13 18L6 15L13 12L15 5Z" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
      <path d="M8 8L9 12L13 13L9 14L8 18L7 14L3 13L7 12L8 8Z" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
      <path d="M22 8L23 12L27 13L23 14L22 18L21 14L17 13L21 12L22 8Z" fill="#FFD700" stroke="#FFA500" strokeWidth="1"/>
    </svg>
  ),
  default: (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="30" fill="#89EEFF" />
      <circle cx="15" cy="15" r="8" fill="#007A99" />
    </svg>
  ),
};

type IconType = keyof typeof icons;

const AllPractices = () => {
  const { practices, isLoading, addPractice } = usePractices();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [systemPractices, setSystemPractices] = useState<Practice[]>([]);
  const [userPractices, setUserPractices] = useState<Practice[]>([]);
  const { toast } = useToast();
  
  console.log("AllPractices rendering:", { 
    isLoading,
    practicesCount: practices?.length || 0,
    systemPracticesCount: practices?.filter(p => p.isSystemPractice)?.length || 0,
    userPracticesCount: practices?.filter(p => p.userCreated && !p.isSystemPractice)?.length || 0
  });

  // Separate system practices from user-created practices
  useEffect(() => {
    if (practices && practices.length > 0) {
      const system = practices.filter(p => p.isSystemPractice);
      const user = practices.filter(p => p.userCreated && !p.isSystemPractice);
      
      setSystemPractices(system);
      setUserPractices(user);
    }
  }, [practices]);

  const handleAddToDailyPractices = (practice: Practice) => {
    console.log("handleAddToDailyPractices called with:", {
      practiceId: practice.id,
      practiceName: practice.name,
      isDaily: practice.isDaily
    });
    
    if (practice.isDaily) {
      console.log("Practice is already marked as daily, skipping");
      toast({
        title: 'Already in Daily Practices',
        description: 'This practice is already in your daily practices.',
        variant: 'default'
      });
      return;
    }
    
    console.log("Adding practice to daily practices:", practice.name);
    // Create a new practice object with isDaily explicitly set to true
    const dailyPractice = { 
      ...practice, 
      isDaily: true 
    };
    
    console.log("Calling addPractice with:", {
      practiceId: dailyPractice.id,
      practiceName: dailyPractice.name,
      isDaily: dailyPractice.isDaily
    });
    
    // Call addPractice with the updated practice
    addPractice(dailyPractice);
    
    // Show success message
    toast({
      title: 'Added to Daily Practices!',
      description: 'This practice has been added to your daily practices.',
      variant: 'success',
    });
    
    // Check if the practice was successfully marked as daily
    setTimeout(() => {
      const updatedPractice = practices.find(p => p.id === practice.id);
      console.log("After addPractice, practice state:", {
        practiceId: practice.id,
        practiceName: practice.name,
        isDaily: updatedPractice?.isDaily
      });
    }, 500);
  };

  if (isLoading) {
    return <div className="w-full p-4 text-center">Loading practices...</div>;
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Header with Add New Practice button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-happy-monkey text-[#148BAF]">All Practices</h2>
        <button
          onClick={() => setIsAddDialogOpen(true)}
          className="px-4 py-2 bg-[#148BAF] text-white rounded-md hover:bg-[#0a7c9c] transition-all font-happy-monkey"
        >
          Create New Practice
        </button>
      </div>

      {/* System Practices Section */}
      <div className="w-full">
        <h3 className="text-xl font-happy-monkey text-[#148BAF] mb-4">System Practices</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {systemPractices.map((practice) => {
            const iconKey = (practice.icon as IconType) || 'default';
            const icon = icons[iconKey] || icons.default;
            
            return (
              <div
                key={practice.id}
                className="w-full p-[10px] bg-[rgba(83,252,255,0.10)] shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)] rounded-[10px] flex flex-col gap-[15px] h-auto"
              >
                {/* Card Content */}
                <div className="flex flex-col gap-[10px]">
                  {/* Header Section */}
                  <div className="w-full p-[4px] rounded-[8px] flex flex-col items-center">
                    <div className="w-full flex items-center gap-[10px]">
                      <div>{icon}</div>
                      <div className="flex-1 text-center text-[#148BAF] font-happy-monkey text-sm lowercase">
                        {practice.name}
                      </div>
                    </div>
                    <div className="w-full text-black font-happy-monkey text-base text-center lowercase">
                      {practice.description.split('.')[0]}
                    </div>
                  </div>
                  
                  {/* Duration Display */}
                  <div className="text-[#148BAF] font-happy-monkey text-[14px] lowercase">
                    Duration: {practice.duration} min
                  </div>

                  {/* Description Section */}
                  <div className="text-[#148BAF] font-happy-monkey text-[14px] lowercase line-clamp-2">
                    {practice.description}
                  </div>
                </div>
                
                {/* Add to Daily Button */}
                <div className="mt-auto">
                  <button
                    onClick={() => handleAddToDailyPractices(practice)}
                    className={`w-full p-[8px] bg-white border border-[#49DADD] rounded-[8px] flex justify-center items-center cursor-pointer text-[#148BAF] hover:bg-[#E6F7F9] transition-colors font-happy-monkey text-base lowercase ${
                      practice.isDaily ? 'bg-[#E6F7F9]' : ''
                    }`}
                    disabled={practice.isDaily}
                  >
                    <span className="text-center">
                      {practice.isDaily ? "in daily practices" : "add to daily practices"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Created Practices Section */}
      <div className="w-full">
        <h3 className="text-xl font-happy-monkey text-[#148BAF] mb-4">My Custom Practices</h3>
        {userPractices.length === 0 ? (
          <div className="text-center p-8 bg-[rgba(83,252,255,0.05)] rounded-[10px] border border-dashed border-[#49DADD]">
            <p className="text-[#148BAF] font-happy-monkey mb-4">You haven't created any custom practices yet.</p>
            <button
              onClick={() => setIsAddDialogOpen(true)}
              className="px-4 py-2 bg-[#148BAF] text-white rounded-md hover:bg-[#0a7c9c] transition-all font-happy-monkey"
            >
              Create Your First Practice
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userPractices.map((practice) => {
              const iconKey = (practice.icon as IconType) || 'default';
              const icon = icons[iconKey] || icons.default;
              
              return (
                <div
                  key={practice.id}
                  className="w-full p-[10px] bg-[rgba(83,252,255,0.10)] shadow-[1px_2px_4px_rgba(73,217.90,234,0.50)] rounded-[10px] flex flex-col gap-[15px] h-auto"
                >
                  {/* Card Content */}
                  <div className="flex flex-col gap-[10px]">
                    {/* Header Section with User Badge */}
                    <div className="w-full p-[4px] rounded-[8px] flex flex-col items-center">
                      <div className="w-full flex items-center gap-[10px]">
                        <div>{icon}</div>
                        <div className="flex-1 text-center text-[#148BAF] font-happy-monkey text-sm lowercase">
                          {practice.name}
                          <span className="ml-2 px-2 py-0.5 text-xs bg-[#148BAF] text-white rounded-full">custom</span>
                        </div>
                      </div>
                      <div className="w-full text-black font-happy-monkey text-base text-center lowercase">
                        {practice.description.split('.')[0]}
                      </div>
                    </div>
                    
                    {/* Duration Display */}
                    <div className="text-[#148BAF] font-happy-monkey text-[14px] lowercase">
                      Duration: {practice.duration} min
                    </div>

                    {/* Description Section */}
                    <div className="text-[#148BAF] font-happy-monkey text-[14px] lowercase line-clamp-2">
                      {practice.description}
                    </div>
                  </div>
                  
                  {/* Add to Daily Button */}
                  <div className="mt-auto">
                    <button
                      onClick={() => handleAddToDailyPractices(practice)}
                      className={`w-full p-[8px] rounded-[8px] flex justify-center items-center cursor-pointer transition-colors font-happy-monkey text-base lowercase ${
                        practice.isDaily 
                        ? 'bg-white text-[#148BAF] border border-[#49DADD]' 
                        : 'bg-[#148BAF] text-white border border-[#0A7C9C] hover:bg-[#0A7C9C]'
                      }`}
                      disabled={practice.isDaily}
                    >
                      <span className="text-center">
                        {practice.isDaily ? "in daily practices" : "add to daily practices"}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Practice Dialog */}
      <AddPracticeDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} />
    </div>
  );
};

export default AllPractices;
