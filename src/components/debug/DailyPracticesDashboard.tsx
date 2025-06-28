/**
 * DailyPracticesDashboard.tsx
 * A debug dashboard component for developers to inspect and fix daily practices
 * 
 * USAGE:
 * Import this component temporarily for debugging:
 * import DailyPracticesDashboard from './DailyPracticesDashboard';
 * 
 * Then add it to your component tree:
 * <DailyPracticesDashboard />
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { usePractices } from '@/context/PracticeContext';
import { ensureDailyPracticesPersistence } from '@/context/practiceUtils.persistence-fix';

interface DailyPractice {
  id: number;
  name: string;
  isDaily?: boolean;
  streak?: number;
  icon?: string;
}

interface DatabasePractice {
  user_id: string;
  practice_id: number;
  added_at: string;
}

const DailyPracticesDashboard: React.FC = () => {
  const { user } = useAuth();
  const { practices } = usePractices();
  const [dbPractices, setDbPractices] = useState<DatabasePractice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{text: string, type: 'info' | 'success' | 'error'} | null>(null);
  
  // Daily practices from in-memory data
  const memoryDailyPractices = practices.filter(p => p.isDaily === true);
  
  // Fetch database data on mount
  useEffect(() => {
    if (!user?.id) return;
    
    async function fetchDailyPractices() {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('user_daily_practices')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        setDbPractices(data || []);
        setMessage({ 
          text: `Found ${data?.length || 0} daily practices in database`, 
          type: 'info' 
        });
      } catch (error) {
        console.error('Error fetching daily practices:', error);
        setMessage({ 
          text: `Error fetching daily practices: ${error instanceof Error ? error.message : 'Unknown error'}`,
          type: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDailyPractices();
  }, [user?.id]);
  
  // Find discrepancies between memory and database
  const findDiscrepancies = () => {
    // Get IDs
    const memoryIds = new Set(memoryDailyPractices.map(p => p.id));
    const dbIds = new Set(dbPractices.map(p => p.practice_id));
    
    // Find differences
    const onlyInMemory = [...memoryIds].filter(id => !dbIds.has(id));
    const onlyInDb = [...dbIds].filter(id => !memoryIds.has(id));
    
    return {
      onlyInMemory,
      onlyInDb,
      hasDiscrepancies: onlyInMemory.length > 0 || onlyInDb.length > 0
    };
  };
  
  const discrepancies = findDiscrepancies();
  
  // Fix discrepancies
  const fixDiscrepancies = async () => {
    if (!user?.id) {
      setMessage({ text: 'User not logged in', type: 'error' });
      return;
    }
    
    setMessage({ text: 'Fixing discrepancies...', type: 'info' });
    
    try {
      // Use our enhanced persistence fix
      await ensureDailyPracticesPersistence(user.id, practices);
      
      // Refresh database data
      const { data, error } = await supabase
        .from('user_daily_practices')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setDbPractices(data || []);
      setMessage({ text: 'Discrepancies fixed successfully!', type: 'success' });
    } catch (error) {
      console.error('Error fixing discrepancies:', error);
      setMessage({ 
        text: `Error fixing discrepancies: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        type: 'error' 
      });
    }
  };
  
  // Add practice to daily
  const addToDaily = async (practiceId: number) => {
    if (!user?.id) return;
    
    try {
      const practiceToUpdate = practices.find(p => p.id === practiceId);
      if (!practiceToUpdate) {
        setMessage({ text: `Practice with ID ${practiceId} not found`, type: 'error' });
        return;
      }
      
      // Get practice context from window
      const practiceContext = (window as any).__PRACTICE_CONTEXT__;
      if (practiceContext && practiceContext.addPractice) {
        practiceContext.addPractice({
          ...practiceToUpdate,
          isDaily: true
        });
        setMessage({ text: `Added practice "${practiceToUpdate.name}" to daily practices`, type: 'success' });
      } else {
        setMessage({ text: 'Practice context not available', type: 'error' });
      }
    } catch (error) {
      setMessage({ 
        text: `Error adding practice: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      });
    }
  };
  
  // Remove practice from daily
  const removeFromDaily = async (practiceId: number) => {
    if (!user?.id) return;
    
    try {
      const practiceToUpdate = practices.find(p => p.id === practiceId);
      if (!practiceToUpdate) {
        setMessage({ text: `Practice with ID ${practiceId} not found`, type: 'error' });
        return;
      }
      
      // Get practice context from window
      const practiceContext = (window as any).__PRACTICE_CONTEXT__;
      if (practiceContext && practiceContext.addPractice) {
        practiceContext.addPractice({
          ...practiceToUpdate,
          isDaily: false
        });
        setMessage({ text: `Removed practice "${practiceToUpdate.name}" from daily practices`, type: 'success' });
      } else {
        setMessage({ text: 'Practice context not available', type: 'error' });
      }
    } catch (error) {
      setMessage({ 
        text: `Error removing practice: ${error instanceof Error ? error.message : 'Unknown error'}`,
        type: 'error'
      });
    }
  };

  if (!user) {
    return (
      <div style={{ padding: '20px', borderRadius: '8px', background: '#f8f9fa', margin: '20px' }}>
        <h3>Daily Practices Dashboard</h3>
        <p>Please log in to use this tool</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      borderRadius: '8px', 
      background: '#f8f9fa', 
      margin: '20px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h3 style={{ marginTop: 0 }}>Daily Practices Dashboard</h3>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          borderRadius: '4px', 
          marginBottom: '15px',
          background: message.type === 'error' ? '#ffebee' : 
                     message.type === 'success' ? '#e8f5e9' : '#e3f2fd',
          color: message.type === 'error' ? '#c62828' :
                 message.type === 'success' ? '#2e7d32' : '#0277bd'
        }}>
          {message.text}
        </div>
      )}
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Summary</h4>
        <ul>
          <li>User ID: {user.id}</li>
          <li>Daily practices in memory: {memoryDailyPractices.length}</li>
          <li>Daily practices in database: {dbPractices.length}</li>
          <li>Status: {
            isLoading ? 'Loading...' : 
            discrepancies.hasDiscrepancies ? '⚠️ Discrepancies found' : '✅ In sync'
          }</li>
        </ul>
      </div>
      
      {discrepancies.hasDiscrepancies && !isLoading && (
        <div style={{ marginBottom: '20px' }}>
          <h4>Discrepancies</h4>
          {discrepancies.onlyInMemory.length > 0 && (
            <>
              <p>Found in memory but not in database:</p>
              <ul>
                {discrepancies.onlyInMemory.map(id => {
                  const practice = practices.find(p => p.id === id);
                  return (
                    <li key={`mem-${id}`}>
                      {practice?.name || 'Unknown'} (ID: {id})
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          
          {discrepancies.onlyInDb.length > 0 && (
            <>
              <p>Found in database but not in memory:</p>
              <ul>
                {discrepancies.onlyInDb.map(id => {
                  const practice = practices.find(p => p.id === id);
                  return (
                    <li key={`db-${id}`}>
                      {practice?.name || 'Unknown'} (ID: {id})
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          
          <button 
            onClick={fixDiscrepancies}
            style={{
              padding: '8px 16px',
              background: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Fix Discrepancies
          </button>
        </div>
      )}
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h4>Memory Daily Practices</h4>
          {memoryDailyPractices.length === 0 ? (
            <p>No daily practices in memory</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>ID</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {memoryDailyPractices.map(practice => (
                  <tr key={practice.id}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{practice.id}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{practice.name}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                      <button 
                        onClick={() => removeFromDaily(practice.id)}
                        style={{
                          padding: '4px 8px',
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        <div style={{ flex: 1 }}>
          <h4>Database Daily Practices</h4>
          {isLoading ? (
            <p>Loading...</p>
          ) : dbPractices.length === 0 ? (
            <p>No daily practices in database</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Practice ID</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Added At</th>
                  <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Name</th>
                </tr>
              </thead>
              <tbody>
                {dbPractices.map(practice => {
                  const fullPractice = practices.find(p => p.id === practice.practice_id);
                  return (
                    <tr key={practice.practice_id}>
                      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{practice.practice_id}</td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                        {new Date(practice.added_at).toLocaleString()}
                      </td>
                      <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                        {fullPractice?.name || 'Unknown'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h4>Other Practices (Not Daily)</h4>
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {practices
                .filter(p => p.isDaily !== true)
                .map(practice => (
                  <tr key={practice.id}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{practice.id}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{practice.name}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                      <button 
                        onClick={() => addToDaily(practice.id)}
                        style={{
                          padding: '4px 8px',
                          background: '#27ae60',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Add to Daily
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DailyPracticesDashboard;
