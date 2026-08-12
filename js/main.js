/* ============================================================
   TAX EDUCATION EXPERIENCE
   MAIN GAME CONTROLLER
   ============================================================ */


/* ============================================================
   GLOBAL GAME STATE
   ============================================================ */

const gameState = {

    /*
        Current scene
    */

    currentScene: "scene-0",


    /*
        Currently selected character
    */

    selectedCharacter: null,


    /*
        Current player level
    */

    level: 1,


    /*
        Insert Coin / Game Start
    */

    coinInserted: false,


    /*
        Progress tracking
    */

    rahmanCompleted: false,

    riponUnlocked: false

};


/* ============================================================
   GLOBAL GAME INFORMATION
   ============================================================ */

console.log(
    "Tax Education Experience loaded."
);

console.log(
    "Current scene:",
    gameState.currentScene
);

console.log(
    "Game waiting on welcome screen."
);
