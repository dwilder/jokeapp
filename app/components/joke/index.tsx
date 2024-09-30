import { useEffect, useState } from "react"
import { loadJoke } from "@/app/api/joke";
import { JokeData, JokeSingle, JokeTwoPart } from "@/app/types/joke";
import { useLanguageContext } from "@/app/context/language-context";
import { loadTranslations } from "@/app/api/translation";
import { Language } from "@/app/types/languages";

const SingleJoke = ({ joke }: { joke: JokeSingle }) => {
  return <p>{joke.joke}</p>
};

const TwoPartJoke = ({ joke }: { joke: JokeTwoPart }) => {
  const { translations } = useLanguageContext();
  const [revealDelivery, setRevealDelivery] = useState(false);

  return (
    <div>
      <p className="pb-6">{joke.setup}</p>
      <p
        className="py-2 text-purple-500 border-b-2 border-purple-400"
        onClick={() => setRevealDelivery(true)}
        role="button"
      >
        {translations.JOKE_TWOPART_SHOW_PUNCHLINE} 💫
      </p>
      {revealDelivery && (
        <p className="mt-8">{joke.delivery} 🤣</p>
      )}
    </div>
  )
};

const LoadingMessage = ({ text }: { text: string }) => {
  return (
    <div className="flex justify-center items-center">
      <p className="inline-block animate-spin text-4xl">🌀</p>
      <p className="ml-4 text-2xl">{text}</p>
    </div>
  )
};

const ErrorMessage = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <p className="text-4xl">⚠️</p>
      <p className="mt-4 text-2xl">{text}</p>
    </div>
  );
}

export default function Joke() {
  const { language, translations } = useLanguageContext();
  const [joke, setJoke] = useState<JokeData>();
  const [localizedJoke, setLocalizedJoke] = useState<JokeData>();
  const [loading, setLoading] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const initiateJokeLoading = () => {
    if (loading !== 'idle' || 'pending') {
      setLoading('idle');
    }
  }

  const fetchJoke = async () => {
    const newJoke = await loadJoke(language);
    if (typeof newJoke === 'object') {
      setJoke(newJoke as JokeData);
    } else {
      setLoading('error');
    }
  };

  const localizeJoke = async (originalJoke: JokeData | undefined, language: Language) => {
    if (!language.language || !originalJoke) {
      return;
    }
    const { type, ...strings } = originalJoke;
    const translatedJoke = await loadTranslations({originalText: strings, language});
    if (typeof translatedJoke === 'object') {
      const pendingJoke = { ...translatedJoke, type } as JokeData;
      setLocalizedJoke(pendingJoke);
      setLoading('success');
    } else {
      setLoading('error');
    }
  };

  useEffect(() => {
    if (loading === 'idle') {
      setLoading('pending');
      fetchJoke();
    }  
  }, [loading]);

  useEffect(() => {
    localizeJoke(joke, language);
  }, [language, joke]);


  return (
    <div className="m-auto max-w-screen-sm ">
      <div className="mb-8 p-8 rounded-md bg-gray-800 border-purple-900 border-2">
        {loading === 'success' && localizedJoke?.type === 'single' && <SingleJoke joke={localizedJoke} />}
        {loading === 'success' && localizedJoke?.type === 'twopart' && <TwoPartJoke joke={localizedJoke} />}
        {(loading === 'idle' || loading === 'pending') && <LoadingMessage text={translations.JOKE_LOADING} />}
        {loading === 'error' && <ErrorMessage text={translations.JOKE_LOADING_ERROR} />}
      </div>
      <div className="flex flex-col items-center">
        <button
          className={`rounded text-gray-100 inline-block px-6 py-2 ${loading == 'pending' ? 'bg-gray-500' : 'bg-purple-900'}`}
          onClick={initiateJokeLoading}
        >
          {translations.JOKE_LOAD_NEW_JOKE}
        </button>
      </div>
    </div>
  )
}