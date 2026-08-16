/* ============================================================
   SCENE 15 — FINAL VIDEO
   ============================================================ */

const scene15 = document.getElementById("scene-15");
const scene15Video = document.getElementById("scene-15-video");

// const SCENE15_PAUSE_TIME = 21.3;

let scene15PauseReached = false;
let scene15PauseMonitor = null;


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
    window.cancelAnimationFrame(scene15PauseMonitor);
    scene15PauseMonitor = null;
    scene15Video.currentTime = 0;

    const playPromise = scene15Video.play();

    if (playPromise !== undefined) {
        playPromise.catch((error) => {
            console.log("Scene 15 video could not autoplay:", error);
        });
    }

    monitorScene15Pause();
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

    if (typeof stopJourneyLoopAudio === "function") {
        stopJourneyLoopAudio();
    }
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
