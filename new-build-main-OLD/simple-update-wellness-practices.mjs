// simple-update-wellness-practices.mjs
// A simplified script to update or add selected wellness practices to the database

import { createClient } from '@supabase/supabase-js';

// Using the Supabase project URL and anon key
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';
const supabase = createClient(supabaseUrl, supabaseKey);

// Three example practices - one update and two new ones
const WELLNESS_PRACTICES = [
  // Daily Stretching/Yoga - ID 17 already exists but we'll update with more info
  {
    id: 17,
    icon: "yoga",
    name: "Daily Stretching/Yoga",
    description: "Enhances flexibility, reduces muscle tension, improves posture, and boosts energy by increasing blood flow.",
    benefits: [
      "Improves flexibility and joint mobility, reducing injury risk",
      "Relieves physical tension from sitting or stress",
      "Boosts mood and energy via increased circulation",
      "Enhances body awareness, aiding posture correction"
    ],
    duration: 10,
    completed: false,
    streak: 0,
    isDaily: true,
    isSystemPractice: true,
    source: "Physical Wellness",
    tags: ["stretching", "yoga", "flexibility", "physical"],
    steps: [
      { title: "Choose a Space", description: "Find a quiet space with enough room to move (a yoga mat is optional)." },
      { title: "Neck Rolls", description: "Sit cross-legged or stand, gently roll your neck in circles 5 times clockwise, then 5 times counterclockwise (30 seconds)." },
      { title: "Cat-Cow Pose", description: "On all fours, inhale while arching your back (cow), exhale while rounding it (cat). Repeat for 5 breaths (1 minute)." },
      { title: "Forward Fold", description: "Stand, hinge at hips, bring head toward knees, and hands toward floor or shins. Hold for 30 seconds." },
      { title: "Side Stretch", description: "Stand, raise one arm overhead, lean to the opposite side, hold for 15 seconds per side." },
      { title: "Child's Pose", description: "Kneel, sit back on heels, stretch arms forward, rest forehead on ground for 1 minute." }
    ]
  },
  
  // Hydration Habit - New practice
  {
    id: 18,
    icon: "water",
    name: "Hydration Habit",
    description: "Maintains bodily functions, boosts energy, and supports mental clarity by preventing dehydration.",
    benefits: [
      "Supports digestion, skin health, and temperature regulation",
      "Prevents fatigue and headaches caused by mild dehydration",
      "Enhances cognitive function and mood"
    ],
    duration: 5,
    completed: false,
    streak: 0,
    isDaily: true,
    isSystemPractice: true,
    source: "Physical Wellness",
    tags: ["hydration", "health", "energy", "physical"],
    steps: [
      { title: "Morning Start", description: "Start your day with a full glass of water (8 oz) upon waking." },
      { title: "Carry Water", description: "Carry a reusable water bottle (1-liter capacity) and refill it 2-3 times daily." },
      { title: "Regular Sips", description: "Sip water throughout the day, especially during meals, exercise, or work breaks." },
      { title: "Track Intake", description: "Use a habit app or mark your bottle with time goals (e.g., half by noon)." },
      { title: "Add Variety", description: "Include hydrating foods (cucumber, watermelon) if variety helps." }
    ]
  },

  // Sleep Hygiene - New practice
  {
    id: 20,
    icon: "sleep",
    name: "Sleep Hygiene",
    description: "Ensures consistent, restorative sleep to support physical and mental health.",
    benefits: [
      "Improves memory, focus, and emotional regulation",
      "Enhances physical recovery and immune function",
      "Reduces risk of chronic conditions"
    ],
    duration: 30,
    completed: false,
    streak: 0,
    isDaily: true,
    isSystemPractice: true,
    source: "Sleep Science",
    tags: ["sleep", "health", "recovery", "wellbeing"],
    steps: [
      { title: "Consistent Schedule", description: "Set a fixed bedtime and wake-up time, even on weekends." },
      { title: "Pre-Sleep Routine", description: "Create a 30-minute wind-down routine: dim lights, avoid stimulants, engage in calming activities." },
      { title: "Optimize Environment", description: "Keep bedroom cool (60-67°F), dark (blackout curtains), and quiet (earplugs if needed)." },
      { title: "Limit Screen Time", description: "Avoid screens 30-60 minutes before bed or use blue-light filters." },
      { title: "Bed Association", description: "Use bed only for sleep and intimacy to strengthen sleep associations." }
    ]
  }
];

// Function to update or insert practices
async function updatePractices() {
  console.log("Starting practice updates...");

  for (const practice of WELLNESS_PRACTICES) {
    try {
      // Check if practice exists with this ID
      const { data: existingPractice, error: fetchError } = await supabase
        .from('practices')
        .select('*')
        .eq('id', practice.id)
        .maybeSingle();
      
      if (fetchError) {
        console.error(`Error checking for practice ${practice.id}:`, fetchError);
        continue;
      }

      if (existingPractice) {
        // Update existing practice
        const { data, error } = await supabase
          .from('practices')
          .update({
            icon: practice.icon,
            name: practice.name,
            description: practice.description,
            benefits: practice.benefits,
            duration: practice.duration,
            steps: practice.steps,
            is_daily: practice.isDaily,
            is_system_practice: practice.isSystemPractice,
            source: practice.source,
            tags: practice.tags || []
          })
          .eq('id', practice.id);

        if (error) {
          console.error(`Error updating practice ${practice.name}:`, error);
        } else {
          console.log(`Updated practice ${practice.name} (ID: ${practice.id})`);
        }
      } else {
        // Insert new practice
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
              steps: practice.steps,
              tags: practice.tags || []
            }
          ]);

        if (error) {
          console.error(`Error inserting practice ${practice.name}:`, error);
        } else {
          console.log(`Inserted practice ${practice.name} (ID: ${practice.id})`);
        }
      }
    } catch (err) {
      console.error(`Unexpected error processing practice ${practice.id}:`, err);
    }
  }

  console.log("Finished processing practice updates");
}

// Run the update script and then verify
console.log("Starting wellness practices update script...");
updatePractices()
  .then(() => {
    console.log('All practices processed');
    return supabase.from('practices').select('*');
  })
  .then(({ data, error }) => {
    if (error) {
      console.error('Error fetching practices:', error);
    } else {
      console.log(`Practices in database: ${data.length}`);
      console.log(`Daily practices: ${data.filter(p => p.is_daily === true).length}`);
      console.log(`System practices: ${data.filter(p => p.is_system_practice === true).length}`);
    }
  })
  .catch(err => {
    console.error('Script error:', err);
  });
