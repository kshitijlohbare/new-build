const WellbeingTipsSection = () => (
  <div className="flex flex-col sm:flex-row gap-2.5 w-full">
    <div className="flex-1 p-2.5 relative rounded-[10px] border border-[#49DADD]">
      <div className="absolute left-1/2 transform -translate-x-1/2 top-[-10px] px-2.5 py-1 bg-white rounded-md" style={{
        borderImage: 'linear-gradient(90deg, #49DADD 0%, #148BAF 100%)',
        borderImageSlice: 1,
        borderStyle: 'solid',
        borderWidth: '1px'
      }}>
        <span className="text-[#04C4D5] font-happy-monkey text-base lowercase text-center">daily tip by huberman</span>
      </div>
      <p className="text-center text-[#148BAF] font-happy-monkey lowercase mt-5">
        improve your mental health with practices shared by andrew huberman and naval ravikant
      </p>
    </div>
    <div className="flex-1 p-2.5 relative rounded-[10px] border border-[#49DADD]">
      <div className="absolute left-1/2 transform -translate-x-1/2 top-[-10px] px-2.5 py-1 bg-white rounded-md" style={{
        borderImage: 'linear-gradient(90deg, #49DADD 0%, #148BAF 100%)',
        borderImageSlice: 1,
        borderStyle: 'solid',
        borderWidth: '1px'
      }}>
        <span className="text-[#04C4D5] font-happy-monkey text-base lowercase text-center">todays quote by naval</span>
      </div>
      <p className="text-center text-[#148BAF] font-happy-monkey lowercase mt-5">
        improve your mental health with practices shared by andrew huberman and naval ravikant
      </p>
    </div>
  </div>
);

export default WellbeingTipsSection;
