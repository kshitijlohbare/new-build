import { ShareDelights } from "@/components/wellbeing/ShareDelights";
import WellbeingTipsSection from "@/components/wellbeing/WellbeingTipsSection";
import NewDailyPractices from "@/components/wellbeing/NewDailyPractices";
import BookSessionSimple from "@/components/wellbeing/BookSessionSimple";
import HomeHeader from "@/components/layout/HomeHeader";
import GlobalSidebar from "@/components/layout/GlobalSidebar";

const Index = () => {
  return (
    <div className="relative h-screen w-full bg-white">
      {/* Global sidebar handles the sidebar display */}
      <GlobalSidebar />
      
      {/* Main container with header and content stacked */}
      <div className="flex flex-col h-full overflow-hidden">
        {/* HomeHeader - sticky at top */}
        <HomeHeader />
        
        {/* Main content that scrolls under the header */}
        <main 
          id="homepage-content"
          data-testid="homepage-content"
          className="flex-1 overflow-y-auto space-y-6 sm:space-y-8 md:space-y-10 px-2 sm:px-3 md:px-5 py-4"
          aria-label="Homepage content"
        >
      {/* Share Delights Section - With Styled Container */}
      <section 
        id="daily-delights-section" 
        data-testid="daily-delights-section"
        className="bg-[rgba(6,196,213,0.10)] rounded-2xl shadow-lg overflow-hidden p-4 md:p-6"
        aria-labelledby="daily-delights-heading"
      >
        <div className="mb-4">
          <h2 
            id="daily-delights-heading"
            data-testid="daily-delights-heading"
            className="text-[#06C4D5] text-xl md:text-2xl font-happy-monkey lowercase mb-3"
          >
            Daily Delights
          </h2>
        </div>
        <ShareDelights />
      </section>
      
      {/* Wellbeing Tips Section - Exactly as per design */}
      <section 
        id="wellbeing-tips-section" 
        data-testid="wellbeing-tips-section"
        className="section-container" 
        aria-labelledby="wellbeing-tips-heading"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '10px 0',
          width: '100%',
          maxWidth: '360px',
          margin: '0 auto',
          backgroundColor: 'transparent'
        }}
      >
        <WellbeingTipsSection />
      </section>

      {/* Daily Practices Section - Using standard container style */}
      <section 
        id="daily-practices-section" 
        data-testid="daily-practices-section"
        className="section-container"
        aria-labelledby="daily-practices-heading"
        style={{
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
        }}
      >
        <div className="w-full text-center mb-2">
          <h2 
            id="daily-practices-heading"
            data-testid="daily-practices-heading"
            className="text-[#06C4D5] text-xl font-happy-monkey lowercase"
          >
            Daily Practices
          </h2>
        </div>
        <NewDailyPractices />
      </section>

      {/* Book Session Section - Using standard container style */}
      <section 
        id="book-session-section" 
        data-testid="book-session-section"
        className="section-container"
        aria-labelledby="book-session-heading"
        style={{
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
        }}
      >
        <div className="w-full text-center mb-2">
          <h2 
            id="book-session-heading"
            data-testid="book-session-heading"
            className="text-[#06C4D5] text-xl font-happy-monkey lowercase"
          >
            Book a Session
          </h2>
        </div>
        <BookSessionSimple />
      </section>
        </main>
      </div>
    </div>
  );
};

export default Index;