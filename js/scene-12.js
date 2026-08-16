/* ============================================================
   SCENE 12 — eTDS VERIFICATION COMPLETE
   ============================================================ */

const scene12 = document.getElementById("scene-12");
const scene12BackgroundVideo = document.getElementById("scene-12-background");
const scene12ClickLayer = document.getElementById("scene-12-click-layer");
const scene12MessageHint = document.getElementById("scene-12-message-hint");

let scene12ContinuePressed = false;


function openScene12() {
    console.log("Opening Scene 12 — eTDS Verification Complete");

    if (typeof scene11Video !== "undefined") {
        scene11Video.pause();
    }

    document.querySelectorAll(".scene").forEach((scene) => {
        scene.classList.remove("active");
    });

    scene12.classList.add("active");
    gameState.currentScene = "scene-12";

    scene12ContinuePressed = false;
    scene12MessageHint.textContent = "TAP TO CONTINUE";
    scene12ClickLayer.style.display = "block";

    scene12BackgroundVideo.currentTime = 0;

    const playPromise = scene12BackgroundVideo.play();

    if (playPromise !== undefined) {
        playPromise.catch((error) => {
            console.log("Scene 12 background video could not autoplay:", error);
        });
    }
}


scene12ClickLayer.addEventListener("click", () => {
    if (scene12ContinuePressed) {
        return;
    }

    scene12ContinuePressed = true;
    scene12ClickLayer.style.display = "none";
    scene12MessageHint.textContent = "";

    openScene13();
});


/* ============================================================
   SHARED BACK BUTTON

   Scene 12 borrows the Scene 10 orange palette.

   The message can be rewound once, after which the button
   falls back to Scene 11.
   ============================================================ */

registerSceneBackButton("scene-12", {

    theme: "etds",

    previousScene: 11,

    goBack: () => {
        if (!scene12ContinuePressed) {
            return false;
        }

        scene12ContinuePressed = false;
        scene12MessageHint.textContent = "TAP TO CONTINUE";
        scene12ClickLayer.style.display = "block";

        return true;
    }

});
