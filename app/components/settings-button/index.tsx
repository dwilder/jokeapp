import { useSettingsContext } from "@/app/context/settings-context";

export default function SettingsButton() {
  const { setDisplay } = useSettingsContext();
  const showSettings = () => {
    setDisplay(true);
  };

  return (
    <p
      className="p-4 pr-0"
      onClick={showSettings}
    >⚙️</p>
  );
};