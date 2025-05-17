// filepath: /Users/kshitijlohbare/Downloads/new build/src/components/ui/UserProfileCard.tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserPlus, UserCheck } from 'lucide-react';
import { useProfile } from '@/context/ProfileContext';
import UserAvatar from './UserAvatar';

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  followers_count: number;
  following_count: number;
}

interface UserProfileCardProps {
  user: UserProfile;
  isFollowing?: boolean;
  onFollowToggle?: () => void;
}

export function UserProfileCard({ user, isFollowing = false, onFollowToggle }: UserProfileCardProps) {
  const { followUser, unfollowUser } = useProfile();

  const handleFollowToggle = async () => {
    if (isFollowing) {
      await unfollowUser(user.id);
    } else {
      await followUser(user.id);
    }
    
    if (onFollowToggle) onFollowToggle();
  };

  return (
    <Card className="p-4 border border-[rgba(4,196,213,0.2)] hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserAvatar 
            src={user.avatar_url} 
            alt={user.display_name}
            fallbackText={user.display_name.charAt(0)}
          />
          <div>
            <p className="font-medium text-[#148BAF]">{user.display_name}</p>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>
        <Button
          variant={isFollowing ? "outline" : "default"}
          size="sm"
          onClick={handleFollowToggle}
          className="flex items-center gap-1"
        >
          {isFollowing ? (
            <>
              <UserCheck className="w-4 h-4" /> Following
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Follow
            </>
          )}
        </Button>
      </div>
      <div className="mt-2 text-sm text-gray-500 flex gap-4">
        <span>{user.followers_count} followers</span>
        <span>{user.following_count} following</span>
      </div>
    </Card>
  );
}

export default UserProfileCard;