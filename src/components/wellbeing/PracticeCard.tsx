/**
 * PracticeCard.tsx
 * A reusable component to display a practice card
 * 
 * NOTE: This component treats the isDaily flag as the single source of truth for
 * determining if a practice is part of the user's daily practices.
 * 
 * Future database optimization: The current implementation maintains both an isDaily flag
 * and a separate user_daily_practices table. These could be consolidated into a single
 * data structure where isDaily is the only indicator needed.
 */

import React from 'react';
import { Practice } from '@/utils/TypeUtilities';
import { logError } from '@/utils/ErrorHandling';

// Import icons
import QuotesIcon from "@/assets/icons/quotes.svg";

export interface PracticeCardProps {
  practice: Practice;
  onPracticeClick: (id: number) => void;
  onToggleDaily: (practice: Practice) => void;
}

// Helper function to get emoji based on practice icon
const getIconEmoji = (icon?: string) => {
  const iconMap: Record<string, string> = {
    'shower': '🚿', 'sun': '☀️', 'moleskine': '📓', 'book': '📚',
    'relax': '😌', 'tree': '🌳', 'calendar': '📅', 'review': '📋',
    'disconnect': '🔌', 'screen': '📱', 'caffeine': '☕', 'smelling': '👃',
    'sparkles': '✨', 'anchor': '⚓', 'brain': '🧠'
  };
  
  return iconMap[icon || ''] || '📝';
};

const PracticeCard: React.FC<PracticeCardProps> = ({ 
  practice, 
  onPracticeClick,
  onToggleDaily 
}) => {
  const handleClick = () => {
    try {
      onPracticeClick(practice.id);
    } catch (error) {
      logError(`Failed to open practice details for ${practice.id}`, {
        context: { practiceId: practice.id }
      });
    }
  };

  const handleToggleDaily = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      onToggleDaily(practice);
    } catch (error) {
      logError(`Failed to toggle daily status for practice ${practice.id}`, {
        context: { practiceId: practice.id, isDaily: practice.isDaily }
      });
    }
  };

  return (
    <div 
      className={`practice-card flex flex-col justify-start items-stretch p-[var(--spacing-2)] gap-[var(--spacing-2)] w-full ${practice.isDaily ? 'practice-card-daily':'practice-card-regular'} backdrop-blur-xl rounded-[var(--borderRadius-lg)]`}
      data-testid={`practice-card-${practice.id}`}
      onClick={handleClick}
      style={{ 
        position: "relative",
        width: "100%",
        boxShadow: "var(--shadows-DEFAULT)",
        minHeight: "220px",
        height: "220px"
      }}
      aria-label={`Practice: ${practice.name}`}
      tabIndex={0}
      role="button"
    > 
      {/* Practice Card Title with Icon Circle */}
      <div 
        className={`practice-card-title w-full min-h-[48px] flex flex-wrap items-center justify-start text-left uppercase flex-none order-0 self-stretch relative ${practice.isDaily ? 'practice-card-title-daily' : 'practice-card-title-regular'}`}
        data-testid={`practice-card-title-${practice.id}`}
      >
        <div 
          className="practice-card-icon w-[24px] h-[24px] rounded-full flex items-center justify-center bg-white ml-1 mr-2"
          style={{ 
            boxShadow: "var(--shadows-sm)",
            border: practice.isDaily ? '1px solid var(--colors-secondary-light)' : '1px solid var(--colors-primary-light)',
            flexShrink: 0,
            marginTop: "2px"
          }}
          aria-hidden="true"
        >
          <span className="text-[13px]" style={{ lineHeight: 1 }}>
            {getIconEmoji(practice.icon)}
          </span>
        </div>
        <div className="line-clamp-2 text-left flex-1">{practice.name}</div>
      </div>
      
      {/* Practice Card Description */}
      <div 
        className="practice-card-description w-full h-[72px] px-2 text-left lowercase flex-none order-1 self-stretch overflow-hidden"
        data-testid={`practice-card-description-${practice.id}`}
      >
        <div className="line-clamp-4 overflow-ellipsis w-full">
          {practice.description}
        </div>
      </div>
      
      {/* Practice Card Source Tag */}
      <div 
        className="practice-card-source flex flex-row justify-start items-center py-[4px] px-[8px] gap-[4px] w-full h-[24px] bg-white rounded-[var(--borderRadius-lg)] flex-none order-2 self-stretch"
        data-testid={`practice-card-source-${practice.id}`}
      >
        {/* Left quote icon */}
        <img src={QuotesIcon} alt="" className="w-auto h-[8px] flex-none order-0 flex-grow-0" aria-hidden="true" />
        {/* Source Text */}
        <div className="practice-card-source-text mx-2 truncate overflow-hidden max-w-[75%]">
          {practice.source || 'source'}
        </div>
        {/* Right quote icon */}
        <img src={QuotesIcon} alt="" className="w-auto h-[8px] transform rotate-180 flex-none order-2 flex-grow-0" aria-hidden="true" />
      </div>
      
      {/* Practice Card Action Button */}
      <button
        onClick={handleToggleDaily}
        className={`practice-card-action py-[4px] px-[8px] gap-[4px] w-full h-[26px] rounded-[var(--borderRadius-lg)] flex-none order-3 self-stretch ${
          practice.isDaily 
            ? 'practice-card-action-daily' 
            : 'practice-card-action-regular'
        }`}
        data-testid={`practice-card-action-button-${practice.id}`}
        aria-pressed={practice.isDaily}
        aria-label={practice.isDaily ? "Remove from daily practices" : "Add to daily practices"}
      >
        <div className="w-auto h-[18px] flex items-center text-center uppercase flex-none order-0 flex-grow-0">
          {practice.isDaily ? "I'M DOING IT" : "I'LL DO IT"}
        </div>
      </button>
    </div>
  );
};

export default React.memo(PracticeCard);
