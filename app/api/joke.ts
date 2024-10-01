import APP_CONFIG from '@/app.config';
import { Language } from '@/app/types/languages';
import { JokeData } from '@/app/types/joke';
import { BlacklistFlags } from '../types/blacklist-flags';

interface JokeError {
  error: true;
  internalError: boolean;
  code: number;
  message: string;
  causedBy: string[];
  additionalInfo: string;
  timestamp: number;
}

interface JokeResponse {
  error: false;
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

type LoadJoke = {
  language?: Language;
  id?: number;
  blacklistFlags?: BlacklistFlags
}

const mapJoke = (res: JokeResponse): JokeData | null => {
  if (res.type === 'single') {
    return {
      type: 'single',
      id: res.id,
      language: res.lang,
      joke: res.joke!
    };
  }
  if (res.type === 'twopart') {
    return {
      type: 'twopart',
      id: res.id,
      language: res.lang,
      delivery: res.delivery!,
      setup: res.setup!,
    };
  }
  return null;
};

const buildParams = (params: { [key: string]: string }): string => {
  let strings: string[] = [];
  for (let key in params) {
    if (params[key]) {
      strings.push(`${key}=${params[key]}`);
    }
  }
  return strings.join('&') || '';
};

const getBlacklistFlagQuery = (blacklistFlags?: BlacklistFlags): string => {
  if (!blacklistFlags) return '';
  let str = Object.entries(blacklistFlags)
    .filter((flag) => flag[1])
    .map((flag) => flag[0])
    .join(',');
  return str;
};

const loadJoke = async ({ language, id, blacklistFlags }: LoadJoke ): Promise<JokeData | null> => {
  const path = 'Any';
  let query = buildParams({
    idRange: id?.toString() ?? '',
    blacklistFlags: getBlacklistFlagQuery(blacklistFlags),
    lang: (!APP_CONFIG.GCP_API_KEY || APP_CONFIG.USE_SUPPORTED_LANGUAGES) && language?.language || ''
  });
  try {
    const result = await fetch(`https://v2.jokeapi.dev/joke/${path}${query && '?' + query}`);
    const json = await result.json() as JokeResponse | JokeError;
    if (json.error) {
      throw new Error();
    }
    return mapJoke(json);
  } catch(err) {
    // handle error
    return null;
  }
};

export {
  loadJoke
};