'use client';

import { useLanguageContext } from '@/app/context/language-context';
import styles from './styles.module.css';
import LanguageSwitcher from '../language-switcher';
import Container from '../container';

export default function Header() {
  const { translations: { APP_TITLE } } = useLanguageContext();
  return (
    <header>
      <LanguageSwitcher />
      <Container>
        <div className="flex flex-col items-center justify-center">
          <div className="text-8xl pb-4 pt-16 md:text-9xl">🤡</div>
          <h1 className={`${styles.title} text-4xl pb-16 md:text-6xl`}>{APP_TITLE}</h1>
        </div>
      </Container>
    </header>
  )
}