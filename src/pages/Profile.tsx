import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    displayName: user?.user_metadata?.name || '',
    bio: user?.user_metadata?.bio || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Update user metadata in Supabase
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again."
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-happy-monkey text-[#148BAF] mb-8">Profile</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="displayName" className="block text-sm font-happy-monkey text-[#148BAF]">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              className="mt-1 block w-full rounded-md border border-[#148BAF] px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#148BAF] focus:border-transparent"
              placeholder="Enter your display name"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-happy-monkey text-[#148BAF]">
              Bio
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
              className="mt-1 block w-full rounded-md border border-[#148BAF] px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#148BAF] focus:border-transparent"
              placeholder="Tell us about yourself"
            />
          </div>

          <div>
            <label className="block text-sm font-happy-monkey text-[#148BAF]">
              Email
            </label>
            <p className="mt-1 text-gray-500">{user?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-happy-monkey text-[#148BAF]">
              Member Since
            </label>
            <p className="mt-1 text-gray-500">
              {new Date(user?.created_at || '').toLocaleDateString()}
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#148BAF] text-white font-happy-monkey"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;