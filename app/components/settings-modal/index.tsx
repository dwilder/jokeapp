import { useLanguageContext } from "@/app/context/language-context";
import { useSettingsContext } from "@/app/context/settings-context"
import { BlacklistFlags } from "@/app/types/blacklist-flags";
import { TranslationKey } from "@/app/types/languages";
import { useState } from "react";

interface FormConfig {
  flags: {
    [Property in keyof BlacklistFlags]: TranslationKey;
  }
}

const formConfig: FormConfig = {
  flags: {
    nsfw: "SETTINGS_NSFW",
    racist: 'SETTINGS_RACIST',
    religious: 'SETTINGS_RELIGIOUS',
    sexist: 'SETTINGS_SEXIST',
    political: 'SETTINGS_POLITICAL',
    explicit: 'SETTINGS_EXPLICIT'
  }
}

export default function SettingsModal() {
  const { display, setDisplay, blacklistFlags, setBlacklistFlags } = useSettingsContext();
  const { translations } = useLanguageContext();

  const [flags, setFlags] = useState(blacklistFlags);

  const save = () => {
    setBlacklistFlags(flags);
    setDisplay(false);
  };

  if (!display) {
    return null;
  }
  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center bg-gray-900 bg-opacity-50 z-50">
      <div className="relative p-6 rounded-lg bg-gray-900 border-2 border-purple-900">
        <p
          className="absolute top-0 right-0 p-4"
          onClick={() => setDisplay(false)}
          role="button"
          aria-label={translations.SETTINGS_CLOSE}
        >❌</p>
        <h2 className="text-xl mb-4">{translations.SETTINGS_HEADER}</h2>

        <form>
          <p className="mb-4">{translations.SETTINGS_DESCRIPTION}</p>
          {Object.entries(flags).map((flag) => {
            return (
              <fieldset className="mb-2 flex flex-row items-center">
                <input type="checkbox" name={flag[0]} id={flag[0]} defaultChecked={flag[1]} onClick={() => {
                  setFlags({
                    ...flags,
                    [flag[0]]: !flag[1]
                  })
                }} />
                <label htmlFor={flag[0]} className="ml-2">{translations[formConfig.flags[flag[0]]]}</label>
              </fieldset>
            )
          })}
          <div className="flex flex-row justify-between mt-6">
            <button
              className="border-2 rounded px-6 py-2 border-purple-500 text-purple-500"
              onClick={(e) => {
                e.preventDefault();
                setDisplay(false);
                setFlags(blacklistFlags);
              }}
            >
              {translations.SETTINGS_CANCEL}
            </button>
            <button
              className="border-2 rounded px-6 py-2 border-purple-500 bg-purple-500 ml-6"
              onClick={(e) => {
                e.preventDefault();
                save();
              }}
            >
              {translations.SETTINGS_UPDATE}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}