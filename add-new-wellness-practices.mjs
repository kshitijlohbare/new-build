// add-new-wellness-practices.mjs
// Script to add new wellness practices to the database

import { createClient } from '@supabase/supabase-js';

// Using the Supabase project URL and anon key
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';
const supabase = createClient(supabaseUrl, supabaseKey);

// This function will process a single practice
async function processPractice(practice) {
  try {
    // Check if practice exists with this name
    const { data: existingPractice, error: fetchError } = await supabase
      .from('practices')
      .select('*')
      .eq('name', practice.name)
      .maybeSingle();
    
    if (fetchError) {
      console.error(`Error checking for practice ${practice.name}:`, fetchError);
      return;
    }

    if (existingPractice) {
      // Update existing practice
      const { data, error } = await supabase
        .from('practices')
        .update({
          icon: practice.icon,
          description: practice.description,
          benefits: practice.benefits,
          duration: practice.duration,
          steps: practice.steps,
          is_daily: practice.isDaily,
          is_system_practice: practice.isSystemPractice,
          source: practice.source,
          tags: practice.tags || []
        })
        .eq('name', practice.name);

      if (error) {
        console.error(`Error updating practice ${practice.name}:`, error);
      } else {
        console.log(`Updated practice ${practice.name} (ID: ${existingPractice.id})`);
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
            completed: practice.completed || false,
            streak: practice.streak || 0,
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
    console.error(`Unexpected error processing practice ${practice.name}:`, err);
  }
}

// The new wellness practices to add
const newWellnessPractices = [
  {
    id: 31,
    icon: "creativity",
    name: "Limit Perfectionism",
    description: "Reducing perfectionist tendencies to foster creativity, reduce stress, and increase productivity.",
    benefits: [
      "Reduces anxiety and creative blocks",
      "Improves productivity by reducing overthinking",
      "Increases creative output through experimentation",
      "Improves mental wellbeing by lessening self-criticism"
    ],
    duration: 20,
    isDaily: false,
    isSystemPractice: true,
    source: "Cultivate Creativity and Self-Expression",
    tags: ["creativity", "mental health", "productivity", "self-expression"],
    steps: [
      { title: "Set Time Limits", description: "Establish clear time constraints for creative projects to prevent endless refinement." },
      { title: "Embrace the Draft", description: "Focus on creating rough drafts without editing, separating creation from refinement." },
      { title: "Cognitive Reframing", description: "Replace \"This must be perfect\" thoughts with \"This is a learning experience\" or \"Done is better than perfect.\"" },
      { title: "Practice Self-Compassion", description: "Speak to yourself as you would to a friend when facing creative challenges or mistakes." },
      { title: "Celebrate Progress", description: "Acknowledge small wins and improvements rather than focusing only on the end result." }
    ]
  },
  {
    id: 32,
    icon: "connect",
    name: "Weekly Check-Ins",
    description: "Regular dedicated time to strengthen connections with loved ones through meaningful conversation.",
    benefits: [
      "Prevents relationship drift by maintaining regular connection",
      "Creates a safe space for discussing concerns before they become problems",
      "Builds emotional intimacy through consistent communication",
      "Promotes mutual understanding and empathy"
    ],
    duration: 30,
    isDaily: false,
    isSystemPractice: true,
    source: "Strengthen Relationships and Social Bonds",
    tags: ["relationships", "communication", "connection", "wellbeing"],
    steps: [
      { title: "Schedule Consistently", description: "Set a recurring time each week that works for everyone involved." },
      { title: "Create a Comfortable Space", description: "Choose a quiet, private environment free from distractions like phones or TVs." },
      { title: "Use Prompts", description: "Prepare conversation starters like \"What made you feel supported this week?\" or \"What are you looking forward to?\"" },
      { title: "Practice Active Listening", description: "Focus fully on the speaker, ask clarifying questions, and validate feelings without judgment." },
      { title: "End with Appreciation", description: "Close by sharing something you appreciate about each other or the relationship." }
    ]
  },
  {
    id: 33,
    icon: "conversation",
    name: "Conflict Resolution",
    description: "A structured approach to addressing disagreements constructively and strengthening relationships.",
    benefits: [
      "Transforms conflicts into opportunities for deeper understanding",
      "Reduces relationship tension and resentment",
      "Builds problem-solving skills that benefit all relationships",
      "Creates sustainable solutions through mutual input"
    ],
    duration: 45,
    isDaily: false,
    isSystemPractice: true,
    source: "Strengthen Relationships and Social Bonds",
    tags: ["relationships", "communication", "conflict", "emotional intelligence"],
    steps: [
      { title: "Cool Down First", description: "Wait until emotions have settled before addressing serious conflicts (typically 20+ minutes after peak emotion)." },
      { title: "Use \"I\" Statements", description: "Express feelings with \"I feel...\" rather than accusatory \"You always...\" or \"You never...\" statements." },
      { title: "Listen to Understand", description: "Take turns speaking without interruption, then summarize the other's perspective to confirm understanding." },
      { title: "Focus on Needs", description: "Identify the underlying needs behind positions (e.g., \"I need reassurance\" vs. \"You must call me every day\")." },
      { title: "Brainstorm Solutions", description: "Generate multiple possible resolutions together before evaluating and choosing the best approach." }
    ]
  },
  {
    id: 34,
    icon: "group",
    name: "Group Activities",
    description: "Intentionally engaging in shared experiences to strengthen bonds and create lasting memories.",
    benefits: [
      "Creates shared memories that strengthen relationships",
      "Reveals different aspects of personalities in various contexts",
      "Reduces social isolation and feelings of loneliness",
      "Provides natural opportunities for connection without forced conversation"
    ],
    duration: 120,
    isDaily: false,
    isSystemPractice: true,
    source: "Strengthen Relationships and Social Bonds",
    tags: ["relationships", "social", "activities", "connection"],
    steps: [
      { title: "Collective Planning", description: "Choose activities with input from everyone to ensure engagement and buy-in." },
      { title: "Mix Familiar & New", description: "Balance comfortable favorite activities with novel experiences that create growth opportunities." },
      { title: "Remove Distractions", description: "Establish device-free periods during activities to ensure genuine presence and connection." },
      { title: "Document Meaningfully", description: "Take photos or keep mementos, but not at the expense of being present in the moment." },
      { title: "Reflect Together", description: "After activities, discuss favorite moments or insights to enhance the bonding effect." }
    ]
  }
];

// Process all new practices
async function processAllPractices() {
  console.log("Processing new wellness practices...");
  for (const practice of newWellnessPractices) {
    await processPractice(practice);
  }
}

// Run the script
console.log("Starting new wellness practices addition script...");
processAllPractices()
  .then(() => {
    console.log('All new practices processed');
    return supabase.from('practices').select('*');
  })
  .then(({ data, error }) => {
    if (error) {
      console.error('Error fetching practices:', error);
    } else {
      console.log(`Total practices in database: ${data.length}`);
      
      // Log specifically the new practices we added
      console.log("\nNewly added practices:");
      newWellnessPractices.forEach(p => {
        const dbPractice = data.find(dp => dp.name === p.name);
        if (dbPractice) {
          console.log(`${dbPractice.id}. ${dbPractice.name} (Daily: ${dbPractice.is_daily ? 'Yes' : 'No'}, Source: ${dbPractice.source})`);
        } else {
          console.log(`Practice not found: ${p.name}`);
        }
      });
    }
  })
  .catch(err => {
    console.error('Script error:', err);
  });
