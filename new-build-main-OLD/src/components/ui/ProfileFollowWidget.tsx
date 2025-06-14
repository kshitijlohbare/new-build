import { useState, useEffect } from 'react';
import { Filter, UserCheck, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/context/ProfileContext';
import UserProfileCard from './UserProfileCard';

interface ProfileFollowWidgetProps {
  showFollowingOnly: boolean;
  setShowFollowingOnly: (value: boolean) => void;
}

export function ProfileFollowWidget({ 
  showFollowingOnly, 
  setShowFollowingOnly 
}: ProfileFollowWidgetProps) {
  const { followingList, suggestedUsers, getSuggestedUsers } = useProfile();
  
  const [showPeopleSection, setShowPeopleSection] = useState(false);
  const [followCheckMap, setFollowCheckMap] = useState<Record<string, boolean>>({});
  const [followingUserIds, setFollowingUserIds] = useState<string[]>([]);
  
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
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant={showFollowingOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFollowingOnly(!showFollowingOnly)}
            className="flex items-center gap-1"
          >
            {showFollowingOnly ? (
              <>
                <UserCheck className="w-4 h-4" /> Following Only
              </>
            ) : (
              <>
                <Filter className="w-4 h-4" /> All Posts
              </>
            )}
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={togglePeopleSection}
          className="flex items-center gap-1"
        >
          <User className="w-4 h-4" />
          {showPeopleSection ? 'Hide People' : 'Discover People'}
        </Button>
      </div>
      
      {showPeopleSection && (
        <div className="mb-8 p-4 bg-white rounded-lg shadow animate-slide-down">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-happy-monkey lowercase text-[#148BAF]">People to Follow</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={togglePeopleSection}
            >
              Hide
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
            <p className="text-center text-gray-500 my-4">No suggested users available at this time.</p>
          )}
        </div>
      )}
    </>
  );
}

export default ProfileFollowWidget;
