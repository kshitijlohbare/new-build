import { Badge } from "@/components/ui/badge";

interface TagListProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  className?: string;
}

export const TagList = ({ tags, selectedTags, onTagToggle, className = "" }: TagListProps) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant={selectedTags.includes(tag) ? "secondary" : "outline"}
          className="cursor-pointer font-happy-monkey lowercase hover:bg-moody-light"
          onClick={() => onTagToggle(tag)}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
};