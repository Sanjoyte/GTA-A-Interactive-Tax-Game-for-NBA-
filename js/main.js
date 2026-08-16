/* ============================================================
   TAX EDUCATION EXPERIENCE
   MAIN GAME CONTROLLER
   ============================================================ */


/* ============================================================
   GLOBAL GAME STATE
   ============================================================ */

const gameState = {

    /*
        Current scene
    */

    currentScene: "scene-0",


    /*
        Currently selected character
    */

    selectedCharacter: null,


    /*
        Current player level
    */

    level: 1,


    /*
        Progress tracking
    */

    rahmanCompleted: false,

    riponUnlocked: false

};


/* ============================================================
   GLOBAL BACKGROUND AUDIO

   One single looping track runs from Scene 0 all the way
   through Scene 15.

   Whenever a scene plays a voice over clip, the background
   track steps aside and then continues the moment that clip
   finishes or is skipped.

   Scene videos are left alone on purpose — the background
   track keeps playing over them.
   ============================================================ */

/*
    The untouched browser constructor.

    It is kept here because the patched constructor further
    down needs it, and because the background track itself
    must not register as a voice over clip.
*/

const NativeAudio = window.Audio;


const backgroundAudio =
    new NativeAudio(
        "assets/audio/background.mp3"
    );


backgroundAudio.loop = true;
backgroundAudio.preload = "auto";


let shouldPlayBackgroundAudio = false;


/*
    Every voice over clip that is playing right now.

    The background track only continues once this set is
    empty again, so two overlapping clips cannot bring it
    back too early.
*/

const activeVoiceOverAudios = new Set();


let backgroundResumeTimer = null;


function playBackgroundAudio() {

    backgroundAudio.play().catch((error) => {

        console.log(
            "Background loop could not autoplay yet:",
            error
        );

    });

}


function resumeBackgroundAudio() {

    window.clearTimeout(
        backgroundResumeTimer
    );

    backgroundResumeTimer = null;


    if (!shouldPlayBackgroundAudio) {

        return;

    }


    if (activeVoiceOverAudios.size > 0) {

        return;

    }


    if (!backgroundAudio.paused) {

        return;

    }


    playBackgroundAudio();

}


/*
    A clip that is restarted stops and starts again within
    the same moment.

    The tiny delay here keeps the background track from
    flickering back in between those two steps, and is far
    too short to be heard as a gap.
*/

function scheduleBackgroundResume() {

    window.clearTimeout(
        backgroundResumeTimer
    );

    backgroundResumeTimer =
        window.setTimeout(
            resumeBackgroundAudio,
            40
        );

}


function startBackgroundAudio() {

    shouldPlayBackgroundAudio = true;

    resumeBackgroundAudio();

}


function stopBackgroundAudio() {

    shouldPlayBackgroundAudio = false;

    window.clearTimeout(
        backgroundResumeTimer
    );

    backgroundResumeTimer = null;

    backgroundAudio.pause();
    backgroundAudio.currentTime = 0;

}


/* ============================================================
   VOICE OVER CLIPS

   A registered clip pauses the background track while it
   plays, and hands it back when it ends, is paused or is
   stopped by a scene change.
   ============================================================ */

function registerVoiceOverAudio(audio) {

    audio.addEventListener(
        "play",
        () => {

            activeVoiceOverAudios.add(audio);

            window.clearTimeout(
                backgroundResumeTimer
            );

            backgroundResumeTimer = null;

            backgroundAudio.pause();

        }
    );


    [
        "pause",
        "ended",
        "error",
        "emptied"
    ].forEach(
        (eventName) => {

            audio.addEventListener(
                eventName,
                () => {

                    activeVoiceOverAudios.delete(audio);

                    scheduleBackgroundResume();

                }
            );

        }
    );

}


/*
    Every scene builds its clips with `new Audio(...)`, so
    registering them here means a new scene gets the same
    behaviour without any extra wiring.

    Videos use <video> elements and are never touched by
    this.
*/

window.Audio = function PatchedAudio(source) {

    const audio =
        source === undefined
            ? new NativeAudio()
            : new NativeAudio(source);


    registerVoiceOverAudio(audio);


    return audio;

};


window.Audio.prototype = NativeAudio.prototype;


document.addEventListener(
    "pointerdown",
    resumeBackgroundAudio
);


startBackgroundAudio();


/* ============================================================
   GLOBAL GAME INFORMATION
   ============================================================ */

console.log(
    "Tax Education Experience loaded."
);

console.log(
    "Current scene:",
    gameState.currentScene
);

console.log(
    "Game waiting on welcome screen."
);
