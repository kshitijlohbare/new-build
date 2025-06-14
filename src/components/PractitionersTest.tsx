import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Practitioner {
  id: number;
  name: string;
  specialty: string;
  price: number;
  location_type: string;
  [key: string]: any;
}

const PractitionersTest = () => {
  const [practitioners, setPractitioners] = useState<Practitioner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPractitioners = async () => {
      console.log('🔍 PractitionersTest: Starting fetch...');
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔗 Testing basic connection...');
        const { data, error } = await supabase.from('practitioners').select('*').limit(3);
        
        console.log('📊 Raw response:', { data, error });
        
        if (error) {
          console.error('❌ Database error:', error);
          setError(`Database error: ${error.message}`);
          return;
        }
        
        if (!data) {
          console.error('❌ No data returned');
          setError('No data returned from database');
          return;
        }
        
        console.log('✅ Success! Found practitioners:', data.length);
        console.log('📋 Practitioners data:', data);
        // Type assertion with validation
        const typedData = data as Practitioner[];
        setPractitioners(typedData);
        
      } catch (err: unknown) {
        console.error('❌ Exception:', err);
        if (err instanceof Error) {
          setError(`Exception: ${err.message}`);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
        console.log('✅ Loading complete');
      }
    };

    fetchPractitioners();
  }, []);

  console.log('🎨 Rendering PractitionersTest:', { 
    loading, 
    error, 
    practitionersCount: practitioners.length 
  });

  if (loading) {
    return (
      <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px' }}>
        <h2>🔄 Loading practitioners...</h2>
        <p>Please check console for detailed logs</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', background: '#ffeeee', margin: '20px', border: '2px solid red' }}>
        <h2>❌ Error Loading Practitioners</h2>
        <p><strong>Error:</strong> {error}</p>
        <p>Check console for detailed logs</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#eeffee', margin: '20px', border: '2px solid green' }}>
      <h2>✅ Practitioners Loaded Successfully!</h2>
      <p><strong>Count:</strong> {practitioners.length}</p>
      
      {practitioners.length === 0 ? (
        <p>No practitioners found (empty result)</p>
      ) : (
        <div>
          <h3>Practitioners List:</h3>
          {practitioners.map((practitioner, index) => (
            <div key={practitioner.id || index} style={{ 
              border: '1px solid #ccc', 
              padding: '10px', 
              margin: '10px 0',
              background: '#fff'
            }}>
              <p><strong>ID:</strong> {practitioner.id}</p>
              <p><strong>Name:</strong> {practitioner.name}</p>
              <p><strong>Specialty:</strong> {practitioner.specialty}</p>
              <p><strong>Price:</strong> ${practitioner.price}</p>
              <p><strong>Location:</strong> {practitioner.location_type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PractitionersTest;
