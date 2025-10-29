# Picodia Game

Picodia is a web-based game based on a combination between Picross puzzles and the daily nature of Wordle. The tech stack is JS/React, MUI for styling and utilizes local storage for the caching of user play data.

## Development

Install dependencies with `npm install`, start a local dev server with `npm run dev`, and launch the production preview via `npm run preview`. Run the Vite-powered build with `npm run build` and execute unit tests through `npm test`. The project now uses TypeScript via Vite, so any new environment variables should use the `VITE_` prefix (e.g. `VITE_GOOGLE_ANALYTICS_ID`, `VITE_SPREADSHEET_ID`, `VITE_SHEETS_API_KEY`). Tailwind CSS 4 is configured through the official Vite plugin, so utility classes are available once dependencies are installed. To keep formatting consistent, run Prettier with `npm run format` (or check-only via `npm run format:check`).

## Current Works-in-Progress

The current version of the project is missing some key features, which will be added as development continues:

    -   Ability to "mark" squares for ease of play
    -   Replayability of previous levels (still need to figure out implementation)
    -   Re-do tutorial for greater clarity of the rules
    -   Change cookies storage to local storage
    -   Re-implement state management into Redux
    -   Refactor css into variables for ease of editing

## External Integrations

There are a few external platforms that this app communicates with.

Presently, the app is connected into a spreadsheet holding all of the puzzles (using the Google Sheets API). This is restrictive from a scale perspective (~20k reads/daily), and is not a programmatically secure solution.

In the next phase of development, the app will connect into a Node/Express backend hosted on GCP to read puzzles. This will be managed by an admin/backend app built in Golang. The hope is to containerize the front end components (probably just this game) to allow greater scalability and practice with implementing Docker/K8s.

## Testing Framework

Picodia does not currently have a testing framework. This should change.
