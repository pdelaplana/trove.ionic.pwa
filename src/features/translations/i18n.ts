import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translations from './translations';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true, // Enable debug
    resources: {
      en: {
        translation: translations.en, // Map translations directly
      },
      es: { translation: translations.es },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
