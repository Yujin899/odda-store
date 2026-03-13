import en from './en.json';
import ar from './ar.json';

const dictionaries = {
  en,
  ar,
};

export type Language = keyof typeof dictionaries;

export const getDictionary = (lang: Language) => dictionaries[lang] || dictionaries.en;
