/* ============================================================
   SHARED BACK BUTTON CONTROLLER

   A single BACK button is reused by every scene that needs
   one. Each scene registers:

       theme          colour palette to use
       isVisible()    optional, hides the button when false
       goBack()       internal back step,
                      returns true  = handled inside the scene
                      returns false = leave the scene
       previousScene  scene number to fall back to,
                      null = the button never leaves the scene
       resumeAtEnd()  optional, replays the scene's own final
                      state so that arriving here from the NEXT
                      scene lands on the last thing the player
                      saw instead of the opening screen

   Scene 10 registers previousScene as null, so its back button
   only ever works inside its own scope.
   ============================================================ */


const globalBackLayer =
    document.getElementById(
        "global-back-layer"
    );


const globalBackButton =
    document.getElementById(
        "global-back-button"
    );


const sceneBackRegistry = {};


/* ============================================================
   REGISTRATION
   ============================================================ */

function registerSceneBackButton(sceneId, config) {

    sceneBackRegistry[sceneId] = config;

}


/* ============================================================
   ACTIVE SCENE

   Some scenes keep the "active" class on an earlier scene
   and only hide it, so the last visible active scene in
   document order is the real one.
   ============================================================ */

function getActiveSceneId() {

    const activeScenes =
        document.querySelectorAll(
            ".scene.active:not(.hidden)"
        );

    if (activeScenes.length === 0) {

        return null;

    }

    return activeScenes[
        activeScenes.length - 1
    ].id;

}


function getActiveBackConfig() {

    const sceneId = getActiveSceneId();

    if (!sceneId) {

        return null;

    }

    const config = sceneBackRegistry[sceneId];

    if (!config) {

        return null;

    }

    if (
        typeof config.isVisible === "function" &&
        !config.isVisible()
    ) {

        return null;

    }

    return config;

}


/* ============================================================
   VISIBILITY + THEME REFRESH

   Runs every frame so the button follows the scene state
   without every scene having to call back into this file.
   ============================================================ */

function refreshGlobalBackButton() {

    const config = getActiveBackConfig();

    if (config) {

        if (globalBackButton.dataset.theme !== config.theme) {

            globalBackButton.dataset.theme = config.theme;

        }

        globalBackLayer.classList.add(
            "is-visible"
        );

    } else {

        globalBackLayer.classList.remove(
            "is-visible"
        );

    }

    window.requestAnimationFrame(
        refreshGlobalBackButton
    );

}


/* ============================================================
   MEDIA CLEANUP BEFORE A SCENE CHANGE
   ============================================================ */

function stopTransientSceneAudio() {

    [
        "stopEtinAudio",
        "stopEreturnAudio",
        "stopEtdsAudio",
        "stopEauditCaseAudio"
    ].forEach(
        (functionName) => {

            if (typeof window[functionName] === "function") {

                window[functionName]();

            }

        }
    );


    if (typeof etinReqAudio !== "undefined") {

        etinReqAudio.pause();
        etinReqAudio.currentTime = 0;

    }


    if (typeof eauditSelectPromptAudio !== "undefined") {

        eauditSelectPromptAudio.pause();
        eauditSelectPromptAudio.currentTime = 0;

    }

}


/* ============================================================
   HOLD A VIDEO ON ITS LAST FRAME

   Video scenes have no steps to rewind into, so their final
   state is the finished video. Parking the video just short
   of the end keeps the closing frame on screen without
   firing "ended", which would bounce straight forward again.

   A tap then plays the remaining moment and moves on.
   ============================================================ */

const VIDEO_END_HOLD_SECONDS = 0.25;

const VIDEO_HOLD_RETRY_MS = 100;

const VIDEO_HOLD_MAX_ATTEMPTS = 40;


/*
    A seek past the buffered range is clamped by the browser,
    so the parking is retried until the data catches up.
*/

const videoHoldSessions = new WeakMap();


function holdVideoAtEnd(video) {

    const session =
        (videoHoldSessions.get(video) || 0) + 1;

    videoHoldSessions.set(video, session);


    let attempts = 0;


    function parkOnLastFrame() {

        /*
            A newer hold, or the scene being replayed from
            the top, cancels this one.
        */

        if (videoHoldSessions.get(video) !== session) {

            return;

        }

        if (
            attempts > 0 &&
            !video.paused &&
            video.currentTime < 1
        ) {

            return;

        }


        video.pause();


        const target =
            video.duration - VIDEO_END_HOLD_SECONDS;


        if (
            Number.isFinite(target) &&
            target > 0
        ) {

            video.currentTime = target;

            video.pause();


            if (
                Math.abs(video.currentTime - target) <= 0.5
            ) {

                return;

            }

        }


        attempts += 1;


        if (attempts <= VIDEO_HOLD_MAX_ATTEMPTS) {

            window.setTimeout(
                parkOnLastFrame,
                VIDEO_HOLD_RETRY_MS
            );

        }

    }


    parkOnLastFrame();

}


/* ============================================================
   GO BACK TO A PREVIOUS SCENE

   The scene is opened normally first, so its video, audio
   and layout are set up the usual way, and then rewound to
   its own final state when it provides one.
   ============================================================ */

function goToPreviousScene(sceneNumber) {

    stopTransientSceneAudio();


    document
        .querySelectorAll("video")
        .forEach(
            (video) => {

                video.pause();

            }
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


    const opener =
        window[`openScene${sceneNumber}`];


    if (typeof opener !== "function") {

        console.log(
            `No opener found for scene ${sceneNumber}.`
        );

        return;

    }


    opener();


    /*
        Looping background videos were paused above, and not
        every scene restarts its own, so they are resumed here.
    */

    const targetScene =
        document.getElementById(
            `scene-${sceneNumber}`
        );


    if (targetScene) {

        targetScene
            .querySelectorAll("video[loop]")
            .forEach(
                (video) => {

                    video.play().catch(() => {});

                }
            );

    }


    /*
        Land on the last thing the player saw in that scene
        rather than on its opening screen.
    */

    const targetConfig =
        sceneBackRegistry[`scene-${sceneNumber}`];


    if (
        targetConfig &&
        typeof targetConfig.resumeAtEnd === "function"
    ) {

        targetConfig.resumeAtEnd();

    }

}


/* ============================================================
   CLICK
   ============================================================ */

globalBackButton.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();


        const config = getActiveBackConfig();

        if (!config) {

            return;

        }


        /*
            Try the scene's own internal back step first.
        */

        const handledInsideScene =
            typeof config.goBack === "function"
                ? config.goBack()
                : false;


        if (handledInsideScene) {

            return;

        }


        /*
            Nothing left inside the scene, so leave it.
        */

        if (config.previousScene) {

            goToPreviousScene(
                config.previousScene
            );

        }

    }
);


refreshGlobalBackButton();
