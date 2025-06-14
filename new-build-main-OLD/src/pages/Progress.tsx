import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Progress = () => {
  const weeklyStats = [
    { practice: "Cold Exposure", completed: 5, total: 7 },
    { practice: "Meditation", completed: 6, total: 7 },
    { practice: "Outdoor Walking", completed: 4, total: 7 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-happy-monkey lowercase text-[#148BAF]">your progress</h1>
      <div className="grid gap-6">
        {weeklyStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-happy-monkey lowercase text-[#148BAF]">{stat.practice.toLowerCase()}</h3>
              <Badge variant="secondary">
                {stat.completed}/{stat.total} days
              </Badge>
            </div>
            <div className="mt-4 h-2 bg-white rounded-full overflow-hidden border border-[rgba(4,196,213,0.3)]">
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