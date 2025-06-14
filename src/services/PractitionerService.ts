import { supabase } from '@/lib/supabase';

export interface Practitioner {
  id: string;
  created_at: string;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  image_url?: string;
  bio: string;
  years_experience: number;
  available_days?: string[];
  available_hours?: string[];
  hourly_rate?: number;
  education?: string;
  certifications?: string[];
  languages?: string[];
  contact_email?: string;
  contact_phone?: string;
  is_accepting_new_patients?: boolean;
}

// Sample practitioner data for initialization
export const samplePractitioners = [
  {
    name: 'Dr. Sarah Johnson',
    specialty: 'Cognitive Behavioral Therapy',
    location: 'New York, NY',
    rating: 4.9,
    bio: 'Specialized in anxiety and depression treatment with over a decade of experience helping patients develop coping strategies.',
    years_experience: 12,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    available_hours: ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
    hourly_rate: 150,
    education: 'Ph.D in Clinical Psychology, Columbia University',
    certifications: ['Licensed Clinical Psychologist', 'CBT Certification'],
    languages: ['English', 'Spanish'],
    is_accepting_new_patients: true
  },
  {
    name: 'Dr. Michael Chen',
    specialty: 'Trauma Therapy',
    location: 'Los Angeles, CA',
    rating: 4.7,
    bio: 'Focuses on helping patients heal from past trauma using evidence-based approaches and compassionate care.',
    years_experience: 15,
    available_days: ['Monday', 'Wednesday', 'Friday'],
    available_hours: ['8:00', '9:00', '10:00', '11:00', '13:00', '14:00', '15:00'],
    hourly_rate: 175,
    education: 'Psy.D in Clinical Psychology, UCLA',
    certifications: ['Licensed Psychologist', 'EMDR Certified', 'Trauma Specialist'],
    languages: ['English', 'Mandarin'],
    is_accepting_new_patients: true
  },
  {
    name: 'Lisa Rodriguez, LMFT',
    specialty: 'Family Therapy',
    location: 'Chicago, IL',
    rating: 4.8,
    bio: 'Dedicated to strengthening family bonds and resolving conflicts through collaborative therapeutic approaches.',
    years_experience: 8,
    available_days: ['Tuesday', 'Thursday', 'Saturday'],
    available_hours: ['10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00'],
    hourly_rate: 130,
    education: 'M.A. in Marriage and Family Therapy, Northwestern University',
    certifications: ['Licensed Marriage and Family Therapist'],
    languages: ['English', 'Spanish'],
    is_accepting_new_patients: true
  }
];

export class PractitionerService {
  /**
   * Check if practitioners table exists and create it if needed
   */
  static async checkAndCreateTable(): Promise<boolean> {
    try {
      console.log('Checking if practitioners table exists...');
      
      // Try to query the table to see if it exists
      const { error } = await supabase
        .from('practitioners')
        .select('count(*)')
        .limit(1);
      
      // If there's a 404 error, the table doesn't exist
      if (error && (error.code === '42P01' || error.message.includes('relation "practitioners" does not exist'))) {
        console.log('Practitioners table does not exist. Creating it...');
        return await this.createTable();
      } else if (error) {
        console.error('Error checking practitioners table:', error);
        return false;
      }
      
      console.log('Practitioners table exists');
      return true;
    } catch (error) {
      console.error('Error in checkAndCreateTable:', error);
      return false;
    }
  }

