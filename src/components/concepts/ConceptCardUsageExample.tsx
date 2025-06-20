import React from "react";
import ConceptCardExample from "./ConceptCardExample";

const ConceptCardUsageExample: React.FC = () => {
  const sampleConcepts = [
    {
      title: "Generalised anxiety disorder",
      category: "neuroscience of anxiety",
      description: "Description about the concepts and this could be anything in 2 lines max word length fwelkfmwke"
    },
    {
      title: "Cognitive Behavioral Therapy",
      category: "therapy",
      description: "A type of psychotherapy that helps people identify and change disturbing thought patterns."
    },
    {
      title: "Mindfulness Meditation",
      category: "practice",
      description: "A mental training practice that teaches you to slow down racing thoughts and let go of negativity."
    }
  ];

  const handleMoreClick = (title: string) => {
    console.log(`More clicked for: ${title}`);
    // Add your logic here, like opening a modal or navigating to details page
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="font-righteous text-[#148BAF] text-2xl uppercase mb-4">Concept Card Examples</h2>
      
      {sampleConcepts.map((concept, index) => (
        <ConceptCardExample 
          key={index}
          title={concept.title}
          category={concept.category}
          description={concept.description}
          onMoreClick={() => handleMoreClick(concept.title)}
        />
      ))}
    </div>
  );
};

export default ConceptCardUsageExample;
