import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface QuoteCardProps {
  quote: string;
  author: 'huberman' | 'naval';
  type?: 'tip' | 'quote';
  className?: string;
}

const QuoteCard = ({ quote, author, type = 'quote', className = '' }: QuoteCardProps) => {
  return (
    <Card className={`relative border-moody-primary dark:border-moody-secondary p-6 animate-fade-in ${className}`}>
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <Badge variant="outline" className="bg-background text-moody-primary dark:text-moody-secondary font-happy-monkey text-base lowercase">
          {type === 'tip' ? `daily tip by ${author}` : `today's quote by ${author}`}
        </Badge>
      </div>
      <p className="text-center text-moody-primary dark:text-moody-secondary font-happy-monkey lowercase">
        {quote}
      </p>
    </Card>
  );
};

export default QuoteCard;