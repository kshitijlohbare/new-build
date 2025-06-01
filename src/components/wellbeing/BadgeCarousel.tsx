import * as React from 'react';

const BadgeCarousel: React.FC = () => {
  return (
    <div className="relative bg-[rgba(83,252,255,0.10)] rounded-xl p-4 text-center" style={{ minHeight: '320px' }}>
      <h3 className="text-xl font-happy-monkey text-[#148BAF] lowercase mb-4">Your Achievements</h3>
      <p className="text-[#148BAF] font-happy-monkey">No badges unlocked yet! Complete practices to earn badges.</p>
    </div>
  );
};

export default BadgeCarousel;
