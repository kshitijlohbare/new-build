import { useState } from "react";

// Mock tips data
const mockTips = [
  {
    id: 1,
    content: "Take a 5-minute break every hour to stretch and move around to improve circulation and mental clarity.",
    source: "Andrew Huberman",
    sourceImage: "https://via.placeholder.com/100x60?text=Huberman",
    sourceUrl: "https://hubermanlab.com",
    date: new Date()
  },
  {
    id: 2,
    content: "Expose your eyes to morning sunlight within 30-60 minutes of waking to regulate your circadian rhythm.",
    source: "Andrew Huberman",
    sourceImage: "https://via.placeholder.com/100x60?text=Huberman",
    sourceUrl: "https://hubermanlab.com",
    date: new Date()
  },
  {
    id: 3,
    content: "Practice mindful breathing for 5 minutes before starting your workday to reduce stress and improve focus.",
    source: "Naval Ravikant",
    sourceImage: "https://via.placeholder.com/100x60?text=Naval",
    sourceUrl: "https://nav.al",
    date: new Date()
  }
];

const MobileWellbeingTipsSection = () => {
  const tips = mockTips;
  const isLoading = false;
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Show loading state if tips are being loaded
  if (isLoading || tips.length === 0) {
    return (
      <div 
        className="tips-container"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 10px 10px',
          gap: '20px',
          width: '360px',
          height: '155px',
          flex: 'none',
          order: 0,
          alignSelf: 'stretch',
          flexGrow: 0,
          margin: '0 auto'
        }}>
        <div className="tip-card p-3 relative rounded-[15px] border border-[rgba(4,196,213,0.3)] shadow-[0px_3px_6px_rgba(73,218,234,0.3)]" style={{
          height: '155px',
          width: '320px',
          flex: 'none'
        }}>
          <div className="rounded-lg absolute left-1/2 transform -translate-x-1/2 top-[-12px] bg-white border border-[#04C4D5]" style={{
            borderRadius: '10px',
            boxShadow: '0px 2px 4px rgba(73,218,234,0.2)',
            padding: '4px 12px'
          }}>
            <span className="text-[#148BAF] inline-flex font-happy-monkey text-xs lowercase text-center font-medium">wellbeing tips</span>
          </div>
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-center text-[#148BAF] font-happy-monkey lowercase">
              Loading wellbeing tips...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="tips-container"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 10px 10px',
        gap: '20px',
        width: '360px',
        height: '155px',
        flex: 'none',
        order: 0,
        alignSelf: 'stretch',
        flexGrow: 0,
        margin: '0 auto'
      }}>
      
      {/* First Tip Card */}
      <div className="tip-card p-3 relative rounded-[15px] border border-[rgba(4,196,213,0.3)] shadow-[0px_3px_6px_rgba(73,218,234,0.3)]" style={{
        height: '155px',
        width: '160px',
        flex: 'none'
      }}>
        <div className="rounded-lg absolute left-1/2 transform -translate-x-1/2 top-[-12px] bg-white border border-[#04C4D5]" style={{
          borderRadius: '10px',
          boxShadow: '0px 2px 4px rgba(73,218,234,0.2)',
          padding: '4px 12px'
        }}>
          <span className="text-[#148BAF] inline-flex font-happy-monkey text-xs lowercase text-center font-medium">wellbeing tip</span>
        </div>
        <div className="flex flex-col h-full justify-between">
          <p className="text-xs text-[#148BAF] mt-4 font-happy-monkey lowercase">
            {tips[currentTipIndex % tips.length]?.content || "No tip available"}
          </p>
          <div className="flex justify-center mt-auto mb-1">
            <button 
              onClick={() => setCurrentTipIndex((prev) => prev > 0 ? prev - 1 : tips.length - 1)}
              className="px-2 text-[#04C4D5] hover:text-[#148BAF] transition-all"
            >
              &#8592;
            </button>
            <button 
              onClick={() => setCurrentTipIndex((prev) => (prev + 1) % tips.length)}
              className="px-2 text-[#04C4D5] hover:text-[#148BAF] transition-all"
            >
              &#8594;
            </button>
          </div>
        </div>
      </div>
      
      {/* Source Card */}
      <div className="tip-source-card p-3 relative rounded-[15px] border border-[rgba(4,196,213,0.3)] shadow-[0px_3px_6px_rgba(73,218,234,0.3)]" style={{
        height: '155px',
        width: '160px',
        flex: 'none'
      }}>
        <div className="rounded-lg absolute left-1/2 transform -translate-x-1/2 top-[-12px] bg-white border border-[#04C4D5]" style={{
          borderRadius: '10px',
          boxShadow: '0px 2px 4px rgba(73,218,234,0.2)',
          padding: '4px 12px'
        }}>
          <span className="text-[#148BAF] inline-flex font-happy-monkey text-xs lowercase text-center font-medium">tip source</span>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-center text-[#148BAF] font-happy-monkey lowercase text-xs mt-2">
            from {tips[currentTipIndex % tips.length]?.source || "Unknown"}
          </p>
          <div className="max-w-[100px] max-h-[60px] overflow-hidden mt-4 mb-2">
            {tips[currentTipIndex % tips.length]?.sourceImage && (
              <img 
                src={tips[currentTipIndex % tips.length]?.sourceImage || ""} 
                alt={tips[currentTipIndex % tips.length]?.source || "Tip source"} 
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <a 
            href={tips[currentTipIndex % tips.length]?.sourceUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-[#148BAF] font-happy-monkey text-xs lowercase py-1 hover:underline mt-2"
          >
            learn more
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileWellbeingTipsSection;
