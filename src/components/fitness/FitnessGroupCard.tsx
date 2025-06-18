import React from 'react';
import { FitnessGroup } from '@/helpers/fitnessGroupUtils';

interface FitnessGroupCardProps {
  group: FitnessGroup;
  isJoined: boolean;
  onJoin: (group: FitnessGroup) => void;
  onLeave: (group: FitnessGroup) => void;
}

const FitnessGroupCard: React.FC<FitnessGroupCardProps> = ({ 
  group, 
  isJoined,
  onJoin,
  onLeave
}) => {
  return (
    <div className="fitness-group-card">
      <div className="group-image">
        <div className="category-badge">{group.category}</div>
      </div>
      <div className="group-details">
        <h3>{group.name}</h3>
        <p className="group-description">{group.description}</p>
        <div className="group-metadata">
          <div className="group-location">
            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 7.5C6.825 7.5 7.5 6.825 7.5 6C7.5 5.175 6.825 4.5 6 4.5C5.175 4.5 4.5 5.175 4.5 6C4.5 6.825 5.175 7.5 6 7.5ZM6 0C9.3 0 12 2.475 12 5.775C12 7.889 10.4775 10.3073 7.4325 12.9765C6.9075 13.4407 6.0915 13.4407 5.5665 12.9765C2.5215 10.305 1 7.8877 1 5.775C1 2.475 3.7 0 6 0Z" fill="#148BAF"/>
            </svg>
            <span>{group.location}</span>
          </div>
          <div className="group-members">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7C16 9.2 14.2 11 12 11C9.8 11 8 9.2 8 7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7Z" stroke="#148BAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 14C8.13 14 5 17.13 5 21H19C19 17.13 15.87 14 12 14Z" stroke="#148BAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{group.memberCount || 0} members</span>
          </div>
        </div>
        <div className="group-actions">
          {isJoined ? (
            <button className="leave-group-btn" onClick={() => onLeave(group)}>Leave Group</button>
          ) : (
            <button className="join-group-btn" onClick={() => onJoin(group)}>Join Group</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FitnessGroupCard;
