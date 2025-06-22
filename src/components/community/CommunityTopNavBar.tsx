import React from "react";

type CommunityTopNavBarProps = {
  activeView: 'newsfeed' | 'community' | 'profile';
  onViewChange: (view: 'newsfeed' | 'community' | 'profile') => void;
};

const CommunityTopNavBar: React.FC<CommunityTopNavBarProps> = ({ activeView, onViewChange }) => {
  return (
    <div className="w-full h-[52px] bg-[#FAF8EC] border border-white rounded-[100px] flex flex-row items-center justify-between px-2 relative">
      {/* News Feed Icon - Pen/Notes (Left side) */}
      <div 
        className={`flex items-center justify-center cursor-pointer ${activeView === 'newsfeed' ? 'z-10' : ''}`}
        onClick={() => onViewChange('newsfeed')}
      >
        <svg width="32" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.748 20.8155C11.6169 20.8155 11.4889 20.7628 11.3946 20.6666C11.2654 20.5337 11.2217 20.3397 11.2808 20.1638L12.8606 15.5041C12.8801 15.4468 12.9101 15.3936 12.949 15.3474C13.0363 15.242 15.1067 12.7579 16.2988 11.5872C18.0421 9.87524 20.697 7.4006 23.2641 5.0075C25.0601 3.33368 26.779 1.73146 28.0278 0.536638C28.7898 -0.192885 30.0042 -0.172895 30.7359 0.578247L32.0042 1.88166V1.8822C32.7359 2.63414 32.7215 3.84895 31.9718 4.59002C30.7405 5.80801 29.0878 7.48646 27.3615 9.23947C24.9031 11.7366 22.3609 14.3185 20.6041 16.0123C19.4015 17.1715 16.8617 19.1733 16.7542 19.2576C16.7066 19.2954 16.6523 19.3238 16.5945 19.3416L11.8937 20.7933C11.8456 20.8085 11.7965 20.8155 11.7481 20.8155L11.748 20.8155ZM13.7652 15.908L12.5247 19.5662L16.2152 18.427C16.6416 18.0887 18.8618 16.3217 19.9193 15.3025C21.6669 13.6176 24.2042 11.0403 26.6584 8.54834C28.3882 6.79159 30.0441 5.10989 31.2778 3.8892C31.6439 3.52715 31.652 2.93571 31.2967 2.5696L30.0285 1.26674C29.6734 0.900632 29.0812 0.892525 28.7094 1.24945C27.4579 2.4469 25.736 4.05217 23.9365 5.72951C21.374 8.11797 18.724 10.5883 16.9899 12.2911C15.9418 13.3205 14.1148 15.4915 13.7655 15.9081L13.7652 15.908Z" 
            fill={activeView === 'newsfeed' ? "#000000" : "#148BAF"} />
          <path d="M29.3479 6.7495C29.2195 6.7495 29.0909 6.69951 28.9945 6.60063L25.8398 3.35862C25.6501 3.16354 25.6541 2.85066 25.8495 2.66126C26.0446 2.47051 26.3575 2.47645 26.5468 2.67018L29.7016 5.91219C29.8912 6.10726 29.8872 6.42015 29.6918 6.60954C29.5962 6.7033 29.4719 6.7495 29.3479 6.7495Z" 
            fill={activeView === 'newsfeed' ? "#000000" : "#148BAF"} />
        </svg>
      </div>
      
      {/* Community Icon - Group */}
      <div 
        className={`w-12 h-12 flex items-center justify-center cursor-pointer ${activeView === 'community' ? 'bg-[#FCDF4D] rounded-full shadow-[1px_2px_4px_rgba(73,218,234,0.5)]' : ''}`}
        onClick={() => onViewChange('community')}
      >
        <svg width="32" height="32" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.8391 2.88234C16.8391 4.45047 15.5681 5.72172 14 5.72172C12.4319 5.72172 11.1606 4.45047 11.1606 2.88234C11.1606 1.31422 12.4319 0.0429688 14 0.0429688C15.5681 0.0429688 16.8391 1.31422 16.8391 2.88234Z" 
            fill={activeView === 'community' ? "#000000" : "#148BAF"} />
          <path d="M27.0345 4.42641C27.0345 6.52688 25.3339 8.22735 23.2337 8.22735C21.1335 8.22735 19.4326 6.52688 19.4326 4.42641C19.4326 2.32641 21.1332 0.625977 23.2337 0.625977C25.3339 0.625977 27.0345 2.32641 27.0345 4.42641Z" 
            fill={activeView === 'community' ? "#000000" : "#148BAF"} />
          <path d="M8.56737 4.42641C8.56737 6.52688 6.86674 8.22735 4.76659 8.22735C2.66612 8.22735 0.965545 6.52688 0.965545 4.42641C0.965545 2.32641 2.66612 0.625977 4.76659 0.625977C6.86674 0.625977 8.56737 2.32641 8.56737 4.42641Z" 
            fill={activeView === 'community' ? "#000000" : "#148BAF"} />
        </svg>
      </div>
      
      {/* Profile Icon - User */}
      <div 
        className={`w-12 h-12 flex items-center justify-center cursor-pointer ${activeView === 'profile' ? 'bg-[#FCDF4D] rounded-full shadow-[1px_2px_4px_rgba(73,218,234,0.5)]' : ''}`}
        onClick={() => onViewChange('profile')}
      >
        <svg width="32" height="32" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 13.453C8.26918 13.453 4.83398 10.0178 4.83398 5.78698C4.83398 1.55614 8.26918 0.00292969 12.5 0.00292969C16.7309 0.00292969 20.166 1.55614 20.166 5.78698C20.166 10.0178 16.7309 13.453 12.5 13.453ZM12.5 2.3696C10.5734 2.3696 7.20065 2.86952 7.20065 5.78698C7.20065 8.70444 9.58255 11.0863 12.5 11.0863C15.4175 11.0863 17.7994 8.70444 17.7994 5.78698C17.7994 2.86952 14.4266 2.3696 12.5 2.3696Z" 
            fill={activeView === 'profile' ? "#000000" : "#148BAF"} />
          <path d="M0.833333 27.9954C0.373094 27.9954 0 27.6223 0 27.1621C0 24.0687 1.80704 21.2343 4.73242 19.8787L10.3001 17.095C10.7239 16.8893 11.2344 17.0843 11.4401 17.5081C11.6458 17.9319 11.4508 18.4424 11.027 18.6482L5.45931 21.4319C3.22379 22.472 1.82292 24.6952 1.6665 27.1621C1.6665 27.6223 1.29357 27.9954 0.833333 27.9954Z" 
            fill={activeView === 'profile' ? "#000000" : "#148BAF"} />
          <path d="M24.1667 27.9955C23.7064 27.9955 23.3335 27.6225 23.3335 27.1623C23.1771 24.6954 21.7763 22.4721 19.5407 21.432L13.973 18.6483C13.5493 18.4426 13.3542 17.932 13.5599 17.5083C13.7656 17.0846 14.2761 16.8895 14.6999 17.0952L20.2676 19.8789C23.193 21.2345 25 24.0689 25 27.1623C25 27.6225 24.627 27.9955 24.1667 27.9955Z" 
            fill={activeView === 'profile' ? "#000000" : "#148BAF"} />
        </svg>
      </div>

      {/* Action Button Content */}
      {activeView === 'newsfeed' && (
        <div className="flex-grow flex justify-center">
          <button className="flex flex-row items-center gap-2.5 px-4 py-2 bg-[#FCDF4D] rounded-full shadow-[1px_2px_4px_rgba(73,218,234,0.5)]">
            <svg width="32" height="32" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.8391 2.88234C16.8391 4.45047 15.5681 5.72172 14 5.72172C12.4319 5.72172 11.1606 4.45047 11.1606 2.88234C11.1606 1.31422 12.4319 0.0429688 14 0.0429688C15.5681 0.0429688 16.8391 1.31422 16.8391 2.88234Z" fill="#000000"/>
              <path d="M27.0345 4.42641C27.0345 6.52688 25.3339 8.22735 23.2337 8.22735C21.1335 8.22735 19.4326 6.52688 19.4326 4.42641C19.4326 2.32641 21.1332 0.625977 23.2337 0.625977C25.3339 0.625977 27.0345 2.32641 27.0345 4.42641Z" fill="#000000"/>
            </svg>
            <span className="font-['Happy_Monkey'] text-base text-black">share your feels</span>
          </button>
        </div>
      )}

      {activeView === 'community' && (
        <div className="flex-grow flex justify-center">
          <button className="flex flex-row items-center gap-2.5 px-4 py-2 bg-[#FCDF4D] rounded-full shadow-[1px_2px_4px_rgba(73,218,234,0.5)]">
            <svg width="32" height="32" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.8391 2.88234C16.8391 4.45047 15.5681 5.72172 14 5.72172C12.4319 5.72172 11.1606 4.45047 11.1606 2.88234C11.1606 1.31422 12.4319 0.0429688 14 0.0429688C15.5681 0.0429688 16.8391 1.31422 16.8391 2.88234Z" fill="#000000"/>
              <path d="M27.0345 4.42641C27.0345 6.52688 25.3339 8.22735 23.2337 8.22735C21.1335 8.22735 19.4326 6.52688 19.4326 4.42641C19.4326 2.32641 21.1332 0.625977 23.2337 0.625977C25.3339 0.625977 27.0345 2.32641 27.0345 4.42641Z" fill="#000000"/>
            </svg>
            <span className="font-['Happy_Monkey'] text-base text-black">find your tribe</span>
          </button>
        </div>
      )}

      {activeView === 'profile' && (
        <div className="flex-grow flex justify-center">
          <button className="flex flex-row items-center gap-2.5 px-4 py-2 bg-[#FCDF4D] rounded-full shadow-[1px_2px_4px_rgba(73,218,234,0.5)]">
            <svg width="32" height="32" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 13.453C8.26918 13.453 4.83398 10.0178 4.83398 5.78698C4.83398 1.55614 8.26918 0.00292969 12.5 0.00292969C16.7309 0.00292969 20.166 1.55614 20.166 5.78698C20.166 10.0178 16.7309 13.453 12.5 13.453Z" fill="#000000"/>
            </svg>
            <span className="font-['Happy_Monkey'] text-base text-black">profile</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunityTopNavBar;
