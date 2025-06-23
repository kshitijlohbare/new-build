import { useState, useEffect } from "react";
import { useToast } from '@/hooks/useToast';
import { useAuth } from "@/context/AuthContext";
import "@/styles/SocialFeed.css";
import "@/styles/FeelsSectionImproved.css";
import RedditThread from "@/components/social/RedditThread";
import styled from 'styled-components';

// Filter chips styled component
const FilterChips = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 10px 0;
  gap: 10px;
  margin-bottom: 5px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const FilterChip = styled.div<{ active?: boolean }>`
  background-color: ${props => props.active ? 'rgba(20, 139, 175, 0.15)' : 'white'};
  color: ${props => props.active ? 'var(--Primary, #148BAF)' : 'var(--Primary, #148BAF)'};
  border: 1.5px solid var(--Primary, #148BAF);
  border-radius: 20px;
  padding: 6px 12px;
  font-size: 12px;
  font-family: 'Happy Monkey', cursive;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0 3px rgba(20, 139, 175, 0.2);
  
  &:hover {
    background-color: ${props => props.active ? 'rgba(20, 139, 175, 0.15)' : 'rgba(20, 139, 175, 0.05)'};
  }
`;

interface Post {
  id: number;
  username: string;
  community: string;
  timestamp: string;
  content: string;
  likes: number;
  comments: Comment[];
  avatar: string;
}

interface Comment {
  id: number;
  username: string;
  content: string;
  timestamp: string;
  avatar: string;
  likes: number;
  level?: number;
  replies?: Comment[];
}

interface SocialFeedProps {
  selectedTribe?: string;
}

export default function SocialFeed({ selectedTribe = 'all' }: SocialFeedProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Removed unused postContent state
  const [activeFilter, setActiveFilter] = useState(selectedTribe);
  
  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
  };
  
  // Removed unused handlePostSubmit function
  
  // Mock data for Reddit-style posts with comments
  const [posts] = useState<Post[]>([
    {
      id: 1,
      username: 'feelsgoodman',
      community: 'morning vibes',
      timestamp: '2 hours ago',
      content: 'achieved the sanity level which i craved for years of my life, thanks to the morning meditation practice!',
      likes: 24,
      avatar: '#FCDF4D',
      comments: [
        {
          id: 1,
          username: 'zenmaster',
          content: 'that\'s amazing! what meditation technique are you using?',
          timestamp: '1 hour ago',
          avatar: '#148BAF',
          likes: 8,
          replies: [
            {
              id: 2,
              username: 'feelsgoodman',
              content: 'just simple mindfulness, focusing on my breath for 10 mins every morning',
              timestamp: '45 minutes ago',
              avatar: '#FCDF4D',
              likes: 5
            }
          ]
        },
        {
          id: 3,
          username: 'peacefulwarrior',
          content: 'i\'ve been struggling with consistency. any tips?',
          timestamp: '50 minutes ago',
          avatar: '#04C4D5',
          likes: 3
        }
      ]
    },
    {
      id: 2,
      username: 'stressedout',
      community: 'anxiety support',
      timestamp: '5 hours ago',
      content: 'having one of those days where everything feels overwhelming. breathing exercises aren\'t helping today.',
      likes: 18,
      avatar: '#FF7B7B',
      comments: [
        {
          id: 4,
          username: 'calmcoach',
          content: 'on days like that, i find physical activity helps more than breathing. maybe try a quick walk?',
          timestamp: '4 hours ago',
          avatar: '#A4D96C',
          likes: 12
        }
      ]
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

  // Filter posts based on selected tribe/filter
  const displayedPosts = selectedTribe === 'all' && activeFilter === 'all' 
    ? posts 
    : posts.filter(post => 
        post.community.toLowerCase() === (selectedTribe !== 'all' ? selectedTribe.toLowerCase() : activeFilter)
      );

  // useEffect to sync activeFilter with selectedTribe prop
  useEffect(() => {
    if (selectedTribe) {
      setActiveFilter(selectedTribe);
    }
  }, [selectedTribe]);

  return (
    <div className="caktus-feels-page" data-testid="social-feed-container" style={{border: '5px solid red', padding: '10px'}}>
      <h2 style={{color: 'red', fontSize: '24px', margin: '10px 0'}}>🔥 FEELS SECTION - UPDATED 🔥</h2>
      {/* Filter Chips for Feels - Only show when not already filtered by tribe selection */}
      {selectedTribe === 'all' && (
        <FilterChips>
          <FilterChip active={activeFilter === 'all'} onClick={() => handleFilterClick('all')}>
            all feels
          </FilterChip>
          <FilterChip active={activeFilter === 'anxiety'} onClick={() => handleFilterClick('anxiety')}>
            anxiety
          </FilterChip>
          <FilterChip active={activeFilter === 'meditation'} onClick={() => handleFilterClick('meditation')}>
            meditation
          </FilterChip>
          <FilterChip active={activeFilter === 'gratitude'} onClick={() => handleFilterClick('gratitude')}>
            gratitude
          </FilterChip>
          <FilterChip active={activeFilter === 'mindfulness'} onClick={() => handleFilterClick('mindfulness')}>
            mindfulness
          </FilterChip>
          <FilterChip active={activeFilter === 'morning running group'} onClick={() => handleFilterClick('morning running group')}>
            morning running group
          </FilterChip>
          <FilterChip active={activeFilter === 'yoga tribe'} onClick={() => handleFilterClick('yoga tribe')}>
            yoga tribe
          </FilterChip>
        </FilterChips>
      )}
      
      <div className="caktus-feels-feed-container" data-testid="reddit-feeds-container">
        {displayedPosts.length > 0 ? (
          displayedPosts.map(post => (
            <RedditThread 
              key={post.id}
              id={post.id}
              username={post.username}
              community={post.community}
              timestamp={post.timestamp}
              content={post.content}
              likes={post.likes}
              comments={post.comments}
              avatar={post.avatar}
            />
          ))
        ) : (
          <div className="caktus-feels-empty-state">
            <p>No posts in this tribe yet. Be the first to share your feels!</p>
          </div>
        )}
      </div>
    </div>
  );
}
