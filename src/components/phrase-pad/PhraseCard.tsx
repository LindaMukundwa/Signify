import React, { useState } from "react";
import type { Phrase } from "../../types/phrase";
import { Card } from "../shared/Card";

interface PhraseCardProps {
  phrase: Phrase;
  onSpeak: (text: string) => void;
}

export const PhraseCard: React.FC<PhraseCardProps> = ({ phrase, onSpeak }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(true);
    onSpeak(phrase.text);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    setTimeout(() => {
      setIsActive(false);
    }, 200);
  };

  return (
    <Card
      onClick={handleClick}
      className={`cursor-pointer h-20 flex items-center justify-center text-center p-3 transition-all ${
        isActive ? "scale-95 bg-primary-light" : "hover:bg-surface-secondary"
      }`}
    >
      <p className="text-lg font-medium leading-tight text-text-primary">
        {phrase.text}
      </p>
    </Card>
  );
};
