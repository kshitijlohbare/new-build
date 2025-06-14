const WellbeingTipsSection = () => (
  <div className="flex flex-col sm:flex-row gap-3 w-full">
    <div className="flex-1 p-3 relative rounded-[15px] border border-[rgba(4,196,213,0.3)] shadow-[0px_3px_6px_rgba(73,218,234,0.3)]">
      <div className="rounded-lg absolute left-1/2 transform -translate-x-1/2 top-[-10px] px-2.5 py-1 bg-white border border-[#04C4D5]" style={{
        borderRadius: '10px',
        boxShadow: '0px 2px 4px rgba(73,218,234,0.2)',
        padding: '2px 12px'
      }}>
        <span className="text-[#148BAF] inline-flex font-happy-monkey text-sm lowercase text-center">daily tip by huberman</span>
      </div>
      <p className="text-center text-[#148BAF] font-happy-monkey lowercase mt-5">
        improve your mental health with practices shared by andrew huberman and naval ravikant
      </p>
    </div>
    <div className="flex-1 p-3 relative rounded-[15px] border border-[rgba(4,196,213,0.3)] shadow-[0px_3px_6px_rgba(73,218,234,0.3)]">
      <div className="rounded-lg absolute left-1/2 transform -translate-x-1/2 top-[-10px] px-2.5 py-1 bg-white border border-[#04C4D5]" style={{
        borderRadius: '10px',
        boxShadow: '0px 2px 4px rgba(73,218,234,0.2)',
        padding: '2px 12px'
      }}>
        <span className="text-[#148BAF] inline-flex font-happy-monkey text-sm lowercase text-center">todays quote by naval</span>
      </div>
      <p className="text-center text-[#148BAF] font-happy-monkey lowercase mt-5">
        improve your mental health with practices shared by andrew huberman and naval ravikant
      </p>
    </div>
  </div>
);

export default WellbeingTipsSection;
