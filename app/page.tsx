'use client';

import { LanguageProvider } from "./context/language-context";
import Header from "./components/header";
import Joke from "./components/joke";
import Container from "./components/container";
import Loading from "./components/loading";

export default function Home() {  
  return (
    <LanguageProvider>
      <div className="">
        <Loading>
          <Header />
          <Container>
            <Joke />
          </Container>
        </Loading>
      </div>
    </LanguageProvider>
  );
}
