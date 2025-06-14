// Script to setup and import community dummy data directly in the browser
import { supabase } from '@/lib/supabase';

// Sample data for community delights
const delightsSampleData = [
  {
    text: "Found a peaceful spot in the park today for meditation",
    username: "nature_lover",
    cheers: 5,
  },
  {
    text: "Started my day with a 10-minute gratitude practice",
    username: "gratitude_guru",
    cheers: 12,
  },
  {
    text: "Enjoyed a mindful walk in the rain",
    username: "mindful_walker",
    cheers: 8,
  },
  {
    text: "Made time to read a chapter of my favorite book",
    username: "book_enthusiast",
    cheers: 4,
  },
  {
    text: "Tried a new breathing technique that really calmed my anxiety",
    username: "anxiety_warrior",
    cheers: 15,
  },
  {
    text: "Planted seeds in my balcony garden - felt so therapeutic!",
    username: "urban_gardener",
    cheers: 9,
  },
  {
    text: "Watched the sunset without checking my phone once",
    username: "digital_detoxer",
    cheers: 17,
  },
  {
    text: "Had a meaningful conversation with an old friend",
    username: "connection_seeker",
    cheers: 7,
  },
  {
    text: "Tried cold plunge therapy for the first time today",
    username: "cold_exposure_fan",
    cheers: 21,
  },
  {
    text: "Made a healthy meal with ingredients from the farmer's market",
    username: "health_enthusiast",
    cheers: 11,
  },
  {
    text: "Did a 5-minute yoga stretch between work meetings",
    username: "desk_yogi", 
    cheers: 6,
  },
  {
    text: "Journaled three pages this morning - my mind feels clearer",
    username: "journal_writer",
    cheers: 8,
  },
  {
    text: "Took a break to play with my dog - instant mood boost!",
    username: "pet_parent",
    cheers: 14,
  },
  {
    text: "Used a new positive affirmation today: 'I am capable and strong'",
    username: "positive_thinker",
    cheers: 10,
  },
  {
    text: "Tried sound bath meditation with singing bowls",
    username: "sound_healer",
    cheers: 9,
  }
];

// Sample data for community practices
const practicesSampleData = [
  {
    name: "Morning Sun Salutation",
    description: "Start your day with energy and vitality",
    benefits: "Improves flexibility, boosts metabolism, increases energy levels",
    duration: 10,
    streak: 7,
    username: "yoga_enthusiast"
  },
  {
    name: "Mindful Tea Ritual",
    description: "Transform a simple cup of tea into a mindfulness practice",
    benefits: "Reduces stress, promotes mindfulness, increases present moment awareness",
    duration: 5,
    streak: 14,
    username: "tea_lover"
  },
  {
    name: "5-4-3-2-1 Grounding Exercise",
    description: "A sensory awareness technique to reduce anxiety",
    benefits: "Manages anxiety, improves focus, grounds energy",
    duration: 3,
    streak: 21,
    username: "anxiety_coach"
  },
  {
    name: "Digital Sunset Routine",
    description: "Wind down technology use 1 hour before bed",
    benefits: "Improves sleep quality, reduces eye strain, calms the nervous system",
    duration: 60,
    streak: 5,
    username: "sleep_expert"
  },
  {
    name: "Gratitude Rock Practice",
    description: "Carry a small stone and touch it whenever you feel grateful",
    benefits: "Increases positive emotions, improves mood, develops gratitude habit",
    duration: 1,
    streak: 30,
    username: "gratitude_guide"
  }
];

// Sample data for community tips and stories
const tipsAndStoriesSampleData = [
  {
    type: "tip",
    title: "Quick Stress Relief",
    content: "When feeling overwhelmed, try the 4-7-8 breathing technique: inhale for 4 counts, hold for 7, exhale for 8. Works wonders!",
    username: "stress_less",
    upvotes: 24
  },
  {
    type: "story",
    title: "My Meditation Journey",
    content: "I struggled with meditation for years until I realized I was trying too hard. Now I focus on being present rather than 'doing it right', and it's changed everything.",
    username: "mindful_traveler",
    upvotes: 31
  },
  {
    type: "tip",
    title: "Nature Connection Hack",
    content: "Place a small plant on your desk where you can see it. Research shows even brief glances at nature can reduce stress and improve focus.",
    username: "biophilia_fan",
    upvotes: 17
  },
  {
    type: "story",
    title: "How Cold Showers Changed My Life",
    content: "I started with just 15 seconds of cold water at the end of my shower. Six months later, I take full cold showers and my anxiety has decreased dramatically.",
    username: "cold_convert",
    upvotes: 42
  },
  {
    type: "tip",
    title: "Mindful Eating Practice",
    content: "Try eating one meal per day without any screens. Focus on the flavors, textures, and sensations. It improves digestion and helps you enjoy food more.",
    username: "mindful_eater",
    upvotes: 19
  }
];

