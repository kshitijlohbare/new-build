import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TagList } from "./TagList";
import { useToast } from "@/hooks/useToast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const ShareDelights = () => {
  const [text, setText] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const tags = ["gratitude", "achievement", "connection", "nature", "learning"];

  const handleShare = async () => {
    if (text.trim()) {
      setIsSharing(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({
          title: "Shared successfully!",
          description: "Your delight has been shared with the community.",
          className: "bg-moody-light dark:bg-gray-900 text-moody-primary dark:text-moody-secondary font-happy-monkey"
        });
        setText("");
        setSelectedTags([]);
      } catch (error) {
        toast({
          title: "Error sharing delight",
          description: "Please try again later.",
          className: "bg-destructive/10 text-destructive font-happy-monkey"
        });
      } finally {
        setIsSharing(false);
      }
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 rounded-md border border-moody-primary/20 bg-transparent text-moody-primary dark:text-moody-secondary resize-none focus:outline-none focus:ring-2 focus:ring-moody-primary/30 font-happy-monkey"
          placeholder="What brought you joy today?"
          rows={3}
          disabled={isSharing}
        />
        <TagList
          tags={tags}
          selectedTags={selectedTags}
          onTagToggle={handleTagToggle}
        />
        <div className="flex justify-end">
          <Button
            onClick={handleShare}
            disabled={!text.trim() || isSharing}
            className="bg-moody-primary text-white hover:bg-moody-primary/90 font-happy-monkey lowercase"
          >
            {isSharing ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : null}
            {isSharing ? "Sharing..." : "Share"}
          </Button>
        </div>
      </div>
    </Card>
  );
};