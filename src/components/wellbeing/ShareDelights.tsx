import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useToast } from "@/hooks/useToast";
import { usePractices } from "@/context/PracticeContext";
import { Share2 } from "lucide-react";
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

// Context menu interface
interface ContextMenu {
  id: number | string;
  x: number;
  y: number;
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

@keyframes scaleIn {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes pulseSubtle {
  0% { opacity: 0.7; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
}

.animate-success {
  animation: shareSuccess 0.8s ease-out forwards;
}

.animate-pulse-subtle {
  animation: pulseSubtle 2s infinite ease-in-out;
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
  // Track which delights have been shared successfully for visual feedback
  const [sharedDelights, setSharedDelights] = useState<Set<string | number>>(new Set());
  const [showShareSuccess, setShowShareSuccess] = useState<number | string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { addPointsForAction } = usePractices(); // Get the function from context
  // Define tempId at component level so it's accessible throughout the component
  const [tempId, setTempId] = useState<string | null>(null);
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  
  // Touch support for long-press
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);

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

  // Add event listener to close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
         // Add points for sharing the delight
         addPointsForAction(5, 'Shared a Delight'); // Add 5 points
         toast({ title: "Success", description: "Delight shared and points added!" }); // Optional: Update toast message
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

  // Context menu handler
  const handleContextMenu = (e: React.MouseEvent, delight: Delight) => {
    e.preventDefault();
    
    // Position the menu near the cursor but ensure it stays within viewport boundaries
    const x = Math.min(e.clientX, window.innerWidth - 230); // Prevent overflow to the right
    const y = Math.min(e.clientY, window.innerHeight - 150); // Prevent overflow at the bottom
    
    console.log("Opening context menu for delight:", { id: delight.id, text: delight.text });
    
    setContextMenu({
      id: delight.id,
      x: x,
      y: y
    });
  };

  // Touch handlers for long press
  const handleTouchStart = (event: React.TouchEvent, delight: Delight) => {
    touchStartPosRef.current = { 
      x: event.touches[0].clientX, 
      y: event.touches[0].clientY 
    };
    
    // Clear any existing timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    
    // Set new timer for long press
    longPressTimerRef.current = setTimeout(() => {
      // Show context menu for long press
      if (touchStartPosRef.current) {
        // For touch, we position the menu near the touch point
        const x = touchStartPosRef.current.x;
        const y = touchStartPosRef.current.y;
        
        setContextMenu({
          id: delight.id,
          x: Math.min(x, window.innerWidth - 230),
          y: Math.min(y, window.innerHeight - 150)
        });
      }
      longPressTimerRef.current = null;
    }, 600); // 600ms for long press
  };

  const handleTouchMove = () => {
    // Cancel long press if user moves finger
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleTouchEnd = () => {
    // Clean up on touch end
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    touchStartPosRef.current = null;
  };

  // Share to community function
  const handleShareToCommunity = async (delight: Delight) => {
    if (!user) return;
    
    try {
      // Insert into community_delights table
      console.log("Sharing delight to community:", delight);
      
      const { error } = await supabase
        .from('community_delights')
        .insert({
          text: delight.text,
          user_id: user.id,
          username: user.email?.split('@')[0] || 'anonymous',
        });
      
      if (error) {
        console.error("Error sharing to community:", error);
        
        // Check if this is a "relation does not exist" error (table missing)
        if (error.code === '42P01') {
          toast({ 
            title: "System Error", 
            description: "The community feature is being set up. Please try again in a few moments.", 
            variant: "destructive" 
          });
          
          // Try to initialize the table
          try {
            // Import dynamically to avoid circular dependencies
            const { checkCommunityDelightsTable } = await import('../../scripts/checkCommunityDelights');
            await checkCommunityDelightsTable();
            
            // Retry the share operation after table creation
            const { error: retryError } = await supabase
              .from('community_delights')
              .insert({
                text: delight.text,
                user_id: user.id,
                username: user.email?.split('@')[0] || 'anonymous',
              });
              
            if (!retryError) {
              // Success after retry
              toast({ 
                title: "Shared to Community", 
                description: "Your delight has been shared to the community!",
                variant: "success"
              });
              
              setSharedDelights(prev => new Set([...prev, delight.id]));
              setShowShareSuccess(delight.id);
              setTimeout(() => {
                setShowShareSuccess(null);
              }, 2000);
              
              addPointsForAction(3, 'Shared Delight to Community');
              return; // Exit function after successful retry
            }
          } catch (initError) {
            console.error("Failed to initialize community table:", initError);
          }
        }
        
        // For other errors or if retry failed
        toast({ 
          title: "Error", 
          description: `Could not share to community: ${error.message}`, 
          variant: "destructive" 
        });
      } else {
        // Show visual success indicator and toast notification
        toast({ 
          title: "Shared to Community", 
          description: "Your delight has been shared to the community!",
          variant: "success"
        });
        
        // Add to the set of shared delights for visual indication
        setSharedDelights(prev => new Set([...prev, delight.id]));
        
        // Show temporary success animation
        setShowShareSuccess(delight.id);
        setTimeout(() => {
          setShowShareSuccess(null);
        }, 2000); // Hide after 2 seconds
        
        // Award extra points for sharing to community
        addPointsForAction(3, 'Shared Delight to Community');
      }
    } catch (err) {
      console.error("Unexpected error sharing to community:", err);
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      // Close the context menu
      setContextMenu(null);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Add CSS animation for success state */}
      <style dangerouslySetInnerHTML={{ __html: successAnimation }} />
      
      <div className="flex flex-col items-start gap-3 sm:gap-4 md:gap-5 w-full">
        <div className="flex flex-col sm:flex-row justify-center items-center p-2 sm:p-[10px] gap-2 sm:gap-[10px] w-full bg-white border border-[rgba(4,196,213,0.3)] shadow-[0px_3px_6px_rgba(73,218,234,0.3)] rounded-[15px]">
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
              className="rounded-lg bg-[#148BAF] text-white py-2 px-3 sm:py-2.5 sm:px-4 text-sm sm:text-base font-happy-monkey lowercase border border-[#04C4D5] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] hover:bg-[#0A7A9C] transition-all w-full sm:w-auto"
              disabled={!user || !inputText.trim()}
            >
              post delight
            </button>
          </div>
        </div>

        {/* Help text for sharing with subtle animation */}
        {entries.length > 0 && (
          <div className="w-full text-center mb-2">
            <p className="text-xs text-[#148BAF] font-happy-monkey bg-[rgba(83,252,255,0.05)] py-1 px-2 rounded-md inline-block animate-pulse-subtle">
              right-click or long-press on a delight to share it to community
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-[10px] w-full min-h-[50px]">
          {loading ? (
             <p className="text-center text-gray-500 col-span-full">Loading delights...</p>
          ) : entries.length === 0 ? (
             <p className="text-center text-gray-500 col-span-full font-happy-monkey lowercase">no delights shared yet today. add one!</p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="p-3 bg-white shadow-[0px_3px_6px_rgba(73,218,234,0.3)] border border-[rgba(4,196,213,0.3)] rounded-[15px] flex items-center justify-between relative cursor-pointer hover:shadow-md hover:bg-[rgba(83,252,255,0.05)] hover:border-[#04C4D5] transition-all duration-300"
                onContextMenu={(e) => handleContextMenu(e, entry)}
                onTouchStart={(e) => handleTouchStart(e, entry)}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                title="Right-click or long-press to share to community"
              >
                <div className="relative w-full flex-grow px-4 group">
                  <span className="text-[#148BAF] font-happy-monkey text-xs sm:text-sm lowercase block text-center">
                    {entry.text}
                  </span>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-70 transition-opacity">
                    <Share2 size={14} className="text-[#04C4D5]" />
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDelight(entry.id);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center text-[#04C4D5] hover:text-red-500 transition-colors bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 shadow-sm"
                  aria-label="Delete delight"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                <div className="flex items-center gap-1 absolute left-2 top-2">
                  {sharedDelights.has(entry.id) && (
                    <div className="flex items-center gap-1 bg-[rgba(4,196,213,0.1)] rounded-full py-0.5 px-2">
                      <Share2 size={10} className="text-[#04C4D5]" />
                      <span className="text-[10px] font-happy-monkey text-[#148BAF] font-medium">
                        Shared to community
                      </span>
                    </div>
                  )}
                  
                  {/* Success animation overlay */}
                  {showShareSuccess === entry.id && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10 rounded-[10px] animate-success">
                      <div className="bg-white p-2 rounded-full shadow-lg">
                        <svg
                          width="36"
                          height="36"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#04C4D5"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>                {/* Context menu - Improved design based on Learn Page styling */}
        {contextMenu && (
          <>
            {/* Background overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-20 z-40"
              onClick={() => setContextMenu(null)}
              style={{ animation: 'fadeIn 0.2s ease-out both' }}
            ></div>
            
            {/* Menu */}
            <div 
              ref={contextMenuRef}
              style={{ 
                top: `${contextMenu.y}px`, 
                left: `${contextMenu.x}px`,
                maxWidth: '240px',
                animation: 'scaleIn 0.2s ease-out both'
              }}
              className="fixed z-50 bg-white p-3 rounded-xl shadow-xl border border-[#04C4D5]"
            >
              <div className="flex flex-col">
                <div className="text-xs font-happy-monkey lowercase text-gray-500 mb-2 px-2">Share this delight...</div>
                <button 
                  onClick={() => {
                    const delight = entries.find(d => d.id === contextMenu.id);
                    if (delight) {
                      console.log("Clicked share to community for delight:", delight);
                      handleShareToCommunity(delight);
                    } else {
                      console.error("Delight not found with id:", contextMenu.id);
                      toast({ 
                        title: "Error", 
                        description: "Could not find the delight to share.", 
                        variant: "destructive" 
                      });
                    }
                  }}
                  className="w-full px-4 py-2.5 text-sm font-happy-monkey text-[#148BAF] hover:bg-[#148BAF] hover:text-white rounded-lg flex items-center gap-2 transition-all border border-[#04C4D5] shadow-[0px_2px_4px_rgba(73,218,234,0.2)]"
                >
                  <Share2 size={16} />
                  <span>Share to Community</span>
                </button>
                
                <hr className="my-2 border-[rgba(4,196,213,0.1)]" />
                
                <button 
                  onClick={() => setContextMenu(null)}
                  className="px-4 py-2 text-xs text-gray-500 hover:text-[#148BAF] hover:bg-[rgba(4,196,213,0.05)] rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShareDelights;