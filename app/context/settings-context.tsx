import { createContext, useContext, useMemo, useState } from 'react';
import { BlacklistFlags } from '../types/blacklist-flags';

interface SettingsProviderValue {
  blacklistFlags: BlacklistFlags;
  setBlacklistFlags: (flags: BlacklistFlags) => void;
  display: boolean;
  setDisplay: (show: boolean) => void;
}

const initialValues: SettingsProviderValue = {
  blacklistFlags: {
    nsfw: true,
    religious: true,
    political: true,
    racist: true,
    sexist: true,
    explicit: true
  },
  setBlacklistFlags: (flags: BlacklistFlags) => {},
  display: false,
  setDisplay: () => {}
};

const SettingsContext = createContext<SettingsProviderValue>(initialValues);

export const SettingsProvider = ({ children }: { children: React.JSX.Element[] | React.JSX.Element }): React.JSX.Element => {

  const [blacklistFlags, setBlacklistFlags] = useState(initialValues.blacklistFlags);
  const [display, setDisplay] = useState(false);

  const values = useMemo(() => ({
    blacklistFlags,
    setBlacklistFlags,
    display,
    setDisplay
  }), [blacklistFlags, setBlacklistFlags, display, setDisplay]);

  return (
    <SettingsContext.Provider value={values}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => useContext(SettingsContext);
