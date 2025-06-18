import React, { useState, useEffect, useRef } from "react";
import { Search, Plus } from 'lucide-react';
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
import FitnessGroupCard from '@/components/fitness/FitnessGroupCard';
import SocialFeed from './SocialFeed';
import '@/pages/FitnessGroups.css';

const TABS = [
  { key: 'events', label: 'friendly events' },
  { key: 'tribe', label: 'find your tribe' },
  { key: 'feels', label: 'share your feels' }
];

export default function FitnessGroups() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('events');
  const [fitnessGroups, setFitnessGroups] = useState<FitnessGroup[]>([]);
  const [userGroups, setUserGroups] = useState<FitnessGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activityFilter, setActivityFilter] = useState('');
  const swipeRef = useRef<HTMLDivElement>(null);
  let touchStartX = 0;

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
        setIsLoading(false);
      }
    };
    fetchGroups();
  }, [user?.id]);

  // Swipe handler for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      const idx = TABS.findIndex(t => t.key === activeTab);
      if (dx < 0 && idx < TABS.length - 1) setActiveTab(TABS[idx + 1].key);
      if (dx > 0 && idx > 0) setActiveTab(TABS[idx - 1].key);
    }
  };

  // --- Section Renderers ---
  const renderEvents = () => (
    <div className="events-section">
      {[1,2,3,4].map(i => (
        <div className="event-card" key={i}>
          <div className="event-img-placeholder" />
          <div className="event-details">
            <div className="event-title">MORNING RUNNING GROUP</div>
            <div className="event-desc">start your day right with our energetic morning running group. all paces welcome!...</div>
            <div className="event-meta-row">
              <span className="event-meta"><svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="#04C4D5" strokeWidth="2" fill="none"/></svg> Kalyani nagar</span>
              <span className="event-meta"><svg width="16" height="16" viewBox="0 0 16 16"><rect x="2" y="4" width="12" height="8" rx="2" stroke="#04C4D5" strokeWidth="2" fill="none"/></svg> 12 jan 2025</span>
              <span className="event-meta"><svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="#04C4D5" strokeWidth="2" fill="none"/></svg> 88 members</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTribe = () => (
    <div className="tribe-section">
      {[1,2,3].map((i, idx) => (
        <div className="tribe-card" key={i}>
          <div className="tribe-title">MORNING RUNNING GROUP</div>
          <div className="tribe-desc">start your day right with our energetic morning running group. all paces welcome! every sunday morning the run starts</div>
          <div className="tribe-meta-row">
            <span className="tribe-meta tribe-meta-cat">yoga</span>
            <span className="tribe-meta tribe-meta-members"><svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="#04C4D5" strokeWidth="2" fill="none"/></svg> 88 members</span>
            <span className="tribe-meta tribe-meta-loc"><svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="#04C4D5" strokeWidth="2" fill="none"/></svg> kalyani nagar</span>
          </div>
          {idx === 1 ? (
            <button className="tribe-btn tribe-btn-member">I'M A MEMBER</button>
          ) : (
            <button className="tribe-btn tribe-btn-join">JOIN</button>
          )}
        </div>
      ))}
    </div>
  );

  const renderFeels = () => (
    <div className="feels-section">
      <SocialFeed />
    </div>
  );

  return (
    <div className="fitnessgroups-root" ref={swipeRef} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="fitnessgroups-topnav">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`fitnessgroups-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="fitnessgroups-section">
        {activeTab === 'events' && renderEvents()}
        {activeTab === 'tribe' && renderTribe()}
        {activeTab === 'feels' && renderFeels()}
      </div>
    </div>
  );
}
