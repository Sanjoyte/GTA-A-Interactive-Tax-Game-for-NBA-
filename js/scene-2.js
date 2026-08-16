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
    Scene 2 starts hidden and locked.

    Scene 1 opens it after the opening
    video has finished.
*/

scene2.classList.remove(
    "active"
);


/* ============================================================
   OPEN SCENE 2
   ============================================================ */

function openScene2() {

    console.log(
        "Opening Scene 2 — Character Selection"
    );


    if (typeof startBackgroundAudio === "function") {

        startBackgroundAudio();

    }


    document
        .querySelectorAll(".scene")
        .forEach(
            (scene) => {

                scene.classList.remove(
                    "active"
                );

            }
        );


    scene2.classList.remove(
        "hidden"
    );

    scene2.classList.add(
        "active"
    );


    gameState.currentScene =
        "scene-2";

}


/* ============================================================
   RAHMAN — CLICK
   ============================================================ */

rahmanCharacter.addEventListener(
    "click",
    () => {

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
