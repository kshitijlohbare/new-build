import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useToast } from "@/hooks/useToast";
import { usePractices } from "@/context/PracticeContext";
import emojiButtonIcon from "../../assets/emoji button.svg";

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

// CSS animations for UI elements
const successAnimation = `
@keyframes shareSuccess {
  0% { transform: scale(1); opacity: 0; }
  25% { transform: scale(1.2); opacity: 1; }
  50% { transform: scale(0.9); opacity: 1; }
  75% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
`;

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
  const { addPointsForAction } = usePractices(); // Get the function from context
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
          // Map delights to Delight interface with explicit type casting
          setEntries((delights || []).map((d: any) => ({
            id: typeof d.id === 'string' || typeof d.id === 'number' ? d.id : String(d.id),
            text: String(d.text),
            user_id: String(d.user_id),
            created_at: String(d.created_at),
          })));
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
         const delightData: Delight = {
           id: typeof data.id === 'string' || typeof data.id === 'number' ? data.id : String(data.id),
           text: String(data.text),
           user_id: String(data.user_id),
           created_at: String(data.created_at),
         };
         setEntries(prev => prev.map(entry => entry.id === newTempId ? delightData : entry));
         // Add points for sharing the delight
         addPointsForAction(5, 'Shared a Delight'); // Add 5 points
         toast({ title: "Success", description: "Delight shared and points added!" });
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
    <div className="w-full flex flex-col items-center" id="share-delights-container">
      {/* Add CSS animation for success state */}
      <style dangerouslySetInnerHTML={{ __html: successAnimation }} />
      
      <div className="flex flex-col items-start gap-3 sm:gap-4 md:gap-5 w-full" id="delights-content-wrapper">
        <div className="flex flex-col sm:flex-row justify-center items-center p-2 sm:p-[10px] gap-2 sm:gap-[10px] w-full bg-white border border-[rgba(4,196,213,0.3)] shadow-[0px_3px_6px_rgba(73,218,234,0.3)] rounded-[15px]" id="delight-input-container">
          <input
            id="delight-text-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleShare()}
            placeholder="what delighted you today?"
            className={`flex-1 bg-transparent border-none ${inputText ? 'text-[#148BAF]' : 'text-[#43D3E0]'} placeholder-[#43D3E0] font-happy-monkey lowercase focus:outline-none w-full sm:w-auto mb-2 sm:mb-0`}
            disabled={!user}
          />
          <div className="flex items-center gap-2" id="share-controls-container">
            <div className="relative" id="emoji-picker-wrapper">
              <button 
                id="emoji-toggle-btn"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-6 h-6 flex items-center justify-center mx-1"
                disabled={!user}
              >
                <img src={emojiButtonIcon} alt="Emoji" width="24" height="24" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 z-50 max-w-[90vw] sm:max-w-none" id="emoji-picker-dropdown">
                  <Picker data={data} onEmojiSelect={onEmojiSelect} />
                </div>
              )}
            </div>
            <button 
              id="share-delight-btn"
              onClick={handleShare}
              className="rounded-lg bg-[#148BAF] text-white py-2 px-3 sm:py-2.5 sm:px-4 text-sm sm:text-base font-happy-monkey lowercase border border-[#04C4D5] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] hover:bg-[#0A7A9C] transition-all w-full sm:w-auto"
              disabled={!user || !inputText.trim()}
            >
              post delight
            </button>
          </div>
        </div>

        <div id="delights-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-[10px] w-full min-h-[50px]">
          {loading ? (
             <p id="loading-message" className="text-center text-gray-500 col-span-full">Loading delights...</p>
          ) : entries.length === 0 ? (
             <p id="empty-state-message" className="text-center text-gray-500 col-span-full font-happy-monkey lowercase">no delights shared yet today. add one!</p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                id={`delight-card-${entry.id}`}
                className="delight-card p-3 bg-white shadow-[0px_3px_6px_rgba(73,218,234,0.3)] border border-[rgba(4,196,213,0.3)] rounded-[15px] flex items-center justify-between relative cursor-pointer hover:shadow-md hover:bg-[rgba(83,252,255,0.05)] hover:border-[#04C4D5] transition-all duration-300"
              >
                <div className="delight-content relative w-full flex-grow px-4 group">
                  <span className="delight-text text-[#148BAF] font-happy-monkey text-xs sm:text-sm lowercase block text-center">
                    {entry.text}
                  </span>
                </div>
                <button 
                  id={`delete-delight-btn-${entry.id}`} 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDelight(entry.id);
                  }}
                  className="delight-delete-btn absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#04C4D5] hover:text-red-500 transition-colors bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 shadow-sm"
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