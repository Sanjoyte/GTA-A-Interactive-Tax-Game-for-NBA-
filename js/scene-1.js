/* ============================================================
   #SCENE 1 — OPENING VIDEO
   ============================================================ */


/* ============================================================
   ELEMENTS
   ============================================================ */

const scene1 =
    document.getElementById(
        "scene-1"
    );


const scene1Video =
    document.getElementById(
        "scene-1-video"
    );


const scene1Skip =
    document.getElementById(
        "scene-1-skip"
    );


/* ============================================================
   OPEN SCENE 1
   ============================================================ */

function openScene1() {

    console.log(
        "Opening Scene 1 — Intro Video"
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


    scene1.classList.add(
        "active"
    );


    gameState.currentScene =
        "scene-1";


    scene1Video.currentTime = 0;


    const playPromise =
        scene1Video.play();


    if (
        playPromise !== undefined
    ) {

        playPromise.catch(
            (error) => {

                console.log(
                    "Opening video could not autoplay:",
                    error
                );

            }
        );

    }

}


/* ============================================================
   VIDEO FINISHED
   ============================================================ */

scene1Video.addEventListener(
    "ended",
    () => {

        console.log(
            "Opening video finished."
        );

        openScene2();

    }
);


/* ============================================================
   SKIP OPENING VIDEO
   ============================================================ */

scene1Skip.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        scene1Video.pause();

        console.log(
            "Opening video skipped."
        );

        openScene2();

    }
);


/* ============================================================
   PLAYBACK FALLBACK
   ============================================================ */

scene1.addEventListener(
    "click",
    () => {

        if (
            scene1Video.paused &&
            !scene1Video.ended
        ) {

            const retryPromise =
                scene1Video.play();


            if (
                retryPromise !== undefined
            ) {

                retryPromise.catch(
                    (error) => {

                        console.log(
                            "Opening video could not play after click:",
                            error
                        );

                    }
                );

            }

        }

    }
);
