import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useToast } from "@/hooks/useToast";

// Updated interface to accept both number and string IDs for flexibility
interface Delight {
  id: number | string;
  text: string;
  user_id: string;
  created_at: string;
}

interface EmojiObject {
  native: string;
}

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const ShareDelights = () => {
  const [entries, setEntries] = useState<Delight[]>([]);
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  // Define tempId at component level so it's accessible throughout the component
  const [tempId, setTempId] = useState<string | null>(null);

  // Fetch delights for today and current user
  useEffect(() => {
    const fetchDelights = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const today = getTodayDateString();

      try {
        const { data: delights, error } = await supabase
          .from('delights')
          .select('*')
          .eq('user_id', user.id)
          .gte('created_at', `${today}T00:00:00.000Z`)
          .lte('created_at', `${today}T23:59:59.999Z`)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching delights:", error);
          toast({ title: "Error", description: "Could not fetch today's delights.", variant: "destructive" });
          setEntries([]);
        } else {
          setEntries(delights || []);
        }
      } catch (err) {
        console.error("Unexpected error fetching delights:", err);
        toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDelights();
  }, [user, toast]);

  const handleShare = async () => {
    if (!inputText.trim() || !user) {
      return;
    }

    const newDelightText = inputText.trim();
    const newDelightData = {
      text: newDelightText,
      user_id: user.id,
    };

    try {
      // Optimistic UI update
      const newTempId = Date.now().toString();
      setTempId(newTempId); // Store the tempId in state
      
      const optimisticEntry: Delight = {
        ...newDelightData,
        id: newTempId,
        created_at: new Date().toISOString(),
      };
      setEntries(prev => [optimisticEntry, ...prev]);
      setInputText("");

      const { data, error } = await supabase
        .from('delights')
        .insert(newDelightData)
        .select()
        .single();

      if (error) {
        console.error("Error saving delight:", error);
        toast({ title: "Error", description: "Could not save your delight.", variant: "destructive" });
        // Revert optimistic update
        setEntries(prev => prev.filter(entry => entry.id !== newTempId));
        setInputText(newDelightText);
      } else if (data) {
         // Replace optimistic entry with actual data from DB
         setEntries(prev => prev.map(entry => entry.id === newTempId ? data : entry));
      }
    } catch (err) {
      console.error("Unexpected error saving delight:", err);
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
      // Revert optimistic update on error
      if (tempId) {
        setEntries(prev => prev.filter(entry => entry.id !== tempId));
      }
      setInputText(newDelightText);
    }
  };

  const deleteDelight = async (id: number | string) => {
    if (!user) return;
    
    // Optimistic UI update - remove the delight immediately
    const deletedDelight = entries.find(entry => entry.id === id);
    setEntries(prev => prev.filter(entry => entry.id !== id));
    
    try {
      // For temporary IDs (optimistic entries not yet saved to DB), no DB call needed
      if (typeof id === 'string' && isNaN(parseInt(id as string))) {
        return;
      }
      
      // Delete from database
      const { error } = await supabase
        .from('delights')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting delight:", error);
        toast({ title: "Error", description: "Could not delete the delight.", variant: "destructive" });
        
        // Revert optimistic deletion on error
        if (deletedDelight) {
          setEntries(prev => [...prev, deletedDelight]);
        }
      } else {
        toast({ title: "Success", description: "Delight deleted successfully." });
      }
    } catch (err) {
      console.error("Unexpected error deleting delight:", err);
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
      
      // Revert optimistic deletion on error
      if (deletedDelight) {
        setEntries(prev => [...prev, deletedDelight]);
      }
    }
  };

  const onEmojiSelect = (emoji: EmojiObject) => {
    setInputText(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="px-2 sm:px-3 md:p-[20px] w-full flex flex-col items-center">
      <div className="flex flex-col items-start p-3 sm:p-4 md:p-[20px_10px] gap-3 sm:gap-4 md:gap-5 w-full bg-[rgba(83,252,255,0.1)] rounded-[20px]">
        <h2 className="text-xl sm:text-2xl md:text-3xl text-center text-black font-happy-monkey lowercase w-full">
          share your delights
        </h2>

        <div className="flex flex-col sm:flex-row justify-center items-center p-2 sm:p-[10px] gap-2 sm:gap-[10px] w-full bg-white border border-[#148BAF] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] rounded-[10px]">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleShare()}
            placeholder="what delighted you today?"
            className={`flex-1 bg-transparent border-none ${inputText ? 'text-[#148BAF]' : 'text-[#43D3E0]'} placeholder-[#43D3E0] font-happy-monkey lowercase focus:outline-none w-full sm:w-auto mb-2 sm:mb-0`}
            disabled={!user}
          />
          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-6 h-6 flex items-center justify-center mx-1"
                disabled={!user}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z" fill="white"/>
                  <path d="M9.5 9C9.5 10.1046 8.60457 11 7.5 11C6.39543 11 5.5 10.1046 5.5 9C5.5 7.89543 6.39543 7 7.5 7C8.60457 7 9.5 7.89543 9.5 9Z" fill="#49DADD"/>
                  <path d="M18.5 9C18.5 10.1046 17.6046 11 16.5 11C15.3954 11 14.5 10.1046 14.5 9C14.5 7.89543 15.3954 7 16.5 7C17.6046 7 18.5 7.89543 18.5 9Z" fill="#49DADD"/>
                  <path d="M12 1C18.3513 1 23.5 6.14873 23.5 12C23.5 17.8513 18.3513 23 12 23C5.64873 23 0.5 17.8513 0.5 12C0.5 6.14873 5.64873 1 12 1ZM9 9C9 9.82843 8.32843 10.5 7.5 10.5C6.67157 10.5 6 9.82843 6 9C6 8.17157 6.67157 7.5 7.5 7.5C8.32843 7.5 9 8.17157 9 9ZM18 9C18 9.82843 17.3284 10.5 16.5 10.5C15.6716 10.5 15 9.82843 15 9C15 8.17157 15.6716 7.5 16.5 7.5C17.3284 7.5 18 8.17157 18 9Z" stroke="#49DADD" strokeMiterlimit="1.05762" strokeLinecap="round"/>
                </svg>
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 z-50 max-w-[90vw] sm:max-w-none">
                  <Picker data={data} onEmojiSelect={onEmojiSelect} />
                </div>
              )}
            </div>
            <button 
              onClick={handleShare}
              className="bg-[#148BAF] rounded-[10px] text-white py-2 px-3 sm:py-2.5 sm:px-4 text-sm sm:text-base font-happy-monkey lowercase hover:bg-[#1279A0] transition-colors w-full sm:w-auto"
              disabled={!user || !inputText.trim()}
            >
              post delight
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-[10px] w-full min-h-[50px]">
          {loading ? (
             <p className="text-center text-gray-500 col-span-full">Loading delights...</p>
          ) : entries.length === 0 ? (
             <p className="text-center text-gray-500 col-span-full font-happy-monkey lowercase">no delights shared yet today. add one!</p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="p-2 bg-white shadow-[1px_2px_4px_rgba(73,218,234,0.5)] border border-[#04C4D5] rounded-[10px] flex items-center justify-between relative"
              >
                <span className="text-[#04C4D5] font-happy-monkey text-xs sm:text-sm lowercase flex-grow text-center pr-4">{entry.text}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDelight(entry.id);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center text-[#04C4D5] hover:text-red-500 transition-colors"
                  aria-label="Delete delight"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareDelights;