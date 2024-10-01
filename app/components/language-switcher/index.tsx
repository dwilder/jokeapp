import { useLanguageContext } from "@/app/context/language-context"
import { ChangeEvent, useEffect, useState } from "react";
import { Language } from "@/app/types/languages";
import debounce from "debounce";
import Container from "@/app/components/container";

const LanguageOption = ({ language }: { language: Language }) => {
  return (
    <option value={language.language}>{language.name}</option>
  );
};

export default function LanguageSwitcher(): React.JSX.Element {
  const { translations, languages, language, setLanguage, setLanguages } = useLanguageContext();

  const [localLang, setLocalLang] = useState<string>(language.language);

  const debounceSetLanguage = debounce(setLanguage, 400);

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
  );
}