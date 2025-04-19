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
      <h1 className="text-3xl font-happy-monkey text-moody-primary">Your Progress</h1>
      <div className="grid gap-6">
        {weeklyStats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-happy-monkey text-moody-primary">{stat.practice}</h3>
              <Badge variant="secondary">
                {stat.completed}/{stat.total} days
              </Badge>
            </div>
            <div className="mt-4 h-2 bg-moody-light rounded-full overflow-hidden">
              <div 
                className="h-full bg-moody-primary rounded-full transition-all duration-500"
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