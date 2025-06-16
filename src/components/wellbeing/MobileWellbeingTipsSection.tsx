const MobileWellbeingTipsSection = () => {
  return (
    <div 
      className="tips-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: '0px',
        gap: '20px',
        width: '360px',
        height: '258px',
        flex: 'none',
        order: 1,
        flexGrow: 0,
        margin: '0 auto'
      }}
    >
      {/* Daily Tip by Huberman */}
      <div 
        className="tip-card relative rounded-[20px] bg-[#F5F5F5]"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '20px 10px',
          gap: '10px',
          width: '360px',
          height: '105px',
          flex: 'none',
          order: 0,
          flexGrow: 0
        }}
      >
        <div 
          className="practices-title"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0px',
            gap: '10px',
            width: '340px',
            height: '18px',
            flex: 'none',
            order: 0,
            alignSelf: 'stretch',
            flexGrow: 0
          }}
        >
          <span 
            className="text-[#148BAF] font-righteous text-center uppercase text-base"
            style={{
              width: '340px',
              height: '18px',
              lineHeight: '18px',
              flex: 'none',
              order: 0,
              flexGrow: 1
            }}
          >
            DAILY TIP BY HUBERMAN
          </span>
        </div>
        
        <p 
          className="text-center text-[#148BAF] font-happy-monkey lowercase text-base"
          style={{
            width: '340px',
            lineHeight: '1.5',
            flex: 1,
            padding: '0 10px'
          }}
        >
          improve your mental health with practices shared by andrew huberman and naval ravikant
        </p>
      </div>
      
      {/* Today's Quote by Naval */}
      <div 
        className="quote-card relative rounded-[20px] bg-[#F5F5F5]"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '20px 10px',
          gap: '10px',
          width: '360px',
          height: '105px',
          flex: 'none',
          order: 1,
          flexGrow: 0
        }}
      >
        <div 
          className="practices-title"
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0px',
            gap: '10px',
            width: '340px',
            height: '18px',
            flex: 'none',
            order: 0,
            alignSelf: 'stretch',
            flexGrow: 0
          }}
        >
          <span 
            className="text-[#148BAF] font-righteous text-center uppercase text-base"
            style={{
              width: '340px',
              height: '18px',
              lineHeight: '18px',
              flex: 'none',
              order: 0,
              flexGrow: 1
            }}
          >
            TODAYS QOUTE BY NAVAL
          </span>
        </div>
        
        <p 
          className="text-center text-[#148BAF] font-happy-monkey lowercase text-base"
          style={{
            width: '340px',
            lineHeight: '1.5',
            flex: 1,
            padding: '0 10px'
          }}
        >
          improve your mental health with practices shared by andrew huberman and naval ravikant
        </p>
      </div>
    </div>
  );
};

export default MobileWellbeingTipsSection;
