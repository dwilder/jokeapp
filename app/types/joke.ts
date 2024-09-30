export interface JokeSingle {
  type: 'single';
  joke: string;
}

export interface JokeTwoPart {
  type: 'twopart';
  setup: string;
  delivery: string;
}

export type JokeData = JokeSingle | JokeTwoPart;
