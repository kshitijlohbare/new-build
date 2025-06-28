/**
 * PageTitleImproved.tsx
 * An enhanced version of PageTitle for practitioner onboarding pages
 */

import React from 'react';
import '@/styles/PractitionerOnboardingStyles.css';

export interface PageTitleImprovedProps {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

/**
 * PageTitleImproved component - An enhanced page title component 
 * Displays a title and optional subtitle with styling
 */
const PageTitleImproved: React.FC<PageTitleImprovedProps> = ({ title, subtitle, actionButton }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-gray-600">{subtitle}</p>
          )}
        </div>
        
        {actionButton && (
          <div className="ml-4">{actionButton}</div>
        )}
      </div>
    </div>
  );
};

export default PageTitleImproved;
