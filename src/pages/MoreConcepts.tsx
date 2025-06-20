import { PsychTerm } from './Learn';

// These are additional concepts to be added to the Learn page
export const moreConcepts: PsychTerm[] = [
  {
    term: "Halo Effect",
    story: "After seeing a charismatic presenter give an excellent talk, Kim immediately assumed he must be intelligent, honest, and kind—without any evidence of these other traits.",
    explanation: "The halo effect is the tendency for positive impressions of a person in one area to positively influence our opinion of them in other areas.",
    category: "Social Perception",
    icon: "social",
    keywords: ["first impression", "judgment", "stereotype", "positive bias", "perception", "image", "charisma", "attractiveness", "bias", "favoritism"],
  },
  {
    term: "Framing Effect",
    story: "The doctor told Lin she had a 90% survival rate with the treatment. When she got a second opinion, another doctor said there was a 10% mortality rate. Though the statistics were identical, Lin felt much more optimistic after the first consultation.",
    explanation: "The framing effect is our tendency to react differently to information depending on whether it's presented as a gain or a loss, even when the underlying facts are the same.",
    category: "Decision Making",
    icon: "cognitive",
    keywords: ["perspective", "wording", "language", "presentation", "context", "positive vs negative", "glass half full", "glass half empty", "communication", "marketing", "persuasion", "manipulation"],
  },
  {
    term: "Availability Bias",
    story: "After watching news coverage of a plane crash, Jordan became afraid of flying, even though statistics show it's far safer than driving, which he does daily without worry.",
    explanation: "Availability bias leads us to overestimate the likelihood of events that come readily to mind, like those that are recent, unusual, or emotionally charged.",
    category: "Cognitive Biases",
    icon: "cognitive",
    keywords: ["recency bias", "media influence", "fear", "anxiety", "risk assessment", "probability", "news bias", "vividness", "memorable events", "danger perception", "worry", "overthinking"],
  },
  {
    term: "Zeigarnik Effect",
    story: "Even though it was 11 PM, Carlos couldn't stop thinking about the unfinished project on his desk. Only after making a detailed plan to complete it tomorrow did his mind finally relax.",
    explanation: "The Zeigarnik Effect is our tendency to remember interrupted or incomplete tasks better than completed ones. Our brains tend to focus on unfinished business until it's resolved.",
    category: "Memory",
    keywords: ["unfinished business", "incomplete tasks", "open loops", "rumination", "overthinking", "anxiety", "procrastination", "distraction", "focus", "productivity", "to-do list", "mental load"],
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
  },
  {
    term: "Placebo Effect",
    story: "After taking what she thought was a powerful pain reliever (actually just a sugar pill), Elena's headache started to fade within minutes.",
    explanation: "The placebo effect occurs when a person experiences a real improvement in symptoms after receiving a treatment with no therapeutic value, simply because they believe it will help.",
    category: "Mind-Body Connection",
    icon: "mindfulness",
  },
  {
    term: "Reactance",
    story: "When the museum put up a sign saying 'Please don't touch the sculptures,' visitors felt a sudden urge to do just that, even though they had no interest in touching them before.",
    explanation: "Reactance is the psychological resistance we experience when we feel our freedom is being restricted. We often desire to do the forbidden thing more intensely to reassert our autonomy.",
    category: "Behavioral Patterns",
    icon: "behavioral",
  }
];
