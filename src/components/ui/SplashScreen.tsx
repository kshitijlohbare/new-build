import React from 'react';
import Lottie from "lottie-react";
import { celebrationAnimation } from "@/assets/lottie-animations";

const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#53FCFF] to-[#148BAF] text-white">
      <div className="mb-6 w-32 h-32 flex items-center justify-center">
        <Lottie animationData={celebrationAnimation} loop={true} autoplay={true} style={{ width: '100%', height: '100%' }} />
      </div>
      <h1 className="text-3xl font-happy-monkey mb-2">Wellbeing</h1>
      <p className="text-lg font-light tracking-wide">Loading your experience...</p>
    </div>
  );
};

export default SplashScreen;
