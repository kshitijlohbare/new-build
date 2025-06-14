const WellbeingTipsSection = () => (
  <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:gap-4 w-full">
    {/* Enhanced mobile-first tip card */}
    <div className="flex-1 p-4 sm:p-5 relative rounded-[15px] border border-[rgba(4,196,213,0.3)] shadow-[0px_3px_6px_rgba(73,218,234,0.3)] min-h-[120px] sm:min-h-[140px] hover:shadow-[0px_4px_8px_rgba(73,218,234,0.4)] transition-all duration-300">
      <div className="rounded-lg absolute left-1/2 transform -translate-x-1/2 top-[-12px] px-3 py-1.5 bg-white border border-[#04C4D5]" style={{
        borderRadius: '10px',
        boxShadow: '0px 2px 4px rgba(73,218,234,0.2)',
        padding: '4px 14px'
      }}>
        <span className="text-[#148BAF] inline-flex font-happy-monkey text-xs sm:text-sm lowercase text-center font-medium">daily tip by huberman</span>
      </div>
      <p className="text-center text-[#148BAF] font-happy-monkey lowercase mt-6 sm:mt-7 text-sm sm:text-base leading-relaxed px-1 sm:px-2">
        improve your mental health with practices shared by andrew huberman and naval ravikant
      </p>
    </div>
    
    {/* Enhanced mobile-first quote card */}
    <div className="flex-1 p-4 sm:p-5 relative rounded-[15px] border border-[rgba(4,196,213,0.3)] shadow-[0px_3px_6px_rgba(73,218,234,0.3)] min-h-[120px] sm:min-h-[140px] hover:shadow-[0px_4px_8px_rgba(73,218,234,0.4)] transition-all duration-300">
      <div className="rounded-lg absolute left-1/2 transform -translate-x-1/2 top-[-12px] px-3 py-1.5 bg-white border border-[#04C4D5]" style={{
        borderRadius: '10px',
        boxShadow: '0px 2px 4px rgba(73,218,234,0.2)',
        padding: '4px 14px'
      }}>
        <span className="text-[#148BAF] inline-flex font-happy-monkey text-xs sm:text-sm lowercase text-center font-medium">todays quote by naval</span>
      </div>
      <p className="text-center text-[#148BAF] font-happy-monkey lowercase mt-6 sm:mt-7 text-sm sm:text-base leading-relaxed px-1 sm:px-2">
        improve your mental health with practices shared by andrew huberman and naval ravikant
      </p>
    </div>
  </div>
);

export default WellbeingTipsSection;
