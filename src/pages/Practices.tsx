import DailyPractices from "@/components/wellbeing/DailyPractices";
import WeeklyPointsChart from '@/components/wellbeing/WeeklyPointsChart'; // Import the new chart component
import TestAchievements from "@/components/wellbeing/TestAchievements"; // Import the test component

const Practices = () => {
  return (
    <div className="space-y-10 px-5"> {/* 40px gap between sections, 20px horizontal padding */}
      <WeeklyPointsChart /> {/* Add the chart at the top */}
      <DailyPractices />
      
      {/* Add test component - Remove this in production */}
      <div className="mt-8">
        <TestAchievements />
      </div>
    </div>
  );
};

export default Practices;