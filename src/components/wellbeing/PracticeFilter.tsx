/**
 * PracticeFilter.tsx
 * A dedicated component to handle practice filtering functionality
 * This improves code organization and makes the Practices component more focused
 */

import React, { useEffect, useMemo, useCallback } from 'react';
import { Practice, FilterCategory } from '@/utils/TypeUtilities';
import { logError } from '@/utils/ErrorHandling';

export interface PracticeFilterProps {
  practices: Practice[];
  activeTab: string;
  onFilterChange: (filteredPractices: Practice[]) => void;
  searchQuery?: string;
}

export function usePracticeFilters(practices: Practice[]) {
  // Memoize filter categories to prevent unnecessary recalculations
  const filterCategories = useMemo(() => {
    try {
      if (!practices || practices.length === 0) {
        return [{ id: 'all', label: 'all', count: 0 }];
      }
      
      // Start with the "all" filter
      const categories: FilterCategory[] = [
        { id: 'all', label: 'all', count: practices.length }
      ];
      
      // Create maps to count different types of practices
      const sourcesMap = new Map<string, number>();
      const iconsMap = new Map<string, number>();
      const tagsMap = new Map<string, number>();
      const durationMap = new Map<string, number>();
      const pointsMap = new Map<string, number>();
      
      // Process each practice to extract filter data
      practices.forEach(practice => {
        // Extract sources
        if (practice.source) {
          // Source-based categories (huberman, naval)
          if (practice.source.toLowerCase().includes('huberman')) {
            const count = sourcesMap.get('huberman') || 0;
            sourcesMap.set('huberman', count + 1);
          } else if (practice.source.toLowerCase().includes('naval')) {
            const count = sourcesMap.get('naval') || 0;
            sourcesMap.set('naval', count + 1);
          }
          
          // Add other common sources if they appear multiple times
          const sourceLower = practice.source.toLowerCase();
          const count = sourcesMap.get(sourceLower) || 0;
          sourcesMap.set(sourceLower, count + 1);
        }
        
        // Extract practice types from icons
        if (practice.icon) {
          const count = iconsMap.get(practice.icon) || 0;
          iconsMap.set(practice.icon, count + 1);
          
          // Specific mappings for common practice types
          if (['meditation', 'sparkles', 'breathing'].includes(practice.icon)) {
            const count = sourcesMap.get('meditation') || 0;
            sourcesMap.set('meditation', count + 1);
          }
          
          if (['shower', 'yoga'].includes(practice.icon)) {
            const count = sourcesMap.get('physical') || 0;
            sourcesMap.set('physical', count + 1);
          }
          
          if (['journal', 'moleskine'].includes(practice.icon)) {
            const count = sourcesMap.get('journal') || 0;
            sourcesMap.set('journal', count + 1);
          }
        }
        
        // Extract from practice name
        const nameLower = practice.name.toLowerCase();
        if (nameLower.includes('meditation') || nameLower.includes('breathing')) {
          const count = sourcesMap.get('meditation') || 0;
          sourcesMap.set('meditation', count + 1);
        }
        
        if (nameLower.includes('exercise') || nameLower.includes('yoga') || 
            nameLower.includes('physical')) {
          const count = sourcesMap.get('physical') || 0;
          sourcesMap.set('physical', count + 1);
        }
        
        if (nameLower.includes('journal') || nameLower.includes('gratitude')) {
          const count = sourcesMap.get('journal') || 0;
          sourcesMap.set('journal', count + 1);
        }
        
        // Extract from tags
        if (practice.tags) {
          practice.tags.forEach(tag => {
            const tagLower = tag.toLowerCase();
            const count = tagsMap.get(tagLower) || 0;
            tagsMap.set(tagLower, count + 1);
            
            if (tagLower === 'neuroscience' || tagLower === 'brain') {
              const count = sourcesMap.get('neuroscience') || 0;
              sourcesMap.set('neuroscience', count + 1);
            }
          });
        }
        
        // Track daily practices
        if (practice.isDaily) {
          const count = sourcesMap.get('daily') || 0;
          sourcesMap.set('daily', count + 1);
        }
        
        // Track duration categories
        if (practice.duration) {
          if (practice.duration <= 5) {
            const count = durationMap.get('quick') || 0;
            durationMap.set('quick', count + 1);
            
            // Also add to sources map for quick practices
            const count2 = sourcesMap.get('quick') || 0;
            sourcesMap.set('quick', count2 + 1);
          } else if (practice.duration <= 15) {
            const count = durationMap.get('medium') || 0;
            durationMap.set('medium', count + 1);
          } else {
            const count = durationMap.get('long') || 0;
            durationMap.set('long', count + 1);
          }
        }
        
        // Track high point practices (popular)
        if (practice.points) {
          if (practice.points >= 5) {
            const count = pointsMap.get('high') || 0;
            pointsMap.set('high', count + 1);
            
            // Also add to sources map for popular practices
            const count2 = sourcesMap.get('popular') || 0;
            sourcesMap.set('popular', count2 + 1);
          }
        }
      });
      
      // Add sources with at least one practice
      sourcesMap.forEach((count, source) => {
        if (count > 0) {
          let label = source;
          if (source === 'huberman') label = 'andrew huberman';
          if (source === 'naval') label = 'naval ravikant';
          
          // Only add if not already in categories
          if (!categories.some(cat => cat.id === source)) {
            categories.push({
              id: source,
              label,
              count
            });
          }
        }
      });
      
      // Sort categories by count (except 'all' stays first)
      const sortedCategories = [
        categories[0],
        ...categories.slice(1).sort((a, b) => b.count - a.count)
      ];
      
      // Limit to a reasonable number of categories
      const finalCategories = sortedCategories.slice(0, 12);
      
      return finalCategories;
    } catch (error) {
      logError('Error generating filter categories', { context: { practicesCount: practices.length }});
      return [{ id: 'all', label: 'all', count: practices.length || 0 }];
    }
  }, [practices]);
  
  return { filterCategories };
}

