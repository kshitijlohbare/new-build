import { ShareDelights } from "@/components/wellbeing/ShareDelights";
import WellbeingTipsSection from "@/components/wellbeing/WellbeingTipsSection";
import NewDailyPractices from "@/components/wellbeing/NewDailyPractices";
import BookSessionSimple from "@/components/wellbeing/BookSessionSimple";

const Index = () => {
  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10 px-2 sm:px-3 md:px-5">
      {/* Share Delights Section - With Styled Container */}
      <section className="bg-[rgba(6,196,213,0.10)] rounded-2xl shadow-lg overflow-hidden p-4 md:p-6">
        <div className="mb-4">
          <h2 className="text-[#06C4D5] text-xl md:text-2xl font-happy-monkey lowercase mb-3">Daily Delights</h2>
        </div>
        <ShareDelights />
      </section>
      
      {/* Wellbeing Tips Section - Using standard container style */}
      <section className="section-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 10px 10px',
        gap: '20px',
        width: '360px',
        height: '186px',
        flex: 'none',
        order: 0,
        alignSelf: 'stretch',
        flexGrow: 0,
        margin: '0 auto'
      }}>
        <div className="w-full text-center mb-2">
          <h2 className="text-[#06C4D5] text-xl font-happy-monkey lowercase">Wellbeing Tips</h2>
        </div>
        <WellbeingTipsSection />
      </section>

      {/* Daily Practices Section - Using standard container style */}
      <section className="section-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 10px 10px',
        gap: '20px',
        width: '360px',
        height: '186px',
        flex: 'none',
        order: 0,
        alignSelf: 'stretch',
        flexGrow: 0,
        margin: '0 auto'
      }}>
        <div className="w-full text-center mb-2">
          <h2 className="text-[#06C4D5] text-xl font-happy-monkey lowercase">Daily Practices</h2>
        </div>
        <NewDailyPractices />
      </section>

      {/* Book Session Section - Using standard container style */}
      <section className="section-container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 10px 10px',
        gap: '20px',
        width: '360px',
        height: '186px',
        flex: 'none',
        order: 0,
        alignSelf: 'stretch',
        flexGrow: 0,
        margin: '0 auto'
      }}>
        <div className="w-full text-center mb-2">
          <h2 className="text-[#06C4D5] text-xl font-happy-monkey lowercase">Book a Session</h2>
        </div>
        <BookSessionSimple />
      </section>
    </div>
  );
};

export default Index;