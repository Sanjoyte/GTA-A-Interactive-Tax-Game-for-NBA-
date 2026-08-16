/* ============================================================
   SCENE 15 — FINAL VIDEO
   ============================================================ */

const scene15 = document.getElementById("scene-15");
const scene15Video = document.getElementById("scene-15-video");

// const SCENE15_PAUSE_TIME = 21.3;

/*
    The mid video pause is switched off.

    Infinity keeps the checks below valid while making sure
    the pause point is never reached.
*/

const SCENE15_PAUSE_TIME = Infinity;


/*
    The captain clip starts exactly this far into the final
    video.
*/

const SCENE15_CAPTAIN_TIME = 5.3;


let scene15PauseReached = false;
let scene15PauseMonitor = null;
let scene15TransitionStarted = false;


/* ============================================================
   CAPTAIN AUDIO

   Registered as a voice over clip by main.js, so the
   background track pauses while it plays and continues as
   soon as it is finished or stopped.
   ============================================================ */

const scene15CaptainAudio =
    new Audio("assets/audio/captain.mp3");

scene15CaptainAudio.preload = "auto";


let scene15CaptainStarted = false;
let scene15CaptainMonitor = null;


function playScene15CaptainAudio() {

    scene15CaptainStarted = true;

    window.cancelAnimationFrame(scene15CaptainMonitor);
    scene15CaptainMonitor = null;

    scene15CaptainAudio.currentTime = 0;

    scene15CaptainAudio.play().catch((error) => {
        console.log("Could not play captain audio:", error);
    });

}


function stopScene15CaptainAudio() {

    window.cancelAnimationFrame(scene15CaptainMonitor);
    scene15CaptainMonitor = null;

    scene15CaptainStarted = false;

    scene15CaptainAudio.pause();
    scene15CaptainAudio.currentTime = 0;

}


/*
    Watching the video clock instead of the wall clock keeps
    the clip on its mark even if the video is paused or slow
    to start.
*/

function monitorScene15Captain() {

    if (
        scene15CaptainStarted ||
        !scene15.classList.contains("active")
    ) {
        scene15CaptainMonitor = null;
        return;
    }

    if (scene15Video.currentTime >= SCENE15_CAPTAIN_TIME) {
        playScene15CaptainAudio();
        return;
    }

    scene15CaptainMonitor = window.requestAnimationFrame(
        monitorScene15Captain
    );

}


function monitorScene15Pause() {
    if (
        scene15PauseReached ||
        !scene15.classList.contains("active")
    ) {
        scene15PauseMonitor = null;
        return;
    }

    if (scene15Video.currentTime >= SCENE15_PAUSE_TIME) {
        pauseScene15ForResume();
        return;
    }

    scene15PauseMonitor = window.requestAnimationFrame(
        monitorScene15Pause
    );
}


function openScene15() {
    console.log("Opening Scene 15 — Final Video");

    document.querySelectorAll(".scene").forEach((scene) => {
        scene.classList.remove("active");
    });

    scene15.classList.remove("awaiting-resume", "video-finished");
    scene15.classList.add("active");
    gameState.currentScene = "scene-15";

    scene15PauseReached = false;
    scene15TransitionStarted = false;
    window.cancelAnimationFrame(scene15PauseMonitor);
    scene15PauseMonitor = null;
    scene15Video.currentTime = 0;

    stopScene15CaptainAudio();

    const playPromise = scene15Video.play();

    if (playPromise !== undefined) {
        playPromise.catch((error) => {
            console.log("Scene 15 video could not autoplay:", error);
        });
    }

    monitorScene15Pause();
    monitorScene15Captain();
}


function pauseScene15ForResume() {
    if (
        scene15PauseReached ||
        !scene15.classList.contains("active")
    ) {
        return;
    }

    scene15PauseReached = true;
    window.cancelAnimationFrame(scene15PauseMonitor);
    scene15PauseMonitor = null;
    scene15Video.pause();
    scene15.classList.add("awaiting-resume");
}


scene15Video.addEventListener("timeupdate", () => {
    if (
        !scene15PauseReached &&
        scene15Video.currentTime >= SCENE15_PAUSE_TIME
    ) {
        pauseScene15ForResume();
    }
});


scene15Video.addEventListener("ended", () => {
    console.log("Scene 15 video finished.");
    window.cancelAnimationFrame(scene15PauseMonitor);
    scene15PauseMonitor = null;
    scene15.classList.remove("awaiting-resume");
    scene15.classList.add("video-finished");

    stopScene15CaptainAudio();

    if (
        scene15TransitionStarted ||
        !scene15.classList.contains("active")
    ) {
        return;
    }

    scene15TransitionStarted = true;
    openScene0();
});


scene15.addEventListener("click", () => {
    if (
        !scene15.classList.contains("active") ||
        scene15Video.ended
    ) {
        return;
    }

    if (
        scene15PauseReached &&
        scene15Video.paused &&
        scene15.classList.contains("awaiting-resume")
    ) {
        scene15.classList.remove("awaiting-resume");

        const resumePromise = scene15Video.play();

        if (resumePromise !== undefined) {
            resumePromise.catch((error) => {
                console.log("Scene 15 video could not resume:", error);
                scene15.classList.add("awaiting-resume");
            });
        }

        return;
    }

    if (
        !scene15PauseReached &&
        scene15Video.paused &&
        !scene15Video.ended
    ) {
        const retryPromise = scene15Video.play();

        if (retryPromise !== undefined) {
            retryPromise.catch((error) => {
                console.log("Scene 15 video could not play after click:", error);
            });
        }
    }
});
