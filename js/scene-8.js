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


let scene8TransitionStarted = false;


function completeScene8() {

    if (
        scene8TransitionStarted ||
        !scene8.classList.contains("active")
    ) {

        return;

    }

    scene8TransitionStarted = true;
    scene8Video.pause();
    openScene9();

}


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


    scene8TransitionStarted = false;


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


        completeScene8();

    }
);


/* ============================================================
   SHARED BACK BUTTON

   Scene 8 borrows the Scene 7 blue palette and always
   returns to Scene 7.

   No resumeAtEnd is registered, so the video would replay
   from the beginning, matching Scene 5 and Scene 11.
   ============================================================ */

registerSceneBackButton(
    "scene-8",
    {

        theme: "ereturn",

        previousScene: 7,

        goBack: () => false

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
