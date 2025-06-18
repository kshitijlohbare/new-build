import { useState, useEffect } from "react";
import { Smile } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useAuth } from "@/context/AuthContext";
import "@/styles/SocialFeed.css";

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
  
  // User posts & group state
  const [posts, setPosts] = useState<Post[]>([
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
  
  const [groups] = useState([
    'morning group',
    'yoga group',
    'naval ravikant',
    'andrew huberman'
  ]);
  
  const [message, setMessage] = useState('');
  
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
  
  const handlePostMessage = () => {
    if (!message.trim() || !user) return;
    
    const newPost = {
      id: Date.now(),
      username: (user as any)?.username || user?.email?.split('@')[0] || 'You',
      group: '',
      content: message,
      avatar: (user as any)?.avatar_url || ''
    };
    
    setPosts([newPost, ...posts]);
    setMessage('');
    
    toast({
      title: "Post Shared",
      description: "Your feelings have been shared with the community.",
      variant: "default"
    });
  };

  return (
    <div className="Body">
      <div className="Main">
        {/* Header */}
        <header>
          <button className="menu-button">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="5" fill="#04C4D5"/>
              <rect x="8" y="10" width="24" height="4" rx="2" fill="white"/>
              <rect x="8" y="18" width="24" height="4" rx="2" fill="white"/>
              <rect x="8" y="26" width="24" height="4" rx="2" fill="white"/>
            </svg>
          </button>
          <div className="app-name">CAKTUS COCO</div>
          <div className="header-icons">
            <div className="notification-badge">3</div>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 7.5C16.6569 7.5 18 6.15685 18 4.5C18 2.84315 16.6569 1.5 15 1.5C13.3431 1.5 12 2.84315 12 4.5C12 6.15685 13.3431 7.5 15 7.5Z" stroke="white" stroke-width="2"/>
              <path d="M22.5 15C24.1569 15 25.5 13.6569 25.5 12C25.5 10.3431 24.1569 9 22.5 9C20.8431 9 19.5 10.3431 19.5 12C19.5 13.6569 20.8431 15 22.5 15Z" stroke="white" stroke-width="2"/>
              <path d="M7.5 15C9.15685 15 10.5 13.6569 10.5 12C10.5 10.3431 9.15685 9 7.5 9C5.84315 9 4.5 10.3431 4.5 12C4.5 13.6569 5.84315 15 7.5 15Z" stroke="white" stroke-width="2"/>
              <path d="M15 28.5C16.6569 28.5 18 27.1569 18 25.5C18 23.8431 16.6569 22.5 15 22.5C13.3431 22.5 12 23.8431 12 25.5C12 27.1569 13.3431 28.5 15 28.5Z" stroke="white" stroke-width="2"/>
              <path d="M15 7.5V22.5" stroke="white" stroke-width="2"/>
              <path d="M22.5 15L15 22.5" stroke="white" stroke-width="2"/>
              <path d="M7.5 15L15 22.5" stroke="white" stroke-width="2"/>
            </svg>
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="15" r="12" stroke="white" stroke-width="2"/>
              <text x="15" y="20" font-family="Happy Monkey" font-size="14" text-anchor="middle" fill="white">88</text>
            </svg>
          </div>
        </header>
        
        {/* Share Your Feels Button */}
        <div className="share-feels-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="white"/>
          </svg>
          <span>share your feels</span>
        </div>
        
        {/* Activity Icons */}
        <div className="activity-icons">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#04C4D5" stroke-width="2"/>
            <circle cx="8" cy="10" r="1.5" fill="#04C4D5"/>
            <circle cx="16" cy="10" r="1.5" fill="#04C4D5"/>
            <path d="M8 16C10 18 14 18 16 16" stroke="#04C4D5" stroke-width="2" stroke-linecap="round"/>
          </svg>
          
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="5" width="16" height="14" rx="2" stroke="#04C4D5" stroke-width="2"/>
            <path d="M4 9H20" stroke="#04C4D5" stroke-width="2"/>
            <path d="M8 13H10" stroke="#04C4D5" stroke-width="2" stroke-linecap="round"/>
            <path d="M14 13H16" stroke="#04C4D5" stroke-width="2" stroke-linecap="round"/>
            <path d="M8 16H10" stroke="#04C4D5" stroke-width="2" stroke-linecap="round"/>
            <path d="M14 16H16" stroke="#04C4D5" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </div>
        
        {/* Group Pills */}
        <div className="group-pills">
          {groups.map(group => (
            <div key={group} className="group-pill">{group}</div>
          ))}
        </div>
        
        {/* Posts */}
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="user-avatar"></div>
              <div className="post-user-info">
                <span className="post-username">{post.username}</span>
                {post.group && <span className="post-group">{post.group}</span>}
              </div>
            </div>
            <div className="post-content">
              {post.content}
            </div>
          </div>
        ))}
        
        {/* Bottom Input Bar */}
        <div className="bottom-input-bar">
          <div className="emoji-selector">
            <Smile size={24} color="white" />
          </div>
          <input 
            type="text" 
            className="input-field" 
            placeholder="share your thoughts (to all groups)" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="post-button" onClick={handlePostMessage}>
            post
          </button>
        </div>
      </div>
    </div>
  );
}
