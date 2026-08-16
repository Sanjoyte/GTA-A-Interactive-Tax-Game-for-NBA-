/* ============================================================
   SCENE 10 — eTDS
   ============================================================ */

const scene10 = document.getElementById("scene-10");
const scene10BackgroundVideo = document.getElementById("scene-10-background");
const scene10ClickLayer = document.getElementById("scene-10-click-layer");
const scene10WelcomeClickLayer = document.getElementById("scene-10-welcome-click-layer");
const etdsQuestionPanel = document.getElementById("etds-question-panel");
const etdsYes = document.getElementById("etds-yes");
const etdsNo = document.getElementById("etds-no");
const etdsTin = document.getElementById("etds-tin");
const etdsPassword = document.getElementById("etds-password");
const etdsLoginButton = document.getElementById("etds-login-button");
const etdsMessageText = document.getElementById("etds-message-text");
const etdsMessageHint = document.getElementById("etds-message-hint");
const etdsAudioStatus = document.getElementById("etds-audio-status");

const etdsAudio = new Audio("assets/audio/etds.mp3");
etdsAudio.preload = "auto";

let scene10Step = "welcome";
let etdsTinDone = false;
let etdsPasswordDone = false;
let etdsTypingSession = 0;


function createEtdsTinNumber() {
    // let tin = "";

    // for (let index = 0; index < 12; index += 1) {
    //     const minimumDigit = index === 0 ? 1 : 0;
    //     tin += Math.floor(Math.random() * (10 - minimumDigit)) + minimumDigit;
    // }

    return `60056****529`;
}


function typeEtdsValue(input, value, onComplete) {
    const typingSession = etdsTypingSession;
    let characterIndex = 0;
    input.value = "";

    function typeNextCharacter() {
        if (typingSession !== etdsTypingSession) {
            return;
        }

        input.value = value.slice(0, characterIndex + 1);
        characterIndex += 1;

        if (characterIndex < value.length) {
            window.setTimeout(typeNextCharacter, 70);
            return;
        }

        onComplete();
        updateEtdsLoginState();
    }

    typeNextCharacter();
}


function updateEtdsLoginState() {
    const loginReady = etdsTinDone && etdsPasswordDone;
    etdsLoginButton.disabled = !loginReady;
}


function showEtdsQuestion() {
    etdsTypingSession += 1;
    scene10Step = "question";
    scene10.classList.remove("welcome-visible", "login-visible", "message-visible", "continue-ready");
    etdsMessageText.textContent = "";
    etdsMessageHint.textContent = "";
}


function showEtdsWelcome() {
    etdsTypingSession += 1;
    scene10Step = "welcome";
    scene10.classList.remove("login-visible", "message-visible", "continue-ready");
    scene10.classList.add("welcome-visible");
    etdsMessageText.textContent = "";
    etdsMessageHint.textContent = "";
}


function showEtdsLogin() {
    scene10Step = "login";
    scene10.classList.remove("welcome-visible", "message-visible", "continue-ready");
    scene10.classList.add("login-visible");
}


function resetEtdsLogin() {
    etdsTypingSession += 1;
    etdsTin.value = "";
    etdsPassword.value = "";
    etdsTinDone = false;
    etdsPasswordDone = false;
    updateEtdsLoginState();
}


function showEtdsMessage(message, hint, step, canContinue) {
    scene10Step = step;
    scene10.classList.remove("welcome-visible", "login-visible");
    scene10.classList.add("message-visible");
    scene10.classList.toggle("continue-ready", canContinue);
    etdsMessageText.textContent = message;
    etdsMessageHint.textContent = hint;
}


function showEtdsAudioStatus() {
    etdsAudioStatus.classList.add("is-visible");
}


function hideEtdsAudioStatus() {
    etdsAudioStatus.classList.remove("is-visible");
}


function stopEtdsAudio() {
    etdsAudio.pause();
    etdsAudio.currentTime = 0;
    hideEtdsAudioStatus();
}


function openScene10() {
    document.querySelectorAll(".scene").forEach((scene) => {
        scene.classList.remove("active");
    });

    scene10.classList.add("active");
    gameState.currentScene = "scene-10";

    etdsNo.disabled = false;
    resetEtdsLogin();
    showEtdsWelcome();
    hideEtdsAudioStatus();

    scene10BackgroundVideo.currentTime = 0;
    scene10BackgroundVideo.play().catch((error) => {
        console.log("Could not play Scene 10 background video:", error);
    });

    etdsAudio.currentTime = 0;
    etdsAudio.play().then(() => {
        showEtdsAudioStatus();
    }).catch((error) => {
        console.log("Could not play eTDS audio:", error);
        hideEtdsAudioStatus();
    });
}


etdsAudio.addEventListener("ended", hideEtdsAudioStatus);


scene10WelcomeClickLayer.addEventListener("click", () => {
    if (scene10Step !== "welcome") {
        return;
    }

    stopEtdsAudio();
    showEtdsQuestion();
});


etdsYes.addEventListener("click", (event) => {
    event.stopPropagation();

    if (scene10Step !== "question") {
        return;
    }

    showEtdsLogin();
});


etdsNo.addEventListener("click", (event) => {
    event.stopPropagation();

    if (scene10Step !== "question") {
        return;
    }

    etdsNo.disabled = true;
    showEtdsMessage("WRONG MOVE!", "USE BACK TO TRY AGAIN", "wrong", false);
});


etdsTin.addEventListener("click", (event) => {
    event.stopPropagation();

    if (scene10Step !== "login" || etdsTinDone || etdsTin.value) {
        return;
    }

    typeEtdsValue(etdsTin, createEtdsTinNumber(), () => {
        etdsTinDone = true;
    });
});


etdsPassword.addEventListener("click", (event) => {
    event.stopPropagation();

    if (scene10Step !== "login" || etdsPasswordDone || etdsPassword.value) {
        return;
    }

    typeEtdsValue(etdsPassword, "password", () => {
        etdsPasswordDone = true;
    });
});


etdsLoginButton.addEventListener("click", (event) => {
    event.stopPropagation();

    if (scene10Step !== "login" || etdsLoginButton.disabled) {
        return;
    }

    scene10Step = "complete";
    openScene11();
});


/* ============================================================
   REBUILD THE FINAL STATE OF SCENE 10

   Used when Scene 11 hands control back, so the player lands
   on the filled-in login instead of the welcome text.
   ============================================================ */

function showEtdsHandover() {
    stopEtdsAudio();
    showEtdsLogin();

    etdsTypingSession += 1;
    etdsTin.value = createEtdsTinNumber();
    etdsPassword.value = "password";
    etdsTinDone = true;
    etdsPasswordDone = true;

    updateEtdsLoginState();
}


/* ============================================================
   SHARED BACK BUTTON

   Scene 10 owns the orange palette.

   The button is hidden on the "WELCOME TO eTDS SYSTEM" text,
   and previousScene is null, so it can never take the player
   back to Scene 9.
   ============================================================ */

registerSceneBackButton("scene-10", {

    theme: "etds",

    previousScene: null,

    resumeAtEnd: showEtdsHandover,

    isVisible: () => scene10Step !== "welcome",

    goBack: () => {
        if (scene10Step === "login") {
            resetEtdsLogin();
            showEtdsQuestion();
            return true;
        }

        if (scene10Step === "wrong") {
            showEtdsQuestion();
            return true;
        }

        if (scene10Step === "question") {
            showEtdsWelcome();
        }

        return true;
    }

});
