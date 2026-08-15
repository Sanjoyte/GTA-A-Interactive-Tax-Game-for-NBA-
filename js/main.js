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
   GLOBAL LOOPING AUDIO
   ============================================================ */

const scene0LoopAudio =
    new Audio(
        "assets/audio/welcome.mp3"
    );


const journeyLoopAudio =
    new Audio(
        "assets/audio/background.mp3"
    );


scene0LoopAudio.loop = true;
scene0LoopAudio.preload = "auto";

journeyLoopAudio.loop = true;
journeyLoopAudio.preload = "auto";


let shouldPlayScene0Loop = false;
let shouldPlayJourneyLoop = false;


function playLoopingAudio(audio, label) {

    audio.play().catch((error) => {

        console.log(
            `${label} loop could not autoplay yet:`,
            error
        );

    });

}


function startScene0LoopAudio() {

    shouldPlayScene0Loop = true;
    shouldPlayJourneyLoop = false;

    journeyLoopAudio.pause();

    if (scene0LoopAudio.paused) {

        playLoopingAudio(
            scene0LoopAudio,
            "Scene 0"
        );

    }

}


function stopScene0LoopAudio() {

    shouldPlayScene0Loop = false;
    scene0LoopAudio.pause();
    scene0LoopAudio.currentTime = 0;

}


function startJourneyLoopAudio() {

    shouldPlayJourneyLoop = true;
    shouldPlayScene0Loop = false;

    stopScene0LoopAudio();

    if (journeyLoopAudio.paused) {

        playLoopingAudio(
            journeyLoopAudio,
            "Scene 2-15"
        );

    }

}


function stopJourneyLoopAudio() {

    shouldPlayJourneyLoop = false;
    journeyLoopAudio.pause();
    journeyLoopAudio.currentTime = 0;

}


function resumeBlockedLoopAudio() {

    if (
        shouldPlayScene0Loop &&
        scene0LoopAudio.paused
    ) {

        playLoopingAudio(
            scene0LoopAudio,
            "Scene 0"
        );

    }

    if (
        shouldPlayJourneyLoop &&
        journeyLoopAudio.paused
    ) {

        playLoopingAudio(
            journeyLoopAudio,
            "Scene 2-15"
        );

    }

}


document.addEventListener(
    "pointerdown",
    resumeBlockedLoopAudio
);


startScene0LoopAudio();


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
