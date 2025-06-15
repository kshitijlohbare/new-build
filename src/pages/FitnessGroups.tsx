import { useState, useEffect } from "react";
import { Users, Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useAuth } from "@/context/AuthContext";
import { KeyboardAwareInput, KeyboardAwareTextarea } from "@/components/ui/KeyboardAwareInput";
import { 
  FitnessGroup, 
  getFitnessGroups, 
  getUserGroups, 
  joinFitnessGroup, 
  leaveFitnessGroup,
  createFitnessGroup
} from "@/helpers/fitnessGroupUtils";

// Define available fitness group categories
const groupCategories = {
  yoga: 'yoga',
  running: 'running',
  cycling: 'cycling',
  hiking: 'hiking',
  swimming: 'swimming',
  pilates: 'pilates',
  weightlifting: 'weight lifting',
  martial_arts: 'martial arts',
  team_sports: 'team sports',
  other: 'other'
};

export default function FitnessGroups() {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fitness Groups state
  const [fitnessGroups, setFitnessGroups] = useState<FitnessGroup[]>([]);
  const [userGroups, setUserGroups] = useState<FitnessGroup[]>([]);
  const [activeTab, setActiveTab] = useState<'my groups' | 'discover groups' | 'challenges'>('discover groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [activityFilter, setActivityFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // New group form state
  const [newGroupForm, setNewGroupForm] = useState({
    name: '',
    description: '',
    location: '',
    category: 'yoga',
    meetingFrequency: ''
  });
  
  useEffect(() => {
    const fetchGroups = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        const allGroups = await getFitnessGroups();
        const userJoinedGroups = await getUserGroups(user.id);
        const groupsWithJoinStatus = allGroups.map(group => ({
          ...group,
          isJoined: userJoinedGroups.some(userGroup => userGroup.id === group.id)
        }));
        
        setFitnessGroups(groupsWithJoinStatus);
        setUserGroups(userJoinedGroups);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching fitness groups:', error);
        setIsLoading(false);
      }
    };
    
    fetchGroups();
  }, [user?.id]);

  const handleJoinGroup = async (group: FitnessGroup) => {
    if (!user?.id) return;
    
    try {
      const success = await joinFitnessGroup(user.id, group.id);
      if (success) {
        setFitnessGroups(groups => groups.map(g => 
          g.id === group.id ? { ...g, isJoined: true, memberCount: (g.memberCount || 0) + 1 } : g
        ));
        setUserGroups(groups => [...groups, { ...group, isJoined: true }]);
        toast({
          title: "Success",
          description: `You have joined the ${group.name} group!`,
          variant: "success"
        });
      }
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  const handleLeaveGroup = async (group: FitnessGroup) => {
    if (!user?.id) return;
    
    try {
      const success = await leaveFitnessGroup(user.id, group.id);
      if (success) {
        setFitnessGroups(groups => groups.map(g => 
          g.id === group.id ? { ...g, isJoined: false, memberCount: Math.max(0, (g.memberCount || 1) - 1) } : g
        ));
        setUserGroups(groups => groups.filter(g => g.id !== group.id));
        toast({
          title: "Success",
          description: `You have left the ${group.name} group.`,
          variant: "success"
        });
      }
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) return;
    
    try {
      const newGroup = await createFitnessGroup({
        ...newGroupForm,
        creator_id: user.id
      });
      
      if (newGroup) {
        setFitnessGroups(groups => [...groups, { ...newGroup, isJoined: true }]);
        setUserGroups(groups => [...groups, { ...newGroup, isJoined: true }]);
        setShowNewGroupForm(false);
        setNewGroupForm({
          name: '',
          description: '',
          location: '',
          category: 'yoga',
          meetingFrequency: ''
        });
        toast({
          title: "Success",
          description: `Your group "${newGroup.name}" has been created!`,
          variant: "success"
        });
      }
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: "Error",
        description: "Failed to create group. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Helper to determine which groups to display based on active tab
  const getDisplayedGroups = () => {
    switch (activeTab) {
      case 'my groups':
        return userGroups;
      case 'challenges':
        return []; // Placeholder for challenges
      case 'discover groups':
      default:
        return fitnessGroups;
    }
  };
  
  // Filter displayed groups
  const filteredGroups = getDisplayedGroups().filter(group => {
    const matchesSearch = !searchQuery.trim() || 
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesActivity = !activityFilter || group.category === activityFilter;
    const matchesLocation = !locationFilter.trim() || 
      group.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    return matchesSearch && matchesActivity && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-white pt-1">
      {/* Header with Yellow Button */}
      <div className="w-full flex justify-center px-5 mb-3">
        <div className="w-full max-w-md h-[60px] bg-[#FCDF4D] rounded-[16px] flex justify-center items-center shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
          <h1 className="font-['Righteous'] text-[24px] text-white uppercase tracking-wide">
            fitness groups
          </h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="mx-auto w-full max-w-md flex flex-col items-center">
        {/* Tab Navigation */}
        <div className="w-full px-5 mb-4">
          <div className="flex h-10 bg-[#F7FFFF] rounded-lg shadow-sm overflow-hidden border border-[#04C4D5] w-full">
            <button
              onClick={() => setActiveTab('my groups')}
              className={`flex-1 text-sm font-['Righteous'] uppercase ${
                activeTab === 'my groups'
                  ? 'bg-gradient-to-r from-[#04C4D5] to-[#208EB1] text-white'
                  : 'text-[#208EB1]'
              }`}
            >
              my groups
            </button>
            <button
              onClick={() => setActiveTab('discover groups')}
              className={`flex-1 text-sm font-['Righteous'] uppercase ${
                activeTab === 'discover groups'
                  ? 'bg-gradient-to-r from-[#04C4D5] to-[#208EB1] text-white'
                  : 'text-[#208EB1]'
              }`}
            >
              discover
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`flex-1 text-sm font-['Righteous'] uppercase ${
                activeTab === 'challenges'
                  ? 'bg-gradient-to-r from-[#04C4D5] to-[#208EB1] text-white'
                  : 'text-[#208EB1]'
              }`}
            >
              challenges
            </button>
          </div>
        </div>
        
        {/* Main Content Area - Groups */}
        <div className="w-full px-5 pt-2.5 mb-[70px]">
          {/* Hidden but keeping functionality */}
          <div className="hidden">
            <KeyboardAwareInput
              type="text"
              placeholder="search by name"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <select
              value={activityFilter}
              onChange={e => setActivityFilter(e.target.value)}
            >
              <option value="">activity</option>
              {Object.entries(groupCategories).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <KeyboardAwareInput
              type="text"
              placeholder="location"
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
            />
          </div>
          
          {/* Groups Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#04C4D5]"></div>
            </div>
          ) : activeTab === 'challenges' ? (
            <div className="text-center py-12 bg-[#F7FFFF] rounded-lg border border-[#04C4D5]">
              <h3 className="text-lg font-['Righteous'] text-[#208EB1] mb-2 uppercase">Challenges Coming Soon</h3>
              <p className="text-[#208EB1] font-['Happy_Monkey']">Stay tuned for exciting fitness challenges!</p>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="text-center py-12 bg-[#F7FFFF] rounded-lg border border-[#04C4D5]">
              <Users className="w-12 h-12 text-[#04C4D5] mx-auto mb-4" />
              <h3 className="text-lg font-['Righteous'] text-[#208EB1] mb-2 uppercase">
                {activeTab === 'my groups' ? 'No groups joined yet' : 'No groups found'}
              </h3>
              <p className="text-[#208EB1] font-['Happy_Monkey']">
                {activeTab === 'my groups' 
                  ? 'Join some groups to see them here' 
                  : 'Try adjusting your search filters'}
              </p>
              {activeTab === 'discover groups' && (
                <button
                  onClick={() => setShowNewGroupForm(true)}
                  className="mt-4 inline-flex items-center gap-2 py-2 px-4 bg-gradient-to-r from-[#04C4D5] to-[#208EB1] text-white rounded-md text-sm font-medium shadow hover:scale-105 transition-all"
                >
                  <Plus className="w-4 h-4" /> Create your first group
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col space-y-4 w-full max-w-md mx-auto">
              {filteredGroups.map(group => (
                <div key={group.id} className="w-full rounded-[16px] overflow-hidden bg-white border border-[#04C4D5] drop-shadow-[1px_2px_4px_rgba(73,218,234,0.5)] p-3">
                  {/* Group Header with Name */}
                  <div className="w-full flex justify-center items-center mb-3">
                    <h3 className="text-[#148BAF] font-['Righteous'] text-lg uppercase text-center">
                      {group.name || 'morning running group'}
                    </h3>
                  </div>
                  
                  {/* Group Icon and Description */}
                  <div className="flex gap-3 mb-3">
                    {/* Activity Icon */}
                    <div className="w-[60px] h-[60px] flex-shrink-0 bg-[rgba(83,252,255,0.1)] rounded-[16px] flex items-center justify-center">
                      <svg width="30" height="30" viewBox="0 0 24 24" className="text-[#148BAF]" fill="none" stroke="currentColor" strokeWidth="2">
                        {group.category === 'running' ? (
                          <path d="M13 4.5l7.5 7.5-7.5 7.5M5.5 19.5v-15" strokeLinecap="round" strokeLinejoin="round" />
                        ) : group.category === 'yoga' ? (
                          <path d="M12 4c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4s-.2 1-.6 1.4c-.4.4-.9.6-1.4.6-.5 0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.4s.2-1 .6-1.4c.4-.4.9-.6 1.4-.6zM12 8v8m-4 0c0-2.2 1.8-4 4-4s4 1.8 4 4" strokeLinecap="round" strokeLinejoin="round" />
                        ) : group.category === 'cycling' ? (
                          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" strokeLinecap="round" strokeLinejoin="round" />
                        ) : (
                          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" strokeLinecap="round" strokeLinejoin="round" />
                        )}
                      </svg>
                    </div>
                    
                    {/* Description */}
                    <div className="flex-1">
                      <p className="text-sm font-['Happy_Monkey'] text-black lowercase line-clamp-3">
                        {group.description || 'start your day right with our energetic morning running group. all paces welcome! every sunday morning the run starts'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Group Stats */}
                  <div className="flex w-full mb-3 space-x-2.5">
                    {/* Members Count */}
                    <div className="flex-1 bg-[#F7FFFF] rounded-lg py-1.5 px-3 flex justify-center items-center gap-1">
                      <svg width="14" height="16" viewBox="0 0 20 20" className="text-[#148BAF]" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[#148BAF] font-['Happy_Monkey'] text-xs lowercase">
                        {group.memberCount || 88} members
                      </span>
                    </div>
                    
                    {/* Location */}
                    <div className="flex-1 bg-[#F7FFFF] rounded-lg py-1.5 px-3 flex justify-center items-center gap-1">
                      <svg width="14" height="16" viewBox="0 0 20 20" className="text-[#148BAF]" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[#148BAF] font-['Happy_Monkey'] text-xs lowercase">
                        {group.location || 'kalyani nagar'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Join/Member Button */}
                  <button
                    onClick={() => group.isJoined ? handleLeaveGroup(group) : handleJoinGroup(group)}
                    className={`w-full h-[40px] rounded-lg flex justify-center items-center ${
                      group.isJoined 
                        ? 'bg-[#FCDF4D]'
                        : 'bg-white border border-[#04C4D5] drop-shadow-[1px_2px_4px_rgba(73,218,234,0.5)]'
                    }`}
                  >
                    <span className={`font-['Righteous'] text-base uppercase ${group.isJoined ? 'text-white' : 'text-[#148BAF]'}`}>
                      {group.isJoined ? 'i\'m a member' : 'join'}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom Search Bar */}
      <div className="fixed w-full max-w-md h-[52px] left-1/2 -translate-x-1/2 bottom-5 px-5">
        <div className="w-full h-full bg-[#DEFFFF] border border-[#04C4D5] drop-shadow-[1px_2px_4px_rgba(73,218,234,0.5)] rounded-[100px] flex items-center px-4">
          {/* Search Icon */}
          <Search className="w-5 h-5 text-[#04C4D5] flex-shrink-0" />
          
          {/* Search Input */}
          <KeyboardAwareInput
            type="text"
            placeholder="search an activity"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-1 h-full bg-transparent border-none outline-none text-[#0097AA] text-sm font-['Happy_Monkey'] ml-2 lowercase"
          />
          
          {/* Create Group Button */}
          <button 
            onClick={() => setShowNewGroupForm(true)}
            className="h-9 px-3 bg-white rounded-full flex items-center justify-center gap-1 ml-2 flex-shrink-0"
          >
            <Plus className="w-4 h-4 text-[#148BAF]" />
            <span className="text-[#148BAF] text-xs font-['Righteous'] uppercase">create</span>
          </button>
        </div>
      </div>
      
      {/* New Group Form Modal */}
      {showNewGroupForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-[#208EB1] hover:text-[#04C4D5] rounded-full hover:bg-[#F7FFFF] transition-all" 
              onClick={() => setShowNewGroupForm(false)}
            >
              <span className="text-2xl leading-none">&times;</span>
            </button>
            <h2 className="text-lg font-['Righteous'] text-[#208EB1] mb-6 pr-8 uppercase">Create a New Group</h2>
            <form onSubmit={handleCreateGroup} className="flex flex-col gap-4">
              <KeyboardAwareInput 
                required 
                className="border border-[#04C4D5] rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#04C4D5] focus:border-transparent" 
                placeholder="Group Name" 
                value={newGroupForm.name} 
                onChange={e => setNewGroupForm(f => ({ ...f, name: e.target.value }))} 
              />
              <KeyboardAwareTextarea 
                className="border border-[#04C4D5] rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#04C4D5] focus:border-transparent font-['Happy_Monkey']" 
                placeholder="Description (optional)" 
                rows={3}
                value={newGroupForm.description} 
                onChange={e => setNewGroupForm(f => ({ ...f, description: e.target.value }))} 
              />
              <KeyboardAwareInput 
                className="border border-[#04C4D5] rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#04C4D5] focus:border-transparent" 
                placeholder="Location" 
                value={newGroupForm.location} 
                onChange={e => setNewGroupForm(f => ({ ...f, location: e.target.value }))} 
              />
              <select 
                className="border border-[#04C4D5] rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#04C4D5] focus:border-transparent" 
                value={newGroupForm.category} 
                onChange={e => setNewGroupForm(f => ({ ...f, category: e.target.value }))} 
              >
                {Object.entries(groupCategories).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <input 
                className="border border-[#04C4D5] rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#04C4D5] focus:border-transparent" 
                placeholder="Meeting Frequency (e.g. Mon, Wed 7am)" 
                value={newGroupForm.meetingFrequency} 
                onChange={e => setNewGroupForm(f => ({ ...f, meetingFrequency: e.target.value }))} 
              />
              <button 
                type="submit" 
                className="mt-4 w-full px-6 py-3 rounded-lg bg-[#FCDF4D] hover:bg-[#FBD82A] text-white text-sm font-['Righteous'] uppercase transition-colors"
              >
                Create Group
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
