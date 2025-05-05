
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface KeywordsInputProps {
  keywords: string[];
  currentKeyword: string;
  setKeywords: (keywords: string[]) => void;
  setCurrentKeyword: (keyword: string) => void;
}

export function KeywordsInput({ 
  keywords, 
  currentKeyword, 
  setKeywords, 
  setCurrentKeyword 
}: KeywordsInputProps) {
  const addKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords([...keywords, currentKeyword.trim()]);
      setCurrentKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentKeyword.trim()) {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={currentKeyword}
          onChange={(e) => setCurrentKeyword(e.target.value)}
          placeholder="Enter keywords for search"
          onKeyPress={handleKeywordKeyPress}
        />
        <Button 
          type="button" 
          onClick={addKeyword}
          disabled={!currentKeyword.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {keywords.map((keyword, index) => (
            <Badge key={index} variant="secondary">
              {keyword}
              <button
                type="button"
                className="ml-1"
                onClick={() => removeKeyword(keyword)}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
