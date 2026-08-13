/* ============================================================
   #SCENE 5 — eTIN VIDEO
   ============================================================ */

const scene5 =
    document.getElementById(
        "scene-5"
    );

const scene5Video =
    document.getElementById(
        "scene-5-video"
    );

const scene5Skip =
    document.getElementById(
        "scene-5-skip"
    );

let scene5Transitioned = false;


/* ============================================================
   OPEN SCENE 5
   ============================================================ */

function openScene5() {

    console.log(
        "Opening Scene 5 — eTIN Video"
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

    scene5.classList.add(
        "active"
    );

    gameState.currentScene =
        "scene-5";

    scene5Transitioned = false;
    scene5Video.currentTime = 0;

    const playPromise =
        scene5Video.play();

    if (
        playPromise !== undefined
    ) {

        playPromise.catch(
            (error) => {

                console.log(
                    "Video could not autoplay:",
                    error
                );

            }
        );

    }

}


/* ============================================================
   MOVE TO SCENE 6
   ============================================================ */

function finishScene5(reason) {

    if (scene5Transitioned) {

        return;

    }

    scene5Transitioned = true;
    scene5Video.pause();

    console.log(
        `Scene 5 ${reason}. Opening Scene 6.`
    );

    openScene6();

}


/* ============================================================
   VIDEO FINISHED — CONTINUE AUTOMATICALLY
   ============================================================ */

scene5Video.addEventListener(
    "ended",
    () => {

        finishScene5(
            "video finished"
        );

    }
);


/* ============================================================
   SKIP VIDEO
   ============================================================ */

scene5Skip.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        finishScene5(
            "video skipped"
        );

    }
);
