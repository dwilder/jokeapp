import { useState } from "react"
import { JokeSingle, JokeTwoPart } from "@/app/types/joke";
import { useLanguageContext } from "@/app/context/language-context";
import useJoke from "@/app/hooks/use-joke";

const SingleJoke = ({ joke }: { joke: JokeSingle }) => {
  return <p>{joke.joke}</p>;
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
  );
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
};

export default function Joke() {
  const { translations } = useLanguageContext();
  const { status, joke, loadJoke } = useJoke();

  return (
    <div className="mx-auto max-w-screen-sm">
      <div className="mb-8 p-8 rounded-md bg-gray-800 border-purple-900 border-2">
        {status === 'success' && joke?.type === 'single' && <SingleJoke joke={joke} />}
        {status === 'success' && joke?.type === 'twopart' && <TwoPartJoke joke={joke} />}
        {(status === 'idle' || status === 'pending') && <LoadingMessage text={translations.JOKE_LOADING} />}
        {status === 'error' && <ErrorMessage text={translations.JOKE_LOADING_ERROR} />}
      </div>
      <div className="flex flex-col items-center">
        <button
          className={`rounded text-gray-100 inline-block px-6 py-2 ${status == 'pending' ? 'bg-gray-500' : 'bg-purple-900'}`}
          onClick={loadJoke}
        >
          {translations.JOKE_LOAD_NEW_JOKE}
        </button>
      </div>
    </div>
  )
}