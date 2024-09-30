import { useLanguageContext } from "@/app/context/language-context";
import Container from "../container";

interface LoadingProps {
  children: React.JSX.Element[] | React.JSX.Element
}

export default function Loading({ children }: LoadingProps): React.JSX.Element {
  const { languagesStatus, translationsStatus } = useLanguageContext();

  if (languagesStatus == 'success' && translationsStatus == 'success') {
    return <>{children}</>;
  }
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <p className="inline-block animate-spin text-7xl sm:text-9xl">🤡</p>
    </div>
  );
}