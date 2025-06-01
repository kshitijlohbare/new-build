import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/useToast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface VideoCallSetupProps {
  practitioner: {
    id: number;
    name: string;
    preferred_video_platform?: string;
    video_meeting_link?: string;
    email?: string;
  };
  appointmentDetails: {
    date: string;
    time: string;
    sessionType: string;
    userEmail: string;
    userName: string;
  };
  onMeetingCreated: (meetingDetails: any) => void;
}

interface MeetingDetails {
  platform: string;
  meetingUrl: string;
  meetingId?: string;
  password?: string;
  dialInNumber?: string;
}

const VideoCallSetup: React.FC<VideoCallSetupProps> = ({
  practitioner,
  appointmentDetails,
  onMeetingCreated
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState(practitioner.preferred_video_platform || 'zoom');
  const [customMeetingUrl, setCustomMeetingUrl] = useState('');
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();

  const platforms = [
    {
      id: 'zoom',
      name: 'Zoom',
      icon: '🎥',
      description: 'High-quality video calls with screen sharing',
      color: 'bg-blue-500'
    },
    {
      id: 'google-meet',
      name: 'Google Meet',
      icon: '📹',
      description: 'Simple video calls integrated with Google Calendar',
      color: 'bg-green-500'
    },
    {
      id: 'microsoft-teams',
      name: 'Microsoft Teams',
      icon: '💼',
      description: 'Professional video conferencing',
      color: 'bg-purple-500'
    },
    {
      id: 'skype',
      name: 'Skype',
      icon: '💬',
      description: 'Classic video calling platform',
      color: 'bg-blue-400'
    },
    {
      id: 'custom',
      name: 'Custom Link',
      icon: '🔗',
      description: 'Use your own video platform link',
      color: 'bg-gray-500'
    }
  ];

  // Mock function to create video meeting
  // In real implementation, this would integrate with actual APIs
  const createVideoMeeting = async (platform: string): Promise<MeetingDetails> => {
    // Mock API delays
    await new Promise(resolve => setTimeout(resolve, 2000));

    switch (platform) {
      case 'zoom':
        return {
          platform: 'Zoom',
          meetingUrl: 'https://zoom.us/j/1234567890?pwd=example',
          meetingId: '123 456 7890',
          password: 'therapy123',
          dialInNumber: '+1 646 558 8656'
        };
      
      case 'google-meet':
        return {
          platform: 'Google Meet',
          meetingUrl: 'https://meet.google.com/abc-defg-hij',
          meetingId: 'abc-defg-hij'
        };
      
      case 'microsoft-teams':
        return {
          platform: 'Microsoft Teams',
          meetingUrl: 'https://teams.microsoft.com/l/meetup-join/19%3example',
          meetingId: 'Conference ID: 123 456 789#'
        };
      
      case 'skype':
        return {
          platform: 'Skype',
          meetingUrl: 'https://join.skype.com/abc123def456',
          meetingId: 'abc123def456'
        };
      
      case 'custom':
        return {
          platform: 'Custom Platform',
          meetingUrl: customMeetingUrl || practitioner.video_meeting_link || 'https://example.com/meeting'
        };
      
      default:
        throw new Error('Unsupported platform');
    }
  };

  const handleCreateMeeting = async () => {
    setLoading(true);
    try {
      const meeting = await createVideoMeeting(selectedPlatform);
      setMeetingDetails(meeting);
      
      // Store meeting details in the database
      const { error } = await supabase
        .from('appointment_meetings')
        .insert({
          practitioner_id: practitioner.id,
          user_id: user?.id,
          platform: meeting.platform,
          meeting_url: meeting.meetingUrl,
          meeting_id: meeting.meetingId,
          password: meeting.password,
          dial_in_number: meeting.dialInNumber,
          appointment_date: appointmentDetails.date,
          appointment_time: appointmentDetails.time,
          session_type: appointmentDetails.sessionType,
          notes: notes,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error storing meeting details:', error);
      }

      onMeetingCreated(meeting);
      
      toast({
        title: "Meeting Created",
        description: `${meeting.platform} meeting has been set up successfully.`,
        variant: "success"
      });

      // Send email notifications (mock)
      await sendMeetingInvitations(meeting);

    } catch (error) {
      console.error('Error creating meeting:', error);
      toast({
        title: "Error",
        description: "Failed to create video meeting. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock function to send email invitations
  const sendMeetingInvitations = async (meeting: MeetingDetails) => {
    // In real implementation, this would send actual emails
    console.log('Sending meeting invitations:', {
      to: [appointmentDetails.userEmail, practitioner.email],
      subject: `Therapy Session - ${appointmentDetails.date} at ${appointmentDetails.time}`,
      meetingDetails: meeting,
      practitionerName: practitioner.name,
      clientName: appointmentDetails.userName
    });

    toast({
      title: "Invitations Sent",
      description: "Meeting invitations have been sent to both participants.",
      variant: "success"
    });
  };

  if (meetingDetails) {
    return (
      <Card className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#148BAF] mb-2">Meeting Ready!</h3>
          <p className="text-gray-600">Your video meeting has been set up successfully.</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Meeting Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Platform:</span>
                <span className="font-medium">{meetingDetails.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date(appointmentDetails.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{appointmentDetails.time}</span>
              </div>
            </div>
          </div>

          <div className="p-4 border border-[#148BAF] rounded-lg">
            <h4 className="font-semibold mb-2 text-[#148BAF]">Join Meeting</h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Meeting URL:</span>
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    value={meetingDetails.meetingUrl} 
                    readOnly 
                    className="flex-1 text-sm"
                  />
                  <Button 
                    size="sm" 
                    onClick={() => {
                      navigator.clipboard.writeText(meetingDetails.meetingUrl);
                      toast({ title: "Copied!", description: "Meeting URL copied to clipboard." });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
              
              {meetingDetails.meetingId && (
                <div>
                  <span className="text-sm text-gray-600">Meeting ID:</span>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">{meetingDetails.meetingId}</p>
                </div>
              )}
              
              {meetingDetails.password && (
                <div>
                  <span className="text-sm text-gray-600">Password:</span>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">{meetingDetails.password}</p>
                </div>
              )}
              
              {meetingDetails.dialInNumber && (
                <div>
                  <span className="text-sm text-gray-600">Dial-in Number:</span>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded mt-1">{meetingDetails.dialInNumber}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={() => window.open(meetingDetails.meetingUrl, '_blank')}
              className="flex-1 bg-[#148BAF] text-white"
            >
              Test Meeting Link
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const details = `
Meeting: ${meetingDetails.platform}
Date: ${new Date(appointmentDetails.date).toLocaleDateString()}
Time: ${appointmentDetails.time}
URL: ${meetingDetails.meetingUrl}
${meetingDetails.meetingId ? `Meeting ID: ${meetingDetails.meetingId}` : ''}
${meetingDetails.password ? `Password: ${meetingDetails.password}` : ''}
                `.trim();
                navigator.clipboard.writeText(details);
                toast({ title: "Copied!", description: "All meeting details copied to clipboard." });
              }}
            >
              Copy All Details
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 text-[#148BAF]">Set Up Video Meeting</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-3">Choose Video Platform</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {platforms.map((platform) => (
              <div
                key={platform.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedPlatform === platform.id
                    ? 'border-[#148BAF] bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPlatform(platform.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{platform.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-medium">{platform.name}</h4>
                    <p className="text-sm text-gray-600">{platform.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedPlatform === 'custom' && (
          <div>
            <label className="block text-sm font-medium mb-2">Custom Meeting URL</label>
            <Input
              value={customMeetingUrl}
              onChange={(e) => setCustomMeetingUrl(e.target.value)}
              placeholder="https://your-platform.com/meeting-room"
              className="w-full"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter your preferred video platform meeting URL
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions or preparation notes for the session..."
            className="w-full"
            rows={3}
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleCreateMeeting}
            disabled={loading || (selectedPlatform === 'custom' && !customMeetingUrl)}
            className="flex-1 bg-[#148BAF] text-white"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating Meeting...
              </div>
            ) : (
              'Create Video Meeting'
            )}
          </Button>
        </div>

        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This is a demo implementation. In production, this would:
            <br />• Integrate with real video platform APIs
            <br />• Send actual calendar invitations
            <br />• Set up automatic reminders
            <br />• Provide seamless joining experience
          </p>
        </div>
      </div>
    </Card>
  );
};

export default VideoCallSetup;