// Anonymous user ID for test data
// Using a valid UUID format for user_id to match Supabase auth.users schema
const TEST_USER_ID = '00000000-0000-0000-0000-000000000000';

/**
 * Inserts sample data for community delights
 */
export async function insertDummyDelights() {
  console.log('Inserting dummy community delights...');
  
  try {
    // Delete existing test data first to avoid duplicates
    await supabase
      .from('community_delights')
      .delete()
      .eq('user_id', TEST_USER_ID);
    
    // Insert each delight with a small delay
    for (const delight of delightsSampleData) {
      await supabase
        .from('community_delights')
        .insert({
          text: delight.text,
          user_id: TEST_USER_ID,
          username: delight.username,
          cheers: delight.cheers || 0,
          created_at: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString() // Random time in last week
        });
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    return { success: true, count: delightsSampleData.length };
  } catch (error) {
    console.error('Error inserting dummy delights:', error);
    return { success: false, error };
  }
}

/**
 * Inserts sample data for community practices
 */
export async function insertDummyPractices() {
  console.log('Inserting dummy community practices...');
  
  try {
    // We'll store these in the community_practices table if it exists
    // Otherwise we'll use our context API for local testing
    const { error } = await supabase
      .from('community_practices')
      .select('id')
      .limit(1);
    
    if (error) {
      // Fall back to a local solution - store in localStorage
      const existingData = localStorage.getItem('community_practices');
      const practices = existingData ? JSON.parse(existingData) : [];
      
      // Add our dummy practices with IDs
      practicesSampleData.forEach((practice, index) => {
        practices.push({
          ...practice,
          id: Date.now() + index,
          user_id: TEST_USER_ID,
          created_at: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString()
        });
      });
      
      localStorage.setItem('community_practices', JSON.stringify(practices));
      return { success: true, count: practicesSampleData.length, storage: 'localStorage' };
    }
    
    // If we got here, the table exists
    for (const practice of practicesSampleData) {
      await supabase
        .from('community_practices')
        .insert({
          name: practice.name,
          description: practice.description,
          benefits: practice.benefits,
          duration: practice.duration,
          streak: practice.streak,
          user_id: TEST_USER_ID,
          username: practice.username,
          created_at: new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)).toISOString()
        });
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    return { success: true, count: practicesSampleData.length, storage: 'database' };
  } catch (error) {
    console.error('Error inserting dummy practices:', error);
    return { success: false, error };
  }
}

/**
 * Inserts sample data for community tips and stories
 */
export async function insertDummyTipsAndStories() {
  console.log('Inserting dummy tips and stories...');
  
  try {
    // Check if table exists
    const { error } = await supabase
      .from('community_posts')
      .select('id')
      .limit(1);
    
    if (error) {
      // Fall back to localStorage
      const existingData = localStorage.getItem('community_tips_stories');
      const posts = existingData ? JSON.parse(existingData) : [];
      
      tipsAndStoriesSampleData.forEach((post, index) => {
        posts.push({
          ...post,
          id: Date.now() + index,
          user_id: TEST_USER_ID,
          created_at: new Date(Date.now() - Math.floor(Math.random() * 21 * 24 * 60 * 60 * 1000)).toISOString()
        });
      });
      
      localStorage.setItem('community_tips_stories', JSON.stringify(posts));
      return { success: true, count: tipsAndStoriesSampleData.length, storage: 'localStorage' };
    }
    
    // If we got here, the table exists
    for (const post of tipsAndStoriesSampleData) {
      await supabase
        .from('community_posts')
        .insert({
          type: post.type,
          title: post.title,
          content: post.content,
          user_id: TEST_USER_ID,
          username: post.username,
          upvotes: post.upvotes || 0,
          created_at: new Date(Date.now() - Math.floor(Math.random() * 21 * 24 * 60 * 60 * 1000)).toISOString()
        });
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    return { success: true, count: tipsAndStoriesSampleData.length, storage: 'database' };
  } catch (error) {
    console.error('Error inserting dummy tips and stories:', error);
    return { success: false, error };
  }
}

/**
 * Inserts all dummy community data
 */
export async function insertAllDummyData() {
  const results = {
    delights: await insertDummyDelights(),
    practices: await insertDummyPractices(),
    tipsAndStories: await insertDummyTipsAndStories()
  };
  
  console.log('Dummy data insertion complete:', results);
  return results;
}

// Export data arrays for direct use
export {
  delightsSampleData,
  practicesSampleData,
  tipsAndStoriesSampleData
};
