import React, { useState, useRef } from "react";
import SocialFeed from './SocialFeed';
import '@/pages/FitnessGroups.css';
import '@/pages/FitnessGroupsTabFix.css';

const TABS = [
  { key: 'events', label: 'friendly events' },
  { key: 'tribe', label: 'find your tribe' },
  { key: 'feels', label: 'share your feels' }
];

export default function FitnessGroups() {
  const [activeTab, setActiveTab] = useState('events');
  const swipeRef = useRef<HTMLDivElement>(null);
  let touchStartX = 0;

  // Swipe handler for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      const idx = TABS.findIndex(t => t.key === activeTab);
      if (dx < 0 && idx < TABS.length - 1) setActiveTab(TABS[idx + 1].key);
      if (dx > 0 && idx > 0) setActiveTab(TABS[idx - 1].key);
    }
  };

  // --- Section Renderers ---
  const renderEvents = () => (
    <div className="events-section">
      {[1,2,3,4].map(i => (
        <div className="event-card" key={i} style={{
          alignSelf: 'stretch',
          padding: '10px',
          background: 'var(--CARDSNEW, rgba(83, 252, 255, 0.10))',
          boxShadow: '1px 2px 4px rgba(73, 217.90, 234, 0.50)',
          overflow: 'hidden',
          borderRadius: '8px',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          display: 'inline-flex'
        }}>
          <div className="event-header" style={{
            alignSelf: 'stretch',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '10px',
            display: 'inline-flex'
          }}>
            <div className="event-category" style={{
              width: '76px',
              alignSelf: 'stretch',
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '4px',
              paddingBottom: '4px',
              background: '#F5F5F5',
              overflow: 'hidden',
              borderRadius: '8px',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '4px',
              display: 'inline-flex'
            }}>
              <svg width="2" height="2" viewBox="0 0 2 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.699442 1.62412L1.66507 1.19267C1.89075 1.09196 1.99168 0.827603 1.8912 0.601929C1.79073 0.37625 1.52614 0.275314 1.30046 0.37579L0.334836 0.807236C0.109157 0.907947 0.00822463 1.1723 0.108701 1.39798C0.208721 1.62251 0.472391 1.72551 0.699442 1.62412Z" fill="var(--Primary, #148BAF)"/>
              </svg>
            </div>
            <div className="event-content" style={{
              flex: '1 1 0',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '10px',
              display: 'inline-flex'
            }}>
              <div className="event-title-container" style={{
                alignSelf: 'stretch',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '10px',
                display: 'inline-flex'
              }}>
                <div className="event-title" style={{
                  flex: '1 1 0',
                  justifyContent: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  color: 'var(--Primary, #148BAF)',
                  fontSize: '16px',
                  fontFamily: 'Righteous',
                  fontWeight: '400',
                  textTransform: 'uppercase',
                  lineHeight: '18px',
                  wordWrap: 'break-word'
                }}>morning running group</div>
              </div>
              <div className="event-description" style={{
                alignSelf: 'stretch',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                color: 'var(--DARKBGColor, black)',
                fontSize: '12px',
                fontFamily: 'Happy Monkey',
                fontWeight: '400',
                textTransform: 'lowercase',
                lineHeight: '16px',
                wordWrap: 'break-word'
              }}>Start your day right with our energetic morning running group. All paces welcome! every sunday morning the run starts</div>
            </div>
          </div>
          <div className="event-meta-row" style={{
            alignSelf: 'stretch',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '10px',
            display: 'inline-flex'
          }}>
            <div className="event-meta event-meta-location" style={{
              flex: '1 1 0',
              height: '24px',
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '4px',
              paddingBottom: '4px',
              background: 'var(--BGColor, white)',
              overflow: 'hidden',
              borderRadius: '8px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '4px',
              display: 'flex'
            }}>
              <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.68269 1.0878C10.3896 1.0878 11.7105 3.49291 11.7105 5.74349C11.7105 5.7858 11.7092 5.82797 11.7079 5.87029L11.7073 5.88589C11.7067 5.91049 11.7067 5.93509 11.7079 5.95969C11.7085 5.97459 11.7094 5.98921 11.7105 6.00538C11.7266 7.50012 10.9665 9.54931 9.62278 11.6324C8.4807 13.4024 7.48282 14.8316 6.87777 14.8417C6.2775 14.8518 5.25857 13.4776 4.12232 11.7855C3.31536 10.5838 1.96265 8.23465 1.95611 5.98465C1.95698 5.96764 1.958 5.95077 1.95858 5.93376C1.95916 5.91394 1.9593 5.89411 1.95872 5.8743L1.958 5.84436C1.95727 5.81076 1.95611 5.7773 1.95611 5.74384C1.95611 4.34386 2.41667 1.08779 6.68277 1.08779M6.68277 0C2.25543 0 0.833496 3.04882 0.833496 5.74359C0.833496 5.79546 0.835237 5.84762 0.836542 5.89991C0.835817 5.92283 0.833496 5.94518 0.833496 5.96851C0.833496 10.536 5.65819 16 6.89184 16C8.12575 16 12.8978 10.1438 12.8328 5.96851C12.8324 5.95094 12.8304 5.93393 12.8296 5.91636C12.8314 5.85886 12.8333 5.80123 12.8333 5.74373C12.8331 2.97817 11.1095 0.000140027 6.68283 0.000140027L6.68277 0Z" fill="var(--Primary, #148BAF)"/>
              </svg>
              <div className="location-text" style={{
                textAlign: 'center',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                color: 'var(--Primary, #148BAF)',
                fontSize: '12px',
                fontFamily: 'Happy Monkey',
                fontWeight: '400',
                textTransform: 'lowercase',
                lineHeight: '16px',
                wordWrap: 'break-word'
              }}>kalyani nagar</div>
            </div>
            <div className="event-meta event-meta-date" style={{
              flex: '1 1 0',
              height: '24px',
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '4px',
              paddingBottom: '4px',
              background: 'var(--BGColor, white)',
              overflow: 'hidden',
              borderRadius: '8px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '4px',
              display: 'flex'
            }}>
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.6154 7.66666C2.6154 7.48257 2.76188 7.33337 2.94244 7.33337H14.0578C14.2384 7.33337 14.3847 7.48257 14.3847 7.66666C14.3847 7.85076 14.2384 7.99995 14.0578 7.99995H2.94244C2.76188 7.99995 2.6154 7.85076 2.6154 7.66666ZM2.94228 10.6666H9.15384C9.33439 10.6666 9.48072 10.5174 9.48072 10.3333C9.48072 10.1492 9.33439 10 9.15384 10H2.94228C2.76172 10 2.61523 10.1492 2.61523 10.3333C2.61523 10.5174 2.76172 10.6666 2.94228 10.6666ZM2.94228 13.3333H12.423C12.6036 13.3333 12.7501 13.1841 12.7501 13C12.7501 12.8159 12.6036 12.6666 12.423 12.6666H2.94228C2.76172 12.6666 2.61523 12.8159 2.61523 13C2.61523 13.1841 2.76172 13.3333 2.94228 13.3333ZM17 4.33357V13.0001C16.999 13.7953 16.6887 14.5579 16.1371 15.1202C15.5856 15.6826 14.8377 15.999 14.0578 16H2.9424C2.16227 15.999 1.41441 15.6826 0.862857 15.1202C0.311304 14.5579 0.000955177 13.7953 0 13.0001V4.33357C0.000973326 3.53815 0.311309 2.77562 0.862857 2.21325C1.41441 1.65089 2.16227 1.33445 2.9424 1.33348H3.9232L3.92304 1.00018C3.92304 0.642909 4.11009 0.312776 4.41346 0.134128C4.71698 -0.044512 5.09077 -0.044512 5.39426 0.134128C5.69762 0.312768 5.88468 0.642931 5.88468 1.00018V3.00025C5.88468 3.35736 5.69764 3.68749 5.39426 3.86614C5.09074 4.04478 4.71696 4.04478 4.41346 3.86614C4.1101 3.6875 3.92304 3.35734 3.92304 3.00025V2.00022H2.94241C2.3357 2.00088 1.75396 2.247 1.32488 2.68432C0.89596 3.12182 0.654549 3.71497 0.653927 4.33357V13.0001C0.654576 13.6187 0.895964 14.2116 1.32488 14.6491C1.75396 15.0866 2.3357 15.3326 2.94241 15.3333H14.0578C14.6645 15.3326 15.246 15.0866 15.6751 14.6491C16.104 14.2116 16.3455 13.6187 16.3461 13.0001V5.33331H1.63469C1.45413 5.33331 1.30764 5.18411 1.30764 5.00001C1.30764 4.81592 1.45413 4.66672 1.63469 4.66672H16.3461V4.33343C16.3454 3.71483 16.104 3.12168 15.6751 2.68418C15.246 2.24686 14.6645 2.00071 14.0578 2.00008H13.077V3.00011C13.077 3.35722 12.8901 3.68735 12.5865 3.866C12.2832 4.04464 11.9092 4.04464 11.6057 3.866C11.3024 3.68736 11.1155 3.3572 11.1155 3.00011V2.00008H6.86536C6.6848 2.00008 6.53848 1.85088 6.53848 1.66679C6.53848 1.48269 6.6848 1.33333 6.86536 1.33333H11.1155V1.00004C11.1155 0.642761 11.3024 0.312628 11.6057 0.13398C11.9093 -0.04466 12.2832 -0.04466 12.5865 0.13398C12.8901 0.31262 13.077 0.642783 13.077 1.00004V1.33333H14.0578C14.8377 1.33432 15.5856 1.65074 16.1371 2.2131C16.6887 2.77547 16.999 3.538 17 4.33343L17 4.33357ZM12.423 1.00015C12.423 0.816049 12.2767 0.666855 12.0962 0.666855C11.9156 0.666855 11.7693 0.816049 11.7693 1.00015V3.00021C11.7693 3.18431 11.9156 3.3335 12.0962 3.3335C12.2767 3.3335 12.423 3.18431 12.423 3.00021V1.00015ZM4.57688 3.00021C4.57688 3.18431 4.7232 3.3335 4.90376 3.3335C5.08432 3.3335 5.23064 3.18431 5.23064 3.00021V1.00015C5.23064 0.816049 5.08432 0.666855 4.90376 0.666855C4.7232 0.666855 4.57688 0.816049 4.57688 1.00015V3.00021Z" fill="var(--Primary, #148BAF)"/>
              </svg>
              <div className="date-text" style={{
                textAlign: 'center',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                color: 'var(--Primary, #148BAF)',
                fontSize: '12px',
                fontFamily: 'Happy Monkey',
                fontWeight: '400',
                textTransform: 'lowercase',
                lineHeight: '16px',
                wordWrap: 'break-word'
              }}>12 Jan 2025</div>
            </div>
            <div className="event-meta event-meta-members" style={{
              flex: '1 1 0',
              height: '24px',
              paddingLeft: '8px',
              paddingRight: '8px',
              paddingTop: '4px',
              paddingBottom: '4px',
              background: 'var(--BGColor, white)',
              overflow: 'hidden',
              borderRadius: '8px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '4px',
              display: 'flex'
            }}>
              <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.66707 15.9999C11.6368 15.9999 14.8539 14.462 14.8539 12.5637C14.8539 11.1658 13.1082 9.11474 10.6028 8.12992C9.81925 9.09867 8.79245 9.78369 7.66704 9.78369C6.54185 9.78369 5.51493 9.09867 4.73079 8.12992C2.226 9.1148 0.47998 11.1659 0.47998 12.5637C0.47998 14.4618 3.69738 15.9999 7.66713 15.9999H7.66707ZM1.52507 11.7884C1.69354 11.4525 1.95057 11.0934 2.26815 10.75C2.87006 10.0991 3.65334 9.53226 4.51306 9.12017C4.87059 9.48662 5.25279 9.79067 5.65437 10.0276C6.30367 10.4108 6.98078 10.605 7.66704 10.605C8.77943 10.605 9.88143 10.0822 10.8205 9.12004C11.6803 9.53216 12.4639 10.0991 13.0658 10.75C13.3832 11.0934 13.6401 11.4524 13.8087 11.7884C13.9943 12.1585 14.0334 12.4143 14.0334 12.5637C14.0334 12.8211 13.9128 13.0878 13.6749 13.3567C13.3903 13.6784 12.9479 13.9882 12.3955 14.2522C11.7963 14.5386 11.0921 14.7649 10.3024 14.9245C9.46969 15.0929 8.58307 15.1782 7.66708 15.1782C6.75118 15.1782 5.86456 15.0929 5.0318 14.9245C4.24194 14.7649 3.53768 14.5386 2.9385 14.2522C2.38607 13.9881 1.94359 13.6784 1.65888 13.3567C1.42106 13.0878 1.30049 12.821 1.30049 12.5637C1.30049 12.4143 1.33944 12.1585 1.52515 11.7884H1.52507ZM7.66675 8.65024C9.8041 8.65024 11.5368 5.80095 11.5368 3.73728C11.5368 1.67339 9.8041 0 7.66675 0C5.52953 0 3.79672 1.67301 3.79672 3.73728C3.79672 5.80155 5.52941 8.65024 7.66675 8.65024ZM4.61465 3.73728C4.61465 2.96442 4.92801 2.23621 5.49705 1.68667C6.07488 1.12868 6.84539 0.821262 7.66675 0.821262C8.48811 0.821262 9.25875 1.12867 9.83659 1.68679C10.4056 2.23649 10.7191 2.96467 10.7191 3.73728C10.7191 4.15077 10.63 4.62279 10.4616 5.10215C10.2889 5.59354 10.0399 6.07188 9.7413 6.48549C9.43749 6.90641 9.08804 7.25115 8.73063 7.48215C8.37472 7.71227 8.01681 7.82889 7.66674 7.82889C7.31667 7.82889 6.95876 7.71227 6.60297 7.48228C6.24557 7.25117 5.8961 6.90667 5.59231 6.48575C5.29383 6.07216 5.04474 5.59379 4.87204 5.1024C4.70357 4.62304 4.61462 4.1509 4.61462 3.73731L4.61465 3.73728Z" fill="var(--Primary, #148BAF)"/>
              </svg>
              <div className="members-text" style={{
                textAlign: 'center',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column',
                color: 'var(--Primary, #148BAF)',
                fontSize: '12px',
                fontFamily: 'Happy Monkey',
                fontWeight: '400',
                textTransform: 'lowercase',
                lineHeight: '16px',
                wordWrap: 'break-word'
              }}>88 members</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTribe = () => (
    <div className="tribe-section">
      {[1,2,3].map((i, idx) => (
        <div className="tribe-card" key={i}>
          <div className="tribe-title">MORNING RUNNING GROUP</div>
          <div className="tribe-desc">start your day right with our energetic morning running group. all paces welcome! every sunday morning the run starts</div>
          <div className="tribe-meta-row">
            <span className="tribe-meta tribe-meta-cat">yoga</span>
            <span className="tribe-meta tribe-meta-members"><svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="#04C4D5" strokeWidth="2" fill="none"/></svg> 88 members</span>
            <span className="tribe-meta tribe-meta-loc"><svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="#04C4D5" strokeWidth="2" fill="none"/></svg> kalyani nagar</span>
          </div>
          {idx === 1 ? (
            <button className="tribe-btn tribe-btn-member">I'M A MEMBER</button>
          ) : (
            <button className="tribe-btn tribe-btn-join">JOIN</button>
          )}
        </div>
      ))}
    </div>
  );

  const renderFeels = () => (
    <div className="feels-section">
      <SocialFeed />
    </div>
  );

  return (
    <div className="fitnessgroups-root" ref={swipeRef} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="fitnessgroups-topnav">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`fitnessgroups-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
            style={{ background: activeTab === tab.key ? '#04C4D5' : '#EEFFFF' }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="fitnessgroups-section">
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'tribe' && renderTribe()}
        {activeTab === 'feels' && renderFeels()}
      </div>
    </div>
  );
}
