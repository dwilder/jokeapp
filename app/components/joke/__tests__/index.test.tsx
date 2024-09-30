import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

import '@testing-library/jest-dom';
import * as React from 'react';
import userEvent from '@testing-library/user-event'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Joke from '../index';
import { LanguageProvider } from '@/app/context/language-context';

jest.mock('../../../../app.config.js', () => ({
  GCP_API_KEY: 'test',
  USE_SUPPORTED_LANGUAGES: false,
  SUPPORTED_LANGUAGES: [{ language: 'en', name: 'English' }]
}));

const mockLanguages = {
  data: {
    languages: [
      { language: 'en', name: 'English' }
    ]
  }
};

const mockJokeError = {
  "error": true,
  "internalError": false,
  "code": 106,
  "message": "No matching joke found",
  "causedBy": [
  "No jokes were found that match your provided filter(s)."
  ],
  "additionalInfo": "The specified category/ies is/are invalid. Got: \"error\" but possible categories are: \"Any, Misc, Programming, Dark, Pun, Spooky, Christmas\" (case insensitive).",
  "timestamp": 1727710442527
};

const mockTwopartJoke = {
  "error": false,
  "category": "Programming",
  "type": "twopart",
  "setup": "twopart joke setup",
  "delivery": "twopart joke delivery",
  "flags": {
    "nsfw": false,
    "religious": false,
    "political": false,
    "racist": false,
    "sexist": false,
    "explicit": false
  },
  "safe": true,
  "id": 292,
  "lang": "en"
};

const mockSingleJoke = {
  "error": false,
  "category": "Programming",
  "type": "single",
  "joke": "test single joke",
  "flags": {
    "nsfw": false,
    "religious": false,
    "political": false,
    "racist": false,
    "sexist": false,
    "explicit": false
  },
  "id": 38,
  "safe": true,
  "lang": "en"
};

describe('Joke', () => {

  const gcpApiRegex = /^https:\/\/translation.googleapis.com.*$/;
  const gcpApiUrl = 'https://translation.googleapis.com/language/translate/v2/languages?model=nmt&target=en&key=test'
  const jokeApiRegex = /^https:\/\/v2.jokeapi.dev.*$/;
  const jokeApiUrl = `https://v2.jokeapi.dev/joke/Any`;

  beforeAll(() => {
    fetchMock.doMock();
  });

  afterAll(() => {
    fetchMock.dontMock();
  });

  beforeEach(() => {
    fetchMock.resetMocks();
    // fetchMock.mockIf(gcpApiRegex, async () => {
    //   return JSON.stringify(mockLanguages);
    // });
    // fetchMock.mockIf(/^https:\/\/v2.jokeapi.dev.*$/, async (req) => {
    //   return JSON.stringify({ 
    //     type: 'single',
    //     joke: 'some joke'
    //   });
    // })
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a loading screen when idle', async () => {
    render(<Joke />);
    const loader = screen.getByText('Loading a joke...');
    expect(loader).toBeInTheDocument();
    await waitFor(
      () => expect(fetch).toHaveBeenCalledWith(jokeApiUrl)
    );
  });

  it('calls the joke API', async () => {
    render(<Joke />);
    await waitFor(
      () => expect(fetch).toHaveBeenCalledWith(jokeApiUrl)
    );
  });

  it('renders a single joke', async () => {
    fetchMock.mockIf(jokeApiUrl, async () => JSON.stringify(mockSingleJoke));
    const { findByText } = render(
      <LanguageProvider>
        <Joke />
      </LanguageProvider>
    );
    await waitFor(
      () => expect(fetch).toHaveBeenCalledWith(jokeApiUrl)
    );
    const joke = await findByText(mockSingleJoke.joke);
    expect(joke).toBeInTheDocument();
  });

  describe('TwoPartJoke', () => {

    it('renders a twopart joke', async () => {
      fetchMock.mockIf(jokeApiUrl, async () => JSON.stringify(mockTwopartJoke));
      const { findByText } = render(
        <LanguageProvider>
          <Joke />
        </LanguageProvider>
      );
      await waitFor(
        () => expect(fetch).toHaveBeenCalledWith(jokeApiUrl)
      );
      const setup = await findByText(mockTwopartJoke.setup);
      expect(setup).toBeInTheDocument();
    });

    it('does not render the delivery until the reveal button is clicked', async () => {
      const user = userEvent.setup();
      fetchMock.mockIf(jokeApiUrl, async () => JSON.stringify(mockTwopartJoke));
      render(
        <LanguageProvider>
          <Joke />
        </LanguageProvider>
      );
      await waitFor(
        () => expect(fetch).toHaveBeenCalledWith(jokeApiUrl)
      );
      const button = await screen.findByText(/Show me the punchline/);
      expect(button).toBeInTheDocument();
      await user.click(button);
      
      const delivery = await screen.findByText(mockTwopartJoke.delivery + ' 🤣');
      expect(delivery).toBeInTheDocument();
    });
  });

  it('loads a new joke when the button is clicked', async () => {
    const user = userEvent.setup();
    fetchMock.mockIf(jokeApiUrl, async () => JSON.stringify(mockTwopartJoke));
    render(
      <LanguageProvider>
        <Joke />
      </LanguageProvider>
    );
    await waitFor(
      () => expect(fetch).toHaveBeenCalledWith(jokeApiUrl)
    );
    const button = await screen.findByText(/Show me another joke/);
    expect(button).toBeInTheDocument();

    fetchMock.mockIf(jokeApiUrl, async () => JSON.stringify(mockSingleJoke));
    await user.click(button);
    await waitFor(
      () => expect(fetch).toHaveBeenCalledWith(jokeApiUrl)
    );

    const joke = await screen.findByText(mockSingleJoke.joke);
    expect(joke).toBeInTheDocument();
  });

});