// Common filter predicates - memoize outside component for reuse
const createFilterHelpers = () => ({
  isMeditation: (practice: Practice): boolean => {
    return Boolean(
      practice.icon === 'sparkles' || 
      practice.icon === 'meditation' || 
      practice.icon === 'breathing' ||
      practice.name.toLowerCase().includes('meditation') || 
      practice.name.toLowerCase().includes('mindfulness') ||
      practice.name.toLowerCase().includes('breathe') || 
      practice.name.toLowerCase().includes('breathing') ||
      (practice.tags && practice.tags.some(tag => 
        tag.toLowerCase().includes('meditation') || 
        tag.toLowerCase().includes('mindful') || 
        tag.toLowerCase().includes('breath')
      ))
    );
  },
  isPhysical: (practice: Practice): boolean => {
    return Boolean(
      practice.icon === 'shower' || 
      practice.icon === 'yoga' ||
      practice.name.toLowerCase().includes('exercise') || 
      practice.name.toLowerCase().includes('stretching') ||
      practice.name.toLowerCase().includes('shower') || 
      practice.name.toLowerCase().includes('cold') ||
      practice.name.toLowerCase().includes('yoga') ||
      (practice.tags && practice.tags.some(tag => 
        tag.toLowerCase().includes('physical') || 
        tag.toLowerCase().includes('exercise') || 
        tag.toLowerCase().includes('yoga') || 
        tag.toLowerCase().includes('cold')
      ))
    );
  },
  isJournal: (practice: Practice): boolean => {
    return Boolean(
      practice.icon === 'moleskine' || 
      practice.icon === 'journal' ||
      practice.name.toLowerCase().includes('journal') || 
      practice.name.toLowerCase().includes('write') || 
      practice.name.toLowerCase().includes('gratitude') ||
      (practice.tags && practice.tags.some(tag => 
        tag.toLowerCase().includes('journal') || 
        tag.toLowerCase().includes('writing') || 
        tag.toLowerCase().includes('gratitude')
      ))
    );
  },
  isHuberman: (practice: Practice): boolean => {
    return Boolean(
      (practice.source && practice.source.toLowerCase().includes('huberman')) || 
      (practice.source && practice.source.toLowerCase().includes('andrew')) ||
      (practice.tags && practice.tags.some(tag => 
        tag.toLowerCase().includes('huberman') || 
        tag.toLowerCase().includes('andrew huberman')
      ))
    );
  },
  isNaval: (practice: Practice): boolean => {
    return Boolean(
      (practice.source && practice.source.toLowerCase().includes('naval')) || 
      (practice.source && practice.source.toLowerCase().includes('ravikant')) ||
      (practice.tags && practice.tags.some(tag => 
        tag.toLowerCase().includes('naval') || 
        tag.toLowerCase().includes('ravikant') || 
        tag.toLowerCase().includes('naval ravikant')
      ))
    );
  },
  isNeuroscience: (practice: Practice): boolean => {
    return Boolean(
      (practice.source && practice.source.toLowerCase().includes('neuroscience')) || 
      (practice.source && practice.source.toLowerCase().includes('stress reduction')) ||
      practice.name.toLowerCase().includes('breathing') || 
      practice.name.toLowerCase().includes('mindfulness') ||
      practice.name.toLowerCase().includes('neuroscience') || 
      practice.name.toLowerCase().includes('stress') ||
      (practice.tags && practice.tags.some(tag => 
        tag.toLowerCase().includes('neuroscience') || 
        tag.toLowerCase().includes('stress') || 
        tag.toLowerCase().includes('anxiety') || 
        tag.toLowerCase().includes('focus') ||
        tag.toLowerCase().includes('brain')
      ))
    );
  },
  isPopular: (practice: Practice): boolean => Boolean(practice.points && practice.points >= 5),
  isDaily: (practice: Practice): boolean => practice.isDaily === true,
  isQuick: (practice: Practice): boolean => Boolean(practice.duration && practice.duration <= 5),
  matchesCategory: (practice: Practice, categoryId: string): boolean => {
    const categoryLower = categoryId.toLowerCase();
    return Boolean(
      // Check source
      (practice.source && practice.source.toLowerCase().includes(categoryLower)) ||
      // Check name
      practice.name.toLowerCase().includes(categoryLower) ||
      // Check description
      practice.description.toLowerCase().includes(categoryLower) ||
      // Check tags 
      (practice.tags && practice.tags.some(tag => 
        tag.toLowerCase().includes(categoryLower)
      )) ||
      // Check icon (exact match)
      (practice.icon && practice.icon.toLowerCase() === categoryLower)
    );
  },
  matchesSearch: (practice: Practice, query: string): boolean => {
    if (!query) return true;
    const queryLower = query.toLowerCase();
    return Boolean(
      practice.name.toLowerCase().includes(queryLower) ||
      practice.description.toLowerCase().includes(queryLower) ||
      (practice.tags && practice.tags.some(tag => 
        tag.toLowerCase().includes(queryLower)
      )) ||
      (practice.source && practice.source.toLowerCase().includes(queryLower))
    );
  }
});

