import { en } from './en';
import { es } from './es';

export type TranslationKeys = typeof en;

const translations = {
  en,
  es,
} as const;

export default translations;
