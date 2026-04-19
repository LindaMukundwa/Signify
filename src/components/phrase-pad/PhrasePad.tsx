import React, { useState, useCallback } from "react";
import type { PhraseCategory } from "../../types/phrase";
import { usePhraseStore } from "../../store/phraseStore";
import { PhraseCard } from "./PhraseCard";
import { AddPhraseModal } from "./AddPhraseModal";
import { Button } from "../shared/Button";
import { Card } from "../shared/Card";
import { Plus, Mic, MicOff, Trash2 } from "lucide-react";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";

export const PhrasePad: React.FC = () => {
  const phrases = usePhraseStore((state) => state.phrases);
  const addPhrase = usePhraseStore((state) => state.addPhrase);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { isListening, transcript, interimTranscript, startListening, stopListening, clearTranscript, isSupported } = useSpeechRecognition();

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
            <div id="phraseCard" className="grid grid-cols-2 md:grid-cols-3 gap-3">
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

      {/* Voice-to-Text Input */}
      {isSupported && (
        <Card className="mt-8 space-y-4">
          <h2 className="text-lg font-semibold">Voice-to-Text</h2>
          <p className="text-sm text-text-secondary">
            Tap the microphone button to speak, and your words will be transcribed below.
          </p>

          {/* Microphone Button */}
          <div className="flex gap-3">
            <Button
              variant={isListening ? "danger" : "primary"}
              onClick={isListening ? stopListening : startListening}
              className="gap-2 flex-1"
            >
              {isListening ? (
                <>
                  <MicOff size={20} />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic size={20} />
                  Start Recording
                </>
              )}
            </Button>
          </div>

          {/* Transcript Display */}
          {(transcript || interimTranscript || isListening) && (
            <div className="space-y-3">
              <div className="p-4 bg-primary-light rounded-lg border border-primary min-h-[56px]">
                <p className="text-text-primary">
                  {transcript}
                  {interimTranscript && (
                    <span className="text-text-muted italic">{interimTranscript}</span>
                  )}
                  {!transcript && !interimTranscript && isListening && (
                    <span className="text-text-muted italic">Listening…</span>
                  )}
                </p>
              </div>

              {transcript && (
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      if ("speechSynthesis" in window) {
                        window.speechSynthesis.cancel();
                        const utterance = new SpeechSynthesisUtterance(transcript);
                        window.speechSynthesis.speak(utterance);
                      }
                    }}
                  >
                    Speak It
                  </Button>
                  <Button variant="secondary" onClick={clearTranscript} className="gap-1">
                    <Trash2 size={16} />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {/* {error && (
            <div className="p-3 bg-danger/10 border border-danger rounded text-sm text-danger">
              {error}
            </div>
          )} */}
        </Card>
      )}

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