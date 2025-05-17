import { ShareDelights } from "@/components/wellbeing/ShareDelights";
import DailyPracticesSimple from "@/components/wellbeing/DailyPracticesSimple";
import BookSession from "@/components/wellbeing/BookSession";
import WellbeingTipsSection from "@/components/wellbeing/WellbeingTipsSection";

const Index = () => {
  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10 px-2 sm:px-3 md:px-5">
      {/* Share Delights Section - With Styled Container */}
      <section className="bg-[rgba(83,252,255,0.10)] rounded-2xl shadow-lg overflow-hidden p-4 md:p-6">
        <div className="mb-4">
          <h2 className="text-[#148BAF] text-xl md:text-2xl font-happy-monkey lowercase mb-3">Daily Delights</h2>
        </div>
        <ShareDelights />
      </section>
      
      {/* Wellbeing Tips Section - Without Container Background */}
      <section className="rounded-2xl overflow-hidden">
        <div className="mb-4">
          <h2 className="text-[#148BAF] text-xl md:text-2xl font-happy-monkey lowercase mb-3">Wellbeing Tips</h2>
        </div>
        <WellbeingTipsSection />
      </section>

      {/* Daily Practices Section - With Styled Container */}
      <section className="bg-[rgba(83,252,255,0.10)] rounded-2xl shadow-lg overflow-hidden p-4 md:p-6">
        <DailyPracticesSimple />
      </section>

      {/* Book Session Section - Without Background */}
      <section className="rounded-2xl overflow-hidden p-4 md:p-6">
        <div className="mb-4">
          <h2 className="text-[#148BAF] text-xl md:text-2xl font-happy-monkey lowercase mb-3">Book a Session</h2>
        </div>
        <BookSession />
      </section>
    </div>
  );
};

export default Index;