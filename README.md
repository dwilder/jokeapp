# Tell Me a Joke

Tell Me a Joke is a small web app written in ReactJs utilizing NextJs and Tailwind CSS.

Translations are performed using the Google Translate API, so a GCP API key is required to access the service. This can be added in the `app.config.js` folder in the project root.

Jokes are provided by the JokeAPI.

## Running the Project

**NOTE**: You will need Node 18.18 or higher to install and run this application.

Clone it from the repo:

```
git clone https://github.com/dwilder/jokeapp.git
```

Navigate to the project root:

```
cd jokeapp
```

Install modules:

```
npm install
```

Run it:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

All project files are in the `/app` folder. This project use the NextJS App Router and loads the layout and pages from the `/app` folder. The `/app` folder contains additional subfolders as follows...

- `/api`: files specific to loading data from external APIs (Google Translate API, JokeAPI).
- `/components`: React components used in the app.
- `/context`: React Contexts, used here for managing translations and available languages.
- `/text`: base text strings for displaying in the UI and translated as needed.
- `/type`: global TypeScript types.

Fonts are loaded using NextJs fonts, so no external font files are required.

## App Config

The project has minimal configuration. For simplicity and testing purposes, the Google Translate API key can be used form the config file. If this is not supplied, then fallback languages supported by the JokeAPI are included here.

```app.config.js
const APP_CONFIG = {
  GCP_API_KEY: '',
  USE_SUPPORTED_LANGUAGES: true,
  SUPPORTED_LANGUAGES: [
    { language: 'cs', name: 'Czech' },
    { language: 'de', name: 'German' },
    { language: 'en', name: 'English' },
    { language: 'es', name: 'Spanish' },
    { language: 'fr', name: 'French' },
    { language: 'pt', name: 'Portuguese' },
  ]
};

export default APP_CONFIG;
```

## TODO

- The JokeAPI provides an id. If the language is changed once a joke is loaded, the joke should be fetched again using the id with the updated language.
- Move GCP_API_KEY to a `.env` file for additional security. Ideally, the API key will be held on the server and requests to the Google Translate API will be proxied through the server.
- Improve UX for loading languages. The language selector should not be accessible when loading languages.
- Move joke loading to a `useJoke` hook to encapsulate joke loading and translation logic.
- Add unit tests for LanguageSwitcher, API transforms, ...
