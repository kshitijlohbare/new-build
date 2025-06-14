import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Progress = () => {
  const weeklyStats = [
    { practice: "Cold Exposure", completed: 5, total: 7 },
    { practice: "Meditation", completed: 6, total: 7 },
    { practice: "Outdoor Walking", completed: 4, total: 7 },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 p-2 sm:p-3 md:p-4 lg:p-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-happy-monkey lowercase text-[#148BAF] mb-2 sm:mb-4">your progress</h1>
      <div className="grid gap-3 sm:gap-4 md:gap-6">
        {weeklyStats.map((stat, index) => (
          <Card key={index} className="p-4 sm:p-5 md:p-6 hover:shadow-lg transition-all duration-300 border border-[rgba(4,196,213,0.3)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2">
              <h3 className="text-base sm:text-lg md:text-xl font-happy-monkey lowercase text-[#148BAF] font-medium">{stat.practice.toLowerCase()}</h3>
              <Badge variant="secondary" className="self-start sm:self-auto bg-[rgba(4,196,213,0.1)] text-[#148BAF] border-[rgba(4,196,213,0.3)] px-3 py-1 text-sm">
                {stat.completed}/{stat.total} days
              </Badge>
            </div>
            <div className="mt-4 sm:mt-5 h-3 sm:h-2 bg-white rounded-full overflow-hidden border border-[rgba(4,196,213,0.3)] shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-[#04C4D5] to-[#148BAF] rounded-full transition-all duration-700 ease-out"
                style={{ width: `${(stat.completed / stat.total) * 100}%` }}
              />
            </div>
            {/* Mobile-friendly completion percentage */}
            <div className="mt-2 sm:mt-3 text-right">
              <span className="text-xs sm:text-sm text-[#148BAF] font-happy-monkey">
                {Math.round((stat.completed / stat.total) * 100)}% complete
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Progress;