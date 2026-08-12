/* ============================================================
   #SCENE 2 — CHARACTER SELECTION
   ============================================================ */


/* ============================================================
   ELEMENTS
   ============================================================ */

const scene2 =
    document.getElementById(
        "scene-2"
    );


const gameStage =
    document.getElementById(
        "game-stage"
    );


const startOverlay =
    document.getElementById(
        "start-overlay"
    );


const insertCoin =
    document.getElementById(
        "insert-coin"
    );


const rahmanCharacter =
    document.getElementById(
        "rahman-character"
    );


const riponCharacter =
    document.getElementById(
        "ripon-character"
    );


/* ============================================================
   INITIAL STATE
   ============================================================ */

/*
    Scene 2 starts locked.

    The player must click once before
    anything becomes interactive.
*/

scene2.classList.remove(
    "game-active"
);


gameState.coinInserted = false;


/* ============================================================
   INSERT COIN / START GAME
   ============================================================ */

/*
    Clicking anywhere on the grey overlay
    starts the game.
*/

startOverlay.addEventListener(
    "click",
    startGame
);


/* ============================================================
   START GAME FUNCTION
   ============================================================ */

function startGame() {

    /*
        Prevent starting more than once.
    */

    if (gameState.coinInserted) {

        return;

    }


    /*
        Insert coin.
    */

    gameState.coinInserted = true;


    /*
        Activate Scene 2.
    */

    scene2.classList.add(
        "game-active"
    );


    /*
        Debug message.
    */

    console.log(
        "Coin inserted. Game started."
    );

}


/* ============================================================
   RAHMAN — CLICK
   ============================================================ */

rahmanCharacter.addEventListener(
    "click",
    () => {

        /*
            Safety check.

            This should normally be impossible
            before the game starts because CSS
            disables pointer events.
        */

        if (!gameState.coinInserted) {

            return;

        }


        /*
            Select Rahman.
        */

        gameState.selectedCharacter =
            "rahman";


        console.log(
            "Mr. Rahman selected."
        );


        /*
            ========================================
            FUTURE SCENE TRANSITION
            ========================================

            This is where we will later transition
            to Scene 3.

            For example:

            showScene("scene-3");

            We are NOT doing that yet.
        */
       openScene3();

    }
);


/* ============================================================
   RAHMAN — KEYBOARD SUPPORT
   ============================================================ */

rahmanCharacter.addEventListener(
    "keydown",
    (event) => {

        /*
            Game must be active.
        */

        if (!gameState.coinInserted) {

            return;

        }


        /*
            Allow Enter or Space
            to select Rahman.
        */

        if (
            event.key === "Enter" ||
            event.key === " "
        ) {

            event.preventDefault();

            rahmanCharacter.click();

        }

    }
);


/* ============================================================
   RIPON — CLICK
   ============================================================ */

riponCharacter.addEventListener(
    "click",
    () => {

        /*
            Ripon is currently locked.

            Clicking him does nothing except
            provide a console message.
        */

        if (!gameState.coinInserted) {

            return;

        }


        console.log(
            "Mr. Ripon is locked."
        );


        /*
            ========================================
            FUTURE
            ========================================

            Later we can display:

            "You must reach Level 2
             to play Mr. Ripon."

        */

    }
);


/* ============================================================
   SCENE 2 DEBUG
   ============================================================ */

console.log(
    "#SCENE 2 loaded."
);