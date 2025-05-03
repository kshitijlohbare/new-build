import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Quote {
  id: number;
  text: string;
  author: string;
}

interface QuoteCardProps {
  quote: string;
  author: 'huberman' | 'naval';
  type?: 'tip' | 'quote';
  className?: string;
}

export const QuoteCard = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRandomQuote = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get the count of quotes to generate a random index
        const { count, error: countError } = await supabase
          .from('quotes')
          .select('*', { count: 'exact', head: true });
        
        if (countError) {
          throw countError;
        }
        
        if (!count) {
          setError("No quotes found");
          setLoading(false);
          return;
        }
        
        // Get a random quote using the count
        const randomIndex = Math.floor(Math.random() * count);
        
        const { data, error: fetchError } = await supabase
          .from('quotes')
          .select('*')
          .range(randomIndex, randomIndex)
          .single();
        
        if (fetchError) {
          throw fetchError;
        }
        
        setQuote(data);
      } catch (err) {
        console.error("Error fetching quote:", err);
        setError("Failed to fetch quote");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRandomQuote();
  }, []);

  return (
    <div className="p-3 sm:p-4 md:p-6 w-full flex flex-col items-center">
      <div className="w-full bg-white border border-[#148BAF] shadow-[1px_2px_4px_rgba(73,218,234,0.5)] rounded-[20px] p-3 sm:p-4 md:p-6 flex flex-col items-center justify-center min-h-[150px]">
        {loading ? (
          <p className="text-center text-gray-500 font-happy-monkey text-sm sm:text-base md:text-lg lowercase">loading today's quote...</p>
        ) : error ? (
          <p className="text-center text-red-500 font-happy-monkey text-sm sm:text-base md:text-lg lowercase">{error}</p>
        ) : quote ? (
          <>
            <p className="text-[#148BAF] font-happy-monkey text-sm sm:text-base md:text-lg text-center mb-2 sm:mb-3 md:mb-4 lowercase">"{quote.text}"</p>
            <p className="text-[#148BAF] font-happy-monkey text-xs sm:text-sm text-center lowercase">- {quote.author}</p>
          </>
        ) : (
          <p className="text-center text-gray-500 font-happy-monkey text-sm sm:text-base md:text-lg lowercase">no quote available</p>
        )}
      </div>
    </div>
  );
};

export default QuoteCard;