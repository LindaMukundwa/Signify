import React, { useState, useCallback } from "react";
import type { Phrase, PhraseCategory } from "../../types/phrase";
import { usePhraseStore } from "../../store/phraseStore";
import { PhraseCard } from "./PhraseCard";
import { AddPhraseModal } from "./AddPhraseModal";
import { Button } from "../shared/Button";
import { Plus } from "lucide-react";

export const PhrasePad: React.FC = () => {
  const phrases = usePhraseStore((state) => state.phrases);
  const addPhrase = usePhraseStore((state) => state.addPhrase);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const categories: PhraseCategory[] = ["medical", "emergency", "daily", "custom"];

  const getPhrasesByCategory = useCallback(
    (category: PhraseCategory) => {
      return phrases.filter((p) => p.category === category);
    },
    [phrases]
  );

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const categoryLabels: Record<PhraseCategory, string> = {
    medical: "Medical",
    emergency: "Emergency",
    daily: "Daily",
    custom: "Custom",
  };

  return (
    <div className="space-y-8">
      {categories.map((category) => {
        const categoryPhrases = getPhrasesByCategory(category);
        if (categoryPhrases.length === 0) return null;

        return (
          <div key={category}>
            <h2 className="text-lg font-semibold mb-4">
              {categoryLabels[category]}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categoryPhrases.map((phrase) => (
                <PhraseCard
                  key={phrase.id}
                  phrase={phrase}
                  onSpeak={handleSpeak}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Add Phrase Button */}
      <div className="flex justify-center pt-4">
        <Button
          variant="secondary"
          onClick={() => setIsModalOpen(true)}
          className="gap-2"
        >
          <Plus size={20} />
          Add Custom Phrase
        </Button>
      </div>

      <AddPhraseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addPhrase}
      />

      {/* Speaking Indicator */}
      {isSpeaking && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium">
          Speaking...
        </div>
      )}
    </div>
  );
};
