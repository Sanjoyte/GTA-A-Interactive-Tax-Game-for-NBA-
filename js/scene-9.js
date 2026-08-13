/* ============================================================
   SCENE 9 — CHARACTER SELECTION
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

}


/* ============================================================
   RIPON SELECTION
   ============================================================ */

scene9Ripon.addEventListener(
    "click",
    () => {

        gameState.selectedCharacter =
            "ripon";


        scene9Ripon.classList.add(
            "selected"
        );


        console.log(
            "Mr. Ripon selected."
        );


        openScene10();

    }
);
