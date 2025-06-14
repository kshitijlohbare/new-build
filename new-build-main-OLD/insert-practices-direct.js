// insert-practices-direct.js
// This script directly inserts practices from the INITIAL_PRACTICE_DATA array into the Supabase practices table
// Updated to handle RLS issues and ensure proper table population

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Supabase client configuration
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
// Using the anon key since service role key isn't available
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';
const supabase = createClient(supabaseUrl, supabaseKey);

// First, disable RLS to ensure we can insert without authentication issues
const disableRlsSql = fs.readFileSync('./disable-practices-rls.sql', 'utf8');

// Load practices from PracticeContext.tsx (first 5 practices)
const INITIAL_PRACTICE_DATA = [
  {
    id: 1,
    icon: "shower",
    name: "Cold Shower Exposure",
    description: "Cold exposure helps improve stress resilience, mood, and cognitive focus.",
    benefits: ["Improves stress resilience", "Boosts mood", "Enhances cognitive focus", "Reduces inflammation"],
    duration: 3,
    completed: false,
    streak: 0,
    isDaily: true,
    isSystemPractice: true,
    source: "Andrew Huberman",
    steps: [
      { title: "Prepare", description: "Start with a warm shower and gradually reduce the temperature to 'uncomfortably cold' but safe.", imageUrl: "https://images.unsplash.com/photo-1585082041509-7e1e0a4b680e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29sZCUyMHNob3dlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60" },
      { title: "Duration", description: "Begin with 1–2 minutes and increase gradually over time (e.g., 3–5 minutes). Aim for a total of 11 minutes per week.", imageUrl: "https://images.unsplash.com/photo-1536852300-aef6305d2801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGltZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60" },
      { title: "Breathing", description: "Maintain steady breathing to avoid hyperventilation. Use the physiological sigh if needed (double inhale followed by a long exhale).", imageUrl: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YnJlYXRoaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60" },
      { title: "Timing", description: "Morning cold showers are ideal for boosting alertness; evening exposure requires more resilience due to circadian rhythm variations.", imageUrl: "https://images.unsplash.com/photo-1541480601022-2308c0f02487?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1vcm5pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60" },
      { title: "Optional Movement", description: "Move your hands, feet, or knees slightly during immersion to increase the cold sensation and enhance benefits.", imageUrl: "https://images.unsplash.com/photo-1584825093731-35ef75c7b6fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2hvd2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60" }
    ]
  },
  {
    id: 6,
    name: "Digital Minimalism",
    description: "Digital minimalism enhances productivity and mental clarity by reducing digital clutter.",
    benefits: ["Improved focus", "Reduced anxiety", "Better sleep", "Enhanced productivity", "Mental clarity"],
    duration: 120,
    completed: false,
    streak: 0,
    source: "Cal Newport",
    steps: [
      { title: "Audit Your Tools", description: "List all apps, tools, and devices you use. Identify essential ones and eliminate non-essential ones (e.g., social media apps).", imageUrl: "https://images.unsplash.com/photo-1556400535-930c858c0968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlnaXRhbCUyMGRldG94fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60" },
      { title: "Organize Digital Space", description: "Group similar tasks into folders or workspaces; use color-coding for quick access.", imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG9yZ2FuaXplJTIwYXBwc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60" },
      { title: "Minimize Notifications", description: "Turn off non-essential notifications and enable 'Do Not Disturb' mode during focus periods.", imageUrl: "https://images.unsplash.com/photo-1622676666769-65633479bfd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bm90aWZpY2F0aW9uc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60" },
      { title: "Set Boundaries", description: "Schedule specific times for checking emails or social media to avoid constant interruptions.", imageUrl: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2NoZWR1bGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60" },
      { title: "Full-Screen Mode", description: "Use full-screen mode or 'Reader Mode' to minimize distractions while working on tasks.", imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zm9jdXMlMjB3b3JrfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60" }
    ]
  },
  {
    id: 4,
    icon: "smelling",
    name: "Focus Breathing (3:3:6)",
    description: "This breathing technique calms the nervous system and enhances focus.",
    benefits: ["Calms the nervous system", "Improves focus", "Reduces stress", "Increases mental clarity"],
    duration: 5,
    completed: false,
    streak: 0,
    isDaily: true,
    isSystemPractice: true,
    source: "Andrew Huberman",
    steps: [
      { title: "Posture", description: "Sit upright in a comfortable position with relaxed shoulders and neck.", imageUrl: "https://images.unsplash.com/photo-1514845994104-1be22149278b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2l0dGluZyUyMHBvc3R1cmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60" },
      { title: "Inhale", description: "Breathe in deeply through your nose for 3 seconds, focusing on expanding your belly rather than your chest.", imageUrl: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnJlYXRoaW5nJTIwaW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60" },
      { title: "Hold", description: "Hold your breath for 3 seconds without straining.", imageUrl: "https://images.unsplash.com/photo-1606471191009-63994c53433b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60" },
      { title: "Exhale", description: "Slowly exhale through your mouth for 6 seconds, ensuring the exhale is longer than the inhale to activate the parasympathetic nervous system (calming response).", imageUrl: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnJlYXRoaW5nJTIwb3V0fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60" },
      { title: "Repeat", description: "Perform this cycle for 2–5 minutes or until you feel calm and focused.", imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlbGF4ZWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60" }
    ]
  },
  {
    id: 2,
    icon: "moleskine",
    name: "Gratitude Journal",
    description: "Gratitude journaling cultivates positivity and mental resilience.",
    benefits: ["Increases positive outlook", "Reduces stress", "Improves mental health", "Enhances sleep quality"],
    duration: 10,
    completed: false,
    streak: 0,
    isDaily: true,
    isSystemPractice: true,
    source: "Naval Ravikant",
    steps: [
      { title: "Choose a Journal", description: "Use a physical notebook or a digital app dedicated to gratitude journaling.", imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8am91cm5hbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60" },
      { title: "Daily Practice", description: "Write down 3–5 things you're grateful for each day. Focus on small, specific moments (e.g., 'I'm grateful for the sunny weather today').", imageUrl: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d3JpdGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60" },
      { title: "Consistency", description: "Keep it simple to stay consistent; allocate just 2–5 minutes daily.", imageUrl: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29uc2lzdGVuY3l8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60" },
      { title: "Reflect During Tough Times", description: "Revisit past entries when feeling stressed or anxious to shift your mindset toward positivity.", imageUrl: "https://images.unsplash.com/photo-1519834022362-cf872776bc7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVmbGVjdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60" }
    ]
  },
  {
    id: 3,
    icon: "sun",
    name: "Morning Sunlight",
    description: "Wake up active.",
    benefits: ["Regulates circadian rhythm", "Boosts Vitamin D"],
    duration: 15,
    completed: false,
    streak: 0,
    isSystemPractice: true
  },
  // Add detailed practices from upsert-practices.sql
  {
    id: 7,
    icon: "breath",
    name: "Box Breathing",
    description: "Practice 4-4-4-4 breathing for 5 minutes daily to calm the nervous system. Purpose: Calms the nervous system, reduces stress, and improves focus.",
    benefits: ["Calms the nervous system", "Reduces stress", "Improves focus"],
    duration: 5,
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Daily Wellbeing Routine",
    tags: ["stress", "anxiety", "focus"],
    steps: [
      { title: "Inhale", description: "Inhale for 4 seconds", imageUrl: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnJlYXRoaW5nJTIwaW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60" },
      { title: "Hold", description: "Hold for 4 seconds", imageUrl: "https://images.unsplash.com/photo-1606471191009-63994c53433b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60" },
      { title: "Exhale", description: "Exhale for 4 seconds", imageUrl: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnJlYXRoaW5nJTIwb3V0fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60" },
      { title: "Hold", description: "Hold for 4 seconds", imageUrl: "https://images.unsplash.com/photo-1606471191009-63994c53433b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60" },
      { title: "Repeat", description: "Repeat for 5 minutes", imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlbGF4ZWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60" }
    ]
  },
  {
    id: 8,
    icon: "meditation",
    name: "Mindfulness Meditation",
    description: "Spend 5-10 minutes focusing on your breath or using a guided meditation. Purpose: Reduces anxiety, improves attention, and enhances emotional regulation.",
    benefits: ["Reduces anxiety", "Improves attention", "Enhances emotional regulation"],
    duration: 10,
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Daily Wellbeing Routine",
    tags: ["stress", "focus", "calm"],
    steps: [
      { title: "Sit comfortably", description: "Find a comfortable seated position", imageUrl: "https://images.unsplash.com/photo-1514845994104-1be22149278b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2l0dGluZyUyMHBvc3R1cmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60" },
      { title: "Focus on your breath", description: "Pay attention to the sensation of breathing", imageUrl: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnJlYXRoaW5nJTIwaW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60" },
      { title: "Gently return attention when distracted", description: "When your mind wanders, bring focus back to the breath", imageUrl: "https://images.unsplash.com/photo-1606471191009-63994c53433b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60" },
      { title: "Use a guided meditation if desired", description: "You can use an app or recording if it helps", imageUrl: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z3VpZGVkJTIwbWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60" }
    ]
  }
];

// Insert each practice into the database with proper field mapping
async function insertPractices() {
  console.log("Starting practice insertion process...");
  
  for (const practice of INITIAL_PRACTICE_DATA) {
    console.log(`Processing practice: ${practice.name}`);
    
    // Map JavaScript property names to database column names
    const dbPractice = {
      id: practice.id,
      icon: practice.icon,
      name: practice.name,
      description: practice.description,
      benefits: practice.benefits || [],
      duration: practice.duration,
      points: practice.points,
      completed: practice.completed || false,
      streak: practice.streak || 0,
      tags: practice.tags || [],
      steps: practice.steps || [],
      source: practice.source,
      step_progress: practice.stepProgress,
      is_daily: practice.isDaily || false,
      user_created: practice.userCreated || false,
      created_by_user_id: practice.createdByUserId,
      is_system_practice: practice.isSystemPractice || false
    };
    
    // First check if the practice already exists
    const { data: existingPractice, error: checkError } = await supabase
      .from('practices')
      .select('id')
      .eq('name', practice.name)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') {  // PGRST116 = no rows returned
      console.error(`Error checking if practice ${practice.name} exists:`, checkError);
      continue;
    }
    
    let result;
    if (existingPractice) {
      // Update existing practice
      console.log(`Practice ${practice.name} already exists with id ${existingPractice.id}, updating...`);
      result = await supabase
        .from('practices')
        .update(dbPractice)
        .eq('id', existingPractice.id);
    } else {
      // Insert new practice
      console.log(`Inserting new practice: ${practice.name}`);
      result = await supabase
        .from('practices')
        .insert([dbPractice]);
    }
    
    if (result.error) {
      console.error(`Error processing practice ${practice.name}:`, result.error);
    } else {
      console.log(`Successfully processed practice ${practice.name}`);
    }
  }
}

// Run the insertion script
insertPractices().then(() => {
  console.log('All practices processed');
  supabase
    .from('practices')
    .select('*')
    .then(({ data, error }) => {
      if (error) {
        console.error('Error fetching practices:', error);
      } else {
        console.log(`Practices in database: ${data.length}`);
        data.forEach(p => console.log(`- ${p.name}`));
      }
    });
}).catch(console.error);