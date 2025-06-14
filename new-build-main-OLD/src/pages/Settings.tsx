import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    reminders: true
  });

  const handleSaveSettings = () => {
    // TODO: Save settings to Supabase
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully"
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-happy-monkey lowercase text-[#148BAF] mb-8">settings</h1>
      
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-happy-monkey lowercase text-[#148BAF] mb-4">notifications</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-happy-monkey lowercase text-[#148BAF]">email notifications</h3>
                <p className="text-sm text-gray-500">Receive updates about your progress</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                className="h-4 w-4 text-[#148BAF] rounded border-[rgba(4,196,213,0.3)] focus:ring-[#04C4D5]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-happy-monkey text-[#148BAF]">Push Notifications</h3>
                <p className="text-sm text-gray-500">Get notified about new practices</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
                className="h-4 w-4 text-[#148BAF] rounded border-[rgba(4,196,213,0.3)] focus:ring-[#04C4D5]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-happy-monkey lowercase text-[#148BAF]">practice reminders</h3>
                <p className="text-sm text-gray-500">Daily reminders for your wellbeing practices</p>
              </div>
              <input
                type="checkbox"
                checked={notifications.reminders}
                onChange={(e) => setNotifications(prev => ({ ...prev, reminders: e.target.checked }))}
                className="h-4 w-4 text-[#148BAF] rounded border-[rgba(4,196,213,0.3)] focus:ring-[#04C4D5]"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-happy-monkey lowercase text-[#148BAF] mb-4">account settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-happy-monkey lowercase text-[#148BAF]">email</label>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleSaveSettings}
            variant="default"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;