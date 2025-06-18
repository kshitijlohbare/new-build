import { useState, useEffect } from "react";
import { Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { useAuth } from "@/context/AuthContext";
import { 
  FitnessGroup, 
  getFitnessGroups, 
  getUserGroups, 
  joinFitnessGroup, 
  leaveFitnessGroup,
  createFitnessGroup
} from "@/helpers/fitnessGroupUtils";
import FitnessGroupCard from "@/components/fitness/FitnessGroupCard";
import "@/styles/FitnessGroups.css";

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
  // Using locationFilter in filteredGroups function but keeping the setter
  const [locationFilter] = useState('');
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
    <div className="Body">
      <div className="Main">

        {/* Share Your Feels Bar */}
        <div className="NewsFeed">
          <div className="Frame128">
            <div className="Frame149">
              <svg width="19" height="17" viewBox="0 0 19 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.8539 5.3566H2.12633C1.69524 5.35702 1.28183 5.52924 0.976894 5.83545C0.671951 6.14164 0.500429 6.5567 0.5 6.9896V12.8866C0.5 13.3207 0.67208 13.7367 0.978145 14.0432C1.2842 14.3495 1.69913 14.521 2.13119 14.5196L2.85732 14.5174L4.66839 16.3813H4.66853C4.74822 16.4634 4.8695 16.4889 4.97529 16.4459C5.08121 16.4029 5.15057 16.2999 5.151 16.1851L5.15714 14.5238H11.8539C12.285 14.5234 12.6984 14.3512 13.0034 14.0449C13.3082 13.7389 13.4797 13.3238 13.4803 12.8908V6.98945C13.4797 6.55659 13.3082 6.14149 13.0034 5.8353C12.6984 5.5291 12.2851 5.35688 11.8539 5.35645L11.8539 5.3566Z" fill="white"/>
                <path d="M16.8736 0.533239H7.146C6.71477 0.5338 6.30136 0.706025 5.99642 1.01209C5.69162 1.31829 5.5201 1.73335 5.51953 2.16624V4.45729C5.51953 4.61326 5.64555 4.73967 5.80089 4.73967C5.95622 4.73967 6.0821 4.61326 6.0821 4.45729V2.16624C6.08238 1.88303 6.19459 1.61159 6.39402 1.41134C6.59346 1.21109 6.86392 1.09842 7.14599 1.09814H16.8736C17.1556 1.09842 17.426 1.21108 17.6254 1.41134C17.8248 1.61159 17.937 1.88316 17.9375 2.16624V8.06328C17.9375 8.34706 17.825 8.61919 17.6248 8.81973C17.4246 9.02012 17.1533 9.13223 16.8705 9.13139L16.2265 9.12873V9.12887C16.1503 9.12817 16.077 9.15886 16.0241 9.21407L14.6098 10.6695L14.605 9.41698H14.6052C14.6046 9.26143 14.4789 9.13559 14.3238 9.13559H14.3227H14.3228C14.2482 9.13587 14.1769 9.16585 14.1242 9.21911C14.0716 9.27222 14.0423 9.34411 14.0426 9.41908L14.0496 11.3617C14.05 11.4764 14.1195 11.5794 14.2253 11.6225C14.3312 11.6656 14.4525 11.6399 14.5322 11.5579L16.3433 9.69401L16.8684 9.69611H16.8736C17.3048 9.69611 17.7185 9.52416 18.0236 9.21783C18.3285 8.91164 18.4999 8.49629 18.4999 8.06325V2.16621C18.4995 1.73335 18.328 1.31824 18.023 1.01205C17.7182 0.706003 17.3048 0.533777 16.8736 0.533203L16.8736 0.533239Z" fill="white"/>
              </svg>
            </div>
            <div className="ShareYourFeels">share your feels</div>
          </div>
          <div className="Frame127">
            <div className="GroupWorkIconsvgCo">
              <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.6295 3.41176C14.6295 4.58785 13.6762 5.54129 12.5001 5.54129C11.324 5.54129 10.3706 4.58785 10.3706 3.41176C10.3706 2.23566 11.324 1.28223 12.5001 1.28223C13.6762 1.28223 14.6295 2.23566 14.6295 3.41176Z" fill="#148BAF"/>
                <path d="M6.75857 7.95552C6.75857 9.13161 5.80514 10.085 4.62904 10.085C3.45295 10.085 2.49951 9.13161 2.49951 7.95552C2.49951 6.77942 3.45295 5.82617 4.62904 5.82617C5.80514 5.82617 6.75857 6.77942 6.75857 7.95552Z" fill="#148BAF"/>
                <path d="M6.75857 17.0434C6.75857 18.2195 5.80514 19.1729 4.62904 19.1729C3.45295 19.1729 2.49951 18.2195 2.49951 17.0434C2.49951 15.8675 3.45295 14.9141 4.62904 14.9141C5.80514 14.9141 6.75857 15.8675 6.75857 17.0434Z" fill="#148BAF"/>
                <path d="M14.6295 21.5873C14.6295 22.7634 13.6762 23.7169 12.5001 23.7169C11.324 23.7169 10.3706 22.7634 10.3706 21.5873C10.3706 20.4113 11.324 19.458 12.5001 19.458C13.6762 19.458 14.6295 20.4113 14.6295 21.5873Z" fill="#148BAF"/>
                <path d="M22.4998 17.0434C22.4998 18.2195 21.5464 19.1729 20.3703 19.1729C19.1942 19.1729 18.2407 18.2195 18.2407 17.0434C18.2407 15.8675 19.1942 14.9141 20.3703 14.9141C21.5464 14.9141 22.4998 15.8675 22.4998 17.0434Z" fill="#148BAF"/>
                <path d="M22.4992 7.9563C22.4992 9.1324 21.546 10.0856 20.3701 10.0856C19.1942 10.0856 18.2407 9.1324 18.2407 7.9563C18.2407 6.7804 19.1942 5.82715 20.3701 5.82715C21.546 5.82715 22.4992 6.7804 22.4992 7.9563Z" fill="#148BAF"/>
              </svg>
            </div>
          </div>
          <div className="Frame130">
            <svg width="48" height="41" viewBox="0 0 48 41" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_d_914_2)">
                <rect x="3.5" y="2" width="39" height="33" rx="16.5" fill="white" shape-rendering="crispEdges"/>
                <path d="M34.0394 8.76409H30.8196V6.95278C30.8196 6.83256 30.771 6.71752 30.6847 6.63258C30.5984 6.54764 30.4815 6.5 30.3594 6.5H28.5194C28.2654 6.5 28.0595 6.70268 28.0595 6.95278V8.76409H17.9398V6.95278C17.9398 6.83256 17.8914 6.71752 17.8052 6.63258C17.7189 6.54764 17.6018 6.5 17.4799 6.5H15.6399C15.3859 6.5 15.18 6.70268 15.18 6.95278V8.76409H11.9599C11.7059 8.76409 11.5 8.96677 11.5 9.21686V14.1981C11.5 14.3181 11.5484 14.4333 11.6347 14.5183C11.721 14.6032 11.8378 14.6509 11.9599 14.6509H12.8798V29.1417C12.8798 29.5019 13.0252 29.8475 13.2841 30.1023C13.5429 30.3569 13.894 30.5 14.2599 30.5H31.7399C32.106 30.5 32.4569 30.3569 32.7157 30.1023C32.9746 29.8475 33.12 29.5018 33.12 29.1417V14.6509H34.0398C34.1619 14.6509 34.2788 14.6032 34.3651 14.5183C34.4514 14.4333 34.5 14.3181 34.5 14.1981V9.21686C34.5 9.09687 34.4514 8.9816 34.3651 8.89666C34.2788 8.81172 34.1619 8.76409 34.0398 8.76409H34.0394ZM28.9796 7.40555H29.8995V11.0282H28.9796V7.40555ZM16.0995 7.40555H17.0194V11.0282H16.0995V7.40555ZM32.1993 29.1415C32.1993 29.2615 32.1509 29.3768 32.0647 29.4617C31.9784 29.5464 31.8615 29.5943 31.7394 29.5943H14.2593C14.0053 29.5943 13.7994 29.3916 13.7994 29.1415V14.6507H32.1992L32.1993 29.1415ZM33.5794 13.7452L12.4197 13.745V9.66957H15.1796V11.4809H15.1798C15.1798 11.6011 15.2282 11.7161 15.3145 11.8011C15.4008 11.886 15.5176 11.9339 15.6397 11.9339H17.4797C17.6016 11.9339 17.7187 11.886 17.805 11.8011C17.8913 11.7161 17.9397 11.6011 17.9397 11.4809V9.66957H28.0593V11.4809C28.0593 11.6011 28.108 11.7161 28.194 11.8011C28.2803 11.886 28.3974 11.9339 28.5193 11.9339H30.3593C30.4814 11.9339 30.5982 11.886 30.6845 11.8011C30.7708 11.7161 30.8194 11.6011 30.8194 11.4809V9.66957H33.5793L33.5794 13.7452Z" fill="#148BAF"/>
              </g>
              <defs>
                <filter id="filter0_d_914_2" x="0.5" y="0" width="47" height="41" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dx="1" dy="2"/>
                  <feGaussianBlur stdDeviation="2"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0.286275 0 0 0 0 0.85451 0 0 0 0 0.917647 0 0 0 0.5 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_914_2"/>
                </filter>
              </defs>
            </svg>
          </div>
        </div>

        {/* Yellow Fitness Groups Header */}
        <div className="fitness-header">
          <h1 className="fitness-title">fitness groups</h1>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'my groups' ? 'active' : ''}`}
            onClick={() => setActiveTab('my groups')}
          >
            My Groups
          </button>
          <button 
            className={`tab-button ${activeTab === 'discover groups' ? 'active' : ''}`}
            onClick={() => setActiveTab('discover groups')}
          >
            Discover
          </button>
          <button 
            className={`tab-button ${activeTab === 'challenges' ? 'active' : ''}`}
            onClick={() => setActiveTab('challenges')}
          >
            Challenges
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <Search size={18} color="#04C4D5" />
          <input 
            type="text" 
            placeholder="Search groups..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="filters-container">
          <div className="Frame124">
            {Object.entries(groupCategories).map(([key, value]) => (
              <button 
                key={key} 
                className={`InputBar ${activityFilter === key ? 'active' : ''}`}
                onClick={() => setActivityFilter(activityFilter === key ? '' : key)}
              >
                <div>{value}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Create Group or Group Listing */}
        {showNewGroupForm ? (
          <div className="create-group-form">
            <h2>Create New Group</h2>
            <form onSubmit={handleCreateGroup}>
              <div className="form-group">
                <label htmlFor="name">Group Name</label>
                <input 
                  type="text" 
                  id="name" 
                  value={newGroupForm.name} 
                  onChange={(e) => setNewGroupForm({...newGroupForm, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea 
                  id="description" 
                  value={newGroupForm.description}
                  onChange={(e) => setNewGroupForm({...newGroupForm, description: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input 
                  type="text" 
                  id="location" 
                  value={newGroupForm.location}
                  onChange={(e) => setNewGroupForm({...newGroupForm, location: e.target.value})} 
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select 
                  id="category" 
                  value={newGroupForm.category}
                  onChange={(e) => setNewGroupForm({...newGroupForm, category: e.target.value})}
                  required
                >
                  {Object.entries(groupCategories).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="meetingFrequency">Meeting Frequency</label>
                <input 
                  type="text" 
                  id="meetingFrequency" 
                  value={newGroupForm.meetingFrequency}
                  onChange={(e) => setNewGroupForm({...newGroupForm, meetingFrequency: e.target.value})}
                  placeholder="e.g. Weekly on Mondays, 7 PM"
                  required
                />
              </div>
              
              <div className="form-buttons">
                <button 
                  type="button" 
                  className="cancel-button" 
                  onClick={() => setShowNewGroupForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">Create Group</button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Create Group Button */}
            <div className="create-group-button-container">
              <button 
                className="create-group-button"
                onClick={() => setShowNewGroupForm(true)}
              >
                <Plus size={20} color="#FFFFFF" />
                <span>Create New Group</span>
              </button>
            </div>

            {/* Groups Listing */}
            <div className="groups-container">
              {isLoading ? (
                <div className="loading">Loading groups...</div>
              ) : filteredGroups.length === 0 ? (
                <div className="no-groups">
                  {activeTab === 'my groups'
                    ? "You haven't joined any groups yet."
                    : activeTab === 'challenges'
                    ? "No challenges available at the moment."
                    : "No fitness groups found matching your criteria."}
                </div>
              ) : (
                filteredGroups.map(group => (
                  <FitnessGroupCard
                    key={group.id}
                    group={group}
                    isJoined={group.isJoined ?? false}
                    onJoin={handleJoinGroup}
                    onLeave={handleLeaveGroup}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
