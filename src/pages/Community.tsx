// filepath: /Users/kshitijlohbare/Downloads/new build/src/pages/Community.tsx
import FitnessGroups from './FitnessGroups';

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
  // Simplified to always show FitnessGroups since navigation has been removed
  const renderContent = () => {
    return <FitnessGroups />;
  };

  return (
    <div className="w-full" style={{ backgroundColor: '#FFFFFF' }}>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      {/* Content section */}
      {renderContent()}
    </div>
  );
}
