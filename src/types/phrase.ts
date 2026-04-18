export type PhraseCategory = 'medical' | 'emergency' | 'daily' | 'custom';

export interface Phrase {
  id: string;
  text: string;
  category: PhraseCategory;
  isDefault: boolean;
}