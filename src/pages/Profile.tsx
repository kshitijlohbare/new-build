import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/context/ProfileContext';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
// Fix import path by using relative path to avoid typescript path issues
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { UserCircle, Users, UserPlus, UserCheck } from 'lucide-react';
import UserAvatar from '../components/ui/UserAvatar';
import EmptyState from '../components/ui/EmptyState';

const Profile = () => {
  const { user } = useAuth();
  const { 
    userProfile, 
    updateProfile, 
    followingList, 
    followersList, 
    getFollowers, 
    getFollowing,
    followUser,
    unfollowUser,
    suggestedUsers,
    getSuggestedUsers,
    loading: profileLoading
  } = useProfile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data from profile
  useEffect(() => {
    if (userProfile) {
      setFormData({
        displayName: userProfile.display_name || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        website: userProfile.website || ''
      });
    }
  }, [userProfile]);

  // Load followers and following when tab changes
  useEffect(() => {
    if (activeTab === 'followers' && user) {
      getFollowers(user.id);
    } else if (activeTab === 'following' && user) {
      getFollowing(user.id);
    } else if (activeTab === 'discover' && user) {
      getSuggestedUsers();
    }
  }, [activeTab, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updates = {
        display_name: formData.displayName,
        bio: formData.bio,
        location: formData.location,
        website: formData.website
      };
      
      const { error } = await updateProfile(updates);
      
      if (!error) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully"
        });
      } else {
        throw new Error(error.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (userId: string) => {
    await followUser(userId);
    // Refresh suggested users
    getSuggestedUsers();
  };

  const handleUnfollow = async (userId: string) => {
    await unfollowUser(userId);
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-happy-monkey lowercase text-[#208EB1] mb-6 sm:mb-8">profile</h1>
      
      {profileLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06C4D5]"></div>
          <span className="ml-3 text-[#06C4D5] font-happy-monkey">Loading profile...</span>
        </div>
      ) : (
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-6 w-full">
            <TabsTrigger value="profile" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <UserCircle className="h-3 w-3 sm:h-4 sm:w-4" /> 
              <span className="hidden sm:inline">Profile</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="followers" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" /> 
              <span className="hidden sm:inline">Followers {userProfile?.followers_count ? `(${userProfile.followers_count})` : ''}</span>
              <span className="sm:hidden">Followers</span>
            </TabsTrigger>
            <TabsTrigger value="following" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <UserCheck className="h-3 w-3 sm:h-4 sm:w-4" /> 
              <span className="hidden sm:inline">Following {userProfile?.following_count ? `(${userProfile.following_count})` : ''}</span>
              <span className="sm:hidden">Following</span>
            </TabsTrigger>
            <TabsTrigger value="discover" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" /> 
              <span className="hidden sm:inline">Discover</span>
              <span className="sm:hidden">Find</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-happy-monkey lowercase text-[#208EB1] mb-1">
                    display name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    className="mt-1 block w-full rounded-lg border border-[rgba(6,196,213,0.3)] px-3 py-2 sm:py-3 text-sm placeholder-[#F7FFFF] focus:outline-none focus:ring-2 focus:ring-[#06C4D5] focus:border-transparent"
                    placeholder="Enter your display name"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-happy-monkey lowercase text-[#208EB1] mb-1">
                    bio
                  </label>
                  <textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-lg border border-[rgba(6,196,213,0.3)] px-3 py-2 sm:py-3 text-sm placeholder-[#F7FFFF] focus:outline-none focus:ring-2 focus:ring-[#06C4D5] focus:border-transparent resize-none"
                    placeholder="Tell us about yourself"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="location" className="block text-sm font-happy-monkey lowercase text-[#208EB1] mb-1">
                      location
                    </label>
                    <input
                      id="location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="mt-1 block w-full rounded-lg border border-[rgba(6,196,213,0.3)] px-3 py-2 sm:py-3 text-sm placeholder-[#F7FFFF] focus:outline-none focus:ring-2 focus:ring-[#06C4D5] focus:border-transparent"
                      placeholder="Where are you located?"
                    />
                  </div>

                  <div>
                    <label htmlFor="website" className="block text-sm font-happy-monkey lowercase text-[#208EB1] mb-1">
                      website
                    </label>
                    <input
                      id="website"
                      type="text"
                      value={formData.website}
                      onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                      className="mt-1 block w-full rounded-lg border border-[rgba(6,196,213,0.3)] px-3 py-2 sm:py-3 text-sm placeholder-[#F7FFFF] focus:outline-none focus:ring-2 focus:ring-[#06C4D5] focus:border-transparent"
                      placeholder="Your website (optional)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-happy-monkey lowercase text-[#208EB1] mb-1">
                      email
                    </label>
                    <p className="mt-1 text-[#000000] text-sm break-all">{user?.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-happy-monkey lowercase text-[#208EB1] mb-1">
                      member since
                    </label>
                    <p className="mt-1 text-[#000000] text-sm">
                      {new Date(user?.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    variant="default"
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? 'Saving...' : 'Save changes'}
                  </Button>
                </div>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="followers">
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-happy-monkey lowercase text-[#208EB1] mb-4">people following you</h2>
              
              {followersList.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {followersList.map((follower) => (
                    <div key={follower.id} className="flex items-center justify-between p-3 border rounded-lg border-[rgba(6,196,213,0.2)] hover:bg-[rgba(6,196,213,0.05)]">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <UserAvatar 
                          src={follower.avatar_url}
                          alt={follower.display_name}
                          fallbackText={follower.display_name.charAt(0)}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base truncate">{follower.display_name}</p>
                          <p className="text-xs sm:text-sm text-[#000000] truncate">@{follower.username}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Users className="h-12 w-12 text-[#208EB1] opacity-40" />}
                  title="No followers yet"
                  message="When someone follows you, they'll appear here." 
                />
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="following">
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-happy-monkey lowercase text-[#208EB1] mb-4">people you follow</h2>
              
              {followingList.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {followingList.map((following) => (
                    <div key={following.id} className="flex items-center justify-between p-3 border rounded-lg border-[rgba(6,196,213,0.2)] hover:bg-[rgba(6,196,213,0.05)] gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <UserAvatar
                          src={following.avatar_url}
                          alt={following.display_name}
                          fallbackText={following.display_name.charAt(0)}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base truncate">{following.display_name}</p>
                          <p className="text-xs sm:text-sm text-[#000000] truncate">@{following.username}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnfollow(following.id)}
                        className="text-xs sm:text-sm"
                      >
                        Unfollow
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<UserCheck className="h-12 w-12 text-[#208EB1] opacity-40" />}
                  title="Not following anyone yet"
                  message="People you follow will appear here."
                  action={
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setActiveTab('discover')}
                      className="text-xs sm:text-sm"
                    >
                      <UserPlus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Discover people to follow
                    </Button>
                  }
                />
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="discover">
            <Card className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-happy-monkey lowercase text-[#208EB1] mb-4">discover people to follow</h2>
              
              {suggestedUsers.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {suggestedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg border-[rgba(6,196,213,0.2)] hover:bg-[rgba(6,196,213,0.05)] gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.display_name} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
                        ) : (
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#06C4D5] flex items-center justify-center text-[#FFFFFF] text-sm">
                            {user.display_name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base truncate">{user.display_name}</p>
                          <p className="text-xs sm:text-sm text-[#000000] truncate">@{user.username}</p>
                        </div>
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleFollow(user.id)}
                        className="text-xs sm:text-sm"
                      >
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<UserPlus className="h-12 w-12 text-[#208EB1] opacity-40" />}
                  title="No suggested users right now"
                  message="Check back later for new people to follow."
                />
              )}
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Profile;