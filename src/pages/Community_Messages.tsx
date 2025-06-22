import { useState } from "react";
import FitnessGroups from "./FitnessGroups";
import GroupMessages from "./GroupMessages";

// Premium CSS animation keyframes with glassmorphism effects
const animationStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in {
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes slide-down {
  0% { transform: translateY(-10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}
`;

export default function Community() {
  const [activeView, setActiveView] = useState<'groups' | 'messages'>('messages');

  return (
    <div className="w-full bg-white">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      {activeView === 'groups' ? <FitnessGroups /> : <GroupMessages />}
      
      {/* Tab Navigation - Hidden but included for functionality */}
      <div className="hidden">
        <button onClick={() => setActiveView('groups')}>Groups</button>
        <button onClick={() => setActiveView('messages')}>Messages</button>
      </div>
    </div>
  );
}
