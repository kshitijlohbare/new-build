import { useState, useEffect } from "react";
import { Smile, BookOpen, Lightbulb, MessageCircle, User, Heart, ThumbsUp, Filter, UserCheck } from 'lucide-react';
import { usePractices } from "@/context/PracticeContext";
import { useToast } from '@/hooks/useToast';
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import UserProfileCard from "@/components/ui/UserProfileCard";

// Import icons for practice streaks
import StreakLesserThan10 from "../assets/icons/Streak_lesser_than_10.svg";
import StreakGreaterThan10 from "../assets/icons/Streak_greater_than_10.svg";
import StreakGreaterThan21 from "../assets/icons/Streak_greater_than_21.svg";

// Premium CSS animation keyframes with glassmorphism effects
const animationStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in {
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes slide-down {
  0% { transform: translateY(-10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes mobile-bounce {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-2px); }
  100% { transform: translateY(0px); }
}

@keyframes chip-glow {
  0% { box-shadow: 0 6px 24px rgba(4,196,213,0.15); }
  50% { box-shadow: 0 12px 40px rgba(4,196,213,0.25); }
  100% { box-shadow: 0 6px 24px rgba(4,196,213,0.15); }
}

@keyframes chip-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes float-orb {
  0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
  33% { transform: translateY(-10px) translateX(5px) rotate(120deg); }
  66% { transform: translateY(5px) translateX(-5px) rotate(240deg); }
  100% { transform: translateY(0px) translateX(0px) rotate(360deg); }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes backdrop-blur-pulse {
  0% { backdrop-filter: blur(8px); }
  50% { backdrop-filter: blur(12px); }
  100% { backdrop-filter: blur(8px); }
}

.card-hover {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-hover:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 32px rgba(4, 196, 213, 0.2);
}

/* Enhanced mobile-specific hover effects */
@media (hover: hover) {
  .card-hover:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 12px 32px rgba(4, 196, 213, 0.2);
  }
}

@media (hover: none) {
  .card-hover:active {
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 8px 24px rgba(4, 196, 213, 0.15);
  }
}

.animate-slide-down {
  animation: slide-down 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.mobile-bounce {
  animation: mobile-bounce 0.8s ease-in-out;
}

.float-orb {
  animation: float-orb 6s ease-in-out infinite;
}

.gradient-shift {
  background-size: 200% 200%;
  animation: gradient-shift 4s ease infinite;
}

.backdrop-blur-pulse {
  animation: backdrop-blur-pulse 3s ease-in-out infinite;
}

/* Enhanced scrollbar hiding for mobile */
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Alternative scrollbar hiding class */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Mobile-optimized text line clamping */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Touch-friendly button styles */
.touch-button {
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation;
}

/* Mobile-optimized focus states */
@media (max-width: 768px) {
  .focus-mobile:focus {
    outline: 2px solid rgba(4, 196, 213, 0.5);
    outline-offset: 2px;
  }
}
`;

interface CommunityPost {
  id: number;
  type: "practice" | "delight" | "tip" | "story";
  author: string;
  content: string;
  createdAt: string;
  user_id?: string; // Add user_id for filtering
  // For practices
  title?: string;
  steps?: string[];
  practiceId?: number; // Reference to original practice
  // For delights
  cheers?: number;
  comments?: { author: string; text: string; createdAt: string }[];
  // For tips & stories
  upvotes?: number;
  threadComments?: { author: string; text: string; createdAt: string }[];
}

interface CommunityDelight {
  id: number;
  text: string;
  user_id: string;
  username: string;
  created_at: string;
  cheers?: number;
  comments?: { author: string; text: string; createdAt: string }[];
}

const typeLabels: Record<CommunityPost["type"], string> = {
  practice: "User Practice",
  delight: "Delight",
  tip: "Tip",
  story: "Story",
};

export default function Community() {
  const { practices, addPractice } = usePractices();
  const { toast } = useToast();
  const { user } = useAuth();
  const { followingList, suggestedUsers, getSuggestedUsers } = useProfile();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [communityDelights, setCommunityDelights] = useState<CommunityDelight[]>([]);
  const [activeTab, setActiveTab] = useState<'practice' | 'delight' | 'tipsStories'>("practice");
  // Add a refresh timer for community delights
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  
  // Tips & Stories state
  const [formContent, setFormContent] = useState("");
  const [formType, setFormType] = useState<"tip" | "story">("tip");
  const [threadComment, setThreadComment] = useState("");
  const [activeThread, setActiveThread] = useState<number | null>(null);
  
  // Filter by following
  const [showFollowingOnly, setShowFollowingOnly] = useState(false);
  const [followingUserIds, setFollowingUserIds] = useState<string[]>([]);
  
  // People section
  const [showPeopleSection, setShowPeopleSection] = useState(false);
  const [followCheckMap, setFollowCheckMap] = useState<Record<string, boolean>>({});
  
  // Load following user IDs when the component mounts
  useEffect(() => {
    if (followingList?.length > 0) {
      const ids = followingList.map(user => user.id);
      setFollowingUserIds(ids);
      
      // Initialize the follow check map
      const initialMap: Record<string, boolean> = {};
      followingList.forEach(user => {
        initialMap[user.id] = true;
      });
      setFollowCheckMap(initialMap);
    }
  }, [followingList]);
  
  // Load suggested users
  useEffect(() => {
    if (showPeopleSection) {
      getSuggestedUsers();
    }
  }, [showPeopleSection]);
  
  // Check follow status for suggested users
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (suggestedUsers?.length > 0) {
        const statusMap: Record<string, boolean> = { ...followCheckMap };
        
        for (const suggestedUser of suggestedUsers) {
          if (statusMap[suggestedUser.id] === undefined) {
            statusMap[suggestedUser.id] = followingUserIds.includes(suggestedUser.id);
          }
        }
        
        setFollowCheckMap(statusMap);
      }
    };
    
    checkFollowStatus();
  }, [suggestedUsers, followingUserIds]);

  // Filter posts based on showFollowingOnly
  const filteredPosts = showFollowingOnly 
    ? posts.filter(post => post.user_id && followingUserIds.includes(post.user_id))
    : posts;
    
  const filteredDelights = showFollowingOnly
    ? communityDelights.filter(delight => followingUserIds.includes(delight.user_id))
    : communityDelights;
    
  // Toggle follow status
  const handleFollowToggle = (userId: string) => {
    setFollowCheckMap(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
    
    // Update followingUserIds
    if (followCheckMap[userId]) {
      setFollowingUserIds(prev => prev.filter(id => id !== userId));
    } else {
      setFollowingUserIds(prev => [...prev, userId]);
    }
  };
  
  // People section toggle
  const togglePeopleSection = () => {
    setShowPeopleSection(!showPeopleSection);
  };
  
  // Render the people section
  const renderPeopleSection = () => {
    if (!showPeopleSection) return null;
    
    return (
      <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-white rounded-[20px] shadow-lg animate-slide-down w-full mx-2 sm:mx-0" style={{
        boxShadow: '0 4px 20px rgba(4, 196, 213, 0.1), 0 1px 3px rgba(0,0,0,0.05)',
        border: '1px solid rgba(4, 196, 213, 0.1)'
      }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-happy-monkey lowercase text-[#148BAF] flex items-center gap-2">
            <User className="w-5 h-5 sm:w-6 sm:h-6" />
            People to Follow
          </h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={togglePeopleSection}
            className="text-sm font-happy-monkey touch-button self-end sm:self-auto px-4 py-2 rounded-full hover:bg-[rgba(4,196,213,0.1)] text-[#148BAF]"
            style={{ minHeight: '44px' }}
          >
            Hide
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
          {suggestedUsers.map(suggestedUser => (
            <UserProfileCard
              key={suggestedUser.id}
              user={suggestedUser}
              isFollowing={followCheckMap[suggestedUser.id] || false}
              onFollowToggle={() => handleFollowToggle(suggestedUser.id)}
            />
          ))}
        </div>
        
        {suggestedUsers.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <p className="text-center text-gray-500 text-sm sm:text-base font-happy-monkey">
              No suggested users available at this time.
            </p>
          </div>
        )}
      </div>
    );
  };

  // Optimized filter controls with improved mobile experience
  const renderFilterControls = () => {
    return (
      <div className="mb-6 sm:mb-8 px-3 sm:px-4">
        {/* Streamlined container with better mobile adaptation */}
        <div className="relative backdrop-blur-lg bg-white/95 rounded-2xl p-4 sm:p-5 border border-white/60 shadow-[0_4px_24px_rgba(4,196,213,0.08)] overflow-hidden">
          
          {/* Subtle background accent */}
          <div className="absolute -top-2 -left-2 w-12 h-12 bg-gradient-to-br from-[#04C4D5]/10 to-[#7B61FF]/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-[#F59E0B]/8 to-[#DC2626]/8 rounded-full blur-xl"></div>
          
          {/* Main filter container */}
          <div className="relative z-10">
            {/* Compact header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#04C4D5]"></div>
                Filters
              </span>
              <div className="text-xs text-gray-400 font-medium">
                {activeTab} • {showFollowingOnly ? 'following' : 'all'} • {showPeopleSection ? 'people visible' : 'posts only'}
              </div>
            </div>
            
            {/* Single row layout for better mobile experience */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {/* Content Type Chips - Compact design */}
              <div className="flex gap-1.5 sm:gap-2">
                <button 
                  onClick={() => setActiveTab('practice')}
                  className={`group px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all duration-300 font-happy-monkey lowercase flex items-center gap-1.5 sm:gap-2 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 ${
                    activeTab === 'practice' 
                      ? 'bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white shadow-[0_4px_16px_rgba(22,163,74,0.3)] border border-white/20' 
                      : 'text-[#16A34A] bg-white/80 border border-[#16A34A]/25 hover:border-[#16A34A]/40 hover:bg-[#16A34A]/5 shadow-[0_2px_8px_rgba(22,163,74,0.1)]'
                  }`}
                >
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-semibold">practices</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('delight')}
                  className={`group px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all duration-300 font-happy-monkey lowercase flex items-center gap-1.5 sm:gap-2 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/30 ${
                    activeTab === 'delight' 
                      ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white shadow-[0_4px_16px_rgba(245,158,11,0.3)] border border-white/20' 
                      : 'text-[#F59E0B] bg-white/80 border border-[#F59E0B]/25 hover:border-[#F59E0B]/40 hover:bg-[#F59E0B]/5 shadow-[0_2px_8px_rgba(245,158,11,0.1)]'
                  }`}
                >
                  <Smile className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-semibold">delights</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('tipsStories')}
                  className={`group px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all duration-300 font-happy-monkey lowercase flex items-center gap-1.5 sm:gap-2 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/30 ${
                    activeTab === 'tipsStories' 
                      ? 'bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white shadow-[0_4px_16px_rgba(220,38,38,0.3)] border border-white/20' 
                      : 'text-[#DC2626] bg-white/80 border border-[#DC2626]/25 hover:border-[#DC2626]/40 hover:bg-[#DC2626]/5 shadow-[0_2px_8px_rgba(220,38,38,0.1)]'
                  }`}
                >
                  <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-semibold">tips</span>
                </button>
              </div>
              
              {/* Separator */}
              <div className="w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent my-1 hidden sm:block"></div>
              
              {/* View Control Chips */}
              <div className="flex gap-1.5 sm:gap-2">
                <button 
                  onClick={() => setShowFollowingOnly(!showFollowingOnly)}
                  className={`group px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all duration-300 font-happy-monkey lowercase flex items-center gap-1.5 sm:gap-2 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#04C4D5]/30 ${
                    showFollowingOnly 
                      ? 'bg-gradient-to-r from-[#04C4D5] to-[#0891B2] text-white shadow-[0_4px_16px_rgba(4,196,213,0.3)] border border-white/20' 
                      : 'text-[#0891B2] bg-white/80 border border-[#04C4D5]/25 hover:border-[#04C4D5]/40 hover:bg-[#04C4D5]/5 shadow-[0_2px_8px_rgba(4,196,213,0.1)]'
                  }`}
                >
                  {showFollowingOnly ? (
                    <>
                      <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-semibold hidden sm:inline">following</span>
                      <span className="font-semibold sm:hidden">follow</span>
                    </>
                  ) : (
                    <>
                      <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="font-semibold">all</span>
                    </>
                  )}
                </button>
                
                <button 
                  onClick={togglePeopleSection}
                  className={`group px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all duration-300 font-happy-monkey lowercase flex items-center gap-1.5 sm:gap-2 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#7B61FF]/30 ${
                    showPeopleSection 
                      ? 'bg-gradient-to-r from-[#7B61FF] to-[#6D28D9] text-white shadow-[0_4px_16px_rgba(123,97,255,0.3)] border border-white/20' 
                      : 'text-[#6D28D9] bg-white/80 border border-[#7B61FF]/25 hover:border-[#7B61FF]/40 hover:bg-[#7B61FF]/5 shadow-[0_2px_8px_rgba(123,97,255,0.1)]'
                  }`}
                >
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="font-semibold">{showPeopleSection ? 'hide' : 'people'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Fetch community practices and delights
  useEffect(() => {
    // Sample fetch for community practices - in a real app, fetch from DB
    const fetchCommunityPractices = async () => {
      // For demo purposes, we're creating sample community-shared practices
      const communityPractices = practices
        .filter(p => p.userCreated)
        .map((practice) => ({
          id: practice.id + 1000, // Avoid ID collision
          type: "practice" as const,
          author: "Community User",
          content: practice.description,
          title: practice.name,
          createdAt: new Date().toISOString(),
          practiceId: practice.id,
          steps: practice.steps?.map(s => s.title) || []
        }));
      
      setPosts(prevPosts => {
        const nonPracticePosts = prevPosts.filter(p => p.type !== "practice");
        return [...nonPracticePosts, ...communityPractices];
      });
    };

    const fetchCommunityDelights = async () => {
      try {
        // Check if the community_delights table exists, attempt to create it if not
        const { error: testError } = await supabase
          .from('community_delights')
          .select('id')
          .limit(1);
          
        if (testError && testError.code === '42P01') {
          console.log('Community delights table does not exist, initializing...');
          try {
            const { checkCommunityDelightsTable } = await import('../scripts/checkCommunityDelights');
            await checkCommunityDelightsTable();
            // Wait a moment for the table to be created
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (initError) {
            console.error("Failed to initialize community delights table:", initError);
          }
        }
      
        // Now fetch the delights
        const { data, error } = await supabase
          .from('community_delights')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching community delights:", error);
        } else {
          setCommunityDelights((data || []).map((d: any) => ({
            id: Number(d.id),
            text: String(d.text),
            user_id: String(d.user_id),
            username: String(d.username),
            created_at: String(d.created_at),
            cheers: d.cheers !== undefined ? Number(d.cheers) : undefined,
            comments: Array.isArray(d.comments) ? d.comments : undefined,
          })));
        }
      } catch (err) {
        console.error("Error in community delights fetch:", err);
      }
    };

    fetchCommunityPractices();
    fetchCommunityDelights();
    
    // Set up a periodic refresh of community delights every 30 seconds
    // This ensures that newly shared delights will appear
    const refreshInterval = setInterval(() => {
      if (activeTab === 'delight') { // Only refresh when the delights tab is active
        setLastRefresh(Date.now());
      }
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [practices, lastRefresh, activeTab]);
  
  // Refresh the delights tab when it becomes active
  useEffect(() => {
    if (activeTab === 'delight') {
      setLastRefresh(Date.now());
    }
  }, [activeTab]);

  // Helper function to get streak icon based on count
  const getStreakIcon = (streakCount: number) => {
    if (streakCount >= 21) return StreakGreaterThan21;
    if (streakCount >= 10) return StreakGreaterThan10;
    return StreakLesserThan10;
  };

  // Handler for adding a tip or story
  function handleTipsStoriesSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formContent.trim() || !user) return;
    
    setPosts([
      {
        id: Date.now(),
        type: formType,
        author: user.email?.split('@')[0] || "Anonymous",
        content: formContent,
        createdAt: new Date().toISOString(),
        upvotes: 0,
        threadComments: [],
      },
      ...posts,
    ]);
    setFormContent("");
    toast({ 
      title: "Success", 
      description: `Your ${formType} has been shared with the community!`
    });
  }

  // Handler for upvoting a tip/story
  function handleUpvote(postId: number) {
    setPosts(posts => posts.map(post =>
      post.id === postId ? { ...post, upvotes: (post.upvotes || 0) + 1 } : post
    ));
  }

  // Handler for adding a thread comment
  function handleAddThreadComment(postId: number) {
    if (!threadComment.trim() || !user) return;
    
    setPosts(posts => posts.map(post =>
      post.id === postId ? {
        ...post,
        threadComments: [
          ...(post.threadComments || []),
          { 
            author: user.email?.split('@')[0] || "Anonymous", 
            text: threadComment, 
            createdAt: new Date().toISOString() 
          }
        ]
      } : post
    ));
    
    setThreadComment("");
    setActiveThread(null);
  }

  // Handler for adding a practice to user's list
  function handleAddPracticeToList(post: CommunityPost) {
    if (!post.practiceId) return;
    
    const originalPractice = practices.find(p => p.id === post.practiceId);
    if (!originalPractice) return;
    
    addPractice({
      ...originalPractice,
      isDaily: true,
      userCreated: false
    });
    
    toast({
      title: "Practice Added",
      description: `${post.title || 'Practice'} has been added to your daily practices!`,
      variant: "success"
    });
  }

  // Tab definitions
  const tabs = [
    { id: "practice", label: "User Practices", color: "#148BAF", icon: <BookOpen className="w-4 h-4 mr-1" /> },
    { id: "delight", label: "Delights", color: "#E6A514", icon: <Smile className="w-4 h-4 mr-1" /> },
    { id: "tipsStories", label: "Tips & Stories", color: "#7B61FF", icon: <Lightbulb className="w-4 h-4 mr-1" /> },
  ];

  // Filtered posts for each tab
  const practicePosts = filteredPosts.filter(p => p.type === 'practice');
  const tipsStoriesPosts = filteredPosts.filter(p => p.type === 'tip' || p.type === 'story');

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-4 md:p-6 items-center w-full min-h-screen bg-gradient-to-br from-[#F7FFFF] via-[#E6F9FA] to-[#F7F7FF] overflow-x-hidden">
      {/* Add the CSS styles */}
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      {/* Enhanced header with mobile-optimized spacing */}
      <div 
        className="text-center text-[#148BAF] text-2xl sm:text-3xl md:text-4xl font-happy-monkey lowercase w-full mb-3 sm:mb-4 tracking-wide px-4"
        style={{ 
          animation: 'fadeIn 0.5s ease-out 0.1s both',
          textShadow: '0px 2px 4px rgba(4, 196, 213, 0.2)'
        }}
      >
        community
      </div>
      
      <div className="max-w-6xl w-full mx-auto flex flex-col gap-4 sm:gap-6 px-2 sm:px-4">
        {/* Filter controls */}
        {renderFilterControls()}
        
        {/* Enhanced tab navigation with improved mobile experience */}
        <div 
          className="flex justify-center mb-3 sm:mb-4 overflow-x-auto py-3 no-scrollbar" 
          style={{ animation: 'fadeIn 0.5s ease-out 0.2s both' }}
        >
          <div className="flex gap-2 sm:gap-3 px-4 sm:px-2 min-w-max">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 sm:px-5 py-3 sm:py-2.5 rounded-full text-sm sm:text-base whitespace-nowrap transition-all font-happy-monkey lowercase flex-shrink-0 touch-button focus-mobile ${
                    isActive 
                      ? `text-white shadow-lg transform` 
                      : `border border-[rgba(4,196,213,0.3)] hover:bg-[rgba(4,196,213,0.1)] active:bg-[rgba(4,196,213,0.15)]`
                  }`}
                  style={{ 
                    boxShadow: isActive ? '0 4px 12px rgba(4, 196, 213, 0.3)' : 'none',
                    minWidth: '120px',
                    minHeight: '48px',
                    background: isActive ? `linear-gradient(135deg, ${tab.color}, ${tab.color}dd)` : undefined,
                    color: !isActive ? tab.color : undefined,
                    transform: isActive ? 'translateY(-1px)' : 'translateY(0)'
                  }}
                >
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 flex-shrink-0">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden text-sm font-medium">
                      {tab.id === 'practice' ? 'Practices' : 
                       tab.id === 'delight' ? 'Delights' : 'Tips'}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="max-w-5xl w-full mx-auto px-1 sm:px-2">
          {/* Tab Content with enhanced mobile layouts */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Practices Tab - Enhanced for mobile */}
            {activeTab === 'practice' && (
              <div>
                <div className="text-lg sm:text-xl text-[#148BAF] font-happy-monkey mb-4 sm:mb-6 flex items-center px-2 sm:px-1">
                  <BookOpen className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <span className="line-clamp-1">Community Shared Practices</span>
                </div>
                
                {practicePosts.length === 0 ? (
                  <div 
                    className="text-center bg-white p-6 sm:p-8 md:p-12 rounded-[20px] border border-[rgba(4,196,213,0.3)] shadow-lg mx-2 sm:mx-0"
                    style={{ 
                      animation: 'fadeIn 0.5s ease-out 0.3s both',
                      boxShadow: '0 4px 20px rgba(4, 196, 213, 0.1)'
                    }}
                  >
                    <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-[rgba(4,196,213,0.3)] mx-auto mb-3 sm:mb-4" />
                    <div className="text-[#148BAF] font-happy-monkey text-lg sm:text-xl mb-2 sm:mb-3">No practices shared yet</div>
                    <p className="text-black font-happy-monkey text-sm sm:text-base leading-relaxed">Create and share your own practices from the Practices page!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 px-2 sm:px-0">
                    {practicePosts.map((post, idx) => {
                      const originalPractice = post.practiceId ? 
                        practices.find(p => p.id === post.practiceId) : null;
                        
                      // Define style variables similar to Learn page
                      const shadowColor = "rgba(4, 196, 213, 0.2)";
                      const borderColor = "rgba(4,196,213,0.1)";
                        
                      return (
                        <div 
                          key={post.id}
                          className="bg-white rounded-[20px] p-4 sm:p-5 md:p-6 relative card-hover border touch-button"
                          style={{
                            animation: `fadeIn 0.5s ease-out ${Math.min(idx * 0.05, 1)}s both`,
                            boxShadow: `0 4px 20px ${shadowColor}, 0 1px 3px rgba(0,0,0,0.05)`,
                            borderColor: borderColor,
                            minHeight: '280px'
                          }}
                        >
                          {/* Enhanced practice header for mobile */}
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-5 gap-3 sm:gap-4">
                            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
                              {originalPractice?.icon && (
                                <div className="flex-shrink-0 mt-1">
                                  <span 
                                    className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-sm" 
                                    style={{
                                      background: `linear-gradient(135deg, rgba(4, 196, 213, 0.15), ${shadowColor} 120%)`,
                                      boxShadow: `0 2px 8px ${shadowColor}`
                                    }}
                                  >
                                    <span className="text-[#148BAF] text-xl sm:text-2xl">
                                      {originalPractice.icon === 'shower' && '🚿'}
                                      {originalPractice.icon === 'sun' && '☀️'}
                                      {originalPractice.icon === 'moleskine' && '📓'}
                                      {originalPractice.icon === 'smelling' && '👃'}
                                      {originalPractice.icon === 'sparkles' && '✨'}
                                      {originalPractice.icon === 'brain' && '🧠'} 
                                      {originalPractice.icon === 'anchor' && '⚓'}
                                    </span>
                                  </span>
                                </div>
                              )}
                              <div className="flex-grow min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#148BAF] font-happy-monkey lowercase line-clamp-2 flex-1">
                                    {post.title}
                                  </h3>
                                </div>
                                <p className="text-black text-sm sm:text-base font-happy-monkey line-clamp-3 leading-relaxed">
                                  {post.content.length > 80 ? `${post.content.substring(0, 80)}...` : post.content}
                                </p>
                              </div>
                            </div>
                            
                            {/* Enhanced streak badge for mobile */}
                            {originalPractice?.streak !== undefined && (
                              <div 
                                className="flex items-center space-x-2 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm flex-shrink-0 self-start sm:self-auto" 
                                style={{ 
                                  background: "linear-gradient(135deg, rgba(4, 196, 213, 0.1), rgba(4, 196, 213, 0.2))",
                                  border: "1px solid rgba(4, 196, 213, 0.3)",
                                  minHeight: '40px'
                                }}
                              >
                                <img 
                                  src={getStreakIcon(originalPractice.streak || 0)} 
                                  alt="streak" 
                                  className="h-5 w-5 sm:h-6 sm:w-6" 
                                />
                                <span className="text-[#148BAF] font-happy-monkey font-bold text-sm sm:text-base">
                                  {originalPractice.streak || 0}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Enhanced benefits tags for mobile */}
                          {originalPractice?.benefits && originalPractice.benefits.length > 0 && (
                            <div className="mb-4 flex flex-wrap gap-2">
                              {originalPractice.benefits.slice(0, 2).map((benefit, index) => (
                                <span 
                                  key={index} 
                                  className="bg-[rgba(4,196,213,0.15)] text-[#148BAF] text-xs sm:text-sm px-3 py-2 rounded-full font-happy-monkey whitespace-nowrap"
                                >
                                  {benefit}
                                </span>
                              ))}
                              {originalPractice.benefits.length > 2 && (
                                <span className="text-[#148BAF] text-xs sm:text-sm font-happy-monkey">
                                  +{originalPractice.benefits.length - 2} more
                                </span>
                              )}
                            </div>
                          )}
                          
                          {/* Enhanced action button for mobile */}
                          <div className="flex justify-end mt-4 sm:mt-6">
                            <button
                              onClick={() => handleAddPracticeToList(post)}
                              className="text-white text-sm sm:text-base font-happy-monkey lowercase font-medium flex items-center gap-2 px-4 sm:px-5 py-3 bg-gradient-to-r from-[#04C4D5] to-[#148BAF] rounded-full hover:shadow-lg transition-all hover:translate-y-[-2px] active:translate-y-0 touch-button focus-mobile"
                              style={{ minHeight: '48px' }}
                            >
                              <span className="hidden xs:inline">add to my practices</span>
                              <span className="xs:hidden">add practice</span>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                          
                          {/* Enhanced author info for mobile */}
                          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[rgba(20,139,175,0.08)] flex items-center justify-center font-bold text-[#148BAF] font-happy-monkey text-sm flex-shrink-0">
                              {post.author ? post.author[0].toUpperCase() : <User className="w-4 h-4" />}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500 font-happy-monkey lowercase truncate flex-1">
                              {post.author || "anonymous"}
                            </span>
                            <span className="text-xs text-gray-400 flex-shrink-0">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* Enhanced Delights Tab for mobile */}
            {activeTab === 'delight' && (
              <div>
                <div className="text-lg sm:text-xl text-[#E6A514] font-happy-monkey mb-4 sm:mb-6 flex items-center px-2 sm:px-1">
                  <Smile className="mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <span className="line-clamp-1">Community Shared Delights</span>
                </div>
                
                {/* Enhanced refresh button for mobile */}
                <div className="flex justify-center mb-4 sm:mb-6 px-2 sm:px-0">
                  <button 
                    onClick={() => setLastRefresh(Date.now())}
                    className="bg-[rgba(230,165,20,0.1)] hover:bg-[rgba(230,165,20,0.2)] active:bg-[rgba(230,165,20,0.25)] text-[#E6A514] font-happy-monkey py-3 px-4 sm:px-5 rounded-full text-sm sm:text-base flex items-center gap-2 sm:gap-3 transition-all touch-button focus-mobile mobile-bounce"
                    style={{ minHeight: '48px' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="sm:w-5 sm:h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.38-5.5M22 12.5a10 10 0 0 1-18.38 5.5"/>
                    </svg>
                    <span>Refresh Delights</span>
                  </button>
                </div>
                
                {filteredDelights.length === 0 ? (
                  <div 
                    className="text-center bg-white p-6 sm:p-8 md:p-12 rounded-[20px] border border-[rgba(230,165,20,0.3)] shadow-lg mx-2 sm:mx-0"
                    style={{ 
                      animation: 'fadeIn 0.5s ease-out 0.3s both',
                      boxShadow: '0 4px 20px rgba(230, 165, 20, 0.1)'
                    }}
                  >
                    <Smile className="w-12 h-12 sm:w-16 sm:h-16 text-[rgba(230,165,20,0.3)] mx-auto mb-3 sm:mb-4" />
                    <div className="text-[#E6A514] font-happy-monkey text-lg sm:text-xl mb-2 sm:mb-3">No delights shared yet</div>
                    <p className="text-black font-happy-monkey text-sm sm:text-base leading-relaxed">Right-click on a delight on your homepage to share it with the community!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 px-2 sm:px-0">
                    {filteredDelights.map((delight, idx) => {
                      // Define style variables similar to Learn page but with delight colors
                      const shadowColor = "rgba(230, 165, 20, 0.2)";
                      const borderColor = "rgba(230, 165, 20, 0.15)";
                      
                      return (
                        <div 
                          key={delight.id} 
                          className="bg-white rounded-[20px] p-4 sm:p-5 md:p-6 relative card-hover border touch-button"
                          style={{
                            animation: `fadeIn 0.5s ease-out ${Math.min(idx * 0.05, 1)}s both`,
                            boxShadow: `0 4px 20px ${shadowColor}, 0 1px 3px rgba(0,0,0,0.05)`,
                            borderColor: borderColor,
                            minHeight: '200px'
                          }}
                        >
                          {/* Enhanced delight header for mobile */}
                          <div className="flex justify-between items-start mb-4 sm:mb-5">
                            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                              <div className="flex-shrink-0 mt-1">
                                <span 
                                  className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-sm" 
                                  style={{
                                    background: `linear-gradient(135deg, rgba(230, 165, 20, 0.15), ${shadowColor} 120%)`,
                                    boxShadow: `0 2px 8px ${shadowColor}`
                                  }}
                                >
                                  <Smile size={24} className="text-[#E6A514] sm:w-7 sm:h-7" />
                                </span>
                              </div>
                              
                              <div className="flex-grow min-w-0">
                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#E6A514] font-happy-monkey lowercase mb-2 sm:mb-3">
                                  Delight
                                </h3>
                                <p className="text-black text-sm sm:text-base font-happy-monkey whitespace-pre-line leading-relaxed line-clamp-3">
                                  {delight.text}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Enhanced interactive elements for mobile */}
                          <div className="flex justify-end mt-4 sm:mt-6">
                            <button
                              className="text-white text-sm sm:text-base font-happy-monkey lowercase font-medium flex items-center gap-2 px-4 sm:px-5 py-3 bg-gradient-to-r from-[#E6A514] to-[#E67D14] rounded-full hover:shadow-lg transition-all hover:translate-y-[-2px] active:translate-y-0 touch-button focus-mobile"
                              style={{ minHeight: '48px' }}
                            >
                              <Heart size={16} className="flex-shrink-0" />
                              <span className="hidden xs:inline">cheer this</span>
                              <span className="xs:hidden">cheer</span>
                            </button>
                          </div>
                          
                          {/* Enhanced author info for mobile */}
                          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-gray-100">
                            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[rgba(230,165,20,0.08)] flex items-center justify-center font-bold text-[#E6A514] font-happy-monkey text-sm flex-shrink-0">
                              {delight.username ? delight.username[0].toUpperCase() : <User className="w-4 h-4" />}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500 font-happy-monkey lowercase truncate flex-1">
                              {delight.username || "anonymous"}
                            </span>
                            <span className="text-xs text-gray-400 flex-shrink-0">
                              {new Date(delight.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* Enhanced Tips & Stories Tab for mobile */}
            {activeTab === 'tipsStories' && (
              <div>
                {user ? (
                  <form 
                    onSubmit={handleTipsStoriesSubmit} 
                    className="bg-white rounded-[20px] p-4 sm:p-5 md:p-6 flex flex-col gap-4 sm:gap-5 border border-[rgba(123,97,255,0.3)] mb-6 sm:mb-8 shadow-lg mx-2 sm:mx-0"
                    style={{ 
                      animation: 'fadeIn 0.5s ease-out 0.2s both',
                      boxShadow: '0 4px 20px rgba(123, 97, 255, 0.1)'
                    }}
                  >
                    <div className="text-lg sm:text-xl md:text-2xl text-[#7B61FF] font-happy-monkey mb-2 sm:mb-3 flex items-center gap-2 sm:gap-3">
                      <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                      <span className="line-clamp-1">Share Your Insights</span>
                    </div>
                    
                    {/* Enhanced type selection for mobile */}
                    <div 
                      className="flex gap-2 sm:gap-3 mb-3 sm:mb-4"
                      style={{ animation: 'fadeIn 0.5s ease-out 0.3s both' }}
                    >
                      <button
                        type="button"
                        onClick={() => setFormType("tip")}
                        className={`flex-1 sm:flex-initial px-4 sm:px-5 py-3 sm:py-2.5 rounded-full font-happy-monkey text-sm sm:text-base transition-all shadow-sm touch-button focus-mobile ${
                          formType === "tip" 
                            ? "bg-gradient-to-r from-[#7B61FF] to-[#B39DFF] text-white" 
                            : "bg-[#F7F7FF] text-[#7B61FF] border border-[#7B61FF] hover:bg-[rgba(123,97,255,0.05)]"
                        }`}
                        style={{ minHeight: '48px' }}
                      >
                        <Lightbulb className="inline-block w-4 h-4 mr-1.5 flex-shrink-0" />
                        <span>Tip</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setFormType("story")}
                        className={`flex-1 sm:flex-initial px-4 sm:px-5 py-3 sm:py-2.5 rounded-full font-happy-monkey text-sm sm:text-base transition-all shadow-sm touch-button focus-mobile ${
                          formType === "story" 
                            ? "bg-gradient-to-r from-[#7B61FF] to-[#B39DFF] text-white" 
                            : "bg-[#F7F7FF] text-[#7B61FF] border border-[#7B61FF] hover:bg-[rgba(123,97,255,0.05)]"
                        }`}
                        style={{ minHeight: '48px' }}
                      >
                        <MessageCircle className="inline-block w-4 h-4 mr-1.5 flex-shrink-0" />
                        <span>Story</span>
                      </button>
                    </div>
                    
                    {/* Enhanced textarea for mobile */}
                    <textarea
                      placeholder={formType === "tip" ? "Share a helpful tip with the community..." : "Share your wellbeing story..."}
                      value={formContent}
                      onChange={e => setFormContent(e.target.value)}
                      className="border border-[#7B61FF] rounded-xl px-4 py-3 sm:px-5 sm:py-4 text-[#7B61FF] font-happy-monkey lowercase bg-white focus:ring-2 focus:ring-[#7B61FF] focus:outline-none min-h-[120px] sm:min-h-[140px] shadow-inner resize-none text-sm sm:text-base focus-mobile"
                      required
                      style={{ animation: 'fadeIn 0.5s ease-out 0.4s both' }}
                    />
                    
                    {/* Enhanced submit button for mobile */}
                    <button 
                      type="submit"
                      className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#7B61FF] to-[#B39DFF] text-white rounded-full font-happy-monkey lowercase shadow-lg hover:shadow-xl hover:translate-y-[-2px] active:translate-y-0 transition-all text-sm sm:text-base touch-button focus-mobile"
                      style={{ 
                        animation: 'fadeIn 0.5s ease-out 0.5s both',
                        minHeight: '52px'
                      }}
                    >
                      <span className="hidden xs:inline">share with community</span>
                      <span className="xs:hidden">share</span>
                    </button>
                  </form>
                ) : (
                  <div 
                    className="bg-white rounded-[20px] p-6 sm:p-8 md:p-12 mb-6 sm:mb-8 text-center border border-[rgba(123,97,255,0.3)] shadow-lg mx-2 sm:mx-0"
                    style={{ 
                      animation: 'fadeIn 0.5s ease-out 0.3s both',
                      boxShadow: '0 4px 20px rgba(123, 97, 255, 0.1)'
                    }}
                  >
                    <Lightbulb className="h-12 w-12 sm:h-16 sm:w-16 text-[#7B61FF] mx-auto mb-3 sm:mb-4 opacity-60" />
                    <p className="text-[#7B61FF] font-happy-monkey text-lg sm:text-xl lowercase mb-2 sm:mb-3">Login to share your tips and stories</p>
                    <p className="text-black font-happy-monkey text-sm sm:text-base">Join our community to contribute your insights!</p>
                  </div>
                )}
                
                {/* Enhanced tips & stories list for mobile */}
                {tipsStoriesPosts.length === 0 ? (
                  <div 
                    className="text-center bg-white p-6 sm:p-8 md:p-12 rounded-[20px] border border-[rgba(123,97,255,0.3)] shadow-lg mx-2 sm:mx-0"
                    style={{ 
                      animation: 'fadeIn 0.5s ease-out 0.3s both',
                      boxShadow: '0 4px 20px rgba(123, 97, 255, 0.1)'
                    }}
                  >
                    <Lightbulb className="w-12 h-12 sm:w-16 sm:h-16 text-[rgba(123,97,255,0.3)] mx-auto mb-3 sm:mb-4" />
                    <div className="text-[#7B61FF] font-happy-monkey text-lg sm:text-xl mb-2">No tips or stories shared yet</div>
                    <p className="text-black font-happy-monkey text-sm sm:text-base">Be the first to share!</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 sm:gap-6 px-2 sm:px-0">
                    {tipsStoriesPosts.map((post, idx) => {
                      // Define style variables similar to Learn page but with purple colors
                      const shadowColor = "rgba(123, 97, 255, 0.2)";
                      const borderColor = "rgba(123, 97, 255, 0.15)";
                      
                      return (
                        <div 
                          key={post.id} 
                          className="bg-white rounded-[20px] p-4 sm:p-5 md:p-6 relative card-hover border"
                          style={{
                            animation: `fadeIn 0.5s ease-out ${Math.min(idx * 0.05, 1)}s both`,
                            boxShadow: `0 4px 20px ${shadowColor}, 0 1px 3px rgba(0,0,0,0.05)`,
                            borderColor: borderColor
                          }}
                        >
                          {/* Enhanced header with type icon for mobile */}
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-4 sm:mb-5 gap-3 sm:gap-4">
                            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0 w-full sm:w-auto">
                              <div className="flex-shrink-0 mt-1">
                                <span 
                                  className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-sm" 
                                  style={{
                                    background: `linear-gradient(135deg, rgba(123, 97, 255, 0.15), ${shadowColor} 120%)`,
                                    boxShadow: `0 2px 8px ${shadowColor}`
                                  }}
                                >
                                  {post.type === 'tip' ? 
                                    <Lightbulb size={24} className="text-[#7B61FF] sm:w-7 sm:h-7" /> : 
                                    <MessageCircle size={24} className="text-[#7B61FF] sm:w-7 sm:h-7" />
                                  }
                                </span>
                              </div>
                              
                              <div className="flex-grow min-w-0">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2 sm:mb-3">
                                  <span className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-happy-monkey lowercase font-medium bg-[rgba(123,97,255,0.08)] text-[#7B61FF] flex-shrink-0">
                                    {typeLabels[post.type]}
                                  </span>
                                  <span className="text-xs sm:text-sm text-gray-400">
                                    {new Date(post.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                  </span>
                                </div>
                                <p className="text-black text-sm sm:text-base font-happy-monkey whitespace-pre-line mt-2 leading-relaxed">
                                  {post.content}
                                </p>
                              </div>
                            </div>
                            
                            {/* Enhanced upvote count badge for mobile */}
                            <div 
                              className="flex items-center gap-2 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm flex-shrink-0 self-start sm:self-auto" 
                              style={{ 
                                background: "linear-gradient(135deg, rgba(123, 97, 255, 0.1), rgba(123, 97, 255, 0.2))",
                                border: "1px solid rgba(123, 97, 255, 0.3)",
                                minHeight: '40px'
                              }}
                            >
                              <ThumbsUp size={16} className="text-[#7B61FF] flex-shrink-0" />
                              <span className="text-[#7B61FF] font-happy-monkey font-bold text-sm sm:text-base">
                                {post.upvotes || 0}
                              </span>
                            </div>
                          </div>
                          
                          {/* Enhanced action buttons for mobile */}
                          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6">
                            <button 
                              onClick={() => handleUpvote(post.id)} 
                              className="text-white text-sm sm:text-base font-happy-monkey lowercase font-medium flex items-center justify-center gap-2 px-4 sm:px-5 py-3 bg-gradient-to-r from-[#7B61FF] to-[#B39DFF] rounded-full hover:shadow-lg transition-all hover:translate-y-[-2px] active:translate-y-0 touch-button focus-mobile flex-1 sm:flex-initial"
                              style={{ minHeight: '48px' }}
                            >
                              <ThumbsUp size={16} className="flex-shrink-0" />
                              <span>upvote</span>
                            </button>
                            <button 
                              onClick={() => setActiveThread(post.id)}
                              className="bg-white hover:bg-[rgba(123,97,255,0.05)] active:bg-[rgba(123,97,255,0.1)] text-[#7B61FF] border border-[#7B61FF] text-sm sm:text-base font-happy-monkey lowercase font-medium flex items-center justify-center gap-2 px-4 sm:px-5 py-3 rounded-full hover:shadow-sm transition-all touch-button focus-mobile flex-1 sm:flex-initial"
                              style={{ minHeight: '48px' }}
                            >
                              <MessageCircle size={16} className="flex-shrink-0" />
                              <span>comment</span>
                            </button>
                          </div>
                          
                          {/* Enhanced thread comments for mobile */}
                          {post.threadComments && post.threadComments.length > 0 && (
                            <div 
                              className="mt-4 sm:mt-5 rounded-xl p-3 sm:p-4"
                              style={{ 
                                backgroundColor: 'rgba(123, 97, 255, 0.05)',
                                border: '1px solid rgba(123, 97, 255, 0.1)'
                              }}
                            >
                              <div className="font-happy-monkey text-sm sm:text-base text-[#7B61FF] mb-2 sm:mb-3">Comments:</div>
                              <div className="space-y-2 sm:space-y-3">
                                {post.threadComments.map((c, idx) => (
                                  <div key={idx} className="bg-white p-3 sm:p-4 rounded-lg shadow-sm">
                                    <p className="text-sm sm:text-base text-black font-happy-monkey leading-relaxed">{c.text}</p>
                                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                                      <span className="text-xs sm:text-sm text-[#7B61FF] font-happy-monkey">{c.author}</span>
                                      <span className="text-xs text-gray-400">
                                        {new Date(c.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Enhanced add thread comment for mobile */}
                          {activeThread === post.id && user && (
                            <div 
                              className="mt-4 sm:mt-5 flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl"
                              style={{ 
                                backgroundColor: 'rgba(123, 97, 255, 0.03)',
                                border: '1px solid rgba(123, 97, 255, 0.1)'
                              }}
                            >
                              <input
                                type="text"
                                placeholder="Add your comment..."
                                value={threadComment}
                                onChange={e => setThreadComment(e.target.value)}
                                className="border border-[#7B61FF] rounded-lg px-3 sm:px-4 py-3 sm:py-3.5 text-[#7B61FF] font-happy-monkey lowercase bg-white focus:ring-2 focus:ring-[#7B61FF] focus:outline-none shadow-inner text-sm sm:text-base focus-mobile"
                                style={{ minHeight: '48px' }}
                              />
                              <div className="flex justify-end">
                                <button 
                                  onClick={() => handleAddThreadComment(post.id)}
                                  className="text-white text-sm sm:text-base font-happy-monkey lowercase font-medium flex items-center gap-2 px-4 sm:px-5 py-3 bg-gradient-to-r from-[#7B61FF] to-[#B39DFF] rounded-full hover:shadow-lg transition-all hover:translate-y-[-2px] active:translate-y-0 touch-button focus-mobile"
                                  style={{ minHeight: '48px' }}
                                >
                                  <span className="hidden xs:inline">post comment</span>
                                  <span className="xs:hidden">post</span>
                                </button>
                              </div>
                            </div>
                          )}
                          
                          {/* Enhanced author info for mobile */}
                          <div className="flex items-center gap-3 mt-4 sm:mt-5 pt-3 border-t border-[rgba(123,97,255,0.1)]">
                            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[rgba(123,97,255,0.08)] flex items-center justify-center font-bold text-[#7B61FF] font-happy-monkey text-sm flex-shrink-0">
                              {post.author ? post.author[0].toUpperCase() : <User className="w-4 h-4" />}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500 font-happy-monkey lowercase truncate flex-1">
                              {post.author ? `by ${post.author}` : "anonymous"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* People Section */}
          {showPeopleSection && renderPeopleSection()}
        </div>
      </div>
    </div>
  );
}
