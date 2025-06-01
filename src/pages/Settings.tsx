import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
// Add this for error handling
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminders: true
  });
  
  // Add an effect to redirect if there's an error
  useEffect(() => {
    if (!user) {
      console.log('No user found in Settings page');
    }
  }, [user]);

  const handleSaveSettings = () => {
    try {
      // TODO: Save settings to Supabase
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully"
      });
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
      toast({
        title: "Error",
        description: "There was a problem saving your settings",
        variant: "destructive"
      });
    }
  };

  // Safe rendering with error handling
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
        <h1 className="text-2xl sm:text-3xl font-happy-monkey lowercase text-red-500 mb-6 sm:mb-8">Error</h1>
        <Card className="p-4 sm:p-6">
          <p className="text-sm sm:text-base">{error}</p>
          <Button onClick={() => navigate('/')} className="mt-4 w-full sm:w-auto">
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  // Make sure user exists before rendering settings
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
        <Card className="p-4 sm:p-6">
          <h1 className="text-lg sm:text-xl font-happy-monkey lowercase text-[#148BAF] mb-4">Loading settings...</h1>
          <div className="animate-pulse h-3 sm:h-4 bg-gray-200 rounded w-1/2 mb-3 sm:mb-4"></div>
          <div className="animate-pulse h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
          <div className="animate-pulse h-3 sm:h-4 bg-gray-200 rounded w-2/3"></div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6">
      <h1 className="text-2xl sm:text-3xl font-happy-monkey lowercase text-[#148BAF] mb-6 sm:mb-8">settings</h1>
      
      <div className="space-y-4 sm:space-y-6">
        <Card className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-happy-monkey lowercase text-[#148BAF] mb-3 sm:mb-4">notifications</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex-1">
                <h3 className="font-happy-monkey lowercase text-[#148BAF] text-sm sm:text-base">email notifications</h3>
                <p className="text-xs sm:text-sm text-gray-500">Receive updates about your progress</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                className="h-4 w-4 text-[#148BAF] rounded border-[rgba(4,196,213,0.3)] focus:ring-[#04C4D5] self-start sm:self-auto"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex-1">
                <h3 className="font-happy-monkey text-[#148BAF] text-sm sm:text-base">Push Notifications</h3>
                <p className="text-xs sm:text-sm text-gray-500">Get notified about new practices</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
                className="h-4 w-4 text-[#148BAF] rounded border-[rgba(4,196,213,0.3)] focus:ring-[#04C4D5] self-start sm:self-auto"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex-1">
                <h3 className="font-happy-monkey lowercase text-[#148BAF] text-sm sm:text-base">practice reminders</h3>
                <p className="text-xs sm:text-sm text-gray-500">Daily reminders for your wellbeing practices</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.reminders}
                onChange={(e) => setNotifications(prev => ({ ...prev, reminders: e.target.checked }))}
                className="h-4 w-4 text-[#148BAF] rounded border-[rgba(4,196,213,0.3)] focus:ring-[#04C4D5] self-start sm:self-auto"
              />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-happy-monkey lowercase text-[#148BAF] mb-3 sm:mb-4">account settings</h2>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-happy-monkey lowercase text-[#148BAF]">email</label>
              <p className="text-gray-500 text-sm sm:text-base break-all">{user?.email || 'Not available'}</p>
            </div>
          </div>
        </Card>

        <div className="flex justify-center sm:justify-end">
          <Button
            onClick={handleSaveSettings}
            variant="default"
            className="w-full sm:w-auto"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;