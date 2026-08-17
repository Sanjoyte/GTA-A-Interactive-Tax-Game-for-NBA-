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
   BUTTON AND CARD CLICK SOUND

   A short confirmation sound for buttons — login, register,
   submit, yes, no, back — and for the character cards on the
   Scene 2 and Scene 9 selection screens.

   The clips are built from NativeAudio on purpose. The patched
   constructor above registers a clip as a voice over, which
   pauses the background track. A click sound must leave the
   background music running, so it stays unregistered.
   ============================================================ */

const CLICK_SOUND_SOURCE = "assets/audio/button.mp3";


/*
    Anything a player presses to make something happen.

    Scene 13 builds its case cards as real buttons at runtime,
    and the listener below is delegated, so those are covered
    without any extra wiring.
*/

const CLICK_SOUND_SELECTOR = [
    "button",
    "[role=\"button\"]",
    ".character",
    ".scene-9-character"
].join(", ");


/*
    Elements that stay silent.

    The "tap to continue" prompts are excluded by request —
    they read as pacing, not as a pressed control.

    Locked and completed character cards are excluded because
    pressing one selects nothing, so a confirmation sound
    would be telling the player the wrong thing.
*/

const CLICK_SOUND_EXCLUDED_SELECTOR = [
    "[data-no-click-sound]",
    "[class*=\"continue\"]",
    "[disabled]",
    "[aria-disabled=\"true\"]",
    ".locked",
    ".completed"
].join(", ");


/*
    Two presses in quick succession should both be heard, so
    the sound is spread across a small pool instead of one clip
    that would have to cut itself off to start again.
*/

const CLICK_SOUND_POOL_SIZE = 4;


const clickSoundPool = [];


for (
    let index = 0;
    index < CLICK_SOUND_POOL_SIZE;
    index += 1
) {

    const clickSound =
        new NativeAudio(
            CLICK_SOUND_SOURCE
        );

    clickSound.preload = "auto";

    clickSoundPool.push(clickSound);

}


let clickSoundIndex = 0;


function playClickSound() {

    const clickSound =
        clickSoundPool[clickSoundIndex];

    clickSoundIndex =
        (clickSoundIndex + 1) %
        CLICK_SOUND_POOL_SIZE;


    clickSound.currentTime = 0;

    clickSound.play().catch((error) => {

        console.log(
            "Click sound blocked:",
            error
        );

    });

}


/*
    The listener runs on the capture phase.

    Several scenes call stopPropagation inside their own click
    handlers, which would swallow a bubbling listener, and
    capture also means the sound starts before a handler
    switches scenes out from under it.
*/

document.addEventListener(
    "click",
    (event) => {

        const target = event.target;


        if (!(target instanceof Element)) {

            return;

        }


        const control =
            target.closest(
                CLICK_SOUND_SELECTOR
            );


        if (!control) {

            return;

        }


        if (
            control.matches(
                CLICK_SOUND_EXCLUDED_SELECTOR
            )
        ) {

            return;

        }


        playClickSound();

    },
    true
);


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
