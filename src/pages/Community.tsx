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

// CSS animation keyframes - inspired by Learn page
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

.card-hover {
  transition: all 0.3s ease-out;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(4, 196, 213, 0.15);
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out forwards;
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
      <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-white rounded-lg shadow animate-slide-down w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 sm:gap-0">
          <h2 className="text-lg sm:text-xl font-happy-monkey lowercase text-[#148BAF]">People to Follow</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={togglePeopleSection}
            className="text-xs sm:text-sm"
          >
            Hide
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
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
          <p className="text-center text-gray-500 my-4 text-sm">No suggested users available at this time.</p>
        )}
      </div>
    );
  };

  // Add a filter control at the top of the page
  const renderFilterControls = () => {
    return (
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0 w-full">
        <div className="flex items-center gap-2">
          <Button
            variant={showFollowingOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFollowingOnly(!showFollowingOnly)}
            className="flex items-center gap-1 text-xs sm:text-sm"
          >
            {showFollowingOnly ? (
              <>
                <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" /> Following Only
              </>
            ) : (
              <>
                <Filter className="w-3 h-3 sm:w-4 sm:h-4" /> All Posts
              </>
            )}
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={togglePeopleSection}
          className="flex items-center gap-1 text-xs sm:text-sm"
        >
          <User className="w-3 h-3 sm:w-4 sm:h-4" />
          {showPeopleSection ? 'Hide People' : 'Discover People'}
        </Button>
      </div>
    );
  };

  // Add the new components to your existing render functions
  // at the top of the component render
  const communityEnhancements = (
    <>
      {renderFilterControls()}
      {renderPeopleSection()}
    </>
  );

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
    <div className="flex flex-col gap-4 sm:gap-6 p-2 sm:p-4 md:p-5 items-center w-full min-h-screen bg-gradient-to-br from-[#F7FFFF] via-[#E6F9FA] to-[#F7F7FF]">
      {/* Add the CSS styles */}
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      {/* Header with animation */}
      <div 
        className="text-center text-[#148BAF] text-2xl sm:text-3xl font-happy-monkey lowercase w-full mb-2 tracking-wide"
        style={{ 
          animation: 'fadeIn 0.5s ease-out 0.1s both',
          textShadow: '0px 2px 4px rgba(4, 196, 213, 0.2)'
        }}
      >
        community
      </div>
      
      <div className="max-w-5xl w-full mx-auto flex flex-col gap-6">
        {communityEnhancements}
        
        {/* Tab navigation, improved with rounded pill design */}
        <div 
          className="flex justify-center mb-2 overflow-x-auto py-2 no-scrollbar" 
          style={{ animation: 'fadeIn 0.5s ease-out 0.2s both' }}
        >
          <div className="flex gap-1 sm:gap-2 px-2">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all font-happy-monkey lowercase flex-shrink-0 ${
                    isActive 
                      ? `text-white shadow-sm` 
                      : `border border-[rgba(4,196,213,0.3)] hover:bg-[rgba(4,196,213,0.1)]`
                  }`}
                  style={{ 
                    boxShadow: isActive ? '0 3px 8px rgba(4, 196, 213, 0.2)' : 'none',
                    minWidth: '120px',
                    background: isActive ? `linear-gradient(to right, ${tab.color}, ${tab.color})` : undefined,
                    color: !isActive ? tab.color : undefined,
                  }}
                >
                  <span className="flex items-center justify-center gap-1 sm:gap-2">
                    <span className="w-3 h-3 sm:w-4 sm:h-4">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden text-xs">
                      {tab.id === 'practice' ? 'Practices' : 
                       tab.id === 'delight' ? 'Delights' : 'Tips'}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="max-w-4xl w-full mx-auto px-2 sm:px-0">
          {/* Tab Content */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Practices Tab */}
            {activeTab === 'practice' && (
              <div>
                <div className="text-base sm:text-lg text-[#148BAF] font-happy-monkey mb-3 sm:mb-4 flex items-center px-1">
                  <BookOpen className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  Community Shared Practices
                </div>
                
                {practicePosts.length === 0 ? (
                  <div 
                    className="text-center bg-white p-6 sm:p-10 rounded-[20px] border border-[rgba(4,196,213,0.3)] shadow-md"
                    style={{ animation: 'fadeIn 0.5s ease-out 0.3s both' }}
                  >
                    <div className="text-[#148BAF] font-happy-monkey text-base sm:text-lg mb-2">No practices shared yet</div>
                    <p className="text-black font-happy-monkey text-sm">Create and share your own practices from the Practices page!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                    {practicePosts.map((post, idx) => {
                      const originalPractice = post.practiceId ? 
                        practices.find(p => p.id === post.practiceId) : null;
                        
                      // Define style variables similar to Learn page
                      const shadowColor = "rgba(4, 196, 213, 0.2)";
                      const borderColor = "rgba(4,196,213,0.1)";
                        
                      return (
                        <div 
                          key={post.id}
                          className="bg-white rounded-[20px] p-4 sm:p-5 relative card-hover border"
                          style={{
                            animation: `fadeIn 0.5s ease-out ${Math.min(idx * 0.05, 1)}s both`,
                            boxShadow: `0 4px 20px ${shadowColor}, 0 1px 3px rgba(0,0,0,0.05)`,
                            borderColor: borderColor
                          }}
                        >
                          {/* Practice Header - Enhanced design similar to Learn page */}
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-3 sm:mb-4 gap-2">
                            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                              {originalPractice?.icon && (
                                <div className="flex-shrink-0 mt-1">
                                  <span 
                                    className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-full shadow-sm" 
                                    style={{
                                      background: `linear-gradient(135deg, rgba(4, 196, 213, 0.15), ${shadowColor} 120%)`,
                                      boxShadow: `0 2px 8px ${shadowColor}`
                                    }}
                                  >
                                    <span className="text-[#148BAF] text-lg sm:text-xl">
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
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg sm:text-2xl font-bold text-[#148BAF] font-happy-monkey lowercase truncate">
                                    {post.title}
                                  </h3>
                                </div>
                                <p className="text-black text-xs sm:text-sm font-happy-monkey line-clamp-3">
                                  {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                                </p>
                              </div>
                            </div>
                            
                            {originalPractice?.streak !== undefined && (
                              <div 
                                className="flex items-center space-x-1 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 shadow-sm flex-shrink-0" 
                                style={{ 
                                  background: "linear-gradient(135deg, rgba(4, 196, 213, 0.1), rgba(4, 196, 213, 0.2))",
                                  border: "1px solid rgba(4, 196, 213, 0.3)" 
                                }}
                              >
                                <img 
                                  src={getStreakIcon(originalPractice.streak || 0)} 
                                  alt="streak" 
                                  className="h-4 w-4 sm:h-5 sm:w-5" 
                                />
                                <span className="text-[#148BAF] font-happy-monkey font-bold text-sm">
                                  {originalPractice.streak || 0}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Benefits tags */}
                          {originalPractice?.benefits && originalPractice.benefits.length > 0 && (
                            <div className="mb-4 flex flex-wrap gap-2">
                              {originalPractice.benefits.slice(0, 2).map((benefit, index) => (
                                <span 
                                  key={index} 
                                  className="bg-[rgba(4,196,213,0.15)] text-[#148BAF] text-xs px-3 py-1.5 rounded-full font-happy-monkey"
                                >
                                  {benefit}
                                </span>
                              ))}
                              {originalPractice.benefits.length > 2 && (
                                <span className="text-[#148BAF] text-xs font-happy-monkey">+{originalPractice.benefits.length - 2} more</span>
                              )}
                            </div>
                          )}
                          
                          {/* Source tag */}
                          {originalPractice?.source && (
                            <div className="mb-4">
                              <span 
                                className="text-xs px-3 py-1.5 rounded-md font-happy-monkey font-medium"
                                style={{
                                  backgroundColor: "rgba(4, 196, 213, 0.15)",
                                  color: "#148BAF"
                                }}
                              >
                                Source: {originalPractice.source}
                              </span>
                            </div>
                          )}
                          
                          {/* Steps preview - new added feature */}
                          {post.steps && post.steps.length > 0 && (
                            <div 
                              className="mb-4 p-3 rounded-lg"
                              style={{ 
                                backgroundColor: 'rgba(4, 196, 213, 0.05)',
                                border: '1px solid rgba(4, 196, 213, 0.1)'
                              }}
                            >
                              <p className="text-[#148BAF] font-happy-monkey text-sm mb-2">Practice steps:</p>
                              <ul className="list-disc pl-5 text-black text-sm font-happy-monkey space-y-1">
                                {post.steps.slice(0, 2).map((step, idx) => (
                                  <li key={idx}>{step}</li>
                                ))}
                                {post.steps.length > 2 && (
                                  <li className="text-[#148BAF]">...and {post.steps.length - 2} more</li>
                                )}
                              </ul>
                            </div>
                          )}
                          
                          {/* Action buttons - improved */}
                          <div className="flex justify-end mt-4">
                            <button
                              onClick={() => handleAddPracticeToList(post)}
                              className="text-white text-sm font-happy-monkey lowercase font-medium flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#04C4D5] to-[#148BAF] rounded-full hover:shadow-md transition-all hover:translate-y-[-2px]"
                            >
                              add to my practices
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                          
                          {/* Author info */}
                          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
                            <span className="w-6 h-6 rounded-full bg-[rgba(20,139,175,0.08)] flex items-center justify-center font-bold text-[#148BAF] font-happy-monkey text-xs">
                              {post.author ? post.author[0].toUpperCase() : <User className="w-3 h-3" />}
                            </span>
                            <span className="text-xs text-gray-500 font-happy-monkey lowercase">{post.author || "anonymous"}</span>
                            <span className="text-xs text-gray-400 ml-auto">{new Date(post.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* Delights Tab */}
            {activeTab === 'delight' && (
              <div>
                <div className="text-base sm:text-lg text-[#E6A514] font-happy-monkey mb-3 sm:mb-4 flex items-center px-1">
                  <Smile className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  Community Shared Delights
                </div>
                
                {/* Manual refresh button */}
                <div className="flex justify-center mb-3 sm:mb-4">
                  <button 
                    onClick={() => setLastRefresh(Date.now())}
                    className="bg-[rgba(230,165,20,0.1)] hover:bg-[rgba(230,165,20,0.2)] text-[#E6A514] font-happy-monkey py-2 px-3 sm:px-4 rounded-full text-xs sm:text-sm flex items-center gap-2 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" className="sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.38-5.5M22 12.5a10 10 0 0 1-18.38 5.5"/>
                    </svg>
                    <span>Refresh Delights</span>
                  </button>
                </div>
                
                {filteredDelights.length === 0 ? (
                  <div 
                    className="text-center bg-white p-6 sm:p-10 rounded-[20px] border border-[rgba(230,165,20,0.3)] shadow-md"
                    style={{ animation: 'fadeIn 0.5s ease-out 0.3s both' }}
                  >
                    <div className="text-[#E6A514] font-happy-monkey text-base sm:text-lg mb-2">No delights shared yet</div>
                    <p className="text-black font-happy-monkey text-sm">Right-click on a delight on your homepage to share it with the community!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                    {filteredDelights.map((delight, idx) => {
                      // Define style variables similar to Learn page but with delight colors
                      const shadowColor = "rgba(230, 165, 20, 0.2)";
                      const borderColor = "rgba(230, 165, 20, 0.15)";
                      
                      return (
                        <div 
                          key={delight.id} 
                          className="bg-white rounded-[20px] p-5 relative card-hover border"
                          style={{
                            animation: `fadeIn 0.5s ease-out ${Math.min(idx * 0.05, 1)}s both`,
                            boxShadow: `0 4px 20px ${shadowColor}, 0 1px 3px rgba(0,0,0,0.05)`,
                            borderColor: borderColor
                          }}
                        >
                          {/* Delight Header with Icon */}
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 mt-1">
                                <span 
                                  className="flex items-center justify-center h-12 w-12 rounded-full shadow-sm" 
                                  style={{
                                    background: `linear-gradient(135deg, rgba(230, 165, 20, 0.15), ${shadowColor} 120%)`,
                                    boxShadow: `0 2px 8px ${shadowColor}`
                                  }}
                                >
                                  <Smile size={24} className="text-[#E6A514]" />
                                </span>
                              </div>
                              
                              <div className="flex-grow">
                                <h3 className="text-xl font-bold text-[#E6A514] font-happy-monkey lowercase mb-2">
                                  Delight
                                </h3>
                                <p className="text-black text-sm font-happy-monkey whitespace-pre-line">
                                  {delight.text}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Interactive elements - cheers button */}
                          <div className="flex justify-end mt-4">
                            <button
                              className="text-white text-sm font-happy-monkey lowercase font-medium flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#E6A514] to-[#E67D14] rounded-full hover:shadow-md transition-all hover:translate-y-[-2px]"
                            >
                              <Heart size={14} />
                              cheer this
                            </button>
                          </div>
                          
                          {/* Author info */}
                          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
                            <span className="w-6 h-6 rounded-full bg-[rgba(230,165,20,0.08)] flex items-center justify-center font-bold text-[#E6A514] font-happy-monkey text-xs">
                              {delight.username ? delight.username[0].toUpperCase() : <User className="w-3 h-3" />}
                            </span>
                            <span className="text-xs text-gray-500 font-happy-monkey lowercase">{delight.username || "anonymous"}</span>
                            <span className="text-xs text-gray-400 ml-auto">{new Date(delight.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            
            {/* Tips & Stories Tab */}
            {activeTab === 'tipsStories' && (
              <div>
                {user ? (
                  <form 
                    onSubmit={handleTipsStoriesSubmit} 
                    className="bg-white rounded-[20px] p-6 flex flex-col gap-4 border border-[rgba(123,97,255,0.3)] mb-6 shadow-md"
                    style={{ animation: 'fadeIn 0.5s ease-out 0.2s both' }}
                  >
                    <div className="text-xl text-[#7B61FF] font-happy-monkey mb-3 flex items-center">
                      <Lightbulb className="mr-2" />
                      Share Your Insights
                    </div>
                    
                    <div 
                      className="flex gap-3 mb-3"
                      style={{ animation: 'fadeIn 0.5s ease-out 0.3s both' }}
                    >
                      <button
                        type="button"
                        onClick={() => setFormType("tip")}
                        className={`px-5 py-2.5 rounded-full font-happy-monkey text-sm transition-all shadow-sm ${
                          formType === "tip" 
                            ? "bg-gradient-to-r from-[#7B61FF] to-[#B39DFF] text-white" 
                            : "bg-[#F7F7FF] text-[#7B61FF] border border-[#7B61FF]"
                        }`}
                      >
                        <Lightbulb className="inline-block w-4 h-4 mr-1.5" />
                        Tip
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setFormType("story")}
                        className={`px-5 py-2.5 rounded-full font-happy-monkey text-sm transition-all shadow-sm ${
                          formType === "story" 
                            ? "bg-gradient-to-r from-[#7B61FF] to-[#B39DFF] text-white" 
                            : "bg-[#F7F7FF] text-[#7B61FF] border border-[#7B61FF]"
                        }`}
                      >
                        <MessageCircle className="inline-block w-4 h-4 mr-1.5" />
                        Story
                      </button>
                    </div>
                    
                    <textarea
                      placeholder={formType === "tip" ? "Share a helpful tip with the community..." : "Share your wellbeing story..."}
                      value={formContent}
                      onChange={e => setFormContent(e.target.value)}
                      className="border border-[#7B61FF] rounded-xl px-4 py-3 text-[#7B61FF] font-happy-monkey lowercase bg-white focus:ring-1 focus:ring-[#7B61FF] focus:outline-none min-h-[120px] shadow-inner"
                      required
                      style={{ animation: 'fadeIn 0.5s ease-out 0.4s both' }}
                    />
                    
                    <button 
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-[#7B61FF] to-[#B39DFF] text-white rounded-full font-happy-monkey lowercase shadow-md hover:shadow-lg hover:translate-y-[-2px] transition-all"
                      style={{ animation: 'fadeIn 0.5s ease-out 0.5s both' }}
                    >
                      share with community
                    </button>
                  </form>
                ) : (
                  <div 
                    className="bg-white rounded-[20px] p-8 mb-6 text-center border border-[rgba(123,97,255,0.3)] shadow-md"
                    style={{ animation: 'fadeIn 0.5s ease-out 0.3s both' }}
                  >
                    <Lightbulb className="h-12 w-12 text-[#7B61FF] mx-auto mb-2 opacity-60" />
                    <p className="text-[#7B61FF] font-happy-monkey text-lg lowercase mb-2">Login to share your tips and stories</p>
                    <p className="text-black font-happy-monkey text-sm">Join our community to contribute your insights!</p>
                  </div>
                )}
                
                {tipsStoriesPosts.length === 0 ? (
                  <div 
                    className="text-center bg-white p-10 rounded-[20px] border border-[rgba(123,97,255,0.3)] shadow-md"
                    style={{ animation: 'fadeIn 0.5s ease-out 0.3s both' }}
                  >
                    <div className="text-[#7B61FF] font-happy-monkey text-lg mb-2">No tips or stories shared yet</div>
                    <p className="text-black font-happy-monkey">Be the first to share!</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {tipsStoriesPosts.map((post, idx) => {
                      // Define style variables similar to Learn page but with purple colors
                      const shadowColor = "rgba(123, 97, 255, 0.2)";
                      const borderColor = "rgba(123, 97, 255, 0.15)";
                      
                      return (
                        <div 
                          key={post.id} 
                          className="bg-white rounded-[20px] p-5 relative card-hover border"
                          style={{
                            animation: `fadeIn 0.5s ease-out ${Math.min(idx * 0.05, 1)}s both`,
                            boxShadow: `0 4px 20px ${shadowColor}, 0 1px 3px rgba(0,0,0,0.05)`,
                            borderColor: borderColor
                          }}
                        >
                          {/* Header with type icon */}
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 mt-1">
                                <span 
                                  className="flex items-center justify-center h-12 w-12 rounded-full shadow-sm" 
                                  style={{
                                    background: `linear-gradient(135deg, rgba(123, 97, 255, 0.15), ${shadowColor} 120%)`,
                                    boxShadow: `0 2px 8px ${shadowColor}`
                                  }}
                                >
                                  {post.type === 'tip' ? 
                                    <Lightbulb size={24} className="text-[#7B61FF]" /> : 
                                    <MessageCircle size={24} className="text-[#7B61FF]" />
                                  }
                                </span>
                              </div>
                              
                              <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-3 py-1 rounded-full text-xs font-happy-monkey lowercase font-medium bg-[rgba(123,97,255,0.08)] text-[#7B61FF]">
                                    {typeLabels[post.type]}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {new Date(post.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                  </span>
                                </div>
                                <p className="text-black text-sm font-happy-monkey whitespace-pre-line mt-2">
                                  {post.content}
                                </p>
                              </div>
                            </div>
                            
                            {/* Upvote count badge */}
                            <div 
                              className="flex items-center gap-1 rounded-lg px-3 py-1.5 shadow-sm" 
                              style={{ 
                                background: "linear-gradient(135deg, rgba(123, 97, 255, 0.1), rgba(123, 97, 255, 0.2))",
                                border: "1px solid rgba(123, 97, 255, 0.3)" 
                              }}
                            >
                              <ThumbsUp size={14} className="text-[#7B61FF]" />
                              <span className="text-[#7B61FF] font-happy-monkey font-bold">
                                {post.upvotes || 0}
                              </span>
                            </div>
                          </div>
                          
                          {/* Action buttons */}
                          <div className="flex gap-3 mt-4">
                            <button 
                              onClick={() => handleUpvote(post.id)} 
                              className="text-white text-sm font-happy-monkey lowercase font-medium flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#7B61FF] to-[#B39DFF] rounded-full hover:shadow-md transition-all hover:translate-y-[-2px]"
                            >
                              <ThumbsUp size={14} />
                              upvote
                            </button>
                            <button 
                              onClick={() => setActiveThread(post.id)}
                              className="bg-white hover:bg-[rgba(123,97,255,0.05)] text-[#7B61FF] border border-[#7B61FF] text-sm font-happy-monkey lowercase font-medium flex items-center gap-1.5 px-4 py-2 rounded-full hover:shadow-sm transition-all"
                            >
                              <MessageCircle size={14} />
                              comment
                            </button>
                          </div>
                          
                          {/* Thread Comments */}
                          {post.threadComments && post.threadComments.length > 0 && (
                            <div 
                              className="mt-4 rounded-xl p-3"
                              style={{ 
                                backgroundColor: 'rgba(123, 97, 255, 0.05)',
                                border: '1px solid rgba(123, 97, 255, 0.1)'
                              }}
                            >
                              <div className="font-happy-monkey text-sm text-[#7B61FF] mb-2">Comments:</div>
                              <div className="space-y-2">
                                {post.threadComments.map((c, idx) => (
                                  <div key={idx} className="bg-white p-2 rounded-lg shadow-sm">
                                    <p className="text-sm text-black font-happy-monkey">{c.text}</p>
                                    <div className="flex items-center mt-1">
                                      <span className="text-xs text-[#7B61FF] font-happy-monkey">{c.author}</span>
                                      <span className="text-xs text-gray-400 ml-auto">
                                        {new Date(c.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Add Thread Comment */}
                          {activeThread === post.id && user && (
                            <div 
                              className="mt-4 flex flex-col gap-3 p-3 rounded-xl"
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
                                className="border border-[#7B61FF] rounded-lg px-3 py-2 text-[#7B61FF] font-happy-monkey lowercase bg-white focus:ring-1 focus:ring-[#7B61FF] focus:outline-none shadow-inner"
                              />
                              <div className="flex justify-end">
                                <button 
                                  onClick={() => handleAddThreadComment(post.id)}
                                  className="text-white text-sm font-happy-monkey lowercase font-medium flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#7B61FF] to-[#B39DFF] rounded-full hover:shadow-md transition-all hover:translate-y-[-2px]"
                                >
                                  post comment
                                </button>
                              </div>
                            </div>
                          )}
                          
                          {/* Author info */}
                          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[rgba(123,97,255,0.1)]">
                            <span className="w-7 h-7 rounded-full bg-[rgba(123,97,255,0.08)] flex items-center justify-center font-bold text-[#7B61FF] font-happy-monkey text-xs">
                              {post.author ? post.author[0].toUpperCase() : <User className="w-4 h-4" />}
                            </span>
                            <span className="text-xs text-gray-500 font-happy-monkey lowercase">{post.author ? `by ${post.author}` : "anonymous"}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
