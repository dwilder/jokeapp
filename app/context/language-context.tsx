import { createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import text from "../text/text";
import { Language, Translations } from "../types/languages";
import { loadTranslations } from "@/app/api/translation";

interface LanguageProviderValue {
  language: Language;
  languages: Language[];
  translations: Translations;
  setLanguage: (language: Language) => void;
  setLanguages: Dispatch<SetStateAction<Language[]>>;
}

const initialValues = {
  language: { language: 'en', name: 'English' },
  languages: [],
  translations: text,
  setLanguage: () => {},
  setLanguages: () => {},
}

const LanguageContext = createContext<LanguageProviderValue>(initialValues);

export const LanguageProvider = ({ children }: { children: React.JSX.Element }): React.JSX.Element => {
  const [languages, setLanguages] = useState<Language[]>(initialValues.languages);
  const [language, setLanguage] = useState<Language>(initialValues.language);
  const [translations, setTranslations] = useState<Translations>(initialValues.translations);

  useEffect(() => {
    (async () => {
      const translated = await loadTranslations({originalText: text, language});
      if (typeof translated !== 'string') {
        setTranslations(translated as Translations);
      } else {
        // handle error
      }
    })();
  }, [language]);

  const value = useMemo(() => {
    return {
      language,
      languages,
      translations,
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

