import DailyPractices from "@/components/wellbeing/DailyPractices";
import WeeklyPointsChart from '@/components/wellbeing/WeeklyPointsChart'; // Import the new chart component

const Practices = () => {
  return (
    <div className="space-y-10 px-5"> {/* 40px gap between sections, 20px horizontal padding */}
      <WeeklyPointsChart /> {/* Add the chart at the top */}
      <DailyPractices />
    </div>
  );
};

export default Practices;