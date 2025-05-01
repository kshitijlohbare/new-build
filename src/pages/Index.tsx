import { ShareDelights } from "@/components/wellbeing/ShareDelights";
import DailyPracticesSimple from "@/components/wellbeing/DailyPracticesSimple";
import BookSession from "@/components/wellbeing/BookSession";

const Index = () => {
  return (
    <div className="space-y-10 px-5"> {/* 40px gap between sections, 20px horizontal padding */}
      {/* Share Delights Section */}
      <section>
        <ShareDelights />
      </section>

      {/* Daily Practices Section */}
      <section className="mt-10"> {/* 40px gap above this section */}
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