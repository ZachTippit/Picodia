exports.versionNotes = [
    {
        versionNum: "0.5.3",
        date: "10/4/22",
        introText: "It's Beta Time!",
        updateList: [
            "Still need to add testing suite to cover code, but there is a branch dedicated to that already.",
            "Replaced Google Sheets API connection with Google Functions call that talks to the MongoDB",
            "Updated version notes access for visibility/ease of access!",
            "Changed lives to 4 (2 on hard mode) for ease of play"
        ],
        outroText: "Planning on launching beta to test scalability and last changes before broader deployment. So much still on the wishlist, but we are close to 1.0.0!"
    },
    {
        versionNum: "0.5.2",
        date: "10/2/22",
        introText: "WOW. The refactor is concluding.",
        updateList: [
            "Changed tutorial from a list to read into a carousel. MUCH easier to read.",
            "Connected localStorage to Stats page for freshness",
            "Added Google Functions connection into app -- still need to fix up some backend/Mongo init before full implementation."
        ],
        outroText: "Code has been refactored to a vastly more stable state by moving game state into the Game component itself instead of app level and passed down (thanks, Redux)"
    },
    {
        versionNum: "0.5.1",
        date: "9/29/22",
        introText: "Refactoring to Redux underway!",
        updateList: [
            "Added basic toggle reducers into app and am slowly untangling these from the old App",
            "Set up empty async slices within Redux to call for puzzle data",
            "Intending to minimize state within React components unless absolutely necessary. Much easier (if boilerplate tedious) to handle from action/reducers."
        ],
        outroText: "Fixing several localStorage bugs due to excessive use of prop-diving. Instead, deconstructing localStorage in relative component's initialization."
    },
    {
        versionNum: "0.5.0",
        date: "9/16/22",
        introText: "Beginning Redux Refactor",
        updateList: [
            "Code has generally gotten to a state that is difficult to maintain and scale. As such, it is time to move to a more scalable solution. Redux it is!",
            "Set up Redux infrastructure around the app. It's like a mini backend! This is great!",
        ],
        outroText: "Removed cookies functionality as it is super buggy and might not work for these purposes. I've hit a bit of a blocker here and will need to go back to the drawing board."
    },
    {
        versionNum: "0.4.0",
        date: "8/31/22",
        introText: "Huzzah! localStorage and prevGameArray bugs",
        updateList: [
            "Local Storage is the solution! Converted cookies use over to local storage which should work like a charm",
            "Bugged out prevGameArray! Uh oh! Had to reformat a bit of gameState logic to fix that out",
            "Ironed out several frustrating bugs and formatting issues",
            "Fixed up code formatting and refactored several redundant functions/components/dependencies across the app."
        ],
        outroText: "Removed cookies functionality as it is super buggy and might not work for these purposes. I've hit a bit of a blocker here and will need to go back to the drawing board."
    },
    {
        versionNum: "0.3.1",
        date: "2/17/22",
        introText: "Post-Alpha: Added feedback.",
        updateList: [
            "Added animated tutorial and converted start button to a 3x3 easy grid",
            "Changed animation timing to be a bit snappier",
            "Fixed edge case mobile formatting for a few users",
            "Ironed out several frustrating bugs and formatting issues"
        ],
        outroText: "Removed cookies functionality as it is super buggy and might not work for these purposes. I've hit a bit of a blocker here and will need to go back to the drawing board."
    },
    {
        versionNum: "0.2.2",
        date: "2/16/22",
        introText: "ALPHA!!",
        updateList: [
            "Welcome, new players :) please leave feedback!",
            "The form has been sent to you.",
            "Google Analytics has been added to track user access",
        ],
        outroText: "50 puzzles stored in Google Sheets. Accessed by app through Sheets API. Limit of 20k req/day, so this could be a bottleneck if ever launched at any kind of scale."
    },
    {
        versionNum: "0.2.1",
        date: "2/15/22",
        introText: "QoL Improvements + Metadata Cleanup.",
        updateList: [
            "Swapped life/time positioning for readability",
            "Cleaned share results text",
            "Added ping alerts to notify user at key points",
            "Fixed up metadata to represent Picodia app"
        ],
        outroText: "Need to make a better tutorial based on pre-alpha feedback."
    },
    {
        versionNum: "0.2.0",
        date: "2/13/22",
        introText: "Starting to incorporate cookies into the mix. So many additiongal logic checks to make everywhere! Spent a lot of time debuggin async issues with time and incrementing cookies. Also added animation on game win, along with i/o on the stats that window that popped up.",
        updateList: [
            "Debugging Async issues with cookie retrieval",
            "Added animation on game win with stats window opening",
            "Implemented cookies to memorize game data between daily solves",
            "Re-wrote puzzle logic to accept any square array size :)"
        ],
        outroText: "Commented out avg times for now until that can be fixed. Now I just need to make a bunch of puzzles!"
    },
    {
        versionNum: "0.1.0",
        date: "2/10/22",
        introText: "Initial hosting and mobile formatting",
        updateList: [
            "Implemented game board logic with hard-coded puzzles",
            "Added ability to click and drag. It is very buggy and will need revisiting.",
            "Cleaned up console outputs, warnings and errors",
        ],
        outroText: "The game itself can be played, but there is not much else besides that yet. Plan on including pre/post game states and the ability to save your historical game data on device somehow."
    },
  ]