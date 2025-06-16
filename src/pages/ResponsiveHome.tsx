import { useState, useEffect } from "react";
import Index from "./Index";
import MobileHome from "./MobileHome";

const ResponsiveHome = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update the state when the window is resized
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    handleResize();
    
    window.addEventListener("resize", handleResize);
    
    // Log for debugging
    console.log("ResponsiveHome rendering, isMobile:", isMobile);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile ? <MobileHome /> : <Index />;
};

export default ResponsiveHome;
