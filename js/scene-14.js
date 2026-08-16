/* ============================================================
   SCENE 14 — eAUDIT VIDEO
   ============================================================ */

const scene14 = document.getElementById("scene-14");
const scene14Video = document.getElementById("scene-14-video");

let scene14TransitionStarted = false;


function completeScene14() {
    if (
        scene14TransitionStarted ||
        !scene14.classList.contains("active")
    ) {
        return;
    }

    scene14TransitionStarted = true;
    scene14Video.pause();
    openScene15();
}


function openScene14() {
    console.log("Opening Scene 14 — eAudit Video");

    if (typeof scene13BackgroundVideo !== "undefined") {
        scene13BackgroundVideo.pause();
    }

    if (typeof stopEauditCaseAudio === "function") {
        stopEauditCaseAudio();
    }

    document.querySelectorAll(".scene").forEach((scene) => {
        scene.classList.remove("active");
    });

    scene14.classList.add("active");
    gameState.currentScene = "scene-14";

    scene14TransitionStarted = false;
    scene14Video.currentTime = 0;

    const playPromise = scene14Video.play();

    if (playPromise !== undefined) {
        playPromise.catch((error) => {
            console.log("Scene 14 video could not autoplay:", error);
        });
    }
}


scene14Video.addEventListener("ended", () => {
    console.log("Scene 14 video finished.");
    completeScene14();
});


scene14.addEventListener("click", () => {
    if (
        scene14Video.paused &&
        !scene14Video.ended &&
        scene14.classList.contains("active")
    ) {
        const retryPromise = scene14Video.play();

        if (retryPromise !== undefined) {
            retryPromise.catch((error) => {
                console.log("Scene 14 video could not play after click:", error);
            });
        }
    }
});
