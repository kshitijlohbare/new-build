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

  const onEmojiSelect = (emoji: EmojiObject) => {
    setInputText(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start p-[20px_10px] gap-5 w-full bg-[rgba(83,252,255,0.1)] rounded-[20px]">
        <h2 className="text-4xl text-center text-black font-happy-monkey lowercase w-full">
          share your delights
        </h2>

        <div className="flex justify-center items-center p-[10px] gap-[10px] w-full h-[59px] bg-white border border-[#148BAF] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] rounded-[10px]">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleShare()}
            placeholder="what delighted you today?"
            className={`flex-1 bg-transparent border-none ${inputText ? 'text-[#148BAF]' : 'text-[#43D3E0]'} placeholder-[#43D3E0] font-happy-monkey lowercase focus:outline-none`}
            disabled={!user}
          />
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
              <div className="absolute bottom-full right-0 z-50">
                <Picker data={data} onEmojiSelect={onEmojiSelect} />
              </div>
            )}
          </div>
          <button 
            onClick={handleShare}
            className="bg-[#148BAF] rounded-[10px] text-white py-2.5 px-4 font-happy-monkey lowercase hover:bg-[#1279A0] transition-colors"
            disabled={!user || !inputText.trim()}
          >
            post delight
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px] w-full min-h-[50px]">
          {loading ? (
             <p className="text-center text-gray-500 col-span-full">Loading delights...</p>
          ) : entries.length === 0 ? (
             <p className="text-center text-gray-500 col-span-full font-happy-monkey lowercase">no delights shared yet today. add one!</p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="p-2.5 bg-white shadow-[1px_2px_4px_rgba(73,218,234,0.5)] rounded-[10px] flex items-center justify-center"
              >
                <span className="text-[#04C4D5] font-happy-monkey text-base lowercase">{entry.text}</span>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2.5 w-full">
        <div className="flex-1 p-2.5 relative rounded-[10px] border border-[#49DADD]">
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[-10px] px-2.5 py-1 bg-white rounded-md" style={{
            borderImage: 'linear-gradient(90deg, #49DADD 0%, #148BAF 100%)',
            borderImageSlice: 1,
            borderStyle: 'solid',
            borderWidth: '1px'
          }}>
            <span className="text-[#04C4D5] font-happy-monkey text-base lowercase text-center">daily tip by huberman</span>
          </div>
          <p className="text-center text-[#148BAF] font-happy-monkey lowercase mt-5">
            improve your mental health with practices shared by andrew huberman and naval ravikant
          </p>
        </div>
        
        <div className="flex-1 p-2.5 relative rounded-[10px] border border-[#49DADD]">
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[-10px] px-2.5 py-1 bg-white rounded-md" style={{
            borderImage: 'linear-gradient(90deg, #49DADD 0%, #148BAF 100%)',
            borderImageSlice: 1,
            borderStyle: 'solid',
            borderWidth: '1px'
          }}>
            <span className="text-[#04C4D5] font-happy-monkey text-base lowercase text-center">todays quote by naval</span>
          </div>
          <p className="text-center text-[#148BAF] font-happy-monkey lowercase mt-5">
            improve your mental health with practices shared by andrew huberman and naval ravikant
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareDelights;