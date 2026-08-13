/* ============================================================
   SCENE 11 — eTDS RESULT VIDEO
   ============================================================ */

const scene11 = document.getElementById("scene-11");
const scene11Video = document.getElementById("scene-11-video");
const scene11Next = document.getElementById("scene-11-next");

let scene11VideoFinished = false;
let scene11NextPressed = false;


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

    scene11VideoFinished = false;
    scene11NextPressed = false;
    scene11Next.disabled = true;
    scene11Next.classList.add("disabled");

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

    scene11VideoFinished = true;
    scene11Next.disabled = false;
    scene11Next.classList.remove("disabled");
});


scene11Next.addEventListener("click", () => {
    if (!scene11VideoFinished || scene11NextPressed) {
        return;
    }

    scene11NextPressed = true;
    scene11Next.disabled = true;
    scene11Next.classList.add("disabled");

    console.log("Scene 11 NEXT clicked.");

    openScene12();
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
