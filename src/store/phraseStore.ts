/**
 * Local Storage for Phrases
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Phrase } from "../types/phrase";
import { DEFAULT_PHRASES } from "../lib/defaultPhrases";

interface PhraseStore {
  phrases: Phrase[];
  addPhrase: (phrase: Phrase) => void;
  removePhrase: (id: string) => void;
  getPhrasesByCategory: (category: string) => Phrase[];
  initializeDefaultPhrases: () => void;
}

export const usePhraseStore = create<PhraseStore>()(
  persist(
    (set, get) => ({
      phrases: DEFAULT_PHRASES,
      addPhrase: (phrase: Phrase) =>
        set((state) => ({
          phrases: [...state.phrases, phrase],
        })),
      removePhrase: (id: string) =>
        set((state) => ({
          phrases: state.phrases.filter((p) => p.id !== id),
        })),
      getPhrasesByCategory: (category: string) => {
        return get().phrases.filter((p) => p.category === category);
      },
      initializeDefaultPhrases: () => {
        set({ phrases: DEFAULT_PHRASES });
      },
    }),
    {
      name: "signify-phrases",
      version: 1,
    }
  )
);
