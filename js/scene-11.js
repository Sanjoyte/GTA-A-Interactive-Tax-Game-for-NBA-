/* ============================================================
   SCENE 11 — eTDS RESULT VIDEO
   ============================================================ */

const scene11 = document.getElementById("scene-11");
const scene11Video = document.getElementById("scene-11-video");

let scene11TransitionStarted = false;


function completeScene11() {
    if (
        scene11TransitionStarted ||
        !scene11.classList.contains("active")
    ) {
        return;
    }

    scene11TransitionStarted = true;
    scene11Video.pause();
    openScene12();
}


function openScene11() {
    console.log("Opening Scene 11 — eTDS Result Video");

    if (typeof scene10BackgroundVideo !== "undefined") {
        scene10BackgroundVideo.pause();
    }

    if (typeof etdsAudio !== "undefined") {
        etdsAudio.pause();
    }

    if (typeof hideEtdsAudioStatus === "function") {
        hideEtdsAudioStatus();
    }

    document.querySelectorAll(".scene").forEach((scene) => {
        scene.classList.remove("active");
    });

    scene11.classList.add("active");
    gameState.currentScene = "scene-11";

    scene11TransitionStarted = false;

    scene11Video.currentTime = 0;

    const playPromise = scene11Video.play();

    if (playPromise !== undefined) {
        playPromise.catch((error) => {
            console.log("Scene 11 video could not autoplay:", error);
        });
    }
}


scene11Video.addEventListener("ended", () => {
    console.log("Scene 11 video finished.");
    completeScene11();
});


/* ============================================================
   SHARED BACK BUTTON

   Scene 11 borrows the Scene 10 orange palette and always
   returns to Scene 10.

   No resumeAtEnd is registered, so arriving here from
   Scene 12 replays the video from the beginning.
   ============================================================ */

registerSceneBackButton("scene-11", {

    theme: "etds",

    previousScene: 10,

    goBack: () => false

});


scene11.addEventListener("click", () => {
    if (
        scene11Video.paused &&
        !scene11Video.ended &&
        scene11.classList.contains("active")
    ) {
        const retryPromise = scene11Video.play();

        if (retryPromise !== undefined) {
            retryPromise.catch((error) => {
                console.log("Scene 11 video could not play after click:", error);
            });
        }
    }
});
