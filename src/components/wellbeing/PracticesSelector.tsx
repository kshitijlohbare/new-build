import { useState, useEffect } from 'react';
import { useDailyPractices } from '@/context/DailyPracticeContext';
import { PracticeWithPoints } from '@/context/practicePointsUtils';
import { supabase } from '@/lib/supabaseClient';

/**
 * PracticesSelector component allows users to browse all available practices
 * and add them to their daily practices list
 */
export default function PracticesSelector() {
  const [allPractices, setAllPractices] = useState<PracticeWithPoints[]>([]);
  const [filteredPractices, setFilteredPractices] = useState<PracticeWithPoints[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { dailyPractices, addToDailyPractices } = useDailyPractices();
  
  // Load all available practices
  useEffect(() => {
    const fetchPractices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('practices')
          .select('*');
          
        if (error) throw error;
        
        if (data) {
          setAllPractices(data);
          setFilteredPractices(data);
        }
      } catch (err) {
        console.error('Error fetching practices:', err);
        setError('Failed to load practices. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPractices();
  }, []);
  
  // Filter practices based on search term and category
  useEffect(() => {
    const filterPractices = () => {
      let filtered = [...allPractices];
      
      // Filter by search term
      if (searchTerm) {
        const lowerSearchTerm = searchTerm.toLowerCase();
        filtered = filtered.filter(
          practice => 
            practice.name.toLowerCase().includes(lowerSearchTerm) ||
            (practice.description && practice.description.toLowerCase().includes(lowerSearchTerm))
        );
      }
      
      // Filter by category
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(
          practice => 
            practice.category === selectedCategory ||
            (practice.tags && practice.tags.includes(selectedCategory))
        );
      }
      
      setFilteredPractices(filtered);
    };
    
    filterPractices();
  }, [searchTerm, selectedCategory, allPractices]);
  
  // Check if a practice is already in daily practices
  const isInDailyPractices = (practiceId: number) => {
    return dailyPractices.some(practice => practice.id === practiceId);
  };
  
  // Handle adding practice to daily practices
  const handleAddToDailyPractices = async (practice: PracticeWithPoints) => {
    if (isInDailyPractices(practice.id)) return;
    console.log('[PracticesSelector] Adding practice to daily:', practice.id);
    const success = await addToDailyPractices(practice.id);
    console.log('[PracticesSelector] RPC result:', success);
    if (!success) {
      setError('Failed to add practice to daily practices. Please try again.');
    }
  };
  
  // Get all unique categories from practices
  const categories = ['all', ...new Set(
    allPractices.flatMap(practice => 
      [
        practice.category, 
        ...(practice.tags || [])
      ].filter(Boolean) as string[]
    )
  )];
  
  if (isLoading) {
    return <div className="loading-spinner">Loading practices...</div>;
  }
  
  return (
    <div className="practices-selector-container">
      <h2>Browse Practices</h2>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      <div className="practices-filter">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search practices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="category-filter">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="practices-grid">
        {filteredPractices.length === 0 ? (
          <div className="no-practices-message">
            No practices found matching your filters.
          </div>
        ) : (
          filteredPractices.map(practice => (
            <div key={practice.id} className="practice-item">
              <div className="practice-details">
                <h3>{practice.name}</h3>
                <p>{practice.description}</p>
                <div className="practice-meta">
                  <span className="points-per-minute">
                    {practice.points_per_minute || 1} points/min
                  </span>
                  
                  {practice.category && (
                    <span className="practice-category">
                      {practice.category}
                    </span>
                  )}
                  
                  {practice.tags && practice.tags.length > 0 && (
                    <div className="practice-tags">
                      {practice.tags.map((tag: string) => (
                        <span key={tag} className="practice-tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="practice-actions">
                {isInDailyPractices(practice.id) ? (
                  <button className="added-btn" disabled>
                    Added to Daily
                  </button>
                ) : (
                  <button 
                    className="add-btn"
                    onClick={() => handleAddToDailyPractices(practice)}
                  >
                    Add to Daily
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
