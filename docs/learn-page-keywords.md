# Learn Page Search Enhancement with Keywords

This document explains how the search functionality in the Learn page has been enhanced to improve concept discoverability based on user issues and search terms.

## What Was Implemented

The Learn page concepts have been enhanced with relevant keywords to help users discover psychological concepts when searching for specific issues or problems they're experiencing. These keywords connect common language and everyday problems to their corresponding psychological concepts.

## Implementation Details

1. **Keyword Addition**: Added extensive, relevant keywords to key concepts in the Learn page, focusing on:
   - Common issues users might search for (e.g., "overthinking", "anxiety", "social pressure")
   - Everyday language related to psychological concepts
   - Symptoms or manifestations of psychological phenomena
   - Related concepts that might lead users to the right information

2. **Search Functionality**:
   - The existing search function already supported searching through keywords using the `getAllKeywords` function
   - For concepts without explicit keywords, the system will generate fallback keywords using the `generateFallbackKeywords` function

3. **Concepts Enhanced With Keywords**:
   - Cognitive Dissonance: Added keywords for inner conflict, guilt, rationalization
   - Halo Effect: Added keywords for first impressions, bias, attractiveness
   - Imposter Syndrome: Added keywords for feeling like a fraud, inadequacy, not belonging
   - Resilience: Added keywords for bouncing back, overcoming challenges, adaptability
   - Mindfulness: Added keywords for meditation, present moment, mental clarity
   - Confirmation Bias: Added keywords for negative thinking, overthinking, biased thinking
   - Emotional Intelligence: Added keywords for empathy, relationship problems, communication
   - Anchoring Bias: Added keywords for negotiation, pricing, financial bias
   - Paradox of Choice: Added keywords for decision paralysis, overwhelm, too many options
   - Loss Aversion: Added keywords for fear of change, attachment, letting go
   - Social Proof: Added keywords for peer pressure, following the crowd, social media influence
   - Dunning-Kruger Effect: Added keywords for overconfidence, blind spots, false confidence
   - Reciprocity: Added keywords for obligation, social pressure, guilt
   - Scarcity Principle: Added keywords for FOMO, urgency, limited time offers
   - Habit Loop: Added keywords for addiction, procrastination, behavior change
   - Fundamental Attribution Error: Added keywords for blame, double standards, relationship problems
   - Hedonic Adaptation: Added keywords for happiness treadmill, materialism, never satisfied
   - Spotlight Effect: Added keywords for social anxiety, embarrassment, fear of judgment
   - Hindsight Bias: Added keywords for "I knew it all along", missed opportunities, regret
   - Zeigarnik Effect: Added keywords for unfinished business, rumination, intrusive thoughts
   - Pygmalion Effect: Added keywords for self-fulfilling prophecy, expectations, encouragement

## Benefits

1. **Improved Discoverability**: Users can now find relevant psychological concepts by searching for the issues they're experiencing rather than needing to know the formal term

2. **Natural Language Searching**: Supports how users actually search, using everyday language and problem descriptions

3. **Concept Connections**: Helps users discover related concepts through overlapping keywords

## Example Searches

With these enhancements, users can now find relevant concepts by searching for terms like:
- "overthinking" → Links to Confirmation Bias, Spotlight Effect, Rumination
- "peer pressure" → Links to Social Proof, Conformity
- "decision making" → Links to Paradox of Choice, Framing Effect, Loss Aversion
- "social anxiety" → Links to Spotlight Effect, Fear of Judgment

## Future Enhancements

1. Consider adding keywords to additional concepts in imported files (MoreConcepts.tsx, etc.)
2. Implement a "related concepts" feature that uses keyword overlaps to suggest connections
3. Add weights to keywords to prioritize more relevant matches
4. Collect user search data to identify common search terms and continue expanding keywords

## Technical Implementation

The keywords are implemented as an optional string array property on the `PsychTerm` interface:

```typescript
export interface PsychTerm {
  term: string;
  story: string;
  explanation: string;
  category: string;
  icon: "mindfulness" | "cognitive" | "emotional" | "behavioral" | "social" | "neuroscience" | "naval";
  keywords?: string[]; // Optional array of related search keywords
}
```

For concepts without explicit keywords, the system generates fallback keywords using text analysis of the term, explanation, and category.
