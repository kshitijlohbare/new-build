import { useState, useEffect, useRef } from "react";
import { Search, BookOpen, Lightbulb, Heart, Brain, Zap, Anchor } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  50% { transform: scale(1.05); }
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
  box-shadow: 0 8px 20px rgba(6, 196, 213, 0.15);
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out forwards;
}
`;

export interface PsychTerm {
  term: string;
  story: string;
  explanation: string;
  category: string;
  icon: "mindfulness" | "cognitive" | "emotional" | "behavioral" | "social" | "neuroscience" | "naval";
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
  },
  {
    term: "Halo Effect",
    story: "After seeing a charismatic presenter give an excellent talk, Kim immediately assumed he must be intelligent, honest, and kind—without any evidence of these other traits.",
    explanation: "The halo effect is the tendency for positive impressions of a person in one area to positively influence our opinion of them in other areas.",
    category: "Social Perception",
    icon: "social",
  },
  {
    term: "Framing Effect",
    story: "The doctor told Lin she had a 90% survival rate with the treatment. When she got a second opinion, another doctor said there was a 10% mortality rate. Though the statistics were identical, Lin felt much more optimistic after the first consultation.",
    explanation: "The framing effect is our tendency to react differently to information depending on whether it's presented as a gain or a loss, even when the underlying facts are the same.",
    category: "Decision Making",
    icon: "cognitive",
  },
  {
    term: "Halo Effect",
    story: "After seeing a charismatic presenter give an excellent talk, Kim immediately assumed he must be intelligent, honest, and kind—without any evidence of these other traits.",
    explanation: "The halo effect is the tendency for positive impressions of a person in one area to positively influence our opinion of them in other areas.",
    category: "Social Perception",
    icon: "social",
  },
  {
    term: "Framing Effect",
    story: "The doctor told Lin she had a 90% survival rate with the treatment. When she got a second opinion, another doctor said there was a 10% mortality rate. Though the statistics were identical, Lin felt much more optimistic after the first consultation.",
    explanation: "The framing effect is our tendency to react differently to information depending on whether it's presented as a gain or a loss, even when the underlying facts are the same.",
    category: "Decision Making",
    icon: "cognitive",
  },
  {
    term: "Availability Bias",
    story: "After watching news coverage of a plane crash, Jordan became afraid of flying, even though statistics show it's far safer than driving, which he does daily without worry.",
    explanation: "Availability bias leads us to overestimate the likelihood of events that come readily to mind, like those that are recent, unusual, or emotionally charged.",
    category: "Cognitive Biases",
    icon: "cognitive",
  },
  {
    term: "Sunk Cost Fallacy",
    story: "Priya continued watching a three-hour movie she wasn't enjoying because she'd already invested an hour and paid for the ticket, thinking, 'I've come this far, I might as well finish it.'",
    explanation: "The sunk cost fallacy is our tendency to continue an endeavor once we've invested resources in it, even when continuing clearly costs more than it benefits us.",
    category: "Decision Making",
    icon: "behavioral",
  },
  {
    term: "Growth Mindset",
    story: "When Sam failed his first driving test, he felt disappointed. But instead of giving up, he saw it as a chance to learn and improve. He practiced more and passed the next time. This attitude is called a growth mindset.",
    explanation: "A growth mindset is the belief that abilities and intelligence can be developed through effort, learning, and persistence. It helps people embrace challenges and learn from setbacks.",
    category: "Self Development",
    icon: "cognitive",
  },
  {
    term: "Imposter Syndrome",
    story: "Maya started a new job and felt like she didn't belong, even though she was qualified. She worried others would find out she was a 'fraud.' This feeling is known as imposter syndrome.",
    explanation: "Imposter syndrome is the persistent feeling of self-doubt and fear of being exposed as a fraud, despite evidence of competence. It's common among high achievers and can be managed by recognizing and challenging these thoughts.",
    category: "Self Perception",
    icon: "emotional",
  },
  {
    term: "Resilience",
    story: "After losing his job, Alex felt lost. But he reached out for support, learned new skills, and eventually found a new opportunity. His ability to bounce back is called resilience.",
    explanation: "Resilience is the capacity to recover from difficulties and adapt to change. It involves emotional strength, support systems, and a positive outlook.",
    category: "Coping Skills",
    icon: "emotional",
  },
  {
    term: "Mindfulness",
    story: "During a stressful day, Tara took a few minutes to focus on her breath and notice her surroundings. She felt calmer and more present. This practice is called mindfulness.",
    explanation: "Mindfulness is the practice of paying attention to the present moment, non-judgmentally. It can reduce stress, improve focus, and enhance well-being.",
    category: "Wellbeing Practices",
    icon: "mindfulness",
  },
  {
    term: "Confirmation Bias",
    story: "John firmly believed that his coworkers didn't like him. Whenever someone didn't smile at him, he saw it as proof. But he ignored all the times they invited him to lunch or asked for his input. This selective attention is called confirmation bias.",
    explanation: "Confirmation bias is our tendency to search for, interpret, and remember information that confirms our existing beliefs while ignoring contradicting evidence.",
    category: "Thought Patterns",
    icon: "cognitive",
  },
  {
    term: "Emotional Intelligence",
    story: "When Emma's friend was upset about failing an exam, she listened without judgment, validated their feelings, and only then gently suggested study strategies. Her ability to understand and respond appropriately demonstrates emotional intelligence.",
    explanation: "Emotional intelligence is the ability to recognize, understand and manage our own emotions, as well as recognize, understand and influence the emotions of others.",
    category: "Social Skills",
    icon: "social",
  },
  {
    term: "Anchoring Bias",
    story: "When buying a car, Alex saw the sticker price of $30,000. After negotiating, he felt triumphant getting it for $27,000, not realizing the dealer's cost was only $23,000. The initial price 'anchored' his perception of value.",
    explanation: "Anchoring is our tendency to rely too heavily on the first piece of information we encounter (the 'anchor') when making decisions, even when the anchor has little relevance to the decision at hand.",
    category: "Cognitive Biases",
    icon: "cognitive",
  },
  {
    term: "Paradox of Choice",
    story: "Michelle stood frozen in the cereal aisle, overwhelmed by 50 different options. After 10 minutes of comparing, she left without buying anything. Too many choices had paralyzed her decision-making.",
    explanation: "The paradox of choice suggests that while freedom of choice is positive, too many options can lead to decision paralysis, anxiety, and dissatisfaction with our eventual choice.",
    category: "Decision Making",
    icon: "behavioral",
  },
  {
    term: "Loss Aversion",
    story: "James refused to sell his old watch for $200, even though he never wore it and a new model costs $150. The pain of losing the watch outweighed the rational financial benefit.",
    explanation: "Loss aversion describes our tendency to prefer avoiding losses over acquiring equivalent gains. The psychological impact of losing is typically twice as powerful as the pleasure of gaining.",
    category: "Behavioral Economics",
    icon: "behavioral",
  },
  {
    term: "Social Proof",
    story: "Lisa was undecided about a restaurant until she saw a long line outside. 'It must be good if so many people are waiting,' she thought, joining the queue without checking reviews.",
    explanation: "Social proof is our tendency to adopt the beliefs or actions of a group of people we trust or identify with. We assume others' collective actions reflect correct behavior in situations of uncertainty.",
    category: "Social Influence",
    icon: "social",
  },
  {
    term: "Dunning-Kruger Effect",
    story: "After one programming class, David felt he could build a professional app and was confused when companies wouldn't hire him. His limited knowledge prevented him from understanding how much more he needed to learn.",
    explanation: "The Dunning-Kruger effect is a cognitive bias where people with limited knowledge in a domain overestimate their competence, while experts tend to underestimate their abilities relative to others.",
    category: "Self Perception",
    icon: "cognitive",
  },
  {
    term: "Reciprocity",
    story: "When the waiter brought Sarah a free dessert sample, she felt obligated to order a full dessert even though she was already full.",
    explanation: "Reciprocity is our tendency to feel obligated to return favors after receiving something, even when unsolicited. This powerful social norm underlies much human cooperation and social exchange.",
    category: "Social Influence",
    icon: "social",
  },
  {
    term: "Scarcity Principle",
    story: "Tim wasn't interested in the concert until he heard 'Only 10 tickets left!' Suddenly, he urgently wanted to go and bought a ticket immediately.",
    explanation: "The scarcity principle refers to our tendency to value things more when they are rare or in limited supply. Opportunities seem more valuable when their availability is limited.",
    category: "Behavioral Economics",
    icon: "behavioral",
  },
  {
    term: "Habit Loop",
    story: "Every time Jenny felt stressed (cue), she checked social media (routine), which gave her temporary distraction (reward). This cycle repeated automatically whenever stress appeared.",
    explanation: "The habit loop is a neurological pattern consisting of a cue (trigger), routine (behavior), and reward. Understanding this loop is key to forming new habits or breaking unwanted ones.",
    category: "Behavioral Patterns",
    icon: "behavioral",
  },
  {
    term: "Fundamental Attribution Error",
    story: "When a colleague missed a deadline, Ryan thought, 'She's so lazy and disorganized.' When he missed a deadline the following week, he explained, 'I had so many unexpected emergencies this week.'",
    explanation: "The fundamental attribution error is our tendency to attribute others' behavior to their character while explaining our own behavior based on situational factors.",
    category: "Social Perception",
    icon: "social",
  },
  {
    term: "Hedonic Adaptation",
    story: "After years of dreaming about it, Maria finally got her luxury car. She felt ecstatic for weeks, but within months, the car just felt normal and no longer brought the same joy.",
    explanation: "Hedonic adaptation is our tendency to quickly return to a relatively stable level of happiness despite major positive or negative life changes. We adapt to new situations, possessions, or life circumstances.",
    category: "Wellbeing",
    icon: "emotional",
  },
  {
    term: "Spotlight Effect",
    story: "After spilling water on his shirt, Michael felt everyone at the meeting was staring at the stain. In reality, hardly anyone noticed.",
    explanation: "The spotlight effect is the tendency to overestimate how much others notice about us, including our appearance, performance, and mistakes. We feel more observed than we actually are.",
    category: "Self Perception",
    icon: "social",
  },
  {
    term: "Hindsight Bias",
    story: "After the stock market crashed, Paula claimed, 'I knew that was going to happen!' In truth, she had been just as surprised as everyone else.",
    explanation: "Hindsight bias is our tendency to perceive past events as having been predictable, despite having little or no objective basis for predicting them before they occurred.",
    category: "Memory Biases",
    icon: "cognitive",
  },
  {
    term: "Halo Effect",
    story: "After seeing a charismatic presenter give an excellent talk, Kim immediately assumed he must be intelligent, honest, and kind—without any evidence of these other traits.",
    explanation: "The halo effect is the tendency for positive impressions of a person in one area to positively influence our opinion of them in other areas.",
    category: "Social Perception",
    icon: "social",
  },
  {
    term: "Framing Effect",
    story: "The doctor told Lin she had a 90% survival rate with the treatment. When she got a second opinion, another doctor said there was a 10% mortality rate. Though the statistics were identical, Lin felt much more optimistic after the first consultation.",
    explanation: "The framing effect is our tendency to react differently to information depending on whether it's presented as a gain or a loss, even when the underlying facts are the same.",
    category: "Decision Making",
    icon: "cognitive",
  },
  {
    term: "Availability Bias",
    story: "After watching news coverage of a plane crash, Jordan became afraid of flying, even though statistics show it's far safer than driving, which he does daily without worry.",
    explanation: "Availability bias leads us to overestimate the likelihood of events that come readily to mind, like those that are recent, unusual, or emotionally charged.",
    category: "Cognitive Biases",
    icon: "cognitive",
  },
  {
    term: "Zeigarnik Effect",
    story: "Even though it was 11 PM, Carlos couldn't stop thinking about the unfinished project on his desk. Only after making a detailed plan to complete it tomorrow did his mind finally relax.",
    explanation: "The Zeigarnik Effect is our tendency to remember interrupted or incomplete tasks better than completed ones. Our brains tend to focus on unfinished business until it's resolved.",
    category: "Memory",
    icon: "cognitive",
  },
  {
    term: "Pygmalion Effect",
    story: "When Mr. Chen told Sam he had great potential in mathematics, Sam started studying harder and eventually excelled in the subject, despite his previous average performance.",
    explanation: "The Pygmalion Effect occurs when higher expectations lead to an increase in performance. When others believe in our abilities, we often rise to meet those expectations.",
    category: "Self Development",
    icon: "social",
  },
  {
    term: "Sunk Cost Fallacy",
    story: "Priya continued watching a three-hour movie she wasn't enjoying because she'd already invested an hour and paid for the ticket, thinking, 'I've come this far, I might as well finish it.'",
    explanation: "The sunk cost fallacy is our tendency to continue an endeavor once we've invested resources in it, even when continuing clearly costs more than it benefits us.",
    category: "Decision Making",
    icon: "behavioral",
  },
  {
    term: "Peak-End Rule",
    story: "Despite standing in line for 45 minutes at the amusement park, Daniel remembered the experience fondly because the ride was thrilling (the peak) and the exit led through a gift shop where he found a souvenir he loved (the end).",
    explanation: "The peak-end rule suggests that people judge experiences primarily based on how they felt at the most intense point and at the end, rather than the average of every moment.",
    category: "Memory",
    icon: "cognitive",
  },
  {
    term: "Mere Exposure Effect",
    story: "Initially, Leila disliked the new song on the radio, but after hearing it play several times over the week, she found herself humming along and eventually downloading it.",
    explanation: "The mere exposure effect is the tendency to develop a preference for things simply because we are familiar with them. Repeated exposure increases liking.",
    category: "Social Influence",
    icon: "behavioral",
  },
  {
    term: "Self-Serving Bias",
    story: "After acing the exam, Marcus attributed his success to his intelligence and hard work. When he failed the next one, he blamed the unclear questions and noisy testing environment.",
    explanation: "Self-serving bias is our tendency to attribute positive events to our own character but attribute negative events to external factors.",
    category: "Self Perception",
    icon: "cognitive",
  },
  {
    term: "Barnum Effect",
    story: "Reading her horoscope, Rachel was amazed at how accurately it described her as 'sometimes outgoing, sometimes reserved,' not realizing the description was vague enough to apply to almost anyone.",
    explanation: "The Barnum Effect occurs when individuals believe that personality descriptions apply specifically to them, despite the fact that the description is vague and general enough to apply to a wide range of people.",
    category: "Self Perception",
    icon: "cognitive",
  },
  {
    term: "Ikea Effect",
    story: "Even though professionally made furniture was available at a similar price, Tyler valued his wobbly bookshelf more because he had spent a whole weekend building it himself.",
    explanation: "The Ikea Effect is the tendency for people to place higher value on things they partially created themselves, regardless of the quality of the end result.",
    category: "Behavioral Economics",
    icon: "behavioral",
  },
  {
    term: "Dunbar's Number",
    story: "Although Maya had 1,500 social media connections, she realized she only maintained meaningful relationships with about 150 people, and truly close connections with far fewer.",
    explanation: "Dunbar's Number suggests that humans can maintain stable social relationships with only about 150 people due to cognitive limitations. Beyond this number, the relationships become less stable and meaningful.",
    category: "Social Relationships",
    icon: "social",
  },
  {
    term: "Impostor Phenomenon",
    story: "Despite receiving a promotion, Eliot worried that he had fooled everyone and would eventually be exposed as not qualified for the job, even though his work consistently received praise.",
    explanation: "Impostor phenomenon involves persistent feelings of self-doubt and fear of being exposed as a fraud despite evidence of competence and accomplishment.",
    category: "Self Perception",
    icon: "emotional",
  },
  {
    term: "Cognitive Load",
    story: "While trying to follow a complex recipe, respond to text messages, and watch her toddler, Sofia made several cooking mistakes that she wouldn't normally make.",
    explanation: "Cognitive load refers to the total amount of mental effort being used in working memory. When cognitive load exceeds our capacity, performance suffers and errors increase.",
    category: "Cognitive Processes",
    icon: "cognitive",
  },
  {
    term: "Decoy Effect",
    story: "The coffee shop offered a small drink for $3 and a large for $4.50. After adding a medium for $4.25, sales of the large drink increased dramatically.",
    explanation: "The decoy effect occurs when preferences between two options change due to the addition of a third (decoy) option that is designed to make one of the original options look more attractive by comparison.",
    category: "Decision Making",
    icon: "behavioral",
  },
  {
    term: "Flow State",
    story: "While painting, Ana lost track of time completely. Hours passed without her noticing as she worked in a state of energized focus, fully immersed in the creative process.",
    explanation: "Flow is the mental state where a person is fully immersed and engaged in an activity, with energized focus and enjoyment in the process. Time seems to distort and self-consciousness disappears.",
    category: "Wellbeing",
    icon: "mindfulness",
  },
  {
    term: "Boundary Setting",
    story: "After feeling overwhelmed by constant work emails on weekends, Raj informed his colleagues he wouldn't be responding until Monday. Despite initial anxiety about setting this limit, his stress levels decreased dramatically.",
    explanation: "Boundary setting involves defining what behavior you will accept from others and what you will not. Healthy boundaries protect your wellbeing and help clarify expectations in relationships.",
    category: "Wellbeing Practices",
    icon: "mindfulness",
  },
  {
    term: "Diffusion of Responsibility",
    story: "When a man collapsed on the crowded train, everyone looked around expecting someone else to help. Only when one person took action did others join in to assist.",
    explanation: "Diffusion of responsibility occurs when individuals are less likely to take action or feel responsibility in the presence of others. The larger the group, the less personal responsibility each individual feels.",
    category: "Social Influence",
    icon: "social",
  },
  {
    term: "Priming",
    story: "Before taking an exam, Talia read inspirational quotes about intelligence and potential. She felt more confident and performed better than when she hadn't done this preparation.",
    explanation: "Priming is when exposure to one stimulus influences how we respond to a subsequent, related stimulus. These cues can be subtle yet significantly impact our thoughts and behaviors.",
    category: "Cognitive Processes",
    icon: "cognitive",
  }
];

export default function Learn() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const storyRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Combine all concepts from different files
  const allTerms = [...terms, ...moreConcepts, ...moreConcepts2, ...moreConcepts3, ...neuroscienceConcepts, ...navalConcepts];
  
  // Remove duplicate terms (based on the term name)
  const uniqueTerms = allTerms.filter((term, index, self) => 
    index === self.findIndex((t) => t.term === term.term)
  );
  
  // Get all unique categories for the filter
  const categories = Array.from(new Set(uniqueTerms.map(term => term.category)));
  
  // Filter terms based on search and category
  const filteredTerms = uniqueTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        term.explanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        term.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? term.category === activeCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  // Auto-scroll to the story when expanded
  useEffect(() => {
    if (selected !== null && storyRefs.current[selected]) {
      setTimeout(() => {
        storyRefs.current[selected]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
    }
  }, [selected]);

  // Navigate to practices page
  const goToPractices = () => {
    navigate('/practices');
  };

  return (
    <div className="py-4 sm:py-8 mx-auto px-2 sm:px-4">
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      
      <div className="mx-auto max-w-6xl">
        {/* Header with title and search */}
        <div className="mb-6 sm:mb-8 px-2 sm:px-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl text-center font-bold text-[#06C4D5] font-happy-monkey lowercase mb-2">
            psychology, neuroscience & wisdom
          </h1>
          <p className="text-black text-center font-happy-monkey lowercase mb-4 sm:mb-6 text-sm sm:text-base">
            explore key concepts to understand yourself and the world
          </p>
          
          {/* Search input - Mobile responsive */}
          <div className="flex align-center flex-col sm:flex-row justify-center items-center p-2 sm:p-[10px] gap-2 sm:gap-[10px] max-w-3xl mx-auto bg-white border border-[rgba(6,196,213,0.3)] shadow-[1px_2px_4px_rgba(6,196,213,0.5)] rounded-[10px]">
            <input
              type="text"
              className={`flex-1 bg-transparent border-none text-center text-sm sm:text-base ${searchQuery ? 'text-[#06C4D5]' : 'text-[#06C4D5]'} placeholder-[#06C4D5] font-happy-monkey lowercase focus:outline-none w-full min-h-[44px] px-2`}
              placeholder="search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex items-center justify-center p-2 sm:p-0">
              <Search className="text-[#06C4D5]" size={18} />
            </div>
          </div>
        </div>
        
        {/* Category filters - Enhanced mobile scrolling */}
        <div className="mb-4 sm:mb-6 px-1 sm:px-3">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all font-happy-monkey lowercase flex-shrink-0 ${
                activeCategory === null 
                  ? 'bg-gradient-to-r from-[#06C4D5] to-[#06C4D5] text-white shadow-sm' 
                  : 'text-[#06C4D5] border border-[rgba(6,196,213,0.3)] hover:bg-[rgba(6,196,213,0.1)]'
              }`}
              onClick={() => setActiveCategory(null)}
            >
              all categories
            </button>
          
          {/* Featured categories */}
          <button 
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all font-happy-monkey lowercase flex-shrink-0 ${
              activeCategory === 'Neuroscience' 
                ? 'bg-gradient-to-r from-[#06C4D5] to-[#06C4D5] text-white shadow-sm' 
                : 'text-[#06C4D5] border border-[rgba(6,196,213,0.3)] hover:bg-[rgba(6,196,213,0.1)]'
            }`}
            onClick={() => setActiveCategory('Neuroscience')}
          >
            <span className="flex items-center gap-1">
              <Zap size={12} className="sm:w-3.5 sm:h-3.5" />
              neuroscience
            </span>
          </button>
          
          <button 
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all font-happy-monkey lowercase flex-shrink-0 ${
              activeCategory === 'Naval Philosophy' 
                ? 'bg-gradient-to-r from-[#06C4D5] to-[#06C4D5] text-white shadow-sm' 
                : 'text-[#06C4D5] border border-[rgba(6,196,213,0.3)] hover:bg-[rgba(6,196,213,0.1)]'
            }`}
            onClick={() => setActiveCategory('Naval Philosophy')}
          >
            <span className="flex items-center gap-1">
              <Anchor size={12} className="sm:w-3.5 sm:h-3.5" />
              naval philosophy
            </span>
          </button>
          
          {/* Other categories */}
          {categories
            .filter(category => category !== 'Neuroscience' && category !== 'Naval Philosophy')
            .map((category) => (
            <button 
              key={category}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm whitespace-nowrap transition-all font-happy-monkey lowercase flex-shrink-0 ${
                activeCategory === category 
                  ? 'bg-gradient-to-r from-[#06C4D5] to-[#06C4D5] text-white shadow-sm' 
                  : 'text-[#06C4D5] border border-[rgba(6,196,213,0.3)] hover:bg-[rgba(6,196,213,0.1)]'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category.toLowerCase()}
            </button>
          ))}
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
      {/* Display count of results - changed from gray to black */}
      {filteredTerms.length > 0 && (
        <p className="text-black font-happy-monkey lowercase text-sm mb-4 px-3">
          showing {filteredTerms.length} {filteredTerms.length === 1 ? 'concept' : 'concepts'}
          {activeCategory && ` in ${activeCategory.toLowerCase()}`}
        </p>
      )}
      
      {/* List of concept items */}
      <div>
        {filteredTerms.length > 0 ? (
          filteredTerms.map((term, idx) => {
            // Determine color shadow and styling based on icon type or category
            let shadowColor, borderColor, labelColor, labelText, labelBg;
            
            // Set default values
            shadowColor = "rgba(6, 196, 213, 0.2)";  // default teal-ish
            borderColor = "rgba(6,196,213,0.1)";
            labelColor = "#06C4D5";
            labelBg = "rgba(6,196,213,0.15)";
            
            // Set icon-specific colors
            switch(term.icon) {
              case "cognitive": 
                shadowColor = "rgba(32, 142, 177, 0.2)"; // blue
                break;
              case "emotional": 
                shadowColor = "rgba(32, 142, 177, 0.2)"; // blue
                break;
              case "behavioral": 
                shadowColor = "rgba(32, 142, 177, 0.2)"; // blue
                break;
              case "social": 
                shadowColor = "rgba(32, 142, 177, 0.2)"; // blue
                break;
              case "mindfulness": 
                shadowColor = "rgba(6, 196, 213, 0.2)"; // teal
                break;
              case "neuroscience": 
                shadowColor = "rgba(32, 142, 177, 0.2)"; // blue
                borderColor = "rgba(32, 142, 177, 0.15)";
                labelColor = "#208EB1";
                labelBg = "rgba(32, 142, 177, 0.15)";
                labelText = "Neuroscience";
                break;
              case "naval": 
                shadowColor = "rgba(32, 142, 177, 0.2)"; // blue
                borderColor = "rgba(32, 142, 177, 0.15)";
                labelColor = "#208EB1";
                labelBg = "rgba(32, 142, 177, 0.15)";
                labelText = "Naval Ravikant";
                break;
            }
            
            return (
              <div 
                key={`${term.term}-${idx}`}
                className="mb-2 last:mb-0"
                style={{animation: `fadeIn 0.5s ease-out ${Math.min(idx * 0.05, 1)}s both`}}
              >
                <div className={`p-4 rounded-xl bg-white border transition-all ${
                  selected === idx ? 'shadow-lg' : 'shadow-md'
                }`} style={{
                  boxShadow: `0 4px 20px ${shadowColor}, 0 1px 3px rgba(0,0,0,0.05)`,
                  borderColor: borderColor
                }}>
                  {/* Header row with columns: Icon+Name | Tag | CTA Button */}
                  <div className="flex items-start justify-between mb-3 gap-2">
                    {/* Column 1: Icon + Concept Name */}
                    <div className="flex items-start gap-2 sm:gap-3 flex-grow min-w-0">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        <span className="flex items-center justify-center h-8 w-8 sm:h-10 sm:w-10 rounded-full shadow-sm" style={{
                          background: `linear-gradient(135deg, rgba(6, 196, 213, 0.15), ${shadowColor} 120%)`,
                          boxShadow: `0 2px 8px ${shadowColor}`
                        }}>
                          {getIconComponent(term.icon)}
                        </span>
                      </div>
                      
                      {/* Term title and description */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#06C4D5] font-happy-monkey lowercase leading-tight mb-1">
                          {term.term.toLowerCase()}
                        </h3>
                        <p className="text-xs sm:text-sm text-black font-happy-monkey leading-snug opacity-90 line-clamp-2">
                          {getSummary(term.term, term.category)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Column 2: Category Tag + CTA Button */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                      {/* Category Tag - hidden on mobile, shown on desktop */}
                      <span className="hidden sm:inline-block px-2 py-1 text-xs font-happy-monkey lowercase rounded-full bg-[rgba(6,196,213,0.1)] text-[#06C4D5] whitespace-nowrap">
                        {term.category.toLowerCase()}
                      </span>
                      
                      {/* Source label for special categories - hidden on mobile */}
                      {(term.icon === "naval" || term.icon === "neuroscience") && (
                        <span 
                          className="hidden sm:inline-block text-xs px-2 py-1 rounded-md font-happy-monkey lowercase" 
                          style={{ backgroundColor: labelBg, color: labelColor }}
                        >
                          {labelText}
                        </span>
                      )}
                      
                      {/* CTA Button - mobile responsive */}
                      <button
                        onClick={() => setSelected(selected === idx ? null : idx)}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-happy-monkey lowercase font-medium bg-gradient-to-r from-[#06C4D5] to-[#06C4D5] text-white shadow-sm hover:shadow-md transition-all hover:scale-105 whitespace-nowrap min-h-[44px] sm:min-h-[36px]"
                        style={{
                          background: selected === idx 
                            ? 'linear-gradient(135deg, #06C4D5, #06C4D5)' 
                            : 'linear-gradient(135deg, #06C4D5, #06C4D5)'
                        }}
                      >
                        {selected === idx ? 'hide example' : 'see example'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Mobile category tag - shown below title on mobile */}
                  <div className="sm:hidden mb-2">
                    <span className="inline-block px-2 py-0.5 text-xs font-happy-monkey lowercase rounded-full bg-[rgba(6,196,213,0.1)] text-[#06C4D5]">
                      {term.category.toLowerCase()}
                    </span>
                    {/* Source label for special categories on mobile */}
                    {(term.icon === "naval" || term.icon === "neuroscience") && (
                      <span 
                        className="inline-block text-xs px-2 py-0.5 rounded-md font-happy-monkey lowercase ml-2" 
                        style={{ backgroundColor: labelBg, color: labelColor }}
                      >
                        {labelText}
                      </span>
                    )}
                  </div>
                  
                  {/* Content section */}
                  <div className="ml-0 sm:ml-[50px]"> {/* Remove left margin on mobile */}
                    {/* Full description - only shown when expanded */}
                    {selected === idx && (
                      <p className="text-black text-sm font-happy-monkey">
                        {term.explanation}
                      </p>
                    )}
                  </div>
                  
                  {/* Expanded content */}
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      selected === idx ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div 
                      ref={el => storyRefs.current[idx] = el}
                      className={`ml-0 sm:ml-[50px] ${selected === idx ? 'animate-slide-down' : ''}`}
                    >
                      <div className="rounded-lg p-3 text-sm text-black leading-relaxed border transition-all" 
                           style={{ 
                             boxShadow: `inset 0 1px 5px ${shadowColor}`,
                             backgroundColor: `${labelBg || 'rgba(6,196,213,0.05)'}`,
                             borderColor: `${borderColor || 'rgba(6,196,213,0.15)'}`,
                             opacity: 0.9
                           }}>
                        <p className="mb-2 font-medium text-[#06C4D5] font-happy-monkey lowercase">example:</p>
                        <p className="font-happy-monkey leading-tight text-xs sm:text-sm">{term.story}</p>
                      </div>
                      
                      <div className="mt-3 flex justify-center sm:justify-end">
                        <button 
                          onClick={goToPractices}
                          className="text-white text-xs font-happy-monkey lowercase font-medium flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#06C4D5] to-[#06C4D5] rounded-full hover:shadow-md transition-all hover:translate-y-[-2px]"
                        >
                          find related practices
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-10 bg-white rounded-xl border border-[rgba(6,196,213,0.2)] shadow-md mx-3">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full flex items-center justify-center bg-[rgba(6,196,213,0.1)]">
              <Search className="text-[#06C4D5]" size={24} />
            </div>
            <p className="text-[#06C4D5] text-lg font-happy-monkey lowercase">no matching concepts found</p>
            <p className="text-black text-sm mt-2 font-happy-monkey lowercase">try a different search term or category</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
