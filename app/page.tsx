'use client';

import { LanguageProvider } from "./context/language-context";
import Header from "./components/header";
import Joke from "./components/joke";
import Container from "./components/container";
import Loading from "./components/loading";
import Footer from "./components/footer";
import { SettingsProvider } from "./context/settings-context";
import SettingsModal from "./components/settings-modal";

export default function Home() {  
  return (
    
    <LanguageProvider>
      <Loading>
        <SettingsProvider>
          <div className="min-h-screen flex flex-col">
            <div className="flex-none">
              <Header />
            </div>
            <div className="flex-1">
              <Container>
                <Joke />
              </Container>
            </div>
            <div className="flex-none">
              <Footer />
            </div>
          </div>
          <SettingsModal />
        </SettingsProvider>
      </Loading>
    </LanguageProvider>
  );
}
