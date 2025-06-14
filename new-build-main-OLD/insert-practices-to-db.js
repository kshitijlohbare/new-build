// insert-practices-to-db.js
// Script to insert all practices from PracticeContext.tsx and upsert-practices.sql into the practices table

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Using the Supabase project URL and anon key
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
// Using the anon key since we don't have the service role key
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';
const supabase = createClient(supabaseUrl, supabaseKey);

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
  {
    id: 7,
    icon: "breath",
    name: "Box Breathing",
    description: "Practice 4-4-4-4 breathing for 5 minutes daily to calm the nervous system.",
    benefits: ["Calms the nervous system", "Reduces stress", "Improves focus"],
    duration: 5,
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Daily Wellbeing Routine",
    tags: ["stress", "anxiety", "focus"],
    steps: [
      { title: "Inhale", description: "Inhale for 4 seconds" },
      { title: "Hold", description: "Hold for 4 seconds" },
      { title: "Exhale", description: "Exhale for 4 seconds" },
      { title: "Hold", description: "Hold for 4 seconds" },
      { title: "Repeat", description: "Repeat for 5 minutes" }
    ]
  },
  {
    id: 8,
    icon: "meditation",
    name: "Mindfulness Meditation",
    description: "Spend 5-10 minutes focusing on your breath or using a guided meditation.",
    benefits: ["Reduces anxiety", "Improves attention", "Enhances emotional regulation"],
    duration: 10,
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Daily Wellbeing Routine",
    steps: [
      { title: "Sit comfortably", description: "Find a comfortable seated position" },
      { title: "Focus on your breath", description: "Pay attention to the sensation of breathing" },
      { title: "Gently return attention when distracted", description: "When your mind wanders, bring focus back to the breath" }
    ]
  },
  {
    id: 9,
    icon: "sparkles",
    name: "Share Your Delights",
    description: "Acknowledge and share small joys to cultivate positivity.",
    benefits: ["Boosts mood", "Increases gratitude", "Strengthens social connections"],
    points: 5,
    completed: false,
    streak: 0,
    isSystemPractice: true,
    source: "Inspired by The Book of Delights"
  },
  {
    id: 10,
    icon: "brain",
    name: "Mindful Observation",
    description: "Practice focused attention on an object or sensory input to enhance neural pathways for concentration.",
    benefits: ["Strengthens focus", "Improves sensory acuity", "Calms the mind"],
    duration: 10,
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Neuroscience Principles"
  },
  {
    id: 11,
    icon: "anchor",
    name: "Build Specific Knowledge",
    description: "Develop unique skills and knowledge that cannot be easily taught or outsourced.",
    benefits: ["Creates unique value", "Leads to leverage", "Cannot be easily replicated"],
    points: 20,
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Naval Ravikant"
  },
  {
    id: 12,
    icon: "brain",
    name: "Vagus Nerve Breathing",
    description: "Stimulate your vagus nerve to promote calm and regulate stress.",
    benefits: ["Reduces anxiety", "Improves heart rate variability", "Promotes relaxation"],
    duration: 5,
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Neuroscience Principles"
  },
  // Additional practices based on user input
  {
    id: 13,
    icon: "breathing",
    name: "Box Breathing",
    description: "A controlled breathing technique that calms the nervous system, reduces stress, and improves focus by regulating breathing patterns.",
    benefits: ["Lowers heart rate and cortisol levels", "Enhances focus and mental clarity", "Activates the parasympathetic nervous system"],
    duration: 5,
    completed: false,
    streak: 0,
    isDaily: true,
    isSystemPractice: true,
    source: "Stress Reduction Techniques",
    tags: ["stress", "anxiety", "focus", "breathing"],
    steps: [
      { title: "Preparation", description: "Sit upright in a quiet space, feet flat on the ground, hands resting on your lap." },
      { title: "Inhale", description: "Inhale deeply through your nose for 4 seconds, filling your belly and chest." },
      { title: "Hold", description: "Hold your breath for 4 seconds, keeping your body relaxed." },
      { title: "Exhale", description: "Exhale slowly through your mouth for 4 seconds, emptying your lungs fully." },
      { title: "Hold Again", description: "Hold your breath again for 4 seconds." },
      { title: "Repeat", description: "Repeat the cycle for 5 minutes (about 15-20 cycles)." }
    ]
  },
  {
    id: 14,
    icon: "meditation",
    name: "Mindfulness Meditation",
    description: "Trains the mind to stay present, reducing anxiety and improving emotional regulation through focused attention practice.",
    benefits: ["Reduces anxiety and depression symptoms", "Improves attention span", "Enhances emotional resilience", "Increases self-awareness"],
    duration: 10,
    completed: false,
    streak: 0,
    isDaily: true,
    isSystemPractice: true,
    source: "Mindfulness-Based Stress Reduction",
    tags: ["meditation", "mindfulness", "anxiety", "focus"],
    steps: [
      { title: "Find a Space", description: "Find a quiet, comfortable spot (sit on a chair, cushion, or floor)." },
      { title: "Position", description: "Close your eyes or soften your gaze, focusing on a point ahead." },
      { title: "Initial Breathing", description: "Take 5 deep breaths to settle in, then breathe naturally." },
      { title: "Focus", description: "Focus on your breath (e.g., air moving through your nose or belly rising)." },
      { title: "Managing Thoughts", description: "When thoughts arise, acknowledge them without judgment and return to your breath." },
      { title: "Continue", description: "Continue for 5-10 minutes; use a timer or guided meditation." }
    ]
  },
  {
    id: 15,
    icon: "journal",
    name: "Daily Journaling",
    description: "Processes emotions, reduces stress, and fosters gratitude or clarity through regular writing practice.",
    benefits: ["Clarifies thoughts and reduces mental clutter", "Boosts mood through gratitude or emotional release", "Helps track progress and identify patterns"],
    duration: 5,
    completed: false,
    streak: 0,
    isDaily: true,
    isSystemPractice: true,
    source: "Positive Psychology",
    tags: ["journaling", "gratitude", "reflection", "stress"],
    steps: [
      { title: "Prepare", description: "Set aside 5 minutes in a quiet space with a notebook or digital app." },
      { title: "Choose Focus", description: "Choose a focus: gratitude, emotions, or free writing." },
      { title: "Write Freely", description: "Write without editing or worrying about grammar; let thoughts flow." },
      { title: "Be Specific", description: "For gratitude, list specific moments (e.g., \"I'm grateful for my friend's call today\")." },
      { title: "Review", description: "End by reviewing what you wrote or noting one positive insight." }
    ]
  },
  {
    id: 16,
    icon: "phone",
    name: "Screen Time Limitation",
    description: "Reduces overstimulation, improves sleep, and frees mental space by setting boundaries with digital devices.",
    benefits: ["Improves sleep quality", "Lowers mental fatigue", "Creates space for reflection or connection"],
    duration: 30,
    completed: false,
    streak: 0,
    isDaily: true,
    isSystemPractice: true,
    source: "Digital Wellbeing",
    tags: ["digital", "sleep", "boundaries"],
    steps: [
      { title: "Set Boundaries", description: "Set a daily rule: no screens (phone, TV, computer) 30-60 minutes before bed." },
      { title: "Alternative Activities", description: "Replace screen time with calming activities (reading, stretching, journaling)." },
      { title: "Block Notifications", description: "Use phone settings (Do Not Disturb, Screen Time) to block notifications." },
      { title: "Blue Light Management", description: "If work requires screens, use blue-light filters or glasses in the evening." },
      { title: "Track Progress", description: "Track adherence mentally or in a habit tracker." }
    ]
  },
  {
    id: 17,
    icon: "yoga",
    name: "Daily Stretching/Yoga",
    description: "Improves flexibility, reduces muscle tension, and boosts energy through gentle movement practice.",
    benefits: ["Improves flexibility and range of motion", "Reduces muscle tension and pain", "Boosts energy and circulation"],
    duration: 10,
    completed: false,
    streak: 0,
    isDaily: true,
    isSystemPractice: true,
    source: "Physical Wellness",
    tags: ["stretching", "yoga", "flexibility", "physical"],
    steps: [
      { title: "Choose Routine", description: "Choose a 5-10 minute routine from a trusted source or use basic stretches." },
      { title: "Neck Rolls", description: "Gently roll neck 5 times in each direction to release tension." },
      { title: "Cat-Cow Pose", description: "On all fours, arch and round back for 5 breaths to warm up the spine." },
      { title: "Forward Fold", description: "Bend at hips, touch floor or shins, hold 30 seconds to stretch hamstrings." },
      { title: "Side Stretches", description: "Raise arms overhead and lean to each side to stretch the torso." }
    ]
  }
];

// Insert each practice into the database
async function insertPractices() {
  for (const practice of INITIAL_PRACTICE_DATA) {
    const { data, error } = await supabase
      .from('practices')
      .insert([
        {
          id: practice.id,
          icon: practice.icon,
          name: practice.name,
          description: practice.description,
          benefits: practice.benefits,
          duration: practice.duration,
          completed: practice.completed,
          streak: practice.streak,
          is_daily: practice.isDaily,
          is_system_practice: practice.isSystemPractice,
          source: practice.source,
          steps: practice.steps
        }
      ]);

    if (error) {
      console.error(`Error inserting practice ${practice.name}:`, error);
    } else {
      console.log(`Inserted practice ${practice.name}`);
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
        console.log('Practices in database:', data);
      }
    });
}).catch(console.error);