import { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  Ban, 
  UserMinus, 
  UserPlus,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/useToast';
import {
  MemberReport,
  AdminLog,
  getGroupMemberReports,
  getGroupAdminLogs,
  removeGroupMember,
  banGroupMember,
  promoteToAdmin,
  demoteToMember,
  getGroupMembersWithRoles
} from '@/helpers/fitnessGroupMessaging';

interface GroupAdminDashboardProps {
  groupId: number;
  groupName: string;
  onClose: () => void;
}

export default function GroupAdminDashboard({ groupId, groupName, onClose }: GroupAdminDashboardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [activeTab, setActiveTab] = useState<'reports' | 'members' | 'logs'>('reports');
  const [reports, setReports] = useState<MemberReport[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [banReason, setBanReason] = useState('');
  const [banType, setBanType] = useState<'temporary' | 'permanent'>('temporary');
  const [banExpiresAt, setBanExpiresAt] = useState('');

  // Load admin dashboard data
  useEffect(() => {
    if (!user?.id) return;

    const loadAdminData = async () => {
      setLoading(true);
      try {
        const [reportsData, membersData, logsData] = await Promise.all([
          getGroupMemberReports(groupId),
          getGroupMembersWithRoles(groupId),
          getGroupAdminLogs(groupId)
        ]);

        setReports(reportsData);
        setMembers(membersData);
        setAdminLogs(logsData);
      } catch (error) {
        console.error('Error loading admin data:', error);
        toast({
          title: "Error",
          description: "Failed to load admin dashboard",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [groupId, user?.id, toast]);

  // Handle member ban
  const handleBanMember = async () => {
    if (!user?.id || !selectedMemberId || !banReason.trim()) return;

    try {
      const expiresAt = banType === 'permanent' ? undefined : banExpiresAt;
      await banGroupMember(groupId, selectedMemberId, user.id, banReason, banType, expiresAt);
      
      setShowBanModal(false);
      setSelectedMemberId('');
      setBanReason('');
      setBanType('temporary');
      setBanExpiresAt('');
      
      // Refresh member list
      const updatedMembers = await getGroupMembersWithRoles(groupId);
      setMembers(updatedMembers);
      
      toast({
        title: "Success",
        description: "Member banned successfully",
        variant: "success"
      });
    } catch (error) {
      console.error('Error banning member:', error);
      toast({
        title: "Error",
        description: "Failed to ban member",
        variant: "destructive"
      });
    }
  };

  // Handle member removal
  const handleRemoveMember = async (memberId: string) => {
    if (!user?.id) return;

    try {
      await removeGroupMember(groupId, memberId, user.id);
      
      // Refresh member list
      const updatedMembers = await getGroupMembersWithRoles(groupId);
      setMembers(updatedMembers);
      
      toast({
        title: "Success",
        description: "Member removed successfully",
        variant: "success"
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive"
      });
    }
  };

  // Handle role changes
  const handlePromoteToAdmin = async (memberId: string) => {
    if (!user?.id) return;

    try {
      await promoteToAdmin(groupId, memberId, user.id);
      
      // Refresh member list
      const updatedMembers = await getGroupMembersWithRoles(groupId);
      setMembers(updatedMembers);
      
      toast({
        title: "Success",
        description: "Member promoted to admin",
        variant: "success"
      });
    } catch (error) {
      console.error('Error promoting member:', error);
      toast({
        title: "Error",
        description: "Failed to promote member",
        variant: "destructive"
      });
    }
  };

  const handleDemoteToMember = async (memberId: string) => {
    if (!user?.id) return;

    try {
      await demoteToMember(groupId, memberId, user.id);
      
      // Refresh member list
      const updatedMembers = await getGroupMembersWithRoles(groupId);
      setMembers(updatedMembers);
      
      toast({
        title: "Success",
        description: "Admin demoted to member",
        variant: "success"
      });
    } catch (error) {
      console.error('Error demoting admin:', error);
      toast({
        title: "Error",
        description: "Failed to demote admin",
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
            <p className="mt-4 text-gray-600 font-happy-monkey">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-orange-500" />
            <h2 className="text-xl font-happy-monkey text-[#148BAF]">Admin Dashboard - {groupName}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#04C4D5] rounded-full hover:bg-gray-100 transition-all"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-6 py-4 font-happy-monkey text-sm transition-colors ${
              activeTab === 'reports'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-600 hover:text-orange-500'
            }`}
          >
            <AlertTriangle className="w-4 h-4 inline mr-2" />
            Reports ({reports.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-6 py-4 font-happy-monkey text-sm transition-colors ${
              activeTab === 'members'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-600 hover:text-orange-500'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Members ({members.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-6 py-4 font-happy-monkey text-sm transition-colors ${
              activeTab === 'logs'
                ? 'border-b-2 border-orange-500 text-orange-500'
                : 'text-gray-600 hover:text-orange-500'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Activity Logs
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'reports' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="mb-4">
                <h3 className="text-lg font-happy-monkey text-gray-900 mb-2">Member Reports</h3>
                <p className="text-sm text-gray-600">Review and manage member reports for inappropriate behavior.</p>
              </div>
              
              {reports.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="font-happy-monkey text-lg">No reports yet</p>
                  <p className="text-sm">All clear! No member behavior reports to review.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            report.status === 'pending' ? 'bg-yellow-500' :
                            report.status === 'reviewed' ? 'bg-blue-500' :
                            report.status === 'resolved' ? 'bg-green-500' : 'bg-gray-500'
                          }`} />
                          <span className="font-happy-monkey text-sm text-gray-900">
                            Report #{report.id}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-happy-monkey">
                            {report.reason.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(report.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Reported User:</strong> {report.reported_user_profile?.display_name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Reported By:</strong> {report.reporter_profile?.display_name || 'Unknown'}
                        </p>
                        {report.description && (
                          <p className="text-sm text-gray-700">
                            <strong>Details:</strong> {report.description}
                          </p>
                        )}
                      </div>
                      
                      {report.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedMemberId(report.reported_user_id);
                              setShowBanModal(true);
                            }}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                          >
                            <Ban className="w-3 h-3 inline mr-1" />
                            Ban Member
                          </button>
                          <button
                            onClick={() => handleRemoveMember(report.reported_user_id)}
                            className="px-3 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700 transition-colors"
                          >
                            <UserMinus className="w-3 h-3 inline mr-1" />
                            Remove
                          </button>
                          <button className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors">
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            Dismiss
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'members' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="mb-4">
                <h3 className="text-lg font-happy-monkey text-gray-900 mb-2">Group Members</h3>
                <p className="text-sm text-gray-600">Manage member roles and permissions.</p>
              </div>
              
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.user_id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#04C4D5] to-[#148BAF] flex items-center justify-center text-white font-happy-monkey">
                        {member.profile?.display_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-happy-monkey text-gray-900">{member.profile?.display_name || 'Unknown User'}</p>
                        <p className="text-sm text-gray-500">@{member.profile?.username || 'unknown'}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-happy-monkey ${
                        member.role === 'admin' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {member.role}
                      </span>
                    </div>
                    
                    {member.user_id !== user?.id && (
                      <div className="flex gap-2">
                        {member.role === 'member' ? (
                          <button
                            onClick={() => handlePromoteToAdmin(member.user_id)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                          >
                            <UserPlus className="w-3 h-3 inline mr-1" />
                            Promote
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDemoteToMember(member.user_id)}
                            className="px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700 transition-colors"
                          >
                            <UserMinus className="w-3 h-3 inline mr-1" />
                            Demote
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedMemberId(member.user_id);
                            setShowBanModal(true);
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                        >
                          <Ban className="w-3 h-3 inline mr-1" />
                          Ban
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="h-full overflow-y-auto p-6">
              <div className="mb-4">
                <h3 className="text-lg font-happy-monkey text-gray-900 mb-2">Admin Activity Logs</h3>
                <p className="text-sm text-gray-600">Track all administrative actions in this group.</p>
              </div>
              
              {adminLogs.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <Eye className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="font-happy-monkey text-lg">No activity logs yet</p>
                  <p className="text-sm">Administrative actions will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {adminLogs.map((log) => (
                    <div key={log.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-happy-monkey text-sm text-gray-900">{log.action_type.replace('_', ' ')}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                      {log.action_details && (
                        <p className="text-sm text-gray-600">{JSON.stringify(log.action_details)}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        By: {log.admin_profile?.display_name || 'Unknown Admin'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ban Member Modal */}
      {showBanModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-happy-monkey text-lg text-gray-900 mb-4">Ban Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-happy-monkey text-gray-700 mb-2">Ban Type</label>
                <select
                  value={banType}
                  onChange={(e) => setBanType(e.target.value as 'temporary' | 'permanent')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="temporary">Temporary</option>
                  <option value="permanent">Permanent</option>
                </select>
              </div>
              
              {banType === 'temporary' && (
                <div>
                  <label className="block text-sm font-happy-monkey text-gray-700 mb-2">Expires At</label>
                  <input
                    type="datetime-local"
                    value={banExpiresAt}
                    onChange={(e) => setBanExpiresAt(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-happy-monkey text-gray-700 mb-2">Reason</label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-20 resize-none"
                  placeholder="Reason for ban..."
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBanModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-happy-monkey"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBanMember}
                  disabled={!banReason.trim()}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-happy-monkey"
                >
                  Ban Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
