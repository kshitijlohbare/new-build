// update-wellness-practices-fixed.js
// Script to update existing practices and add new ones from comprehensive wellness instructions

import { createClient } from '@supabase/supabase-js';

// Using the Supabase project URL and anon key
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';
const supabase = createClient(supabaseUrl, supabaseKey);

// New practices to add or update
const WELLNESS_PRACTICES = [
  // Daily Stretching/Yoga - ID 17 already exists but we'll update with more comprehensive info
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

  // Balanced Diet - New practice
  {
    id: 19,
    icon: "food",
    name: "Balanced Diet",
    description: "Provides essential nutrients, sustains energy, and supports long-term health.",
    benefits: [
      "Stabilizes energy and blood sugar, reducing crashes",
      "Supports immunity, heart health, and digestion",
      "Improves mood via nutrient-rich foods"
    ],
    duration: 15,
    completed: false,
    streak: 0,
    isDaily: true,
    isSystemPractice: true,
    source: "Physical Wellness",
    tags: ["nutrition", "health", "energy", "physical"],
    steps: [
      { title: "Include Vegetables", description: "Include at least one serving of vegetables in every meal." },
      { title: "Prioritize Whole Foods", description: "Focus on lean proteins, whole grains, and healthy fats." },
      { title: "Limit Processed Foods", description: "Restrict processed foods to 1-2 servings daily or less." },
      { title: "Plan for Variety", description: "Aim for 3-5 food groups per meal for nutritional balance." },
      { title: "Portion Control", description: "Use visual cues for portions (protein size of palm, grains size of fist)." },
      { title: "Mindful Eating", description: "Eat slowly, avoid distractions, and stop when 80% full." }
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
  },

  // Morning Routine - New practice
  {
    id: 21,
    icon: "sunrise",
    name: "Morning Routine",
    description: "Sets a focused tone for the day, prioritizing tasks and reducing mental clutter.",
    benefits: [
      "Clarifies goals, reducing decision fatigue",
      "Boosts motivation by starting the day proactively",
      "Enhances productivity by focusing on high-impact tasks"
    ],
    duration: 5,
    completed: false,
    streak: 0,
    isDaily: true,
    isSystemPractice: true,
    source: "Productivity Research",
    tags: ["productivity", "focus", "planning", "mental"],
    steps: [
      { title: "Dedicate Time", description: "Set aside 5 minutes each morning, before checking notifications." },
      { title: "Review Priorities", description: "Mentally review or write down 1-3 key priorities for the day." },
      { title: "Visualize Success", description: "Imagine completing tasks calmly and efficiently." },
      { title: "Optional Addition", description: "Add a quick affirmation or gratitude moment to set a positive tone." },
      { title: "Stay Offline", description: "Avoid checking phone or email until after completing this routine." }
    ]
  },

  // Single-Tasking - New practice
  {
    id: 22,
    icon: "focus",
    name: "Single-Tasking",
    description: "Improves focus and efficiency by dedicating attention to one task at a time.",
    benefits: [
      "Increases work quality and reduces errors",
      "Lowers mental fatigue from context-switching",
      "Builds a sense of accomplishment"
    ],
    duration: 25,
    completed: false,
    streak: 0,
    isDaily: true,
    isSystemPractice: true,
    source: "Productivity Science",
    tags: ["focus", "productivity", "concentration", "mental"],
    steps: [
      { title: "Choose One Task", description: "Select one specific task to focus on (e.g., writing an email, reading a chapter)." },
      { title: "Eliminate Distractions", description: "Silence phone, close unrelated tabs, inform others you're focusing." },
      { title: "Set a Timer", description: "Set a timer for 25-50 minutes to work solely on that task." },
      { title: "Take a Break", description: "After the timer ends, take a 5-minute break to rest your mind." },
      { title: "Repeat", description: "Continue with key tasks throughout the day, avoiding multitasking." }
    ]
  },

  // Reading - New practice
  {
    id: 23,
    icon: "book",
    name: "Reading",
    description: "Stimulates the mind, expands knowledge, and improves focus through sustained attention.",
    benefits: [
      "Enhances vocabulary, critical thinking, and empathy",
      "Reduces stress by providing an immersive escape",
      "Improves focus through sustained attention"
    ],
    duration: 15,
    completed: false,
    streak: 0,
    isDaily: true,
    isSystemPractice: true,
    source: "Cognitive Science",
    tags: ["learning", "focus", "knowledge", "mental"],
    steps: [
      { title: "Choose Material", description: "Select a book, article, or essay that interests you." },
      { title: "Create Space", description: "Find a quiet, comfortable spot with minimal distractions." },
      { title: "Set a Timer", description: "Commit to 10-15 minutes of uninterrupted reading." },
      { title: "Engage Actively", description: "Highlight, take notes, or reflect on key ideas as you read." },
      { title: "Vary Content", description: "Explore different genres to keep interest (novels, self-help, science)." }
    ]
  },

  // Progressive Muscle Relaxation - New practice (informational)
  {
    id: 24,
    icon: "relax",
    name: "Progressive Muscle Relaxation",
    description: "Reduces physical tension and stress by systematically relaxing muscles.",
    benefits: [
      "Lowers heart rate and muscle tension",
      "Eases anxiety by grounding focus in the body",
      "Improves sleep if done before bed"
    ],
    duration: 15,
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Stress Reduction Techniques",
    tags: ["relaxation", "stress", "anxiety", "physical"],
    steps: [
      { title: "Find a Space", description: "Find a quiet space; lie down or sit comfortably for 10-15 minutes." },
      { title: "Start at Feet", description: "Tense foot muscles for 5 seconds, then release for 10 seconds, noticing the contrast." },
      { title: "Move Upward", description: "Progress through muscle groups: calves, thighs, abdomen, chest, arms, shoulders, neck, face." },
      { title: "Deep Breathing", description: "Breathe deeply throughout, exhaling during muscle release." },
      { title: "Final Scan", description: "End with a full-body scan to release any remaining tension." }
    ]
  },

  // Nature Walks - New practice (informational)
  {
    id: 25,
    icon: "tree",
    name: "Nature Walks",
    description: "Reduces stress and boosts mood by connecting with natural environments.",
    benefits: [
      "Lowers cortisol and anxiety",
      "Boosts creativity and problem-solving",
      "Improves physical health via light exercise"
    ],
    duration: 30,
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Environmental Psychology",
    tags: ["nature", "stress", "walking", "wellbeing"],
    steps: [
      { title: "Find Green Space", description: "Locate a nearby natural area (park, forest, garden) or urban area with trees." },
      { title: "Walking Time", description: "Walk for 20-30 minutes at a comfortable pace, 1-2 times weekly." },
      { title: "Engage Senses", description: "Notice sounds, smells, and sights in nature during your walk." },
      { title: "Minimize Distractions", description: "Keep phone on silent or listen only to calming music if desired." },
      { title: "Optional Mindfulness", description: "Focus on your breath or steps to enhance the calming effect." }
    ]
  },

  // Time Blocking - New practice (informational)
  {
    id: 26,
    icon: "calendar",
    name: "Time Blocking",
    description: "Organizes time to focus on specific tasks, reducing procrastination.",
    benefits: [
      "Increases task completion by structuring time",
      "Reduces decision fatigue by pre-planning",
      "Balances work and personal priorities"
    ],
    duration: 15,
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Productivity Science",
    tags: ["productivity", "planning", "focus", "organization"],
    steps: [
      { title: "Review Tasks", description: "At the start of the week or day, list all tasks and commitments." },
      { title: "Allocate Time", description: "Assign specific time blocks for tasks in your calendar (e.g., 9-10AM: emails)." },
      { title: "Include Buffers", description: "Add breaks and buffer time (15 minutes) between blocks." },
      { title: "Stick to Schedule", description: "Follow your time blocks as closely as possible, adjusting if urgent matters arise." },
      { title: "Start Simple", description: "Begin by blocking only 2-3 hours daily until you get comfortable with the system." }
    ]
  },

  // Weekly Review - New practice (informational, translated from Polish)
  {
    id: 27,
    icon: "review",
    name: "Weekly Review",
    description: "Plans the week, sets goals, and evaluates progress for better organization.",
    benefits: [
      "Provides clarity and control over responsibilities",
      "Increases motivation through goal-setting",
      "Prevents missing important tasks"
    ],
    duration: 15,
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Productivity Research",
    tags: ["planning", "organization", "reflection", "goals"],
    steps: [
      { title: "Allocate Time", description: "Set aside 10-15 minutes each Sunday (or weekend) in a quiet place." },
      { title: "Review Past Week", description: "Check last week's tasks and note what went well or needs improvement." },
      { title: "Set New Goals", description: "Write goals for the upcoming week (3 main tasks, personal events)." },
      { title: "Organize Schedule", description: "Update your calendar or task list with key deadlines and commitments." },
      { title: "Positive Reflection", description: "End with a positive thought about the week ahead." }
    ]
  },

  // Digital Detox - New practice (informational, translated from Polish)
  {
    id: 28,
    icon: "disconnect",
    name: "Digital Detox",
    description: "Reduces information overload and improves focus by limiting device usage.",
    benefits: [
      "Decreases mental stress and fatigue",
      "Improves quality of social interactions",
      "Increases time for reflection or creativity"
    ],
    duration: 60,
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Digital Wellbeing",
    tags: ["digital", "focus", "mindfulness", "wellbeing"],
    steps: [
      { title: "Set Aside Time", description: "Choose 1-2 hours weekly for no notifications or device usage." },
      { title: "Silent Mode", description: "Set phone to 'Do Not Disturb' or turn off notifications completely." },
      { title: "Offline Activities", description: "Engage in screen-free activities: reading, walking, conversation, or hobbies." },
      { title: "Inform Others", description: "Let family or friends know you'll be offline to avoid misunderstandings." },
      { title: "Start Small", description: "Begin with 30 minutes if 1-2 hours feels challenging." }
    ]
  },

  // Blue Light Limitation - New practice (translated from Polish)
  {
    id: 29,
    icon: "screen",
    name: "Blue Light Limitation",
    description: "Protects melatonin production and improves sleep quality by reducing blue light exposure.",
    benefits: [
      "Accelerates falling asleep and improves sleep depth",
      "Reduces eye strain from screens",
      "Supports circadian rhythm"
    ],
    duration: 60,
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Sleep Science",
    tags: ["sleep", "digital", "health", "wellbeing"],
    steps: [
      { title: "Screen Curfew", description: "Avoid screens (phone, computer, TV) 1-2 hours before bed if possible." },
      { title: "Use Filters", description: "If screens are necessary, enable blue light filters (e.g., Night Shift, f.lux)." },
      { title: "Protective Eyewear", description: "Consider blue-light blocking glasses for evening computer work." },
      { title: "Alternative Activities", description: "Replace screen time with non-light activities (reading physical books, conversation)." },
      { title: "Warm Lighting", description: "Use warm-colored lamps in the evening instead of bright overhead lights." }
    ]
  },

  // Stimulant Avoidance - New practice (translated from Polish)
  {
    id: 30,
    icon: "caffeine",
    name: "Stimulant Avoidance",
    description: "Protects sleep and stabilizes energy by limiting disruptive substances.",
    benefits: [
      "Improves sleep quality and continuity",
      "Reduces nighttime awakenings",
      "Stabilizes mood and energy throughout the day"
    ],
    duration: 10,
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Sleep Science",
    tags: ["sleep", "health", "habits", "wellbeing"],
    steps: [
      { title: "Caffeine Cutoff", description: "Avoid caffeine (coffee, tea, energy drinks) 6-8 hours before bedtime." },
      { title: "Alcohol Moderation", description: "Limit alcohol to 1-2 drinks, avoiding 3-4 hours before sleep." },
      { title: "Monitor Other Stimulants", description: "Be aware of nicotine and certain medications; consult a doctor if needed." },
      { title: "Choose Alternatives", description: "Replace stimulants with herbal tea, water, or decaffeinated options." },
      { title: "Evening Substitutes", description: "Create alternative evening rituals like herbal tea or a warm bath." }
    ]
  }
];

// Function to update or insert practices
async function updatePractices() {
  console.log("Starting practice updates...");

  for (const practice of WELLNESS_PRACTICES) {
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

    let result;

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

      result = { data, error };
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

      result = { data, error };
      if (error) {
        console.error(`Error inserting practice ${practice.name}:`, error);
      } else {
        console.log(`Inserted practice ${practice.name} (ID: ${practice.id})`);
      }
    }
  }

  console.log("Finished processing practice updates");
}

// Run the update script
updatePractices().then(() => {
  console.log('All practices processed');
  supabase
    .from('practices')
    .select('*')
    .then(({ data, error }) => {
      if (error) {
        console.error('Error fetching practices:', error);
      } else {
        console.log(`Practices in database: ${data.length}`);
        console.log(`Daily practices: ${data.filter(p => p.is_daily === true).length}`);
        console.log(`System practices: ${data.filter(p => p.is_system_practice === true).length}`);
      }
    });
}).catch(console.error);