  /**
   * Create the practitioners table and seed with sample data
   */
  static async createTable(): Promise<boolean> {
    try {
      console.log('Creating practitioners table structure...');
      
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS public.practitioners (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          name TEXT NOT NULL,
          specialty TEXT NOT NULL,
          location TEXT NOT NULL,
          rating DECIMAL(3,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
          image_url TEXT,
          bio TEXT NOT NULL,
          years_experience INTEGER NOT NULL,
          available_days TEXT[] DEFAULT '{}',
          available_hours TEXT[] DEFAULT '{}',
          hourly_rate DECIMAL(10,2),
          education TEXT,
          certifications TEXT[] DEFAULT '{}',
          languages TEXT[] DEFAULT '{}',
          contact_email TEXT,
          contact_phone TEXT,
          is_accepting_new_patients BOOLEAN DEFAULT true
        );
      `;
      
      // Execute the create table query
      const { error: createError } = await supabase.rpc('pg_execute', {
        query: createTableQuery
      });
      
      if (createError) {
        console.error('Error creating practitioners table:', createError);
        return false;
      }
      
      // Set up RLS policies
      console.log('Setting up security policies...');
      
      const rlsQueries = [
        `ALTER TABLE public.practitioners ENABLE ROW LEVEL SECURITY;`,
        `CREATE POLICY IF NOT EXISTS "Allow public read access to practitioners" 
          ON public.practitioners FOR SELECT USING (true);`,
        `CREATE POLICY IF NOT EXISTS "Allow authenticated users to insert practitioners" 
          ON public.practitioners FOR INSERT WITH CHECK (auth.role() = 'authenticated');`,
        `CREATE POLICY IF NOT EXISTS "Allow authenticated users to update practitioners" 
          ON public.practitioners FOR UPDATE USING (auth.role() = 'authenticated');`,
        `CREATE POLICY IF NOT EXISTS "Allow authenticated users to delete practitioners" 
          ON public.practitioners FOR DELETE USING (auth.role() = 'authenticated');`
      ];
      
      // Execute each RLS query
      for (const query of rlsQueries) {
        const { error } = await supabase.rpc('pg_execute', { query });
        if (error) {
          console.error('Error setting up RLS for practitioners:', error);
        }
      }
      
      // Insert sample data
      console.log('Adding sample practitioner data...');
      const { error: insertError } = await supabase
        .from('practitioners')
        .insert(samplePractitioners);
      
      if (insertError) {
        console.error('Error inserting sample practitioner data:', insertError);
        return false;
      }
      
      console.log('Practitioners table created and seeded successfully');
      return true;
    } catch (error) {
      console.error('Error in createTable:', error);
      return false;
    }
  }

  /**
   * Get all practitioners
   */
  static async getAll() {
    const { data, error } = await supabase
      .from('practitioners')
      .select('*');
    
    if (error) {
      console.error('Error fetching practitioners:', error);
      return { data: null, error };
    }
    
    return { data, error: null };
  }

  /**
   * Get practitioners with pagination
   */
  static async getPaginated(page: number = 0, pageSize: number = 10) {
    const from = page * pageSize;
    const to = from + pageSize - 1;
    
    const { data, error, count } = await supabase
      .from('practitioners')
      .select('*', { count: 'exact' })
      .range(from, to);
    
    return { data, error, count, page, pageSize };
  }

  /**
   * Get practitioners filtered by specialty
   */
  static async getBySpecialty(specialty: string) {
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .eq('specialty', specialty);
    
    return { data, error };
  }

  /**
   * Get practitioners with rating above a threshold
   */
  static async getByMinimumRating(rating: number) {
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .gte('rating', rating);
    
    return { data, error };
  }

  /**
   * Search practitioners by name or bio
   */
  static async searchByText(searchTerm: string) {
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%,specialty.ilike.%${searchTerm}%`);
    
    return { data, error };
  }

  /**
   * Get a specific practitioner by ID
   */
  static async getById(id: string) {
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  }

  /**
   * Create a new practitioner
   */
  static async create(practitioner: Omit<Practitioner, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('practitioners')
      .insert([practitioner])
      .select();
    
    return { data, error };
  }

  /**
   * Update a practitioner
   */
  static async update(id: string, updates: Partial<Practitioner>) {
    const { data, error } = await supabase
      .from('practitioners')
      .update(updates)
      .eq('id', id)
      .select();
    
    return { data, error };
  }

  /**
   * Delete a practitioner
   */
  static async delete(id: string) {
    const { error } = await supabase
      .from('practitioners')
      .delete()
      .eq('id', id);
    
    return { error };
  }

  /**
   * Get all unique specialties
   */
  static async getSpecialties() {
    const { data, error } = await supabase
      .from('practitioners')
      .select('specialty');
    
    if (error) {
      return { data: [], error };
    }
    
    // Extract unique specialties
    const specialties = [...new Set(data.map(item => item.specialty))];
    return { data: specialties, error: null };
  }

  /**
   * Subscribe to changes in practitioners table
   */
  static subscribeToChanges(callback: (payload: any) => void) {
    const channels = supabase.channel('practitioners-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'practitioners' },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
    
    return channels;
  }
}