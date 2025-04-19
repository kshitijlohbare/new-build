import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Practices = () => {
  const practices = [
    { name: "Cold Exposure", duration: 5, benefits: ["Immune System", "Mental Resilience"] },
    { name: "Meditation", duration: 20, benefits: ["Focus", "Stress Reduction"] },
    { name: "Outdoor Walking", duration: 30, benefits: ["Physical Health", "Mental Clarity"] },
    { name: "Deep Breathing", duration: 10, benefits: ["Stress Relief", "Energy"] },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-happy-monkey text-moody-primary">Wellbeing Practices</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {practices.map((practice, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-happy-monkey text-moody-primary mb-2">{practice.name}</h3>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary">{practice.duration} minutes</Badge>
              {practice.benefits.map((benefit, i) => (
                <Badge key={i} variant="outline">{benefit}</Badge>
              ))}
            </div>
            <Button className="w-full">Start Practice</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Practices;