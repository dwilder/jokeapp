export interface JokeSingle {
  type: 'single';
  id: number;
  language: string;
  joke: string;
}

export interface JokeTwoPart {
  type: 'twopart';
  id: number;
  language: string;
  setup: string;
  delivery: string;
}

export type JokeData = JokeSingle | JokeTwoPart;
