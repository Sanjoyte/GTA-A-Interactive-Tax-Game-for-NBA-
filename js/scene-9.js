/* ============================================================
   SCENE 9 — CHARACTER SELECTION 2
   ============================================================ */


const scene9 =
    document.getElementById(
        "scene-9"
    );


const scene9Ripon =
    document.getElementById(
        "scene-9-ripon"
    );


/* ============================================================
   OPEN SCENE 9
   ============================================================ */

function openScene9() {

    console.log(
        "Opening Scene 9 — Character Selection"
    );


    document
        .querySelectorAll(".scene")
        .forEach(
            (scene) => {

                scene.classList.remove(
                    "active"
                );

            }
        );


    scene9.classList.add(
        "active"
    );


    scene9Ripon.classList.remove(
        "selected"
    );


    gameState.currentScene =
        "scene-9";

    gameState.rahmanCompleted =
        true;

    gameState.riponUnlocked =
        true;


    /*
        Same character selection voice over as Scene 2.
    */

    playCharAudio();

}


/* ============================================================
   RIPON SELECTION
   ============================================================ */

scene9Ripon.addEventListener(
    "click",
    () => {

        gameState.selectedCharacter =
            "ripon";


        stopCharAudio();


        scene9Ripon.classList.add(
            "selected"
        );


        console.log(
            "Mr. Ripon selected."
        );


        openScene10();

    }
);
