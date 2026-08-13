/* ============================================================
   SCENE 8 — RETURN SUBMISSION VIDEO
   ============================================================ */


const scene8 =
    document.getElementById(
        "scene-8"
    );


const scene8Video =
    document.getElementById(
        "scene-8-video"
    );


const scene8Next =
    document.getElementById(
        "scene-8-next"
    );


let scene8VideoFinished = false;
let scene8NextPressed = false;


/* ============================================================
   OPEN SCENE 8
   ============================================================ */

function openScene8() {

    console.log(
        "Opening Scene 8 — Return Submission Video"
    );


    if (
        typeof scene7BackgroundVideo !== "undefined"
    ) {

        scene7BackgroundVideo.pause();

    }


    if (
        typeof ereturnAudio !== "undefined"
    ) {

        ereturnAudio.pause();

    }


    if (
        typeof hideEreturnAudioStatus === "function"
    ) {

        hideEreturnAudioStatus();

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


    scene8.classList.add(
        "active"
    );


    gameState.currentScene =
        "scene-8";


    scene8VideoFinished = false;
    scene8NextPressed = false;

    scene8Next.disabled = true;

    scene8Next.classList.add(
        "disabled"
    );


    scene8Video.currentTime = 0;


    const playPromise =
        scene8Video.play();


    if (
        playPromise !== undefined
    ) {

        playPromise.catch(
            (error) => {

                console.log(
                    "Scene 8 video could not autoplay:",
                    error
                );

            }
        );

    }

}


/* ============================================================
   VIDEO FINISHED
   ============================================================ */

scene8Video.addEventListener(
    "ended",
    () => {

        console.log(
            "Scene 8 video finished."
        );


        scene8VideoFinished = true;

        scene8Next.disabled = false;

        scene8Next.classList.remove(
            "disabled"
        );

    }
);


/* ============================================================
   NEXT BUTTON
   ============================================================ */

scene8Next.addEventListener(
    "click",
    () => {

        if (
            !scene8VideoFinished ||
            scene8NextPressed
        ) {

            return;

        }


        scene8NextPressed = true;
        scene8Next.disabled = true;

        scene8Next.classList.add(
            "disabled"
        );


        console.log(
            "Scene 8 NEXT clicked."
        );


        openScene9();

    }
);


/* ============================================================
   PLAYBACK FALLBACK
   ============================================================ */

scene8.addEventListener(
    "click",
    () => {

        if (
            scene8Video.paused &&
            !scene8Video.ended &&
            scene8.classList.contains("active")
        ) {

            const retryPromise =
                scene8Video.play();


            if (
                retryPromise !== undefined
            ) {

                retryPromise.catch(
                    (error) => {

                        console.log(
                            "Scene 8 video could not play after click:",
                            error
                        );

                    }
                );

            }

        }

    }
);
