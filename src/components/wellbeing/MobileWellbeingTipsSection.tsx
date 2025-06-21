import "../../../src/styles/wellbeingTips.css";

const MobileWellbeingTipsSection = () => {
  return (
    <div 
      className="tips-and-quotes-container"
      style={{
        width: '100%',
        maxWidth: '100%',
        alignSelf: 'stretch',
        paddingTop: '20px',
        paddingBottom: '10px',
        paddingLeft: '10px',
        paddingRight: '10px',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '20px',
        display: 'flex'
      }}
    >
      {/* Daily Tip by Huberman */}
      <div 
        className="tip"
        style={{
          width: '100%',
          alignSelf: 'stretch',
          padding: '10px',
          position: 'relative',
          borderRadius: '10px',
          outline: '1px var(--TEXTColor, #04C4D5) solid',
          outlineOffset: '-1px',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '20px',
          display: 'flex'
        }}
      >
        <div 
          className="title"
          style={{
            paddingLeft: '10px',
            paddingRight: '10px',
            paddingTop: '2px',
            paddingBottom: '2px',
            left: '50%', /* Center horizontally */
            transform: 'translateX(-50%)', /* Perfect centering */
            top: '-17px',
            position: 'absolute',
            background: 'var(--BGColor, white)',
            borderRadius: '4px',
            outline: '1px #49DAEA solid',
            outlineOffset: '-1px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            display: 'inline-flex'
          }}
        >
          <div 
            style={{
              textAlign: 'center',
              color: 'var(--TEXTColor, #04C4D5)',
              fontSize: '16px',
              fontFamily: 'Righteous',
              fontWeight: '400',
              textTransform: 'uppercase',
              lineHeight: '18px',
              wordWrap: 'break-word'
            }}
          >
            Daily tip by huberman
          </div>
        </div>
        
        <div 
          style={{
            width: '100%',
            maxWidth: '100%',
            alignSelf: 'stretch',
            textAlign: 'center',
            color: 'var(--Primary, #148BAF)',
            fontSize: '12px',
            fontFamily: 'Happy Monkey',
            fontWeight: '400',
            textTransform: 'lowercase',
            lineHeight: '16px',
            wordWrap: 'break-word',
            overflow: 'hidden'
          }}
        >
          Improve your mental health with practices shared by andrew huberman and naval RAvikant
        </div>
      </div>
      
      {/* Today's Quote by Naval */}
      <div 
        className="quote"
        style={{
          width: '100%',
          alignSelf: 'stretch',
          padding: '10px',
          position: 'relative',
          borderRadius: '10px',
          outline: '1px var(--TEXTColor, #04C4D5) solid',
          outlineOffset: '-1px',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '20px',
          display: 'flex'
        }}
      >
        <div 
          className="title"
          style={{
            paddingLeft: '10px',
            paddingRight: '10px',
            paddingTop: '2px',
            paddingBottom: '2px',
            left: '58.50px',
            top: '-11px',
            position: 'absolute',
            background: 'var(--BGColor, white)',
            borderRadius: '4px',
            outline: '1px #49DAEA solid',
            outlineOffset: '-1px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            display: 'inline-flex'
          }}
        >
          <div 
            style={{
              textAlign: 'center',
              color: 'var(--TEXTColor, #04C4D5)',
              fontSize: '16px',
              fontFamily: 'Righteous',
              fontWeight: '400',
              textTransform: 'uppercase',
              lineHeight: '18px',
              wordWrap: 'break-word'
            }}
          >
            Todays qoute by naval
          </div>
        </div>
        
        <div 
          style={{
            width: '100%',
            maxWidth: '100%',
            alignSelf: 'stretch',
            textAlign: 'center',
            color: 'var(--Primary, #148BAF)',
            fontSize: '12px',
            fontFamily: 'Happy Monkey',
            fontWeight: '400',
            textTransform: 'lowercase',
            lineHeight: '16px',
            wordWrap: 'break-word',
            overflow: 'hidden'
          }}
        >
          Improve your mental health with practices shared by andrew huberman and naval RAvikant
        </div>
      </div>
    </div>
  );
};

export default MobileWellbeingTipsSection;
