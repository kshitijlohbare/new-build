// Dummy data loader utility for development
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";

// Import the dummy data functions
import { 
  insertAllDummyData, 
  insertDummyDelights,
  insertDummyPractices,
  insertDummyTipsAndStories
} from "@/scripts/communityDummyData";

/**
 * A development-only component that provides buttons to load dummy data
 */
export function DummyDataLoader() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<{
    all: boolean;
    delights: boolean;
    practices: boolean;
    tipsStories: boolean;
  }>({
    all: false,
    delights: false,
    practices: false,
    tipsStories: false
  });

  if (import.meta.env.PROD) {
    return null; // Don't render in production
  }

  const handleLoadAll = async () => {
    setLoading(prev => ({ ...prev, all: true }));
    try {
      toast({
        title: "Loading all dummy data...",
        description: "Please wait while we populate the community",
      });
      
      const results = await insertAllDummyData();
      
      toast({
        title: "Dummy data loaded successfully!",
        description: `Added ${results.delights.count} delights, ${results.practices.count} practices, and ${results.tipsAndStories.count} tips/stories`,
        variant: "success"
      });
    } catch (error) {
      console.error("Error loading dummy data:", error);
      toast({
        title: "Error loading data",
        description: "See console for details",
        variant: "destructive" 
      });
    } finally {
      setLoading(prev => ({ ...prev, all: false }));
    }
  };

  const handleLoadDelights = async () => {
    setLoading(prev => ({ ...prev, delights: true }));
    try {
      const result = await insertDummyDelights();
      toast({
        title: "Delights loaded!",
        description: `Added ${result.count} sample delights`,
        variant: "success"
      });
    } catch (error) {
      console.error("Error loading delights:", error);
      toast({
        title: "Error loading delights",
        description: "See console for details",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, delights: false }));
    }
  };

  const handleLoadPractices = async () => {
    setLoading(prev => ({ ...prev, practices: true }));
    try {
      const result = await insertDummyPractices();
      toast({
        title: "Practices loaded!",
        description: `Added ${result.count} sample practices`,
        variant: "success"
      });
    } catch (error) {
      console.error("Error loading practices:", error);
      toast({
        title: "Error loading practices",
        description: "See console for details",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, practices: false }));
    }
  };

  const handleLoadTipsStories = async () => {
    setLoading(prev => ({ ...prev, tipsStories: true }));
    try {
      const result = await insertDummyTipsAndStories();
      toast({
        title: "Tips & Stories loaded!",
        description: `Added ${result.count} sample tips and stories`,
        variant: "success"
      });
    } catch (error) {
      console.error("Error loading tips and stories:", error);
      toast({
        title: "Error loading tips & stories",
        description: "See console for details",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, tipsStories: false }));
    }
  };

  return (
    <div className="fixed bottom-6 right-6 bg-white p-4 rounded-xl shadow-lg border border-[rgba(4,196,213,0.3)] z-50">
      <div className="flex flex-col gap-2">
        <div className="text-[#148BAF] font-happy-monkey text-sm mb-1">Dev Tools: Load Dummy Data</div>
        <Button 
          onClick={handleLoadAll}
          disabled={loading.all}
          className="bg-amber-500 hover:bg-amber-600 text-white w-full"
          size="sm"
        >
          {loading.all ? "Loading..." : "Load All Data"}
        </Button>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            onClick={handleLoadDelights}
            disabled={loading.delights}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            size="sm"
          >
            {loading.delights ? "..." : "Delights"}
          </Button>
          <Button 
            onClick={handleLoadPractices}
            disabled={loading.practices}
            className="bg-green-500 hover:bg-green-600 text-white"
            size="sm"
          >
            {loading.practices ? "..." : "Practices"}
          </Button>
          <Button 
            onClick={handleLoadTipsStories}
            disabled={loading.tipsStories}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            size="sm"
          >
            {loading.tipsStories ? "..." : "Tips"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DummyDataLoader;
