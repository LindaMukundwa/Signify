/**
 * Hard-coded phrases but user can add custom ones as well
 */
import type { Phrase } from "../types/phrase";

export const DEFAULT_PHRASES: Phrase[] = [
  // Medical
  { id: "med-1", text: "I am Deaf. I use ASL.", category: "medical", isDefault: true },
  { id: "med-2", text: "Please write things down.", category: "medical", isDefault: true },
  { id: "med-3", text: "I have a nut allergy.", category: "medical", isDefault: true },
  { id: "med-4", text: "I need my medication.", category: "medical", isDefault: true },

  // Emergency
  { id: "em-1", text: "Call 911.", category: "emergency", isDefault: true },
  { id: "em-2", text: "I am having chest pain.", category: "emergency", isDefault: true },
  { id: "em-3", text: "Check my Medical ID.", category: "emergency", isDefault: true },

  // Daily
  { id: "dy-1", text: "Can you type your response?", category: "daily", isDefault: true },
  { id: "dy-2", text: "Please speak slowly.", category: "daily", isDefault: true },
  { id: "dy-3", text: "Yes.", category: "daily", isDefault: true },
  { id: "dy-4", text: "No.", category: "daily", isDefault: true },
  { id: "dy-5", text: "Thank you.", category: "daily", isDefault: true },
];
