import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Pin, 
  Shield, 
  X,
  Flag,
  Trash2,
  Settings
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import {
  GroupMessage,
  GroupAnnouncement,
  sendGroupMessage,
  getGroupMessages,
  subscribeToGroupMessages,
  createGroupAnnouncement,
  getGroupAnnouncements,
  reportGroupMember,
  deleteGroupMessage,
  isGroupAdmin
} from '@/helpers/fitnessGroupMessaging';
import GroupAdminDashboard from './GroupAdminDashboard';

interface GroupMessagingProps {
  groupId: number;
  groupName: string;
  onClose: () => void;
}

export default function GroupMessaging({ groupId, groupName, onClose }: GroupMessagingProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [announcements, setAnnouncements] = useState<GroupAnnouncement[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'announcements' | 'admin'>('messages');
  const [loading, setLoading] = useState(true);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  
  // Admin features state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTargetUser, setReportTargetUser] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementContent, setAnnouncementContent] = useState('');

  // Load initial data
  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // Check if user is admin
        const adminStatus = await isGroupAdmin(user.id, groupId);
        setIsAdmin(adminStatus);

        // Load messages and announcements
        const [messagesData, announcementsData] = await Promise.all([
          getGroupMessages(groupId),
          getGroupAnnouncements(groupId)
        ]);

        setMessages(messagesData);
        setAnnouncements(announcementsData);
      } catch (error) {
        console.error('Error loading group data:', error);
        toast({
          title: "Error",
          description: "Failed to load group messages",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time messages
    const subscription = subscribeToGroupMessages(groupId, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [groupId, user?.id, toast]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const handleSendMessage = async () => {
    if (!user?.id || !newMessage.trim()) return;

    try {
      await sendGroupMessage(groupId, user.id, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  // Handle message actions (admin)
  const handleDeleteMessage = async (messageId: number) => {
    if (!user?.id || !isAdmin) return;

    try {
      await deleteGroupMessage(messageId, user.id);
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      toast({
        title: "Success",
        description: "Message deleted",
        variant: "success"
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error",
        description: "Failed to delete message",
        variant: "destructive"
      });
    }
  };

  // Report member
  const handleReportMember = async () => {
    if (!user?.id || !reportTargetUser || !reportReason.trim()) return;

    try {
      await reportGroupMember(groupId, reportTargetUser, user.id, reportReason, reportDescription);
      setShowReportModal(false);
      setReportTargetUser(null);
      setReportReason('');
      setReportDescription('');
      toast({
        title: "Success",
        description: "Report submitted successfully",
        variant: "success"
      });
    } catch (error) {
      console.error('Error reporting member:', error);
      toast({
        title: "Error",
        description: "Failed to submit report",
        variant: "destructive"
      });
    }
  };

  // Create announcement
  const handleCreateAnnouncement = async () => {
    if (!user?.id || !isAdmin || !announcementTitle.trim() || !announcementContent.trim()) return;

    try {
      const newAnnouncement = await createGroupAnnouncement(
        groupId,
        user.id,
        announcementTitle.trim(),
        announcementContent.trim()
      );
      
      if (newAnnouncement) {
        setAnnouncements(prev => [newAnnouncement, ...prev]);
        setAnnouncementTitle('');
        setAnnouncementContent('');
        setShowAnnouncementForm(false);
        toast({
          title: "Success",
          description: "Announcement created",
          variant: "success"
        });
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast({
        title: "Error",
        description: "Failed to create announcement",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#04C4D5] mx-auto"></div>
            <p className="mt-4 text-gray-600 font-happy-monkey">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[#04C4D5]" />
            <h2 className="text-xl font-happy-monkey text-[#148BAF]">{groupName}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#04C4D5] rounded-full hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-3 font-happy-monkey text-sm transition-colors ${
              activeTab === 'messages'
                ? 'border-b-2 border-[#04C4D5] text-[#04C4D5]'
                : 'text-gray-600 hover:text-[#04C4D5]'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Messages
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-3 font-happy-monkey text-sm transition-colors ${
              activeTab === 'announcements'
                ? 'border-b-2 border-[#04C4D5] text-[#04C4D5]'
                : 'text-gray-600 hover:text-[#04C4D5]'
            }`}
          >
            <Pin className="w-4 h-4 inline mr-2" />
            Announcements
          </button>
          {isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-3 font-happy-monkey text-sm transition-colors ${
                activeTab === 'admin'
                  ? 'border-b-2 border-[#04C4D5] text-[#04C4D5]'
                  : 'text-gray-600 hover:text-[#04C4D5]'
              }`}
            >
              <Shield className="w-4 h-4 inline mr-2" />
              Admin
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'messages' && (
            <>
              {/* Messages Area */}
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="font-happy-monkey">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div key={message.id} className="flex gap-3 group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#04C4D5] to-[#148BAF] flex items-center justify-center text-white font-happy-monkey text-sm">
                          {message.user_profile?.display_name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-happy-monkey text-sm text-[#148BAF]">
                              {message.user_profile?.display_name || 'Unknown User'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(message.created_at).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                            {message.message}
                          </div>
                        </div>
                        {/* Message Actions */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-start gap-1">
                          <button
                            onClick={() => {
                              setReportTargetUser(message.user_id);
                              setShowReportModal(true);
                            }}
                            className="p-1 text-gray-400 hover:text-orange-500 rounded"
                            title="Report message"
                          >
                            <Flag className="w-4 h-4" />
                          </button>
                          {isAdmin && message.user_id !== user?.id && (
                            <button
                              onClick={() => handleDeleteMessage(message.id)}
                              className="p-1 text-gray-400 hover:text-red-500 rounded"
                              title="Delete message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t border-gray-200 p-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04C4D5] focus:border-transparent font-happy-monkey text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'announcements' && (
            <div className="h-full overflow-y-auto p-4">
              {isAdmin && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowAnnouncementForm(true)}
                    className="px-4 py-2 bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white rounded-lg hover:scale-105 transition-all font-happy-monkey text-sm"
                  >
                    <Pin className="w-4 h-4 inline mr-2" />
                    Create Announcement
                  </button>
                </div>
              )}
              
              {announcements.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Pin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="font-happy-monkey">No announcements yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Pin className="w-4 h-4 text-blue-600" />
                        <h3 className="font-happy-monkey text-lg text-blue-900">{announcement.title}</h3>
                      </div>
                      <p className="text-gray-700 mb-3">{announcement.content}</p>
                      <div className="text-xs text-gray-500">
                        By {announcement.creator_profile?.display_name} • {new Date(announcement.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'admin' && isAdmin && (
            <div className="h-full overflow-y-auto p-4">
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-happy-monkey text-lg text-yellow-900 mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Admin Controls
                  </h3>
                  <p className="text-yellow-800 text-sm">
                    As a group admin, you can moderate messages, manage announcements, and handle member reports.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-happy-monkey text-gray-900 mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => setShowAnnouncementForm(true)}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded border"
                      >
                        <Pin className="w-4 h-4 inline mr-2" />
                        Create Announcement
                      </button>
                      <button
                        onClick={() => setShowAdminDashboard(true)}
                        className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded border"
                      >
                        <Settings className="w-4 h-4 inline mr-2" />
                        Admin Dashboard
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-happy-monkey text-gray-900 mb-2">Moderation</h4>
                    <p className="text-sm text-gray-600">
                      Use the action buttons on messages to delete inappropriate content or report members.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-happy-monkey text-lg text-gray-900 mb-4">Report Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-happy-monkey text-gray-700 mb-2">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04C4D5] focus:border-transparent"
                >
                  <option value="">Select a reason</option>
                  <option value="spam">Spam</option>
                  <option value="harassment">Harassment</option>
                  <option value="inappropriate_content">Inappropriate Content</option>
                  <option value="hate_speech">Hate Speech</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-happy-monkey text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04C4D5] focus:border-transparent h-20 resize-none"
                  placeholder="Additional details..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-happy-monkey"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReportMember}
                  disabled={!reportReason}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-happy-monkey"
                >
                  Submit Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Form Modal */}
      {showAnnouncementForm && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-happy-monkey text-lg text-gray-900 mb-4">Create Announcement</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-happy-monkey text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04C4D5] focus:border-transparent"
                  placeholder="Announcement title..."
                />
              </div>
              <div>
                <label className="block text-sm font-happy-monkey text-gray-700 mb-2">Content</label>
                <textarea
                  value={announcementContent}
                  onChange={(e) => setAnnouncementContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04C4D5] focus:border-transparent h-24 resize-none"
                  placeholder="Write your announcement..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAnnouncementForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-happy-monkey"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAnnouncement}
                  disabled={!announcementTitle.trim() || !announcementContent.trim()}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#04C4D5] to-[#148BAF] text-white rounded-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-happy-monkey"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Group Admin Dashboard */}
      {showAdminDashboard && (
        <GroupAdminDashboard
          groupId={groupId}
          groupName={groupName}
          onClose={() => setShowAdminDashboard(false)}
        />
      )}
    </div>
  );
}
