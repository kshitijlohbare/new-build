import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#06C4D5] to-[#208EB1] flex flex-col items-center justify-center">
      <div className="animate-bounce">
        <h1 className="text-4xl md:text-5xl font-happy-monkey text-white">
          Caktus Coco
        </h1>
      </div>
      <div className="mt-6">
        <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
