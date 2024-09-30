import { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import text from "../text/text";
import { Language, Translations } from "../types/languages";
import { loadLanguages, loadTranslations } from "@/app/api/translation";
import APP_CONFIG from "@/app.config";
import { Status } from "../types/status";

interface LanguageProviderValue {
  language: Language;
  languages: Language[];
  languagesStatus: Status;
  translations: Translations;
  translationsStatus: Status;
  setLanguage: (language: Language) => void;
  setLanguages: Dispatch<SetStateAction<Language[]>>;
}

const initialValues = {
  language: { language: 'en', name: 'English' },
  languages: [],
  languagesStatus: 'idle' as Status,
  translations: text,
  translationsStatus: 'idle' as Status,
  setLanguage: () => {},
  setLanguages: () => {},
}

const LanguageContext = createContext<LanguageProviderValue>(initialValues);

export const LanguageProvider = ({ children }: { children: React.JSX.Element }): React.JSX.Element => {
  const [languages, setLanguages] = useState<Language[]>(initialValues.languages);
  const [language, setLanguage] = useState<Language>(initialValues.language);
  const [translations, setTranslations] = useState<Translations>(initialValues.translations);
  const [languagesStatus, setLanguagesStatus] = useState<Status>('idle');
  const [translationsStatus, setTranslationsStatus] = useState<Status>('idle');

  const _loadLanguages = async () => {
    const languages = await loadLanguages();
    if (typeof languages !== 'string') {
      setLanguages(languages);
    } else {
      // fallback to JokeAPI supported languages
      setLanguages(APP_CONFIG.SUPPORTED_LANGUAGES);
    }
    setLanguage({ language: 'en', name: 'English' });
    setLanguagesStatus('success');
  };

  useEffect(() => {
    setLanguagesStatus('pending');
    _loadLanguages();
  }, []);

  useEffect(() => {
    (async () => {
      setTranslationsStatus('pending');
      const translated = await loadTranslations<Translations>({originalText: text, language});
      if (typeof translated !== 'string') {
        setTranslations(translated);
        setTranslationsStatus('success');
      } else {
        // handle error
        setTranslationsStatus('error');
      }
    })();
  }, [language]);

  const value = useMemo(() => {
    return {
      language,
      languages,
      languagesStatus,
      translations,
      translationsStatus,
      setLanguages,
      setLanguage
    };
  }, [language, languages, translations]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => useContext(LanguageContext);

