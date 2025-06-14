const WellbeingTipsSection = () => (
  <div 
    className="tips-quotes-container"
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
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
    {/* Enhanced mobile-first tip card */}
    <div className="tip-card p-3 relative rounded-[15px] border border-[rgba(4,196,213,0.3)] shadow-[0px_3px_6px_rgba(73,218,234,0.3)] hover:shadow-[0px_4px_8px_rgba(73,218,234,0.4)] transition-all duration-300" style={{
      height: '155px',
      width: '160px',
      flex: 'none'
    }}>
      <div className="rounded-lg absolute left-1/2 transform -translate-x-1/2 top-[-12px] bg-white border border-[#04C4D5]" style={{
        borderRadius: '10px',
        boxShadow: '0px 2px 4px rgba(73,218,234,0.2)',
        padding: '4px 12px'
      }}>
        <span className="text-[#148BAF] inline-flex font-happy-monkey text-xs lowercase text-center font-medium">daily tip by huberman</span>
      </div>
      <p className="text-center text-[#148BAF] font-happy-monkey lowercase mt-5 text-xs leading-tight">
        improve your mental health with practices shared by andrew huberman
      </p>
    </div>
    
    {/* Enhanced mobile-first quote card */}
    <div className="quote-card p-3 relative rounded-[15px] border border-[rgba(4,196,213,0.3)] shadow-[0px_3px_6px_rgba(73,218,234,0.3)] hover:shadow-[0px_4px_8px_rgba(73,218,234,0.4)] transition-all duration-300" style={{
      height: '155px',
      width: '160px',
      flex: 'none'
    }}>
      <div className="rounded-lg absolute left-1/2 transform -translate-x-1/2 top-[-12px] bg-white border border-[#04C4D5]" style={{
        borderRadius: '10px',
        boxShadow: '0px 2px 4px rgba(73,218,234,0.2)',
        padding: '4px 12px'
      }}>
        <span className="text-[#148BAF] inline-flex font-happy-monkey text-xs lowercase text-center font-medium">todays quote by naval</span>
      </div>
      <p className="text-center text-[#148BAF] font-happy-monkey lowercase mt-5 text-xs leading-tight">
        "the most important skill for getting rich is becoming a perpetual learner"
      </p>
    </div>
  </div>
);

export default WellbeingTipsSection;