const PracticeFilter: React.FC<PracticeFilterProps> = ({
  practices,
  activeTab,
  onFilterChange,
  searchQuery = ''
}) => {
  // Memoize filter helpers to prevent recreation on each render
  const filterHelpers = useMemo(() => createFilterHelpers(), []);
  
  // Memoize filter function to prevent recreation on each render
  const getFilteredPractices = useCallback(() => {
    try {
      // Filter practices based on active tab and search query
      return practices
        .filter(practice => {
          // Return all practices for the "all" tab
          if (activeTab === 'all') return true;

          // Common predefined filter categories
          switch (activeTab) {
            case 'meditation': return filterHelpers.isMeditation(practice);
            case 'physical': return filterHelpers.isPhysical(practice);
            case 'journal': return filterHelpers.isJournal(practice);
            case 'huberman': return filterHelpers.isHuberman(practice);
            case 'naval': return filterHelpers.isNaval(practice);
            case 'neuroscience': return filterHelpers.isNeuroscience(practice);
            case 'popular': return filterHelpers.isPopular(practice);
            case 'daily': return filterHelpers.isDaily(practice);
            case 'quick': return filterHelpers.isQuick(practice);
            default: return filterHelpers.matchesCategory(practice, activeTab);
          }
        })
        .filter(practice => filterHelpers.matchesSearch(practice, searchQuery));
    } catch (error) {
      logError('Error filtering practices', { 
        context: { activeTab, searchQuery, practicesCount: practices.length } 
      });
      return practices; // Return all practices if filtering fails
    }
  }, [practices, activeTab, searchQuery, filterHelpers]);
  
  // Apply filters whenever inputs change
  useEffect(() => {
    const filteredPractices = getFilteredPractices();
    onFilterChange(filteredPractices);
  }, [getFilteredPractices, onFilterChange]);
  
  return null; // This is a logic-only component, no UI rendering
};

export default React.memo(PracticeFilter); // Memoize the component to prevent unnecessary re-renders
