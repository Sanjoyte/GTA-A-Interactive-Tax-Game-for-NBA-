/* ============================================================
   #SCENE 0 — WELCOME
   ============================================================ */


/* ============================================================
   ELEMENTS
   ============================================================ */

const scene0 =
    document.getElementById(
        "scene-0"
    );


const scene0Video =
    document.getElementById(
        "scene-0-video"
    );


const scene0Start =
    document.getElementById(
        "scene-0-start"
    );


let scene0StartClicked = false;


/* ============================================================
   OPEN SCENE 0
   ============================================================ */

function openScene0() {

    console.log(
        "Opening Scene 0 — Welcome"
    );


    /*
        The background track runs through every scene, so
        coming back here from Scene 15 keeps it playing
        without a break.
    */

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


    scene0.classList.add(
        "active"
    );


    gameState.currentScene =
        "scene-0";


    scene0StartClicked = false;


    scene0Video.currentTime = 0;

    const playPromise =
        scene0Video.play();

    if (
        playPromise !== undefined
    ) {

        playPromise.catch(
            (error) => {

                console.log(
                    "Scene 0 video could not autoplay:",
                    error
                );

            }
        );

    }

}


/* ============================================================
   START FROM WELCOME
   ============================================================ */

scene0Start.addEventListener(
    "click",
    () => {

        if (scene0StartClicked) {

            return;

        }

        scene0StartClicked = true;

        console.log(
            "Opening video from welcome screen."
        );

        openScene1();

    }
);
