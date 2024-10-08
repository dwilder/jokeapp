import { Language, Translations } from "@/app/types/languages";
import APP_CONFIG from '@/app.config';

interface GCPError {
  error: {
    code: number;
    message: string;
    status: string;
    errors: {
      domain: string;
      message: string;
      reason: string;
    }[];
  }
}

type GetSupportedLanguagesResponseLanguage = Language;

interface GetSupportedLanguagesResponseList {
  languages: GetSupportedLanguagesResponseLanguage[];
}

interface LanguagesResponse {
  data: GetSupportedLanguagesResponseList;
}

const mapLanguages = (languageLists: GetSupportedLanguagesResponseLanguage[]): Language[] => {
  return languageLists.reduce((acc, language) => acc.concat(language), [] as Language[]);
};

const loadLanguages = async (): Promise<Language[] | string> => {
  if (!APP_CONFIG.GCP_API_KEY || APP_CONFIG.USE_SUPPORTED_LANGUAGES) {
    return APP_CONFIG.SUPPORTED_LANGUAGES;
  }
  try {
    const result = await fetch(
      `https://translation.googleapis.com/language/translate/v2/languages?model=nmt&target=en&key=${APP_CONFIG.GCP_API_KEY}`
    );
    const json = await result.json() as LanguagesResponse;
    return mapLanguages(json.data.languages);
  } catch(err) {
    return 'error';
  }
};

type LoadTranslations = {
  originalText: {
    [key: string]: string;
  },
  language: Language
};

interface TranslateTextResponseTranslation {
  detectedSourceLanguage: string;
  model: string;
  translatedText: string;
}

interface TranslateTextReponseList {
  translations: TranslateTextResponseTranslation[];
}

interface TranslateTextResponse {
  data: TranslateTextReponseList;
}

interface MapResponseToKeysRet {
  [key: string]: string;
}

const mapResponseToKeys = (map: [string, string][], translations: TranslateTextResponseTranslation[]): MapResponseToKeysRet => {
  const remapped = {} as MapResponseToKeysRet;
  for (let i = 0; i < map.length; i++) {
    const key = map[i][0];
    const val = translations[i].translatedText || map[i][1];
    remapped[key] = val;
  }
  return remapped;
};


const loadTranslations = async ({ originalText, language }: LoadTranslations): Promise<{ [key: string]: string } | string> => {
  if (!APP_CONFIG.GCP_API_KEY || APP_CONFIG.USE_SUPPORTED_LANGUAGES) {
    return originalText;
  }
  if (!language.language || language.language == 'en') {
    return originalText;
  }
  const map = Object.entries(originalText);
  const q = map.map(([_, value]: [string, string]) => value);
  try {
    const result = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${APP_CONFIG.GCP_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q,
          source: 'en',
          target: language.language,
          format: 'text',
          model: 'nmt',
          key: APP_CONFIG.GCP_API_KEY
        })
      }
    );
    const json = await result.json() as TranslateTextResponse & GCPError;
    if (json.error) {
      throw new Error(json.error.message)
    }
    return mapResponseToKeys(map, json.data.translations);
  } catch(err) {
    return 'error';
  }
}

const loadAppTranslations = async ({ originalText, language }: LoadTranslations): Promise<Translations> => {
  return await loadTranslations({ originalText, language }) as Translations;
} 

export {
  loadLanguages,
  loadTranslations,
  loadAppTranslations
};