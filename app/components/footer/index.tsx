'use client';

import { useLanguageContext } from "@/app/context/language-context";
import Container from "../container";

export default function Footer() {
  const { translations } = useLanguageContext();

  return (
    <footer className="bg-gray-900 border-t-2 border-t-purple-900 mt-16 py-6">
      <Container>
        <p>{translations.FOOTER_COPYRIGHT} &copy; <a href="https://davewilder.ca" target="_blank">Dave Wilder</a></p>
      </Container>
    </footer>
  )
}