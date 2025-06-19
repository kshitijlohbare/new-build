import { Link } from "react-router-dom";
import { usePractices } from "../../context/PracticeContext";
import "../../../src/styles/mobileHome.css";

const MobileDailyPractices = () => {
  // Consume context
  const { practices, togglePracticeCompletion, isLoading } = usePractices();

  // Filter practices for display (show only daily practices)
  const displayedPractices = practices.filter(practice => practice.isDaily === true);
  
  // Calculate completion percentage
  const completedCount = displayedPractices.filter(p => p.completed).length;
  const totalCount = displayedPractices.length || 1; // Prevent division by zero
  const completionPercentage = Math.round((completedCount / totalCount) * 100);
  const completionPoints = completedCount * 88; // Calculate points based on completed practices
  
  if (isLoading) {
    return (
      <div 
        className="wellness-section" 
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: '20px',
          display: 'inline-flex',
          padding: '0 20px'
        }}
      >
        <div className="loading-message">Loading practices...</div>
      </div>
    );
  }
  
  // Check for empty daily practices and show a message
  if (displayedPractices.length === 0) {
    return (
      <div 
        className="wellness-section" 
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: '20px',
          display: 'inline-flex',
          padding: '0 20px'
        }}
      >
        <div className="empty-practices-message">
          <p>You don't have any daily practices yet</p>
          <Link to="/Practices" className="practices-link">Add daily practice</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="wellness-section" 
      id="daily-practices-section"
      style={{
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: '20px',
        display: 'inline-flex'
      }}
    >
      {/* Progress bar */}
      <div 
        className="progress-bar" 
        style={{
          width: '360px',
          height: '24px',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '10px',
          display: 'inline-flex'
        }}
      >
        <div className="vector">
          <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.6662 1.04836L1.60896 4.24833C1.25294 4.36267 0.999272 4.67529 1 4.99824V15.1311C1 17.3362 2.55687 19.1397 4.57505 20.6729C6.59323 22.2058 9.14016 23.5327 11.4795 24.8562C11.8021 25.0518 12.2001 25.0441 12.5205 24.8562C14.8601 23.5329 17.4068 22.206 19.425 20.6729C21.4431 19.14 23 17.3364 23 15.1311V4.99824C23.001 4.67529 22.7471 4.36266 22.391 4.24833L12.3338 1.04836C12.096 0.972066 11.8723 0.996877 11.6662 1.04836Z" fill="#04C4D5"/>
            <path d="M16.5585 14.9687C16.5585 15.525 16.4503 16.0469 16.2339 16.5344C16.0174 17.0219 15.7214 17.45 15.3458 17.8187C14.9766 18.1812 14.5437 18.4687 14.0472 18.6812C13.5507 18.8937 13.0192 19 12.4526 19H6.9717V16.3094H12.4526C12.6436 16.3094 12.8218 16.275 12.9873 16.2062C13.1528 16.1375 13.2961 16.0437 13.417 15.925C13.5443 15.8 13.643 15.6562 13.713 15.4937C13.783 15.3312 13.8181 15.1562 13.8181 14.9687C13.8181 14.7812 13.783 14.6062 13.713 14.4437C13.643 14.2812 13.5443 14.1406 13.417 14.0219C13.2961 13.8969 13.1528 13.8 12.9873 13.7312C12.8218 13.6625 12.6436 13.6281 12.4526 13.6281H8.7191V10.9375H12.4526C12.6436 10.9375 12.8218 10.9031 12.9873 10.8344C13.1528 10.7656 13.2961 10.6719 13.417 10.5531C13.5443 10.4281 13.643 10.2844 13.713 10.1219C13.783 9.95312 13.8181 9.775 13.8181 9.5875C13.8181 9.4 13.783 9.225 13.713 9.0625C13.643 8.9 13.5443 8.75937 13.417 8.64062C13.2961 8.51562 13.1528 8.41875 12.9873 8.35C12.8218 8.28125 12.6436 8.24687 12.4526 8.24687H6.9717V5.55625H12.4526C13.0192 5.55625 13.5507 5.6625 14.0472 5.875C14.5437 6.0875 14.9766 6.37812 15.3458 6.74687C15.7214 7.10937 16.0174 7.53437 16.2339 8.02187C16.4503 8.50937 16.5585 9.03125 16.5585 9.5875C16.5585 10.0812 16.4662 10.5625 16.2816 11.0312C16.097 11.4937 15.836 11.9094 15.4986 12.2781C15.836 12.6469 16.097 13.0656 16.2816 13.5344C16.4662 13.9969 16.5585 14.475 16.5585 14.9687Z" fill="var(--BGColor, white)"/>
            <path d="M11.5449 0.563477C11.7963 0.500712 12.1241 0.456137 12.4863 0.572266L12.4854 0.573242L22.543 3.77148L22.5439 3.77246C23.0632 3.93923 23.5009 4.41551 23.5 4.99805V15.1309C23.5 17.5865 21.7688 19.5209 19.7275 21.0713C17.6742 22.6311 15.0814 23.9818 12.7666 25.291L12.7656 25.29C12.3004 25.5597 11.7166 25.5767 11.2334 25.29V25.291C8.9189 23.9816 6.32577 22.6309 4.27246 21.0713C2.23123 19.5206 0.5 17.5862 0.5 15.1309V4.99805C0.499348 4.41587 0.936428 3.93937 1.45605 3.77246L1.45703 3.77148L11.5146 0.572266L11.5293 0.567383L11.5449 0.563477Z" stroke="var(--BGColor, white)"/>
          </svg>
        </div>
        
        <div 
          className="progress-bar-container"
          style={{
            height: '16px',
            paddingTop: '16px',
            paddingBottom: '16px',
            position: 'relative',
            background: 'linear-gradient(180deg, #49DAEA 0%, rgba(195.50, 253.79, 255, 0.20) 100%)',
            borderRadius: '4px',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '10px',
            display: 'inline-flex'
          }}
        >
          <div 
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'top left',
              color: 'var(--BGColor, white)',
              fontSize: '12px',
              fontFamily: 'Happy Monkey',
              fontWeight: 400,
              textTransform: 'lowercase',
              lineHeight: '16px',
              wordWrap: 'break-word'
            }}
          >
            {completionPercentage}%
          </div>
          
          <div 
            className="frame-100"
            style={{
              width: '23px',
              height: '16px',
              left: '193px',
              top: '-1.50px',
              position: 'absolute'
            }}
          >
            <div 
              className="star-2"
              style={{
                left: '-10px',
                top: '-13px',
                position: 'absolute'
              }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.0979 2.3541C14.6966 0.511483 17.3034 0.511479 17.9021 2.3541L20.2658 9.62868C20.5335 10.4527 21.3014 11.0106 22.1679 11.0106H29.8168C31.7543 11.0106 32.5598 13.4899 30.9924 14.6287L24.8043 19.1246C24.1033 19.6339 23.81 20.5366 24.0777 21.3607L26.4414 28.6353C27.0401 30.4779 24.9311 32.0101 23.3637 30.8713L17.1756 26.3754C16.4746 25.8661 15.5254 25.8661 14.8244 26.3754L8.63631 30.8713C7.06888 32.0101 4.95992 30.4779 5.55862 28.6353L7.92228 21.3607C8.19002 20.5366 7.89671 19.6339 7.19573 19.1246L1.00761 14.6287C-0.559815 13.4899 0.245734 11.0106 2.18318 11.0106H9.83212C10.6986 11.0106 11.4665 10.4527 11.7342 9.62868L14.0979 2.3541Z" fill="var(--textcolor, #49DADD)"/>
              </svg>
            </div>
            <div 
              style={{
                left: '-2px',
                top: '0px',
                position: 'absolute',
                transform: 'rotate(-90deg)',
                transformOrigin: 'top left',
                justifyContent: 'flex-end',
                display: 'flex',
                flexDirection: 'column',
                color: 'var(--BGColor, white)',
                fontSize: '12px',
                fontFamily: 'Happy Monkey',
                fontWeight: 400,
                textTransform: 'lowercase',
                lineHeight: '16px',
                wordWrap: 'break-word'
              }}
            >
              {completionPoints}
            </div>
          </div>
        </div>
        
        <div 
          style={{
            color: 'var(--TEXTColor, #04C4D5)',
            fontSize: '16px',
            fontFamily: 'Righteous',
            fontWeight: 400,
            textTransform: 'uppercase',
            lineHeight: '18px',
            wordWrap: 'break-word'
          }}
        >
          1000 pts
        </div>
      </div>
      
      {/* Daily practice to-do list */}
      <div 
        className="daily-practices-container"
        style={{
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          gap: '20px',
          display: 'flex'
        }}
      >
        <div 
          className="daily-practice-todo-list"
          style={{
            width: '360px',
            paddingLeft: '10px',
            paddingRight: '10px',
            paddingTop: '20px',
            paddingBottom: '20px',
            background: '#F5F5F5',
            overflow: 'hidden',
            borderRadius: '20px',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '10px',
            display: 'flex'
          }}
        >
          {/* Title */}
          <div 
            className="practices-title"
            style={{
              alignSelf: 'stretch',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              display: 'inline-flex'
            }}
          >
            <div 
              style={{
                flex: '1 1 0',
                textAlign: 'center',
                color: 'var(--Primary, #148BAF)',
                fontSize: '16px',
                fontFamily: 'Righteous',
                fontWeight: 400,
                textTransform: 'uppercase',
                lineHeight: '18px',
                wordWrap: 'break-word'
              }}
            >
              your daily practices
            </div>
          </div>
          
          {/* Practices list */}
          <div 
            className="practices-list"
            style={{
              alignSelf: 'stretch',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              gap: '10px',
              display: 'flex'
            }}
          >
            <div 
              className="left-section"
              style={{
                alignSelf: 'stretch',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: '10px',
                display: 'flex'
              }}
            >
              {/* Practice items */}
              {displayedPractices.map((practice, index) => (
                <div 
                  key={practice.id} 
                  className={`practice-item ${index % 2 === 0 ? '' : 'practice-card-alt'}`}
                  style={{
                    alignSelf: 'stretch',
                    padding: '10px',
                    background: index % 2 === 0 ? 'var(--BGColor, white)' : 'var(--CARDSNEW, rgba(83, 252, 255, 0.10))',
                    boxShadow: '1px 2px 4px rgba(73, 217.90, 234, 0.50)',
                    borderRadius: '10px',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    display: 'inline-flex'
                  }}
                >
                  {/* Practice name */}
                  <div 
                    className="practice-name"
                    style={{
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '10px',
                      display: 'flex'
                    }}
                  >
                    <div 
                      style={{
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '10px',
                        display: 'flex'
                      }}
                    >
                      <div 
                        className="points-indicator"
                        style={{
                          borderRadius: '4px',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '2px',
                          display: 'flex'
                        }}
                      >
                        <div 
                          style={{
                            width: '15px',
                            height: '15px',
                            position: 'relative'
                          }}
                        >
                          <div 
                            style={{
                              left: '-2px',
                              top: '-2.50px',
                              position: 'absolute'
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8.7977 0.912485C9.17613 -0.30416 10.8239 -0.304163 11.2023 0.912482L12.6963 5.71573C12.8656 6.25983 13.351 6.62822 13.8986 6.62822H18.7334C19.958 6.62822 20.4672 8.2652 19.4765 9.01713L15.565 11.9857C15.122 12.322 14.9366 12.918 15.1058 13.4621L16.5998 18.2654C16.9783 19.482 15.6452 20.4937 14.6545 19.7418L10.7431 16.7732C10.3 16.437 9.70001 16.437 9.25694 16.7732L5.34552 19.7418C4.35477 20.4937 3.02173 19.482 3.40016 18.2654L4.89419 13.4621C5.06343 12.918 4.87803 12.322 4.43495 11.9857L0.523533 9.01713C-0.467214 8.2652 0.0419615 6.62822 1.26659 6.62822H6.10137C6.64905 6.62822 7.13443 6.25983 7.30367 5.71573L8.7977 0.912485Z" fill="var(--textcolor, #49DADD)"/>
                            </svg>
                          </div>
                          <div 
                            style={{
                              left: '0px',
                              top: '0.50px',
                              position: 'absolute',
                              justifyContent: 'flex-end',
                              display: 'flex',
                              flexDirection: 'column',
                              color: '#FCDF4D',
                              fontSize: '12px',
                              fontFamily: 'Happy Monkey',
                              fontWeight: 400,
                              textTransform: 'lowercase',
                              lineHeight: '16px',
                              wordWrap: 'break-word'
                            }}
                          >
                            88
                          </div>
                        </div>
                      </div>
                      <div 
                        style={{
                          color: 'var(--DARKBGColor, black)',
                          fontSize: '16px',
                          fontFamily: 'Happy Monkey',
                          fontWeight: 400,
                          textTransform: 'lowercase',
                          lineHeight: '18px',
                          wordWrap: 'break-word'
                        }}
                      >
                        {practice.name}
                      </div>
                      <div 
                        style={{
                          paddingLeft: '4px',
                          paddingRight: '4px',
                          paddingTop: '2px',
                          paddingBottom: '2px',
                          background: 'var(--BGColor, white)',
                          overflow: 'hidden',
                          borderRadius: '4px',
                          outline: '1px var(--TEXTColor, #04C4D5) solid',
                          outlineOffset: '-1px',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '2px',
                          display: 'flex'
                        }}
                      >
                        <div style={{ position: 'relative' }}>
                          <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_681_26)">
                              <path d="M13.4131 9.90025C13.093 9.67868 12.6007 9.60474 12.2067 9.97406C11.4435 10.7127 10.04 11.1066 9.07981 11.4513C9.07981 11.6237 8.98126 11.7715 8.80904 11.8207C7.38095 12.3624 6.29759 12.3624 4.79565 11.8699C4.6725 11.8207 4.59869 11.6729 4.62329 11.5497C4.6725 11.4266 4.82026 11.3528 4.94341 11.3774C6.32216 11.8205 7.28251 11.8453 8.56271 11.3774C8.4889 10.9588 8.19339 10.6387 7.79947 10.5895C5.46037 10.1956 4.67254 8.79212 2.92437 9.48156C1.32394 10.0972 -0.74419 10.8605 -2 11.1314L-0.670473 14.5045C-0.10418 14.2337 0.437483 14.1105 0.979181 14.1105C1.91479 14.1105 2.85041 14.4307 3.76139 14.7506C4.62318 15.0461 5.43564 15.3415 6.2481 15.3415C9.22728 14.6767 12.0588 12.9532 13.6591 10.8605C13.8808 10.4174 13.6593 10.0726 13.4131 9.90025Z" fill="var(--TEXTColor, #04C4D5)"/>
                              <path d="M2.72725 8.9894C4.74622 8.20154 5.65724 9.67885 7.87329 10.0728C8.36576 10.1713 8.78431 10.4913 8.95665 10.9592C9.07981 10.9099 9.20282 10.8853 9.32597 10.836C9.89227 10.639 10.5817 10.4175 11.1234 10.122C10.9264 9.85118 10.6063 9.65408 10.2616 9.62948C10.1384 9.62948 10.04 9.53093 10.0154 9.43252C9.89226 8.76767 9.20296 8.37375 8.58733 8.54613C8.43958 8.59534 8.26721 8.49693 8.26721 8.32457C8.21801 7.73368 7.72552 7.2904 7.13463 7.2904C6.91306 7.2904 6.69149 7.36421 6.51914 7.48736C6.54375 7.01948 6.34678 5.49298 6.78991 4.75435C7.35621 4.95131 8.04565 5.04986 8.58732 4.75435C9.44911 4.31121 9.67068 3.10469 9.67068 3.0555C9.69528 2.93235 9.62147 2.83393 9.52292 2.78473C8.11943 2.11988 6.78991 2.61237 6.42059 4.33582C6.17442 4.68054 6.05127 5.07446 6.00204 5.5176L5.97744 5.493C5.80508 3.74493 4.54936 3.08011 3.04745 3.62178C2.9489 3.67098 2.87509 3.76953 2.87509 3.89255C2.99825 5.41905 4.00768 6.25624 5.60811 5.83756C5.90362 6.2561 6.02665 6.79777 5.97743 7.46262C5.75586 7.16711 5.43573 6.97015 5.04181 6.97015C4.45092 6.97015 3.93386 7.43802 3.90923 8.05351C3.90923 8.25047 3.68766 8.34902 3.51531 8.25047C3.31835 8.12732 3.1214 8.07811 2.89983 8.07811C2.23498 8.07811 1.69345 8.6444 1.79187 9.35845C2.16105 9.21097 2.48104 9.08795 2.72734 8.98941L2.72725 8.9894ZM9.37506 9.26018C9.54742 9.43253 9.42426 9.70332 9.2027 9.70332C8.68577 9.67885 9.03048 8.91559 9.37506 9.26018ZM9.15349 3.15424C9.05494 3.49896 8.80877 4.06526 8.39026 4.28683C8.02094 4.48379 7.52847 4.40998 7.20848 4.31143C7.47925 4.11447 7.87333 3.99131 8.41485 3.91752C8.56261 3.89291 8.66102 3.76976 8.63642 3.62201C8.61182 3.47425 8.48866 3.37584 8.34091 3.40044C7.89777 3.44964 7.55304 3.54819 7.25755 3.69595C7.6516 2.95731 8.29184 2.85874 9.15349 3.15424ZM7.70081 8.00472C7.79936 8.25089 7.47924 8.47259 7.28227 8.27549C6.98689 8.00472 7.55318 7.61078 7.70081 8.00472ZM7.08533 8.86637C7.3315 9.08793 6.96217 9.48185 6.71601 9.23569C6.46984 8.98952 6.83916 8.6202 7.08533 8.86637ZM3.46603 4.04052C4.54939 3.76975 5.06646 4.13907 5.33726 4.82838C5.09109 4.65603 4.82019 4.53287 4.5002 4.40984C4.37705 4.36064 4.22943 4.43444 4.18008 4.5576C4.13088 4.68075 4.20469 4.82837 4.32784 4.87771C4.69716 5.02547 4.99269 5.17322 5.23886 5.39478C4.3031 5.5424 3.6876 5.19782 3.46603 4.04052ZM5.18947 7.70908C5.43564 7.93064 5.09092 8.32456 4.82015 8.0784C4.59859 7.83223 4.96791 7.46291 5.18947 7.70908Z" fill="var(--TEXTColor, #04C4D5)"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_681_26">
                                <rect width="15" height="15" fill="white" transform="translate(0 0.5)"/>
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                        <div 
                          style={{
                            color: 'var(--TEXTColor, #04C4D5)',
                            fontSize: '12px',
                            fontFamily: 'Happy Monkey',
                            fontWeight: 400,
                            textTransform: 'lowercase',
                            lineHeight: '16px',
                            wordWrap: 'break-word'
                          }}
                        >
                          {practice.streak || 2}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Duration and completion buttons */}
                  <div 
                    className="action-buttons"
                    style={{
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                      gap: '4px',
                      display: 'flex'
                    }}
                  >
                    <div 
                      style={{
                        paddingLeft: '8px',
                        paddingRight: '8px',
                        paddingTop: '2px',
                        paddingBottom: '2px',
                        background: 'var(--BGColor, white)',
                        overflow: 'hidden',
                        borderRadius: '4px',
                        outline: '1px var(--TEXTColor, #04C4D5) solid',
                        outlineOffset: '-1px',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px',
                        display: 'flex'
                      }}
                    >
                      <div 
                        style={{
                          color: 'var(--Primary, #148BAF)',
                          fontSize: '12px',
                          fontFamily: 'Happy Monkey',
                          fontWeight: 400,
                          textTransform: 'lowercase',
                          lineHeight: '16px',
                          wordWrap: 'break-word'
                        }}
                      >
                        {practice.duration || 30} min
                      </div>
                    </div>
                    <button
                      onClick={() => togglePracticeCompletion(practice.id)}
                      style={{background: 'transparent', border: 'none', padding: 0, cursor: 'pointer'}}
                      aria-label={practice.completed ? "Mark practice as incomplete" : "Mark practice as complete"}
                    >
                      <svg width="35" height="20" viewBox="0 0 35 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {practice.completed ? (
                          <>
                            <rect width="35" height="20" rx="4" fill="var(--Primary, #148BAF)"/>
                            <path d="M26.9519 2.17324C26.6076 2.36896 26.2451 2.54491 25.9175 2.75886L25.4187 3.06882L24.9301 3.39797C24.7653 3.50416 24.6097 3.62387 24.4521 3.74044C24.2963 3.85937 24.1346 3.96948 23.984 4.09487C23.6794 4.34115 23.3751 4.58585 23.0869 4.84997C22.7901 5.1033 22.5153 5.38248 22.2328 5.65012C21.9617 5.93127 21.6876 6.20696 21.4281 6.49786C21.161 6.78097 20.9128 7.08154 20.6591 7.3756C20.416 7.67968 20.1686 7.97904 19.9381 8.29271C19.7013 8.60031 19.4799 8.92027 19.2532 9.23551C19.0318 9.55467 18.8145 9.87615 18.6062 10.2038C18.3981 10.5316 18.1926 10.8607 17.9986 11.1969C17.8001 11.5302 17.6132 11.8707 17.4319 12.2134C17.2479 12.5545 17.0809 12.9054 16.916 13.2553C16.7524 13.6064 16.5966 13.9608 16.4476 14.317C16.3004 14.6742 16.1504 15.0286 16.0113 15.3854C15.8672 15.7337 15.7233 16.1079 15.6023 16.4289L15.0111 18L13.9639 16.7216C13.7611 16.4738 13.5563 16.2285 13.3496 15.9848C13.1401 15.7446 12.933 15.5014 12.7147 15.2698C12.6047 15.1548 12.499 15.0353 12.3865 14.923C12.277 14.8067 12.1617 14.6979 12.0496 14.5847C11.8229 14.3613 11.5891 14.1448 11.3491 13.9356C11.1093 13.7256 10.8627 13.5224 10.608 13.3286C10.4817 13.2291 10.3508 13.1378 10.2206 13.0435C10.09 12.9493 9.95555 12.8615 9.82048 12.7722C9.54857 12.5988 9.27078 12.4262 8.97832 12.2792C8.68919 12.128 8.38222 11.9875 8.07217 11.8815L8.06317 11.8786C8.01442 11.8617 7.98839 11.8088 8.00502 11.7599C8.01657 11.7263 8.04535 11.7034 8.07804 11.6977C8.26205 11.667 8.43686 11.6605 8.61676 11.6609C8.7949 11.6646 8.97362 11.6746 9.15157 11.6942C9.50471 11.741 9.85922 11.8069 10.2035 11.9068C10.5487 12.0046 10.8871 12.127 11.2166 12.2693C11.5466 12.4107 11.8689 12.5716 12.1791 12.7514C12.4923 12.9274 12.7926 13.1239 13.0855 13.3304C13.3773 13.5379 13.6598 13.7581 13.9315 13.9898C14.0895 14.1246 14.2444 14.2628 14.3961 14.4042C14.3961 14.4042 14.65 13.8931 14.8516 13.5373C15.2499 12.8229 15.6777 12.1282 16.1171 11.4438C16.337 11.1016 16.5605 10.7618 16.7919 10.4278C17.0204 10.0918 17.2598 9.76319 17.5019 9.43697C17.7445 9.11115 17.9954 8.79201 18.2507 8.47597C18.5093 8.16288 18.7694 7.85117 19.0452 7.55279C19.3138 7.24872 19.5992 6.95934 19.8795 6.66683C20.1708 6.38352 20.4556 6.09589 20.759 5.8263C21.0527 5.5475 21.3708 5.29419 21.6787 5.03263C22.0002 4.78517 22.312 4.5283 22.6452 4.29849C22.9697 4.05789 23.3094 3.83826 23.647 3.61841C23.8144 3.50634 23.9925 3.40975 24.1642 3.30513C24.3374 3.20247 24.5087 3.09726 24.6884 3.00596L25.2205 2.72266C25.4014 2.63371 25.5868 2.55181 25.769 2.46678C26.1321 2.28849 26.5049 2.16094 26.8728 2.00714C26.9196 1.98754 26.9734 2.00968 26.993 2.05651C27.0108 2.1 26.9934 2.14938 26.9535 2.17191L26.9519 2.17324Z" fill="#FCDF4D"/>
                          </>
                        ) : (
                          <>
                            <rect x="0.5" y="0.5" width="34" height="19" rx="3.5" fill="var(--BGColor, white)"/>
                            <rect x="0.5" y="0.5" width="34" height="19" rx="3.5" stroke="var(--TEXTColor, #04C4D5)"/>
                            <path d="M26.9519 2.17324C26.6076 2.36896 26.2451 2.54491 25.9175 2.75886L25.4187 3.06882L24.9301 3.39797C24.7653 3.50416 24.6097 3.62387 24.4521 3.74044C24.2963 3.85937 24.1346 3.96948 23.984 4.09487C23.6794 4.34115 23.3751 4.58585 23.0869 4.84997C22.7901 5.1033 22.5153 5.38248 22.2328 5.65012C21.9617 5.93127 21.6876 6.20696 21.4281 6.49786C21.161 6.78097 20.9128 7.08154 20.6591 7.3756C20.416 7.67968 20.1686 7.97904 19.9381 8.29271C19.7013 8.60031 19.4799 8.92027 19.2532 9.23551C19.0318 9.55467 18.8145 9.87615 18.6062 10.2038C18.3981 10.5316 18.1926 10.8607 17.9986 11.1969C17.8001 11.5302 17.6132 11.8707 17.4319 12.2134C17.2479 12.5545 17.0809 12.9054 16.916 13.2553C16.7524 13.6064 16.5966 13.9608 16.4476 14.317C16.3004 14.6742 16.1504 15.0286 16.0113 15.3854C15.8672 15.7337 15.7233 16.1079 15.6023 16.4289L15.0111 18L13.9639 16.7216C13.7611 16.4738 13.5563 16.2285 13.3496 15.9848C13.1401 15.7446 12.933 15.5014 12.7147 15.2698C12.6047 15.1548 12.499 15.0353 12.3865 14.923C12.277 14.8067 12.1617 14.6979 12.0496 14.5847C11.8229 14.3613 11.5891 14.1448 11.3491 13.9356C11.1093 13.7256 10.8627 13.5224 10.608 13.3286C10.4817 13.2291 10.3508 13.1378 10.2206 13.0435C10.09 12.9493 9.95555 12.8615 9.82048 12.7722C9.54857 12.5988 9.27078 12.4262 8.97832 12.2792C8.68919 12.128 8.38222 11.9875 8.07217 11.8815L8.06317 11.8786C8.01442 11.8617 7.98839 11.8088 8.00502 11.7599C8.01657 11.7263 8.04535 11.7034 8.07804 11.6977C8.26205 11.667 8.43686 11.6605 8.61676 11.6609C8.7949 11.6646 8.97362 11.6746 9.15157 11.6942C9.50471 11.741 9.85922 11.8069 10.2035 11.9068C10.5487 12.0046 10.8871 12.127 11.2166 12.2693C11.5466 12.4107 11.8689 12.5716 12.1791 12.7514C12.4923 12.9274 12.7926 13.1239 13.0855 13.3304C13.3773 13.5379 13.6598 13.7581 13.9315 13.9898C14.0895 14.1246 14.2444 14.2628 14.3961 14.4042C14.3961 14.4042 14.65 13.8931 14.8516 13.5373C15.2499 12.8229 15.6777 12.1282 16.1171 11.4438C16.337 11.1016 16.5605 10.7618 16.7919 10.4278C17.0204 10.0918 17.2598 9.76319 17.5019 9.43697C17.7445 9.11115 17.9954 8.79201 18.2507 8.47597C18.5093 8.16288 18.7694 7.85117 19.0452 7.55279C19.3138 7.24872 19.5992 6.95934 19.8795 6.66683C20.1708 6.38352 20.4556 6.09589 20.759 5.8263C21.0527 5.5475 21.3708 5.29419 21.6787 5.03263C22.0002 4.78517 22.312 4.5283 22.6452 4.29849C22.9697 4.05789 23.3094 3.83826 23.647 3.61841C23.8144 3.50634 23.9925 3.40975 24.1642 3.30513C24.3374 3.20247 24.5087 3.09726 24.6884 3.00596L25.2205 2.72266C25.4014 2.63371 25.5868 2.55181 25.769 2.46678C26.1321 2.28849 26.5049 2.16094 26.8728 2.00714C26.9196 1.98754 26.9734 2.00968 26.993 2.05651C27.0108 2.1 26.9934 2.14938 26.9535 2.17191L26.9519 2.17324Z" fill="#FCDF4D"/>
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Link to all practices */}
              <div className="flex justify-center w-full mt-5">
                <Link 
                  to="/Practices"
                  className="inline-block bg-white hover:bg-[#F7FFFF] rounded-lg px-4 py-1.5 text-[#148BAF] font-happy-monkey text-sm lowercase border border-[#04C4D5] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] transition-all"
                >
                  view all practices
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDailyPractices;