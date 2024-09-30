import { useLanguageContext } from "@/app/context/language-context"
import { ChangeEvent, useEffect, useState } from "react";
import { Language } from "@/app/types/languages";
import { loadLanguages } from "@/app/api/translation";
import debounce from "debounce";
import Container from "@/app/components/container";
import APP_CONFIG from "@/app.config";

const LanguageOption = ({ language }: { language: Language }) => {
  return (
    <option value={language.language}>{language.name}</option>
  );
};

export default function LanguageSwitcher(): React.JSX.Element {
  const { translations, languages, language, setLanguage, setLanguages } = useLanguageContext();

  const [localLang, setLocalLang] = useState<string>(language.language);

  const debounceSetLanguage = debounce(setLanguage, 400);

  const _loadLanguages = async () => {
    const languages = await loadLanguages();
    if (typeof languages !== 'string') {
      setLanguages(languages);
    } else {
      // fallback to JokeAPI supported languages
      setLanguages(APP_CONFIG.SUPPORTED_LANGUAGES);
    }
    setLanguage({ language: 'en', name: 'English' })
  };

  useEffect(() => {
    _loadLanguages();
  }, []);

  useEffect(() => {
    setLocalLang(language.language);
  }, [language]);

  const updateLanguage = (e: ChangeEvent<HTMLSelectElement>) => {
    setLocalLang(e.target.value);
    const newLang = languages.find(
      (l) => l.language == e.target.value
    );
    if (newLang) {
      debounceSetLanguage(newLang);
    }
  }

  return (
    <div className="bg-gray-800">
      <Container>
        <form className="py-4 flex flex-row items-center justify-center sm:justify-end">
          <label htmlFor="languageSwitcher" className="pr-4 flex">{translations.LANGUAGE_SWITCHER_LABEL}</label>
          <select
            className="flex p-2 text-gray-800 rounded"
            id="languageSwitcher"
            name="languageSwitcher"
            value={localLang}
            onChange={updateLanguage}
          >
            {languages.map((language) => <LanguageOption language={language} key={language.language} />)}
          </select>
        </form>
      </Container>
    </div>
  );
}