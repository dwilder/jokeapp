import { useEffect, useState } from "react";
import { loadJoke } from "../api/joke";
import { useLanguageContext } from "../context/language-context";
import { JokeData, JokeSingle, JokeTwoPart } from "../types/joke";
import { loadTranslations } from "../api/translation";
import { Language } from "../types/languages";
import { Status } from "../types/status";

interface UseJoke {
  joke: JokeSingle | JokeTwoPart | null,
  loadJoke: () => void,
  status: Status
}

const useJoke = (): UseJoke => {

  const { language } = useLanguageContext();
  const [joke, setJoke] = useState<JokeData | null>(null);
  const [localizedJoke, setLocalizedJoke] = useState<JokeData | null>(null);
  const [status, setStatus] = useState<Status>('idle');

  const initiateJokeLoading = () => {
    if (status !== 'idle' || 'pending') {
      setStatus('idle');
    }
  }

  const fetchJoke = async () => {
    const newJoke = await loadJoke({ language });
    if (typeof newJoke === 'object') {
      setJoke(newJoke);
    } else {
      setStatus('error');
    }
  };

  const localizeJoke = async (originalJoke: JokeData | null, language: Language) => {
    if (!language.language || !originalJoke) {
      return;
    }
    const strings = originalJoke?.type === 'single'
      ? { joke: originalJoke.joke }
      : { setup: originalJoke.setup, delivery: originalJoke.delivery };
    const translatedJoke = await loadTranslations<Pick<JokeSingle, 'joke'> | Pick<JokeTwoPart, 'setup' | 'delivery'>>({originalText: strings, language});
    if (typeof translatedJoke === 'object') {
      const pendingJoke = { ...originalJoke, ...translatedJoke };
      setLocalizedJoke(pendingJoke);
      setStatus('success');
    } else {
      setStatus('error');
    }
  };

  useEffect(() => {
    if (status === 'idle') {
      setStatus('pending');
      fetchJoke();
    }  
  }, [status]);

  useEffect(() => {
    localizeJoke(joke, language);
  }, [language, joke]);

  return {
    joke: localizedJoke,
    loadJoke: initiateJokeLoading,
    status
  }
};

export default useJoke;