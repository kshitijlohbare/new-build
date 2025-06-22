import { useState, useEffect } from "react";
import { useToast } from '@/hooks/useToast';
import { useAuth } from "@/context/AuthContext";
import "@/styles/SocialFeed.css";
import Frame11 from "@/components/social/Frame11";

interface Post {
  id: number;
  username: string;
  group: string;
  content: string;
  avatar: string;
}

export default function SocialFeed() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [postContent, setPostContent] = useState('');
  
  const handlePostSubmit = () => {
    if (postContent.trim() === '') {
      toast({
        title: 'Error',
        description: 'Please enter some content for your post'
      });
      return;
    }
    
    // In a real app, this would send the post to your backend
    toast({
      title: 'Success',
      description: 'Your post has been shared!'
    });
    
    setPostContent('');
  };
  
  // User posts state
  const [posts] = useState<Post[]>([
    {
      id: 1,
      username: 'random username',
      group: 'morning running group',
      content: 'achieved the sanity level which i craved for years of my life',
      avatar: ''
    },
    {
      id: 2,
      username: 'random username',
      group: '',
      content: 'achieved the sanity level which i craved for years of my life',
      avatar: ''
    }
  ]);
  
  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        // This would fetch real data from your backend
        // For now we're using the mock data above
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Error",
          description: "Failed to load your data. Please try again.",
          variant: "destructive"
        });
      }
    };

    loadUserData();
  }, [user, toast]);

  return (
    <div data-layer="Frame 125" className="Frame125" style={{flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px', display: 'inline-flex', width: '100%'}}>
      {/* Post Input Component */}
      <div className="input-card" style={{width: '100%', marginBottom: '15px'}}>
        <div className="post-input-top">
          <div className="profile-avatar">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_773_664)">
                <rect width="32" height="32" rx="8" fill="var(--BGColor, white)"/>
                <circle cx="16" cy="16" r="16" fill="#D9D9D9"/>
              </g>
              <defs>
                <clipPath id="clip0_773_664">
                  <rect width="32" height="32" rx="8" fill="var(--BGColor, white)"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div style={{color: 'var(--Primary, #148BAF)', fontSize: '14px', fontFamily: 'Happy Monkey', fontWeight: '400', textTransform: 'lowercase'}}>
            share your feels...
          </div>
        </div>
        <textarea 
          className="post-input"
          placeholder="what's on your mind today..."
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
        <button className="post-button" onClick={handlePostSubmit}>
          post
        </button>
      </div>
      
      <div data-layer="Frame 17" className="Frame17" style={{width: '100%', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px', display: 'flex'}}>
        <Frame11 
          username={posts[0].username}
          group={posts[0].group}
          content={posts[0].content}
          avatarColor="#FCDF4D"
        />
        
        <div data-layer="Frame 12" className="Frame12" style={{alignSelf: 'stretch', paddingLeft: '10px', paddingRight: '10px', paddingTop: '8px', paddingBottom: '8px', boxShadow: '1px 2px 4px rgba(73, 217.90, 234, 0.50)', overflow: 'hidden', borderRadius: '8px', outline: '1px var(--TEXTColor, #04C4D5) solid', outlineOffset: '-1px', justifyContent: 'flex-start', alignItems: 'center', gap: '10px', display: 'inline-flex'}}>
          <div data-svg-wrapper data-layer="Frame 5" className="Frame5">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_773_670)">
                <rect width="32" height="32" rx="8" fill="var(--BGColor, white)"/>
                <circle cx="16" cy="16" r="16" fill="#D9D9D9"/>
              </g>
              <defs>
                <clipPath id="clip0_773_670">
                  <rect width="32" height="32" rx="8" fill="var(--BGColor, white)"/>
                </clipPath>
              </defs>
            </svg>
          </div>
          <div data-layer="Frame 130" className="Frame130" style={{flex: '1 1 0', height: '52px', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: '4px', display: 'inline-flex'}}>
            <div data-layer="random username" className="RandomUsername" style={{alignSelf: 'stretch', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'var(--Primary, #148BAF)', fontSize: '12px', fontFamily: 'Happy Monkey', fontWeight: '400', textTransform: 'lowercase', lineHeight: '16px', wordWrap: 'break-word'}}>
              {posts[1].username}
            </div>
            <div data-layer="achieved the sanity level which i craved for years of my life" className="AchievedTheSanityLevelWhichICravedForYearsOfMyLife" style={{alignSelf: 'stretch', justifyContent: 'center', display: 'flex', flexDirection: 'column', color: 'var(--Primary, #148BAF)', fontSize: '12px', fontFamily: 'Happy Monkey', fontWeight: '400', textTransform: 'lowercase', lineHeight: '16px', wordWrap: 'break-word'}}>
              {posts[1].content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
