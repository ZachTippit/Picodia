#   Picodia Game

Picodia is a web-based game based on a combination between Picross puzzles and the daily nature of Wordle. The tech stack is JS/React, MUI for styling and utilizes local storage for the caching of user play data. The backend is deployed in separate repo and is hosted in Google Cloud Functions with Cloud Firestore as the database.

##  Current Works-in-Progress

The current version of the project is missing some key features, which will be added as development continues:

    -   Replayability of previous levels (still need to figure out implementation)
    -   Strike out clues in correctly completed rows
    -   Add color to post-game pixel picture
    -   Improved analytics and game tracking on back-end
    
##  External Integrations

There are a few external platforms that this app communicates with.

Presently, the app is connected to Google Cloud Functions and Firestore which communicates with the database and holds all of the puzzles, respectively. It would be relatively trivial to add game tracking stats, however that is not the focus of the initial release. Writing to Firestore would limit the very generous free tier for both Functions and Firestore, however that would require 10k+ active daily players.

In the next phase of development, the hope is to containerize the front end components (probably just this game) to allow greater scalability and practice with implementing Docker/K8s.

##  Testing Framework

Picodia uses Jasmine on the backend and does not currently have a front end testing framework, but includes catch statements and error logging to nail down any errant bugs.
