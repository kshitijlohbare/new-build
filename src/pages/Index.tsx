import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShareDelights } from "@/components/wellbeing/ShareDelights";
import QuoteCard from "@/components/wellbeing/QuoteCard";

const Index = () => {
  return (
    <div className="space-y-8 pb-8">
      {/* Hero section with tips */}
      <section className="space-y-4">
        <QuoteCard
          quote="Cold exposure for 11 minutes per week can boost dopamine and improve stress resilience"
          author="huberman"
          type="tip"
          className="[animation-delay:0s]"
        />
        
        <QuoteCard
          quote="Reading is faster than listening. Doing is faster than watching."
          author="naval"
          className="[animation-delay:200ms]"
        />
      </section>
      
      {/* Share Delights section */}
      <section className="mt-6 animate-fade-in [animation-delay:400ms]">
        <h2 className="text-2xl md:text-3xl text-center text-moody-primary dark:text-moody-secondary font-happy-monkey lowercase mb-4">
          share your delights
        </h2>
        <ShareDelights />
      </section>

      {/* Daily Practices section */}
      <section className="mt-8 animate-fade-in [animation-delay:600ms]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl md:text-3xl text-moody-primary dark:text-moody-secondary font-happy-monkey lowercase">
            your daily practices
          </h2>
          <Button 
            variant="outline"
            className="border-moody-primary text-moody-primary dark:border-moody-secondary dark:text-moody-secondary font-happy-monkey lowercase hover:bg-moody-light/50 dark:hover:bg-moody-primary/10"
          >
            add new practice
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <PracticeItem 
              key={i}
              name={i === 0 ? "outdoor walking" : i === 1 ? "meditation" : "cold shower"}
              duration={i === 0 ? 30 : i === 1 ? 15 : 5}
              completed={i === 0}
            />
          ))}
        </div>
      </section>

      {/* Therapist section */}
      <section className="mt-8 animate-fade-in [animation-delay:800ms]">
        <h2 className="text-2xl md:text-3xl text-center text-moody-primary dark:text-moody-secondary font-happy-monkey lowercase mb-4">
          book your first free session
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="relative h-[250px] bg-gradient-to-b from-moody-primary to-moody-secondary">
            <div className="absolute inset-0 flex flex-col justify-between p-4">
              <p className="text-white font-happy-monkey lowercase">
                connect with experts who understand your journey
              </p>
              <Link to="/therapists">
                <Button 
                  className="w-full bg-black/25 text-white hover:bg-black/40 font-happy-monkey text-sm"
                >
                  discover therapists
                </Button>
              </Link>
            </div>
          </Card>
          
          {Array.from({ length: 2 }).map((_, i) => (
            <TherapistCard key={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

const PracticeItem = ({ name, duration, completed }: { name: string; duration: number; completed: boolean }) => {
  return (
    <Card className="flex justify-between items-center bg-moody-light/50 dark:bg-moody-primary/10 transition-all duration-200">
      <div className="flex gap-2 items-center p-4">
        <span className="text-foreground dark:text-moody-text font-happy-monkey lowercase">{name}</span>
        <Badge variant="secondary" className="font-happy-monkey lowercase">
          {duration} min
        </Badge>
      </div>
      
      <Button 
        variant={completed ? "default" : "outline"}
        className="mr-4 font-happy-monkey lowercase w-32 border-moody-primary text-moody-primary dark:border-moody-secondary dark:text-moody-secondary hover:bg-moody-light/50 dark:hover:bg-moody-primary/10"
      >
        {completed ? "completed" : "mark complete"}
      </Button>
    </Card>
  );
};

const TherapistCard = () => {
  return (
    <Card className="bg-moody-light/50 dark:bg-moody-primary/10 h-[250px]">
      <div className="bg-[#DEDEDE] dark:bg-[#2A2A2A] h-32 relative">
        <Badge className="absolute top-2 left-2 bg-black/75 text-white dark:bg-white/10 font-happy-monkey">
          top rated
        </Badge>
      </div>
      <div className="p-4 space-y-2">
        <p className="text-moody-text dark:text-moody-text/80 font-happy-monkey lowercase">Dr. Sarah Johnson</p>
        <p className="text-moody-text dark:text-moody-text/60 font-happy-monkey lowercase text-sm">Mindfulness & Stress Management</p>
        <p className="text-moody-text dark:text-moody-text/60 font-happy-monkey lowercase text-sm">300+ sessions</p>
      </div>
    </Card>
  );
};

export default Index;