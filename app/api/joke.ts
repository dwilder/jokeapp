import APP_CONFIG from '@/app.config';
import { Language } from '@/app/types/languages';
import { JokeData } from '@/app/types/joke';

interface JokeResponse {
  error: boolean;
  category: string;
  type: string;
  joke?: string;
  setup?: string;
  delivery?: string;
  flags: {
    nsfw: boolean;
    religious: boolean;
    political: boolean;
    racist: boolean;
    sexist: boolean;
    explicit: boolean
  },
  id: number;
  safe: boolean;
  lang: string;
}

const mapJoke = (jokeResponse: JokeResponse): JokeData | null => {
  if (jokeResponse.type === 'single') {
    return {
      type: 'single',
      joke: jokeResponse.joke!
    };
  }
  if (jokeResponse.type === 'twopart') {
    return {
      type: 'twopart',
      delivery: jokeResponse.delivery!,
      setup: jokeResponse.setup!,
    };
  }
  return null;
};

const loadJoke = async (language?: Language): Promise<JokeData | null> => {
  let query = '';
  if ((!APP_CONFIG.GCP_API_KEY || APP_CONFIG.USE_SUPPORTED_LANGUAGES) && language?.language) {
    console.log('GCP_API_KEY', APP_CONFIG.GCP_API_KEY);
    console.log('USE_SUPPORTED_LANGUAGES', APP_CONFIG.USE_SUPPORTED_LANGUAGES);
    console.log('language', language);
    query += `?lang=${language.language}`;
  }
  try {
    const result = await fetch(`https://v2.jokeapi.dev/joke/Any${query}`);
    const json = await result.json();
    return mapJoke(json);
  } catch(err) {
    // handle error
    return null;
  }
};

export {
  loadJoke
};