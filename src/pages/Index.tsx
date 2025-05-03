import { ShareDelights } from "@/components/wellbeing/ShareDelights";
import DailyPracticesSimple from "@/components/wellbeing/DailyPracticesSimple";
import BookSession from "@/components/wellbeing/BookSession";
import WellbeingTipsSection from "@/components/wellbeing/WellbeingTipsSection";

const Index = () => {
  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10 px-2 sm:px-3 md:px-5">
      {/* Share Delights Section */}
      <section>
        <ShareDelights />
      </section>
      
      {/* Wellbeing Tips Section */}
      <section className="mt-5 sm:mt-8 md:mt-10">
        <WellbeingTipsSection />
      </section>

      {/* Daily Practices Section */}
      <section className="mt-5 sm:mt-8 md:mt-10">
        <DailyPracticesSimple />
      </section>

      {/* Book Session Section */}
      <section>
        <BookSession />
      </section>
    </div>
  );
};

export default Index;