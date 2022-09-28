#   Picodia Game

Picodia is a web-based game based on a combination between Picross puzzles and the daily nature of Wordle. The tech stack is JS/React, MUI for styling and utilizes local storage for the caching of user play data.

##  Current Works-in-Progress

The current version of the project is missing some key features, which will be added as development continues:

    -   Ability to "mark" squares for ease of play
    -   Replayability of previous levels (still need to figure out implementation)
    -   Re-do tutorial for greater clarity of the rules
    -   Change cookies storage to local storage
    -   Re-implement state management into Redux
    -   Refactor css into variables for ease of editing

##  External Integrations

There are a few external platforms that this app communicates with.

Presently, the app is connected into a spreadsheet holding all of the puzzles (using the Google Sheets API). This is restrictive from a scale perspective (~20k reads/daily), and is not a programmatically secure solution.

In the next phase of development, the app will connect into a Node/Express backend hosted on GCP to read puzzles. This will be managed by an admin/backend app built in Golang. The hope is to containerize the front end components (probably just this game) to allow greater scalability and practice with implementing Docker/K8s.

##  Testing Framework

Picodia does not currently have a testing framework. This should change.