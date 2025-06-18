import { useState, useEffect, useMemo } from "react";
import { BookOpen, Lightbulb, Heart, Brain, Zap, Anchor } from "lucide-react";
import { moreConcepts } from "./MoreConcepts";
import { moreConcepts2 } from "./MoreConcepts2";
import { moreConcepts3 } from "./MoreConcepts3";
import { neuroscienceConcepts } from "./NeuroscienceConcepts";
import { navalConcepts } from "./NavalConcepts";

// CSS animation keyframes
const animationStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  5        case 'mindfulness':
          return term.icon === 'mindfulness';
        
        case 'social':
          return term.icon === 'social';
        
        default:
          return false;
      }
    });

    setFilteredTerms(filtered);
  }, [searchQuery, activeFilter, allTerms]); scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
}

@keyframes celebrate {
  0% { transform: scale(1); opacity: 1; }
  20% { transform: scale(1.2); opacity: 1; }
  40% { transform: scale(1); opacity: 1; }
  60% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes sparkle {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0); opacity: 0; }
}

@keyframes slide-in {
  0% { transform: translateX(-100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes slide-down {
  0% { transform: translateY(-10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes shine {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

.card-hover {
  transition: all 0.3s ease-out;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(6,196,213,0.15);
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out forwards;
}

@media (min-width: 640px) {
  .card-expanded {
    height: 188.7px;
    transition: height 0.3s ease-out;
  }

  .card-collapsed {
    height: 92.7px;
    transition: height 0.3s ease-out;
  }
}

@media (max-width: 639px) {
  .card-expanded,
  .card-collapsed {
    height: auto;
    transition: height 0.3s ease-out;
  }
}
`;

export interface PsychTerm {
  term: string;
  story: string;
  explanation: string;
  category: string;
  icon: "mindfulness" | "cognitive" | "emotional" | "behavioral" | "social" | "neuroscience" | "naval";
  keywords?: string[]; // Optional array of related search keywords
}

const getIconComponent = (iconType: string) => {
  switch (iconType) {
    case "mindfulness":
      return <Heart size={20} className="text-[#06C4D5]" />;
    case "cognitive":
      return <Brain size={20} className="text-[#208EB1]" />;
    case "emotional":
      return <Heart size={20} className="text-[#208EB1]" />;
    case "behavioral":
      return <Lightbulb size={20} className="text-[#208EB1]" />;
    case "social":
      return <Lightbulb size={20} className="text-[#208EB1]" />;
    case "neuroscience":
      return <Zap size={20} className="text-[#208EB1]" />;
    case "naval":
      return <Anchor size={20} className="text-[#208EB1]" />;
    default:
      return <BookOpen size={20} className="text-[#06C4D5]" />;
  }
};

// Function to generate short summaries for each concept
const getSummary = (term: string, category: string): string => {
  const summaries: Record<string, string> = {
    "Cognitive Dissonance": "Mental discomfort from conflicting beliefs and actions",
    "Halo Effect": "One positive trait influences overall perception",
    "Framing Effect": "How information is presented affects decisions",
    "Availability Bias": "Overestimating events that easily come to mind",
    "Sunk Cost Fallacy": "Continuing based on past investment rather than future value",
    "Growth Mindset": "Belief that abilities can be developed through effort",
    "Imposter Syndrome": "Feeling like a fraud despite achievements",
    "Resilience": "Bouncing back from difficulties and adapting to change",
    "Mindfulness": "Present-moment awareness without judgment",
    "Confirmation Bias": "Seeking information that confirms existing beliefs",
    "Emotional Intelligence": "Understanding and managing emotions effectively",
    "Anchoring Bias": "Over-relying on first information encountered",
    "Paradox of Choice": "More options can lead to decision paralysis",
    "Loss Aversion": "Preferring to avoid losses over acquiring gains",
    "Social Proof": "Following others' actions to guide behavior",
    "Dunning-Kruger Effect": "Overestimating ability when knowledge is limited",
    "Reciprocity": "Feeling obligated to return favors",
    "Scarcity Principle": "Valuing things more when they're limited",
    "Habit Loop": "Cue, routine, reward cycle that drives behaviors",
    "Fundamental Attribution Error": "Blaming others' character but situational factors for self",
    "Hedonic Adaptation": "Quickly returning to baseline happiness",
    "Spotlight Effect": "Overestimating how much others notice us",
    "Hindsight Bias": "Believing events were predictable after they occurred",
    "Zeigarnik Effect": "Better remembering uncompleted tasks",
    "Pygmalion Effect": "High expectations lead to better performance",
    "Peak-End Rule": "Judging experiences by peaks and endings",
    "Mere Exposure Effect": "Preferring things simply through familiarity",
    "Self-Serving Bias": "Taking credit for success, blaming external factors for failure",
    "Barnum Effect": "Accepting vague descriptions as personally accurate",
    "Ikea Effect": "Valuing things more when we help create them",
    "Dunbar's Number": "Cognitive limit to stable social relationships",
    "Impostor Phenomenon": "Persistent feelings of being a fraud despite success",
    "Cognitive Load": "Mental effort required by working memory",
    "Decoy Effect": "Adding a third option changes preferences",
    "Flow State": "Complete absorption in an optimally challenging activity",
    "Boundary Setting": "Defining acceptable behaviors from others",
    "Diffusion of Responsibility": "Reduced individual action in groups",
    "Priming": "Earlier stimulus influences response to later stimulus"
  };
  
  // Return the specific summary if available, otherwise generate a generic one
  return summaries[term] || `A key concept in ${category.toLowerCase()}`;
};

// Original concepts plus some new ones from the psychology cheat sheet, neuroscience, and Naval Ravikant philosophy
const terms: PsychTerm[] = [
  {
    term: "Cognitive Dissonance",
    story: "Priya always believed she was a healthy eater. One day, she found herself finishing a whole bag of chips. She felt uncomfortable and tried to justify it by saying she deserved a treat after a long day. This mental discomfort is called cognitive dissonance.",
    explanation: "Cognitive dissonance is the tension that arises when our actions conflict with our beliefs or values. We often try to reduce this discomfort by changing our beliefs or rationalizing our actions.",
    category: "Thought Patterns",
    icon: "cognitive",
    keywords: ["inner conflict", "contradicting beliefs", "mental discomfort", "rationalization", "justification", "guilt", "inconsistent beliefs", "hypocrisy", "conflicted feelings", "decision regret", "value conflict", "internal contradiction"]
  },
  {
    term: "Generalized Anxiety Disorder (GAD)",
    story: "Liam constantly worried about everything – his job, his health, his family – even when there was no specific reason to worry. He often felt restless, had trouble sleeping, and couldn't concentrate. His doctor explained this persistent, excessive worry might be GAD.",
    explanation: "Generalized Anxiety Disorder (GAD) is characterized by persistent and excessive worry about a number of different things. People with GAD may anticipate disaster and may be overly concerned about money, health, family, work, or other issues. Individuals with GAD find it difficult to control their worry.",
    category: "Mental Health Conditions",
    icon: "emotional",
    keywords: ["anxiety", "worry", "chronic stress", "restlessness", "fatigue", "difficulty concentrating", "irritability", "muscle tension", "sleep disturbance", "panic attacks", "anxious", "overthinking", "fear", "nervousness"]
  },
  {
    term: "Major Depressive Disorder (MDD)",
    story: "For weeks, Sarah felt a profound sadness she couldn't shake. She lost interest in her hobbies, struggled to get out of bed, and felt a deep sense of hopelessness. Her friends noticed she wasn't herself and encouraged her to seek help for what might be MDD.",
    explanation: "Major Depressive Disorder (MDD) is a common and serious medical illness that negatively affects how you feel, the way you think and how you act. Fortunately, it is also treatable. MDD causes feelings of sadness and/or a loss of interest in activities once enjoyed. It can lead to a variety of emotional and physical problems and can decrease a person’s ability to function at work and at home.",
    category: "Mental Health Conditions",
    icon: "emotional",
    keywords: ["depression", "sadness", "hopelessness", "loss of interest", "anhedonia", "fatigue", "sleep problems", "appetite changes", "concentration difficulties", "worthlessness", "suicidal thoughts", "low mood", "persistent sadness", "empty feeling", "irritability"]
  },
  {
    term: "Stress Response (Fight or Flight)",
    story: "Walking home late at night, Ben heard footsteps behind him. His heart started racing, his palms got sweaty, and he felt a surge of adrenaline. This was his body's stress response kicking in, preparing him to either confront the potential threat or run away.",
    explanation: "The stress response, often called the 'fight or flight' response, is a physiological reaction that occurs in response to a perceived harmful event, attack, or threat to survival. The body releases hormones like adrenaline and cortisol, which cause physical changes like increased heart rate, rapid breathing, and heightened senses, preparing the body to either fight or flee.",
    category: "Biological Psychology",
    icon: "neuroscience",
    keywords: ["fight or flight", "adrenaline", "cortisol", "stress hormones", "sympathetic nervous system", "physiological arousal", "threat response", "survival mechanism", "acute stress", "anxiety response", "panic", "danger", "emergency response", "stress reaction"]
  },
  {
    term: "Coping Mechanisms",
    story: "After a particularly stressful week at work, Maria decided to go for a long run (problem-focused coping) and then called her best friend to talk about her feelings (emotion-focused coping). These were her ways of dealing with the stress.",
    explanation: "Coping mechanisms are strategies people often use in the face of stress and/or trauma to help manage painful or difficult emotions. Coping mechanisms can be adaptive (healthy) or maladaptive (unhealthy). Problem-focused coping aims to resolve the stressful situation, while emotion-focused coping aims to manage the emotional response to the stressor.",
    category: "Wellbeing Practices",
    icon: "mindfulness",
    keywords: ["stress management", "emotional regulation", "problem solving", "resilience", "adaptive strategies", "maladaptive coping", "self-soothing", "emotional support", "healthy habits", "unhealthy habits", "dealing with stress", "mental health tools", "psychological well-being", "emotional health", "self-care"]
  },
  {
    term: "Cognitive Behavioral Therapy (CBT)",
    story: "David struggled with negative thought patterns that often led to feelings of anxiety. His therapist introduced him to CBT, helping him identify, challenge, and reframe these unhelpful thoughts, which gradually reduced his anxiety levels.",
    explanation: "Cognitive Behavioral Therapy (CBT) is a type of psychotherapeutic treatment that helps people learn how to identify and change destructive or disturbing thought patterns that have a negative influence on behavior and emotions. CBT focuses on changing the automatic negative thoughts that can contribute to and worsen emotional difficulties, depression, and anxiety.",
    category: "Therapeutic Approaches",
    icon: "cognitive",
    keywords: ["psychotherapy", "mental health treatment", "negative thoughts", "thought patterns", "behavior change", "anxiety treatment", "depression treatment", "emotional regulation", "problem-solving skills", "cognitive restructuring", "behavioral activation", "therapy", "counseling", "mental wellness", "thought challenging"]
  },
  {
    term: "Burnout",
    story: "After months of working long hours without a break, Alex felt emotionally exhausted, cynical about his job, and noticed his performance declining. He realized he was experiencing burnout.",
    explanation: "Burnout is a state of emotional, physical, and mental exhaustion caused by excessive and prolonged stress. It occurs when you feel overwhelmed, emotionally drained, and unable to meet constant demands. As the stress continues, you begin to lose the interest and motivation that led you to take on a certain role in the first place.",
    category: "Work & Lifestyle",
    icon: "emotional",
    keywords: ["exhaustion", "chronic stress", "work stress", "cynicism", "reduced efficacy", "overwhelm", "emotional drain", "job dissatisfaction", "fatigue", "depersonalization", "stress management", "self-care", "work-life balance", "mental exhaustion", "physical exhaustion"]
  },
  {
    term: "Self-Compassion",
    story: "When Maya made a mistake at work, instead of berating herself, she remembered that everyone makes mistakes and treated herself with the same kindness and understanding she would offer a friend in a similar situation. This is self-compassion.",
    explanation: "Self-compassion involves treating yourself with kindness and understanding when confronted with personal failings, inadequacy, or suffering. It has three main components: self-kindness (being gentle with yourself), common humanity (recognizing that suffering and personal inadequacy are part of the shared human experience), and mindfulness (holding painful thoughts and feelings in balanced awareness).",
    category: "Wellbeing Practices",
    icon: "mindfulness",
    keywords: ["kindness to self", "self-acceptance", "mindfulness", "common humanity", "emotional resilience", "self-care", "mental well-being", "reducing self-criticism", "emotional healing", "self-love", "inner critic", "positive self-talk", "self-esteem", "emotional support", "gentleness"]
  },
  {
    term: "Rumination",
    story: "After an argument with a friend, Sarah found herself replaying the conversation over and over in her head for days, analyzing every word and gesture, which only made her feel worse. This repetitive thinking is called rumination.",
    explanation: "Rumination is the compulsively focused attention on the symptoms of one's distress, and on its possible causes and consequences, as opposed to its solutions. It involves repetitively going over a thought or a problem without completion. Rumination can be a symptom of anxiety, depression, and other mental health issues.",
    category: "Thought Patterns",
    icon: "cognitive",
    keywords: ["overthinking", "repetitive thoughts", "worry loop", "anxiety", "depression", "negative thinking", "intrusive thoughts", "mental replay", "obsessive thoughts", "problem focus", "stuck in thoughts", "mental chatter", "brooding", "dwelling on problems", "thought cycle"]
  },
  {
    term: "Attachment Styles",
    story: "Liam tends to be anxious in relationships, constantly seeking reassurance. His partner, Chloe, is more avoidant and needs space. Understanding their different attachment styles helped them navigate their conflicts more effectively.",
    explanation: "Attachment styles (e.g., secure, anxious, avoidant, disorganized) describe how people relate to others in close relationships, based on early experiences with caregivers. These styles influence expectations, behaviors, and emotional responses in adult relationships.",
    category: "Social Relationships",
    icon: "social",
    keywords: ["secure attachment", "anxious attachment", "avoidant attachment", "disorganized attachment", "relationships", "intimacy", "connection", "love", "dating", "childhood experiences", "relationship patterns", "emotional bonding", "interpersonal dynamics", "trust issues", "fear of abandonment"]
  },
  {
    term: "Maslow's Hierarchy of Needs",
    story: "Aisha was struggling to focus on her career goals (self-actualization) because she was worried about job security (safety needs) and felt isolated (love and belonging needs). She realized she needed to address her more fundamental needs first.",
    explanation: "Maslow\'s Hierarchy of Needs is a theory of motivation proposing that people are driven to fulfill basic needs (like food, safety) before moving on to more advanced needs (like esteem, self-actualization). The hierarchy is often depicted as a pyramid.",
    category: "Motivation & Needs",
    icon: "behavioral",
    keywords: ["motivation", "human needs", "physiological needs", "safety needs", "love and belonging", "esteem needs", "self-actualization", "personal growth", "humanistic psychology", "fulfillment", "potential", "life goals", "psychological development", "well-being pyramid", "priorities"]
  },
  {
    term: "Defense Mechanisms",
    story: "When criticized at work, Mark often used humor (a defense mechanism) to deflect the feedback instead of addressing it directly. This helped him avoid discomfort in the moment but didn\'t solve the underlying issue.",
    explanation: "Defense mechanisms are unconscious psychological strategies used to cope with reality and maintain self-image. Common examples include denial, repression, projection, displacement, rationalization, and sublimation. While they can be temporarily helpful, over-reliance can hinder growth.",
    category: "Self Perception",
    icon: "emotional",
    keywords: ["coping", "unconscious mind", "ego defense", "denial", "repression", "projection", "rationalization", "sublimation", "stress response", "emotional protection", "psychological defenses", "Freudian psychology", "self-deception", "avoidance", "mental blocks"]
  },
  {
    term: "Placebo Effect",
    story: "In a clinical trial, some patients given a sugar pill (placebo) reported significant improvement in their symptoms, simply because they believed they were receiving real treatment. This demonstrates the power of belief on health outcomes.",
    explanation: "The placebo effect occurs when a person experiences a real improvement in their condition after receiving a treatment with no therapeutic effect (like a sugar pill). It highlights the powerful connection between mind and body, and the role of expectation in healing.",
    category: "Cognitive Biases",
    icon: "cognitive",
    keywords: ["mind-body connection", "belief", "expectation", "healing", "medical treatment", "psychosomatic", "suggestion", "clinical trials", "health psychology", "power of mind", "fake treatment", "psychological phenomenon", "pain relief", "symptom improvement", "nocebo effect"]
  },
  {
    term: "Learned Helplessness",
    story: "After failing several job interviews despite his best efforts, Tom started to believe he would never find a job and stopped trying. He had developed learned helplessness.",
    explanation: "Learned helplessness occurs when a person or animal endures repeatedly painful or otherwise aversive stimuli which it is unable to escape or avoid. After such experience, the organism often fails to learn escape or avoidance in new situations where such behavior would be effective. In essence, the organism learns that it is helpless.",
    category: "Behavioral Patterns",
    icon: "behavioral",
    keywords: ["giving up", "passivity", "depression", "lack of control", "motivation loss", "apathy", "pessimism", "resignation", "failure cycle", "victim mentality", "empowerment", "self-efficacy", "overcoming adversity", "psychological state", "behavioral conditioning"]
  },
  {
    term: "Trauma",
    story: "After a serious car accident, Maria experienced flashbacks, nightmares, and intense anxiety for months. She was diagnosed with PTSD, a condition that can develop after experiencing or witnessing a traumatic event.",
    explanation: "Psychological trauma is an emotional response to a deeply distressing or life-threatening event. It can lead to long-term reactions such as unpredictable emotions, flashbacks, strained relationships, and even physical symptoms. Examples include accidents, abuse, natural disasters, or combat.",
    category: "Mental Health Conditions",
    icon: "emotional",
    keywords: ["PTSD", "post-traumatic stress", "flashbacks", "nightmares", "anxiety", "emotional distress", "abuse", "accidents", "disaster", "coping with trauma", "healing", "mental health support", "psychological injury", "stress disorders", "emotional shock"]
  },
  {
    term: "Stigma (Mental Health)",
    story: "John was hesitant to tell his friends about his struggles with depression because he feared they would judge him or treat him differently. This fear was due to the social stigma surrounding mental illness.",
    explanation: "Mental health stigma refers to societal disapproval, or when society places shame on people who live with a mental illness or seek help for emotional distress. Stigma can lead to discrimination, reluctance to seek help, and social isolation.",
    category: "Social Issues",
    icon: "social",
    keywords: ["discrimination", "shame", "judgment", "social exclusion", "mental illness awareness", "anti-stigma", "support seeking", "mental health advocacy", "societal attitudes", "prejudice", "misconceptions", "mental wellness", "openness", "acceptance", "community support"]
  },
  {
    term: "Mind-Body Connection",
    story: "Sarah noticed that when she was stressed about exams (mind), she often got headaches and stomach issues (body). Recognizing this connection helped her manage stress better to improve her physical well-being.",
    explanation: "The mind-body connection refers to the complex interplay between an individual's mental and emotional state and their physical health. Psychological factors can directly influence physiological processes, and vice-versa.",
    category: "Wellbeing",
    icon: "neuroscience",
    keywords: ["psychosomatic", "stress and health", "holistic health", "mental influence on physical", "wellness", "psychoneuroimmunology", "biofeedback", "health psychology", "emotional health", "physical symptoms", "well-being", "integrated health", "somatic experience", "body awareness", "mental well-being"]
  },
  {
    term: "Emotional Regulation",
    story: "When Mark felt a surge of anger after a disagreement, instead of lashing out, he took a few deep breaths and consciously decided to express his frustration calmly. This is an example of emotional regulation.",
    explanation: "Emotional regulation is the ability to respond to the ongoing demands of experience with the range of emotions in a manner that is socially tolerable and sufficiently flexible to permit spontaneous reactions as well as the ability to delay spontaneous reactions as needed. It can also be defined as extrinsic and intrinsic processes responsible for monitoring, evaluating, and modifying emotional reactions.",
    category: "Coping Skills",
    icon: "emotional",
    keywords: ["self-control", "managing emotions", "coping strategies", "emotional intelligence", "impulse control", "anger management", "anxiety management", "stress reduction", "emotional balance", "mood regulation", "psychological flexibility", "mindfulness", "emotional resilience", "self-awareness", "emotional health"]
  },
  {
    term: "Grief",
    story: "After losing her beloved pet, Maria experienced a period of intense sadness, denial, and eventually, acceptance. She learned that grief is a complex process with many different emotions and stages, unique to each person.",
    explanation: "Grief is the natural emotional, physical, and spiritual response to loss. It can be triggered by various events, such as the death of a loved one, the end of a significant relationship, job loss, or other major life changes. Grief is a personal and multifaceted experience.",
    category: "Emotional Experiences",
    icon: "emotional",
    keywords: ["bereavement", "loss", "mourning", "sadness", "coping with loss", "stages of grief", "emotional pain", "healing", "acceptance", "bereavement support", "life changes", "emotional processing", "sorrow", "heartbreak", "letting go"]
  },
  {
    term: "Self-Efficacy",
    story: "Despite never having coded before, Sarah believed she could learn and successfully build a website for her project. This belief in her own ability to succeed is called self-efficacy.",
    explanation: "Self-efficacy is an individual's belief in their capacity to execute behaviors necessary to produce specific performance attainments. It reflects confidence in the ability to exert control over one's own motivation, behavior, and social environment.",
    category: "Self Perception",
    icon: "cognitive",
    keywords: ["confidence", "belief in abilities", "competence", "mastery", "achievement", "goal setting", "motivation", "personal agency", "resilience", "empowerment", "can-do attitude", "performance", "skill development", "self-belief", "psychological strength"]
  },
  {
    term: "Social Comparison Theory",
    story: "Tom often felt inadequate after scrolling through social media and seeing curated posts of his friends' successes and perfect lives. He was engaging in upward social comparison, which negatively impacted his self-esteem.",
    explanation: "Social comparison theory, initially proposed by Leon Festinger, centers on the belief that individuals determine their own social and personal worth based on how they stack up against others. People compare themselves to others to make accurate evaluations of themselves, but this can also lead to feelings of envy or inadequacy (upward comparison) or superiority (downward comparison).",
    category: "Social Perception",
    icon: "social",
    keywords: ["comparing to others", "self-esteem", "social media effects", "envy", "self-evaluation", "peer influence", "upward comparison", "downward comparison", "social psychology", "identity", "self-worth", "keeping up with the Joneses", "social influence", "perception of others", "relative deprivation"]
  },
  {
    term: "Bystander Effect",
    story: "When someone fainted on a busy street, many people just walked by, assuming someone else would help. This diffusion of responsibility, where individuals are less likely to help when others are present, is known as the bystander effect.",
    explanation: "The bystander effect is a social psychological phenomenon in which individuals are less likely to offer help to a victim when there are other people present. The greater the number of bystanders, the less likely it is that any one of them will help, due to diffusion of responsibility and social influence.",
    category: "Social Influence",
    icon: "social",
    keywords: ["diffusion of responsibility", "helping behavior", "social inaction", "group behavior", "emergency situations", "social psychology", "prosocial behavior", "apathy", "social conformity", "pluralistic ignorance", "group dynamics", "moral responsibility", "social intervention", "Kitty Genovese", "social inhibition"]
  },
  {
    term: "Intrinsic and Extrinsic Motivation",
    story: "Maria paints because she loves the creative process and the joy it brings her (intrinsic motivation). John, on the other hand, works extra hours primarily to earn a bonus (extrinsic motivation).",
    explanation: "Intrinsic motivation involves engaging in a behavior because it is personally rewarding; essentially, performing an activity for its own sake rather than the desire for some external reward. Extrinsic motivation occurs when we are motivated to perform a behavior or engage in an activity to earn a reward or avoid punishment.",
    category: "Motivation & Needs",
    icon: "behavioral",
    keywords: ["motivation types", "rewards", "personal satisfaction", "goal achievement", "passion", "incentives", "punishment avoidance", "internal drive", "external factors", "job satisfaction", "learning", "performance", "autonomy", "mastery", "purpose"]
  },
  {
    term: "Operant Conditioning",
    story: "A dog learns to sit (behavior) when its owner says \"sit\" because it receives a treat (positive reinforcement) each time it performs the action correctly. This learning through consequences is operant conditioning.",
    explanation: "Operant conditioning is a method of learning that employs rewards and punishments for behavior. Through operant conditioning, an association is made between a behavior and a consequence (whether negative or positive) for that behavior.",
    category: "Learning Theories",
    icon: "behavioral",
    keywords: ["behaviorism", "reinforcement", "punishment", "B.F. Skinner", "learning by consequence", "behavior modification", "training", "rewards system", "positive reinforcement", "negative reinforcement", "shaping behavior", "animal training", "child development", "habit formation"]
  },
  {
    term: "Classical Conditioning",
    story: "Every time a specific jingle played on TV (neutral stimulus), it was followed by a funny cartoon (unconditioned stimulus) that made a child laugh (unconditioned response). Soon, just hearing the jingle (conditioned stimulus) made the child feel happy (conditioned response), even before the cartoon appeared. This is classical conditioning.",
    explanation: "Classical conditioning (also known as Pavlovian conditioning) is a learning process in which an association is made between a previously neutral stimulus and a stimulus that naturally evokes a response. After repeated pairings, the neutral stimulus alone can evoke the response.",
    category: "Learning Theories",
    icon: "behavioral",
    keywords: ["Pavlov\'s dogs", "associative learning", "stimulus-response", "conditioned reflex", "unconditioned stimulus", "conditioned stimulus", "learning by association", "phobias", "advertising techniques", "emotional responses", "behavioral psychology", "Ivan Pavlov", "neutral stimulus", "automatic response"]
  },
  {
    term: "Observational Learning",
    story: "A child watches their older sibling politely ask for a toy and then get to play with it. The child then imitates this polite behavior, hoping for the same outcome. This is observational learning.",
    explanation: "Observational learning, also called social learning theory, occurs when an observer\'s behavior changes after viewing the behavior of a model. An observer\'s behavior can be affected by the positive or negative consequences—called vicarious reinforcement or vicarious punishment— of a model\'s behavior.",
    category: "Learning Theories",
    icon: "social",
    keywords: ["social learning", "modeling", "imitation", "Albert Bandura", "vicarious reinforcement", "role models", "learning by watching", "behavior acquisition", "social behavior", "child development", "skill learning", "cultural transmission", "mirror neurons", "social influence"]
  },
  {
    term: "Erikson's Stages of Psychosocial Development",
    story: "Throughout his life, from infancy (trust vs. mistrust) to old age (integrity vs. despair), Alex faced different psychosocial crises that shaped his personality and sense of self. Understanding Erikson's stages helped him make sense of these developmental challenges.",
    explanation: "Erik Erikson proposed a theory of psychosocial development comprising eight stages from infancy to adulthood. During each stage, the person experiences a psychosocial crisis which could have a positive or negative outcome for personality development. Successfully navigating these crises leads to the development of psychological virtues.",
    category: "Developmental Psychology",
    icon: "social",
    keywords: ["lifespan development", "personality development", "psychosocial crises", "identity formation", "trust vs mistrust", "autonomy vs shame", "initiative vs guilt", "industry vs inferiority", "identity vs role confusion", "intimacy vs isolation", "generativity vs stagnation", "integrity vs despair", "human development", "life stages"]
  },
  {
    term: "Piaget's Stages of Cognitive Development",
    story: "A teacher observed that younger children in her class struggled with abstract concepts (concrete operational stage), while older students could think hypothetically (formal operational stage). This aligns with Piaget\'s theory of how children's thinking develops.",
    explanation: "Jean Piaget\'s theory of cognitive development suggests that children move through four different stages of mental development. His theory focuses not only on understanding how children acquire knowledge, but also on understanding the nature of intelligence. The stages are: sensorimotor, preoperational, concrete operational, and formal operational.",
    category: "Developmental Psychology",
    icon: "cognitive",
    keywords: ["child psychology", "cognitive growth", "intellectual development", "sensorimotor stage", "preoperational stage", "concrete operational stage", "formal operational stage", "learning in children", "thinking skills", "problem solving development", "Jean Piaget", "constructivism", "schemas", "assimilation", "accommodation"]
  },
  {
    term: "Nature vs. Nurture",
    story: "Two identical twins were raised in different environments. While they shared many genetic traits (nature), their personalities and interests varied significantly due to their different upbringings and experiences (nurture).",
    explanation: "The nature versus nurture debate involves the extent to which particular aspects of behavior are a product of either inherited (i.e., genetic) or acquired (i.e., learned) characteristics. Most psychologists now agree that both nature and nurture interact to shape an individual.",
    category: "Core Concepts",
    icon: "cognitive", // Changed "brain" to "cognitive"
    keywords: ["genetics", "environment", "heredity", "learned behavior", "innate traits", "developmental influences", "behavioral genetics", "epigenetics", "twin studies", "psychological traits", "personality origins", "intelligence debate", "human development", "biology vs experience"]
  },
  {
    term: "Correlation vs. Causation",
    story: "A study found that ice cream sales and crime rates are correlated (both increase in summer). However, this doesn\'t mean eating ice cream causes crime (causation). A third factor, warm weather, likely influences both.",
    explanation: "A common error in reasoning is to confuse correlation with causation. Correlation indicates that two variables tend to occur together, but it does not imply that one causes the other. Causation means that a change in one variable directly produces a change in another. Establishing causation requires controlled experiments.",
    category: "Research Methods",
    icon: "cognitive",
    keywords: ["statistical reasoning", "research bias", "logical fallacies", "critical thinking", "scientific method", "data interpretation", "spurious correlation", "experimental design", "third variable problem", "cause and effect", "misinterpretation", "research literacy", "psychological research", "data analysis"]
  },
  {
    term: "Emotional Labor",
    story: "As a customer service representative, Maria had to maintain a cheerful and helpful demeanor all day, even when dealing with angry customers. This effort to manage her emotions as part of her job is known as emotional labor.",
    explanation: "Emotional labor refers to the process of managing feelings and expressions to fulfill the emotional requirements of a job. More specifically, workers are expected to regulate their emotions during interactions with customers, co-workers and superiors. This includes analysis and decision making in terms of the expression of emotion, whether or not it is actually felt.",
    category: "Work & Lifestyle",
    icon: "social",
    keywords: ["work stress", "customer service", "emotion management", "job demands", "burnout risk", "professionalism", "interpersonal skills", "workplace well-being", "emotional exhaustion", "surface acting", "deep acting", "emotional dissonance", "people-facing roles", "emotional toll"]
  },
  {
    term: "Imposter Syndrome",
    story: "Despite numerous accolades and positive feedback, Dr. Chen often felt like a fraud, fearing that someday everyone would discover she wasn't as competent as they thought. This persistent self-doubt is characteristic of imposter syndrome.",
    explanation: "Imposter syndrome is an internal experience of believing that you are not as competent as others perceive you to be. While this definition is usually narrowly applied to intelligence and achievement, it has links to perfectionism and the social context. It is often accompanied by feelings of anxiety and fear of being 'found out'.", // Corrected syntax and removed invalid characters
    category: "Self Perception",
    icon: "emotional",
    keywords: ["self-doubt", "fraud", "inadequacy", "perfectionism", "fear of failure", "achievement anxiety", "competence", "high-achievers", "workplace anxiety", "academic anxiety", "feeling like a fake", "validation seeking", "overcoming self-doubt", "professional insecurity"]
  },
  {
    term: "Mindfulness-Based Stress Reduction (MBSR)",
    story: "To cope with chronic pain and stress, David enrolled in an MBSR program. Through guided meditation, body scans, and gentle yoga, he learned to relate differently to his pain and experienced a significant reduction in stress.",
    explanation: "Mindfulness-Based Stress Reduction (MBSR) is an eight-week evidence-based program that offers secular, intensive mindfulness training to assist people with stress, anxiety, depression and pain. Developed by Jon Kabat-Zinn, MBSR uses a combination of mindfulness meditation, body awareness, yoga and exploration of patterns of thinking, feeling and action.",
    category: "Wellbeing Practices",
    icon: "mindfulness",
    keywords: ["stress reduction", "meditation", "mindfulness training", "Jon Kabat-Zinn", "chronic pain management", "anxiety relief", "depression support", "body scan", "mindful movement", "well-being program", "mental health", "self-care", "awareness practice", "therapeutic mindfulness", "holistic health"]
  },
  {
    term: "Positive Psychology",
    story: "Instead of only focusing on what was wrong, Sarah\\'s therapist also helped her identify and cultivate her strengths, positive emotions, and meaningful engagement in life. This approach is central to positive psychology.",
    explanation: "Positive psychology is the scientific study of what makes life most worth living – focusing on both individual and societal well-being. It seeks to understand and help people to live a flourishing life, by focusing on strengths, positive emotions, meaning, relationships, and accomplishment (PERMA model by Martin Seligman).",
    category: "Therapeutic Approaches",
    icon: "cognitive",
    keywords: ["strengths", "well-being", "happiness", "flourishing", "Martin Seligman", "PERMA model", "optimism", "resilience", "gratitude", "meaning in life", "positive emotions", "human potential", "life satisfaction", "mental wellness", "thriving"]
  },
  {
    term: "Music Therapy",
    story: "To manage her anxiety and improve her mood, Emma started listening to classical music and practicing piano regularly. This use of music as a therapeutic tool is similar to what music therapy offers.",
    explanation: "Music therapy is an established health profession that uses music interventions to address physical, emotional, cognitive, and social needs of individuals. It can promote healing and enhance quality of life.",
    category: "Psychological Approaches",
    icon: "cognitive", // Corrected syntax
    keywords: [ // Corrected and updated keywords for Music Therapy
      "music intervention",
      "sound therapy",
      "expressive arts",
      "emotional regulation",
      "cognitive support",
      "social engagement",
      "therapeutic music",
      "vibrational healing",
      "alternative medicine",
      "non-verbal communication",
      "stress relief",
      "well-being"
    ]
  }
];

export function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Function to remove duplicate terms by keeping the first occurrence
  const removeDuplicateTerms = (termsArray: PsychTerm[]): PsychTerm[] => {
    const uniqueTerms: PsychTerm[] = [];
    const seenTerms = new Set<string>();
    
    termsArray.forEach(term => {
      if (!seenTerms.has(term.term)) {
        seenTerms.add(term.term);
        uniqueTerms.push(term);
      }
    });
    
    return uniqueTerms;
  };
  
  // Memoize allTerms to prevent infinite update loop
  const allTerms = useMemo(() => removeDuplicateTerms([
    ...terms,
    ...moreConcepts,
    ...moreConcepts2,
    ...moreConcepts3,
    ...neuroscienceConcepts,
    ...navalConcepts
  ]), [terms, moreConcepts, moreConcepts2, moreConcepts3, neuroscienceConcepts, navalConcepts]);

  const [filteredTerms, setFilteredTerms] = useState<PsychTerm[]>(allTerms);
  // Add a state to track which cards are expanded
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
  // Add a state to track which filter is active
  const [activeFilter, setActiveFilter] = useState<string>('all');
  // Add state for dynamic filter categories
  const [filterCategories, setFilterCategories] = useState<Array<{id: string, label: string, count: number}>>([]);

  // Generate dynamic filter categories based on terms data
  useEffect(() => {
    if (allTerms.length > 0) {
      // Start with the "all" filter
      const categories: Array<{id: string, label: string, count: number}> = [
        { id: 'all', label: 'all', count: allTerms.length }
      ];
      
      // Create a single map to track all categories and avoid duplicates
      const categoryCountsMap = new Map<string, number>();
      
      // Process each term to count categories
      allTerms.forEach(term => {
        // Count by icon type
        if (term.icon) {
          categoryCountsMap.set(term.icon, (categoryCountsMap.get(term.icon) || 0) + 1);
        }
        
        // Count by category content (only if not already counted by icon)
        if (term.category) {
          const category = term.category.toLowerCase();
          if (category.includes('naval') && !categoryCountsMap.has('naval')) {
            categoryCountsMap.set('naval', (categoryCountsMap.get('naval') || 0) + 1);
          } else if (category.includes('neuroscience') && !categoryCountsMap.has('neuroscience')) {
            categoryCountsMap.set('neuroscience', (categoryCountsMap.get('neuroscience') || 0) + 1);
          } else if (category.includes('habit')) {
            categoryCountsMap.set('habits', (categoryCountsMap.get('habits') || 0) + 1);
          } else if (category.includes('psychology') || category === 'core concepts') {
            categoryCountsMap.set('psychology', (categoryCountsMap.get('psychology') || 0) + 1);
          } else if (category.includes('wellbeing') || category.includes('well-being')) {
            categoryCountsMap.set('wellbeing', (categoryCountsMap.get('wellbeing') || 0) + 1);
          }
        }
        
        // Check for Huberman content in keywords
        if (term.keywords?.some(k => k.toLowerCase().includes('huberman'))) {
          categoryCountsMap.set('huberman', (categoryCountsMap.get('huberman') || 0) + 1);
        }
        
        // Check for wisdom content
        if (term.category?.toLowerCase().includes('wisdom') || 
            term.keywords?.some(k => k.toLowerCase().includes('wisdom'))) {
          categoryCountsMap.set('wisdom', (categoryCountsMap.get('wisdom') || 0) + 1);
        }
      });
      
      // Add all unique categories from the single map
      categoryCountsMap.forEach((count, categoryId) => {
        if (count > 0) {
          categories.push({ id: categoryId, label: categoryId, count });
        }
      });
      
      setFilterCategories(categories);
    }
  }, [allTerms]);

  // Filter terms based on search query and active filter
  useEffect(() => {
    const filtered = allTerms.filter(term => {
      // Apply search query filter
      const query = searchQuery.toLowerCase();
      const matchesSearch = query === '' || 
        term.term.toLowerCase().includes(query) ||
        term.explanation.toLowerCase().includes(query) ||
        term.story.toLowerCase().includes(query) ||
        term.category.toLowerCase().includes(query) ||
        (term.keywords?.some(keyword => keyword.toLowerCase().includes(query)) ?? false);
      
      // If search doesn't match, return false immediately
      if (!matchesSearch) return false;
      
      // If filter is 'all', include all search matches
      if (activeFilter === 'all') return true;
      
      // Handle specific filters
      switch(activeFilter) {
        case 'naval':
          return term.icon === 'naval' || 
                 (term.keywords?.some(k => k.toLowerCase().includes('naval')) ?? false);
        
        case 'neuroscience':
          return term.icon === 'neuroscience' || 
                 term.category.toLowerCase().includes('neuroscience');
        
        case 'habits':
          return term.category.toLowerCase().includes('habit') || 
                 (term.keywords?.some(k => k.toLowerCase().includes('habit')) ?? false);
        
        case 'huberman':
          return (term.keywords?.some(k => k.toLowerCase().includes('huberman')) ?? false);
        
        case 'wisdom':
          return term.category.toLowerCase().includes('wisdom') || 
                 (term.keywords?.some(k => k.toLowerCase().includes('wisdom')) ?? false);
        
        case 'psychology':
          return term.category.toLowerCase().includes('psycholog') || 
                 term.category.toLowerCase() === 'core concepts';
        
        case 'wellbeing':
          return term.category.toLowerCase().includes('wellbeing') || 
                 term.category.toLowerCase().includes('well-being');
        
        case 'emotional':
          return term.icon === 'emotional';
        
        case 'cognitive':
          return term.icon === 'cognitive';
        
        case 'behavioral':
          return term.icon === 'behavioral';
        
        case 'mindfulness':
          return term.icon === 'mindfulness';
        
        case 'social':
          return term.icon === 'social';
        
        default:
          return false;
      }
    });

    setFilteredTerms(filtered);
  }, [searchQuery, activeFilter, allTerms]);

  useEffect(() => {
    // Apply CSS animation styles to the document
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = animationStyles;
    document.head.appendChild(styleSheet);

    // Initial focus on the search input
    const timer = setTimeout(() => {
      const input = document.querySelector("input[name='search']") as HTMLElement;
      input?.focus({ preventScroll: true });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Modified to handle card expansion/collapse instead of navigation
  const handleTermSelect = (term: PsychTerm, event: React.MouseEvent) => {
    // Toggle card expansion instead of navigating
    toggleCardExpansion(term.term, event);
  };

  // Function to toggle card expansion
  const toggleCardExpansion = (term: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click from navigating
    setExpandedCards(prev => ({
      ...prev,
      [term]: !prev[term]
    }));
  };

  return (
    <div className="min-h-screen flex flex-col p-[20px] bg-transparent relative pointer-events-none" id="learn-page" aria-label="Psychology Concepts Learning Page">
      {/* Background embed frame */}
      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden z-0">
        <iframe 
          src='https://my.spline.design/particleaibrain-az4SiexShAY1WrpvxP1RuP9A/' 
          frameBorder='0' 
          width='100%' 
          height='100vh' 
          className="fixed"
          title="Background 3D animation"
          style={{ minHeight: '100vh' }}
        ></iframe>
      </div>
      
      {/* Title and Filters Container (copied from Practices) */}
      <div className="flex flex-col justify-center items-center p-0 gap-[20px] w-full h-[74px] bg-transparent mb-4 relative z-20 pointer-events-auto" id="learn-title-filters-container">
        {/* Page Title */}
        <div className="w-full h-[18px] text-center" id="learn-page-title">
          <span className="font-['Happy_Monkey'] font-normal text-[16px] leading-[18px] text-center lowercase text-[#04C4D5]">
            psychology, neuroscience & wisdom
          </span>
        </div>
        {/* Filter Chips - Horizontal scrolling categories */}
        <div className="flex flex-row items-start p-0 pl-[4px] pr-[4px] w-screen -mx-[20px] h-[36px] overflow-x-auto scrollbar-hide z-20 gap-2 pointer-events-auto" id="learn-filter-chips-container">
          {filterCategories.map(category => (
            <button 
              key={category.id}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveFilter(category.id);
              }}
              className={`box-border flex flex-row justify-center items-center p-[10px] gap-[10px] h-[36px] w-auto min-w-max cursor-pointer pointer-events-auto ${
                activeFilter === category.id 
                  ? 'bg-[#FCDF4D] border border-white shadow-[1px_2px_4px_rgba(73,218,234,0.5)]' 
                  : `border ${category.id === 'all' ? 'border-white' : 'border-[#04C4D5]'}`
              } rounded-[20px] whitespace-nowrap px-4`}
              style={{ touchAction: 'manipulation' }}
            >
              <span className={`font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] flex items-center text-center lowercase ${
                activeFilter === category.id ? 'text-black' : 'text-[#148BAF]'
              }`}>
                {category.label} {category.count > 0 && category.id !== 'all' ? `(${category.count})` : ''}
              </span>
            </button>
          ))}
        </div>
      </div>
      {/* Search Bar (fixed to bottom, like Practices) */}
      <div className="fixed bottom-[20px] left-0 w-full flex justify-center z-[20] pointer-events-auto" id="learn-search-bar-container">
        <div 
          className="box-border flex flex-row justify-center items-center px-[20px] py-[10px] gap-[10px] w-full max-w-[380px] h-[52px] bg-[#148BAF] border border-white rounded-[100px]" 
          id="learn-search-bar"
          style={{ boxShadow: "1px 2px 4px rgba(73, 218, 234, 0.5)" }}
        >
          <input
            type="text"
            placeholder="search concepts"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="flex-grow bg-transparent outline-none font-['Happy_Monkey'] font-normal text-[12px] leading-[16px] lowercase text-[#F7FFFF] placeholder-[#F7FFFF]"
            id="learn-search-input"
          />
          <div className="flex flex-row justify-center items-center w-[31px] h-[32px] flex-none" id="learn-search-button">
            <svg className="w-[19.28px] h-[20px] text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Concepts Grid Container */}
      <div className="max-w-3xl mx-auto relative z-10 pointer-events-auto" id="concepts-container">
        {filteredTerms.length === 0 ? (
          <p className="text-center text-gray-500 py-4" id="no-results-message">No concepts found. Try a different search term or filter.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-2 sm:px-0 mx-auto" style={{ justifyItems: 'center' }} id="concepts-grid" role="list" aria-label="Psychology concepts">
            {filteredTerms.map((term, index) => (
              <div
                key={`${term.term}-${term.category}-${index}`}
                id={`concept-card-${term.term.toLowerCase().replace(/\s+/g, '-')}-${index}`}
                style={{ width: '100%', maxWidth: '360px' }}
                className={`box-border flex flex-col justify-center items-center p-2 sm:p-[10px] gap-2 sm:gap-[8px]
                  ${expandedCards[term.term] 
                    ? 'h-auto sm:h-[188.7px] bg-white/80 backdrop-blur-xl' 
                    : 'h-auto sm:h-[92.7px] bg-[#F5F5F5]/80 backdrop-blur-xl'} 
                  border border-white shadow-[1px_2px_4px_rgba(73,218,234,0.5)] rounded-[10px] card-hover cursor-pointer 
                  ${index === 0 ? 'animate-slide-down' : ''} transition-all duration-300`}
                onClick={(event) => handleTermSelect(term, event)}
                role="listitem"
                aria-expanded={expandedCards[term.term]}
                aria-label={`${term.term} concept card`}
              >
                {/* Concept Card Content */}
                <div className={`flex flex-col items-start p-0 gap-2 sm:gap-[8px] w-full ${expandedCards[term.term] ? '' : 'sm:h-[72.7px]'}`}>
                  
                  {/* Concept Card Header */}
                  <div className="flex flex-row items-center flex-wrap sm:flex-nowrap p-0 gap-2 sm:gap-[10px] w-full min-h-[32.7px]" id={`concept-header-${term.term.toLowerCase().replace(/\s+/g, '-')}`}>
                    {/* Concept Icon Container */}
                    <div 
                      className={`flex flex-col justify-center items-center p-[4px] gap-[4px] min-w-[36.63px] h-[32.7px] 
                        ${expandedCards[term.term] ? 'bg-[rgba(83,252,255,0.1)]' : 'bg-white'} rounded-[8px]`} 
                      id={`concept-icon-container-${term.term.toLowerCase().replace(/\s+/g, '-')}`}
                      aria-hidden="true"
                    >
                      <div className="w-[28.63px] h-[24.7px] flex items-center justify-center" id={`concept-icon-${term.term.toLowerCase().replace(/\s+/g, '-')}`}>
                        {getIconComponent(term.icon)}
                      </div>
                    </div>
                    
                    {/* Concept Title Container */}
                    <div className="flex flex-row items-center p-0 gap-[10px] min-h-[18px] flex-grow overflow-hidden" id={`concept-title-container-${term.term.toLowerCase().replace(/\s+/g, '-')}`}>
                      <h3 
                        className={`font-righteous font-normal text-[14px] sm:text-[16px] leading-tight sm:leading-[18px] flex items-center uppercase truncate
                          ${expandedCards[term.term] ? 'text-[#FFD400]' : 'text-[#148BAF]'} flex-grow`}
                        id={`concept-title-${term.term.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {term.term}
                      </h3>
                    </div>
                    
                    {/* Concept Category Badge */}
                    <div 
                      className="flex flex-col justify-center items-center p-1 sm:p-[4px_8px] gap-[4px] min-w-[70px] sm:w-[98px] h-[24px] bg-[rgba(83,252,255,0.1)] rounded-[8px]" 
                      id={`concept-category-${term.term.toLowerCase().replace(/\s+/g, '-')}`}
                      aria-label={`Category: ${term.category}`}
                    >
                      <span className="w-full sm:w-[82px] h-[16px] font-happy-monkey font-normal text-[10px] sm:text-[12px] leading-[16px] flex items-center justify-center text-center lowercase text-[#148BAF]">
                        {term.category}
                      </span>
                    </div>
                  </div>
                  
                  {/* Concept Description Row */}
                  <div className="flex flex-row justify-between items-center p-0 gap-2 sm:gap-[10px] w-full min-h-[32px]" id={`concept-description-row-${term.term.toLowerCase().replace(/\s+/g, '-')}`}>
                    {/* Concept Summary Text */}
                    <p 
                      className="flex-1 max-w-[calc(100%-50px)] font-happy-monkey font-normal text-[11px] sm:text-[12px] leading-tight sm:leading-[16px] flex items-center lowercase text-black line-clamp-2"
                      id={`concept-summary-${term.term.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {getSummary(term.term, term.category)}
                    </p>
                    
                    {/* Expand/Collapse Button */}
                    <div 
                      className={`flex flex-col justify-center items-center p-1 sm:p-[4px_8px] gap-[4px] min-w-[40px] h-[24px] 
                        ${expandedCards[term.term] ? 'bg-white' : 'bg-[#F5F5F5]'} shadow-[1px_2px_4px_rgba(73,218,234,0.5)] rounded-[8px]`}
                      onClick={(e) => toggleCardExpansion(term.term, e)}
                      id={`expand-button-${term.term.toLowerCase().replace(/\s+/g, '-')}`}
                      role="button"
                      aria-label={`${expandedCards[term.term] ? 'Show less' : 'Show more'} about ${term.term}`}
                      aria-controls={`expanded-content-${term.term.toLowerCase().replace(/\s+/g, '-')}`}
                      aria-expanded={expandedCards[term.term]}
                    >
                      <span className="w-full sm:w-[24px] h-[16px] font-happy-monkey font-normal text-[10px] sm:text-[12px] leading-[16px] flex items-center justify-center text-center lowercase text-[#148BAF]">
                        {expandedCards[term.term] ? 'less' : 'more'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Expanded Content - Yellow Box (Only shown when expanded) */}
                  {expandedCards[term.term] && (
                    <div 
                      className="flex flex-row justify-center items-center p-2 sm:p-[4px] gap-[10px] w-full sm:w-[340px] h-auto min-h-[88px] bg-[#FCDF4D] rounded-[10px] mt-2 sm:mt-[8px]"
                      id={`expanded-content-${term.term.toLowerCase().replace(/\s+/g, '-')}`}
                      aria-label={`Additional information about ${term.term}`}
                    >
                      <p 
                        className="w-full sm:w-[332px] font-happy-monkey font-normal text-[11px] sm:text-[12px] leading-tight sm:leading-[16px] flex items-center lowercase text-black"
                        id={`concept-story-${term.term.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        {term.story || "Start your day right with our energetic morning running group. All paces welcome! Every Sunday morning the run starts. Need more explanation..."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Page Footer Section */}
      <div className="mt-10 text-center" id="learn-page-footer">
        <p className="text-sm text-gray-500" id="learn-page-footer-text">
          Explore more about each concept by clicking on them. Dive deep into the world of psychology!
        </p>
      </div>
    </div>
  );
}

export default Home;