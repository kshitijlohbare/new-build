import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Progress = () => {
  const weeklyStats = [
    { practice: "Cold Exposure", completed: 5, total: 7 },
    { practice: "Meditation", completed: 6, total: 7 },
    { practice: "Outdoor Walking", completed: 4, total: 7 },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 p-3 sm:p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-happy-monkey lowercase text-[#148BAF]">your progress</h1>
      <div className="grid gap-4 sm:gap-6">
        {weeklyStats.map((stat, index) => (
          <Card key={index} className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <h3 className="text-lg sm:text-xl font-happy-monkey lowercase text-[#148BAF]">{stat.practice.toLowerCase()}</h3>
              <Badge variant="secondary" className="self-start sm:self-auto">
                {stat.completed}/{stat.total} days
              </Badge>
            </div>
            <div className="mt-3 sm:mt-4 h-2 bg-white rounded-full overflow-hidden border border-[rgba(4,196,213,0.3)]">
              <div 
                className="h-full bg-[#04C4D5] rounded-full transition-all duration-500"
                style={{ width: `${(stat.completed / stat.total) * 100}%` }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Progress;