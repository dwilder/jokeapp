'use client';

import { LanguageProvider } from "./context/language-context";
import Header from "./components/header";
import Joke from "./components/joke";
import Container from "./components/container";

export default function Home() {  
  return (
    <LanguageProvider>
      <div className="">
        <Header />
        <Container>
          <Joke />
        </Container>
      </div>
    </LanguageProvider>
  );
}
