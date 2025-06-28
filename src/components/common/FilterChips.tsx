/**
 * FilterChips.tsx
 * A reusable component for rendering filter chips with active state management
 */

import React from 'react';
import { FilterCategory } from '@/utils/TypeUtilities';
import '@/styles/FilterChipsSystem.css';

export interface FilterChipsProps {
  categories: FilterCategory[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
  className?: string;
  id?: string;
  testId?: string;
}

const FilterChips: React.FC<FilterChipsProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  className = '',
  id = 'filter-chips-container',
  testId = 'filter-chips-container'
}) => {
  return (
    <div 
      id={id} 
      data-testid={testId}
      className={`filter-chips-container ${className}`}
    >
      {categories.map((category) => (
        <button 
          key={category.id}
          className={`filter-chip ${
            activeCategory === category.id 
              ? 'filter-chip-active' 
              : 'filter-chip-inactive'
          } rounded-[4px] px-4`} 
          data-testid={`filter-chip-${category.id}`}
          data-category={category.id}
          aria-pressed={activeCategory === category.id}
          onClick={() => onCategoryChange(category.id)}
        >
          <div className={`filter-chip-text ${
            activeCategory === category.id 
              ? 'filter-chip-text-active' 
              : 'filter-chip-text-inactive'
          }`}>
            {category.label}
            {category.count > 0 && category.id !== 'all' && (
              <span className={`filter-chip-count ${
                activeCategory === category.id
                  ? 'filter-chip-count-active'
                  : 'filter-chip-count-inactive'
              }`}>
                {category.count}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default React.memo(FilterChips);
