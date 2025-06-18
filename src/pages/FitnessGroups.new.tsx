import { useState, useEffect } from "react";
import { Plus, Users } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useAuth } from "@/context/AuthContext";
import "@/styles/SocialFeed.css";

// Define FitnessGroup interface
interface FitnessGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  location?: string;
  imageUrl?: string;
  isJoined?: boolean;
  createdAt: string;
  updatedAt: string;
}

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

// Mock functions for fitness groups API
const getFitnessGroups = async (): Promise<FitnessGroup[]> => {
  // Mock data - replace with actual API call
  return [
    {
      id: '1',
      name: 'Morning Yoga Group',
      description: 'Join us for peaceful morning yoga sessions',
      category: 'yoga',
      memberCount: 24,
      location: 'Central Park',
      imageUrl: '/api/placeholder/300/200',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Weekend Runners',
      description: 'Casual weekend running group for all levels',
      category: 'running',
      memberCount: 18,
      location: 'Riverside Trail',
      imageUrl: '/api/placeholder/300/200',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
};

const getUserGroups = async (userId: string): Promise<FitnessGroup[]> => {
  // Mock data - replace with actual API call
  console.log(`Getting groups for user ${userId}`);
  return [];
};

const joinFitnessGroup = async (userId: string, groupId: string): Promise<boolean> => {
  // Mock API call - replace with actual implementation
  console.log(`User ${userId} joining group ${groupId}`);
  return true;
};

const leaveFitnessGroup = async (userId: string, groupId: string): Promise<boolean> => {
  // Mock API call - replace with actual implementation
  console.log(`User ${userId} leaving group ${groupId}`);
  return true;
};

const createFitnessGroup = async (groupData: Partial<FitnessGroup>): Promise<FitnessGroup> => {
  // Mock API call - replace with actual implementation
  const newGroup: FitnessGroup = {
    id: Math.random().toString(36).substr(2, 9),
    name: groupData.name || '',
    description: groupData.description || '',
    category: groupData.category || 'other',
    memberCount: 1,
    location: groupData.location,
    imageUrl: groupData.imageUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  return newGroup;
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
        ...newGroupForm
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
      (group.location && group.location.toLowerCase().includes(locationFilter.toLowerCase()));
    
    return matchesSearch && matchesActivity && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="mx-auto w-full max-w-md flex flex-col items-center">
        {/* Top Search Bar/Nav */}
        <div className="w-full px-5 pt-5 pb-2.5 flex flex-row justify-center items-center">
          <div className="w-full h-[52px] bg-[#F5F5F5] border border-white rounded-[100px] flex flex-row items-center px-5 gap-5">
            {/* Write Icon */}
            <div className="w-12 h-12 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M24 2L30 8L8 30H2V24L24 2Z" stroke="#148BAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {/* Find Your Tribe Button */}
            <button className="flex-1 h-12 bg-white rounded-[500px] border border-white drop-shadow-[1px_2px_4px_rgba(73,218,234,0.5)] flex items-center justify-center gap-2.5">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="5" r="3" fill="#FFD400"/>
                <circle cx="7" cy="10" r="3" fill="#FFD400"/>
                <circle cx="5" cy="20" r="3" fill="#FFD400"/>
                <circle cx="13" cy="27" r="3" fill="#FFD400"/>
                <circle cx="25" cy="10" r="3" fill="#FFD400"/>
                <circle cx="27" cy="20" r="3" fill="#FFD400"/>
              </svg>
              <span className="font-['Happy_Monkey'] text-base text-[#FFD400] lowercase">find your tribe</span>
            </button>
            
            {/* User Icon */}
            <div className="w-11 h-12 flex items-center justify-center">
              <svg width="28" height="32" viewBox="0 0 28 32" fill="none">
                <path d="M14 16C17.866 16 21 12.866 21 9C21 5.13401 17.866 2 14 2C10.134 2 7 5.13401 7 9C7 12.866 10.134 16 14 16Z" stroke="#148BAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 30C2 23.373 7.373 18 14 18C20.627 18 26 23.373 26 30" stroke="#148BAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Only visible if needed */}
        <div className={`w-full px-5 ${activeTab !== 'discover groups' ? 'mb-4' : 'hidden'}`}>
          <div className="flex h-10 bg-[#F7FFFF] rounded-lg shadow-sm overflow-hidden border border-[#04C4D5] w-full">
            <button
              onClick={() => setActiveTab('my groups')}
              className={`flex-1 text-sm font-medium ${
                activeTab === 'my groups'
                  ? 'bg-gradient-to-r from-[#04C4D5] to-[#208EB1] text-white'
                  : 'text-[#208EB1]'
              }`}
            >
              my groups
            </button>
            <button
              onClick={() => setActiveTab('discover groups')}
              className={`flex-1 text-sm font-medium ${
                activeTab === 'discover groups'
                  ? 'bg-gradient-to-r from-[#04C4D5] to-[#208EB1] text-white'
                  : 'text-[#208EB1]'
              }`}
            >
              discover groups
            </button>
            <button
              onClick={() => setActiveTab('challenges')}
              className={`flex-1 text-sm font-medium ${
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
            <input
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
            <input
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
              <h3 className="text-lg font-medium text-[#208EB1] mb-2">Challenges Coming Soon</h3>
              <p className="text-[#208EB1]">Stay tuned for exciting fitness challenges!</p>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="text-center py-12 bg-[#F7FFFF] rounded-lg border border-[#04C4D5]">
              <Users className="w-12 h-12 text-[#04C4D5] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#208EB1] mb-2">
                {activeTab === 'my groups' ? 'No groups joined yet' : 'No groups found'}
              </h3>
              <p className="text-[#208EB1]">
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
            <div className="flex flex-col space-y-3 w-full max-w-md mx-auto">
              {filteredGroups.map(group => (
                <div key={group.id} className={`w-full rounded-lg overflow-hidden ${group.isJoined ? 'bg-[#F5F5F5]' : 'bg-white'} box-border p-2.5 border border-[#04C4D5] drop-shadow-[1px_2px_4px_rgba(73,218,234,0.5)]`}>
                  {/* Group Header with Activity Badge */}
                  <div className="w-full h-[26px] relative mb-2.5">
                    {/* Activity Badge */}
                    <div className="absolute left-0 top-0 bg-[rgba(83,252,255,0.1)] rounded-lg py-1 px-2 z-[1]">
                      <span className="text-[#148BAF] font-['Happy_Monkey'] text-xs lowercase">
                        {group.category}
                      </span>
                    </div>
                    
                    {/* Group Name */}
                    <div className="flex justify-center items-center h-full w-full">
                      <h3 className="text-[#148BAF] font-['Righteous'] text-base uppercase text-center">
                        {group.name || 'morning running group'}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div className="w-full mb-2.5">
                    <p className="text-xs font-['Happy_Monkey'] text-black text-center lowercase">
                      {group.description || 'start your day right with our energetic morning running group. all paces welcome! every sunday morning the run starts'}
                    </p>
                  </div>
                  
                  {/* Group Stats */}
                  <div className="flex w-full mb-2.5 space-x-2.5">
                    {/* Members Count */}
                    <div className="flex-1 bg-white rounded-lg py-1 px-2 flex justify-center items-center gap-1">
                      <svg width="14" height="16" viewBox="0 0 20 20" className="text-[#148BAF]" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[#148BAF] font-['Happy_Monkey'] text-xs lowercase">
                        {group.memberCount || 88} members
                      </span>
                    </div>
                    
                    {/* Location */}
                    <div className="flex-1 bg-white rounded-lg py-1 px-2 flex justify-center items-center gap-1">
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
                    className={`w-full h-[26px] rounded-lg flex justify-center items-center ${
                      group.isJoined 
                        ? 'bg-[#FCDF4D] border border-white'
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
      
      {/* Bottom Search/Post Bar */}
      <div className="fixed w-full max-w-md h-[52px] left-1/2 -translate-x-1/2 bottom-5 px-5">
        <div className="w-full h-full bg-[#DEFFFF] border border-white drop-shadow-[1px_2px_4px_rgba(73,218,234,0.5)] rounded-[100px] flex items-center px-3 gap-2.5">
          {/* Search Input */}
          <input
            type="text"
            placeholder="search a activity"
            className="flex-1 h-full bg-transparent border-none outline-none text-[#0097AA] text-xs font-['Happy_Monkey'] lowercase"
          />
          
          {/* Emoji Button */}
          <button className="w-6 h-6 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#04C4D5">
              <circle cx="12" cy="12" r="10" stroke="#04C4D5" strokeWidth="1" />
              <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="#04C4D5" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="8.5" cy="9.5" r="1.5" fill="#04C4D5" />
              <circle cx="15.5" cy="9.5" r="1.5" fill="#04C4D5" />
            </svg>
          </button>
          
          {/* Post Button */}
          <button className="h-8 px-2.5 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#148BAF] text-xs font-['Happy_Monkey'] lowercase">post</span>
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
            <h2 className="text-lg font-semibold text-[#208EB1] mb-6 pr-8">Create a New Fitness Group</h2>
            <form onSubmit={handleCreateGroup} className="flex flex-col gap-4">
              <input 
                required 
                className="border border-[#04C4D5] rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#04C4D5] focus:border-transparent" 
                placeholder="Group Name" 
                value={newGroupForm.name} 
                onChange={e => setNewGroupForm(f => ({ ...f, name: e.target.value }))} 
              />
              <textarea 
                className="border border-[#04C4D5] rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#04C4D5] focus:border-transparent" 
                placeholder="Description (optional)" 
                rows={3}
                value={newGroupForm.description} 
                onChange={e => setNewGroupForm(f => ({ ...f, description: e.target.value }))} 
              />
              <input 
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
                className="mt-4 w-full px-6 py-3 rounded-lg bg-[#04C4D5] hover:bg-[#06B6D4] text-white text-sm font-medium transition-colors"
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
