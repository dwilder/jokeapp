import text from "../text/text";

export interface Language {
  language: string,
  name: string;
}

export type TranslationKey = keyof typeof text;

export type Translations = {
  [Property in keyof typeof text]: string;
};