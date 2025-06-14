import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the shape of a tip
interface Tip {
  id: number;
  content: string;
  source: string;
  sourceImage?: string;
  sourceUrl?: string;
  date: Date;
}

// Define the context shape
interface TipsContextType {
  tips: Tip[];
  isLoading: boolean;
  error: string | null;
}

// Create the context with default values
const TipsContext = createContext<TipsContextType>({
  tips: [],
  isLoading: true,
  error: null
});

// Create a provider component
export const TipsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, you would fetch tips from an API
    // Here we're using mock data
    const fetchTips = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const mockTips: Tip[] = [
          {
            id: 1,
            content: "Take a 5-minute break every hour to stretch and move around to improve circulation and mental clarity.",
            source: "Andrew Huberman",
            sourceImage: "https://via.placeholder.com/100x60?text=Huberman",
            sourceUrl: "https://hubermanlab.com",
            date: new Date()
          },
          {
            id: 2,
            content: "Expose your eyes to morning sunlight within 30-60 minutes of waking to regulate your circadian rhythm.",
            source: "Andrew Huberman",
            sourceImage: "https://via.placeholder.com/100x60?text=Huberman",
            sourceUrl: "https://hubermanlab.com",
            date: new Date()
          },
          {
            id: 3,
            content: "Practice mindful breathing for 5 minutes before starting your workday to reduce stress and improve focus.",
            source: "Naval Ravikant",
            sourceImage: "https://via.placeholder.com/100x60?text=Naval",
            sourceUrl: "https://nav.al",
            date: new Date()
          }
        ];
        
        setTips(mockTips);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load wellbeing tips");
        setIsLoading(false);
        console.error("Error fetching tips:", err);
      }
    };

    fetchTips();
  }, []);

  return (
    <TipsContext.Provider value={{ tips, isLoading, error }}>
      {children}
    </TipsContext.Provider>
  );
};

// Custom hook to use the tips context
export const useTips = () => useContext(TipsContext);
