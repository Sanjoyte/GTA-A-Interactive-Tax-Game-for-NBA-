/* ============================================================
   #SCENE 4 - eTIN PORTAL
   ============================================================ */

const scene4 = document.getElementById("scene-4");
const scene4ClickLayer = document.getElementById("scene-4-click-layer");
const scene4BackgroundVideo = document.getElementById("scene-4-background");

const etinUserId = document.getElementById("etin-user-id");
const etinPassword = document.getElementById("etin-password");
const etinLoginButton = document.getElementById("etin-login-button");
const etinRegisterButton = document.getElementById("etin-register-button");
const etinAudioStatus = document.getElementById("etin-audio-status");
const etinProgress = document.getElementById("etin-progress");
const etinProgressValue = document.getElementById("etin-progress-value");

const etinAudio = new Audio("assets/audio/etin.mp3");
etinAudio.preload = "auto";

const ETIN_USER_ID_VALUE = "user1234";
const ETIN_PASSWORD_VALUE = "********";

let scene4Step = 0;
let scene4TypingSession = 0;
let isUserIdStarted = false;
let isPasswordStarted = false;
let isUserIdDone = false;
let isPasswordDone = false;
let registrationFields = [];


/* ============================================================
   SHARED HELPERS
   ============================================================ */

function setButtonEnabled(button, isEnabled) {
    button.disabled = !isEnabled;
    button.style.pointerEvents = isEnabled ? "auto" : "none";
    button.style.opacity = isEnabled ? "1" : "0.4";
}

function setEtinProgress() {
    etinProgress.style.setProperty("--progress-angle", "-180deg");
    etinProgress.setAttribute("aria-valuenow", "0");
    etinProgressValue.textContent = "0%";
}

function showEtinAudioStatus() {
    if (etinAudioStatus) {
        etinAudioStatus.classList.add("is-visible");
    }
}

function hideEtinAudioStatus() {
    if (etinAudioStatus) {
        etinAudioStatus.classList.remove("is-visible");
    }
}

function stopEtinAudio() {
    etinAudio.pause();
    etinAudio.currentTime = 0;
    hideEtinAudioStatus();
}

function showScene4Panel(panelClass) {
    scene4.classList.remove(
        "welcome-visible",
        "login-visible",
        "registration-visible",
        "certificate-visible",
        "waiting-for-click"
    );

    if (panelClass) {
        scene4.classList.add(panelClass);
    }
}

let etinKeySoundContext = null;

function getEtinKeySoundContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
        return null;
    }

    if (!etinKeySoundContext) {
        etinKeySoundContext = new AudioContextClass();
    }

    if (etinKeySoundContext.state === "suspended") {
        etinKeySoundContext.resume();
    }

    return etinKeySoundContext;
}

function playMechanicalKeySound() {
    const context = getEtinKeySoundContext();
    if (!context) {
        return;
    }

    const now = context.currentTime;

    const noiseDuration = 0.035;
    const bufferSize = Math.max(1, Math.floor(context.sampleRate * noiseDuration));
    const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
        noiseData[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }

    const noiseSource = context.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseFilter = context.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 2200;

    const noiseGain = context.createGain();
    noiseGain.gain.setValueAtTime(0.32, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + noiseDuration);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(context.destination);

    const thock = context.createOscillator();
    thock.type = "square";
    thock.frequency.setValueAtTime(130 + Math.random() * 45, now);

    const thockGain = context.createGain();
    thockGain.gain.setValueAtTime(0.16, now);
    thockGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    thock.connect(thockGain);
    thockGain.connect(context.destination);

    noiseSource.start(now);
    noiseSource.stop(now + noiseDuration);
    thock.start(now);
    thock.stop(now + 0.03);
}

function typeIntoInput(input, value, onComplete) {
    let characterIndex = 0;
    const typingSession = scene4TypingSession;
    input.value = "";

    function typeNextCharacter() {
        if (typingSession !== scene4TypingSession) {
            return;
        }

        input.value = value.slice(0, characterIndex + 1);
        playMechanicalKeySound();
        characterIndex += 1;

        if (characterIndex < value.length) {
            window.setTimeout(typeNextCharacter, 70);
            return;
        }

        onComplete();
    }

    typeNextCharacter();
}


/* ============================================================
   LOGIN
   ============================================================ */

function updateEtinLoginState() {
    if (isUserIdDone && isPasswordDone) {
        scene4Step = 2;
        setButtonEnabled(etinLoginButton, true);
        setEtinProgress();
    }
}

function resetEtinLogin() {
    isUserIdStarted = false;
    isPasswordStarted = false;
    isUserIdDone = false;
    isPasswordDone = false;
    etinUserId.value = "";
    etinPassword.value = "";
    setButtonEnabled(etinLoginButton, false);
}

function showEtinLogin() {
    scene4Step = 1;
    showScene4Panel("login-visible");
    setEtinProgress();
}

function showEtinWelcome() {
    scene4TypingSession += 1;
    resetEtinLogin();
    resetEtinRegistration();
    scene4Step = 0;
    showScene4Panel("welcome-visible");
    scene4.classList.add("waiting-for-click");
    setEtinProgress();
}

etinUserId.addEventListener("click", (event) => {
    event.stopPropagation();

    if (scene4Step !== 1 || isUserIdStarted || isUserIdDone) {
        return;
    }

    isUserIdStarted = true;
    typeIntoInput(etinUserId, ETIN_USER_ID_VALUE, () => {
        isUserIdDone = true;
        updateEtinLoginState();
    });
});

etinPassword.addEventListener("click", (event) => {
    event.stopPropagation();

    if (scene4Step !== 1 || isPasswordStarted || isPasswordDone) {
        return;
    }

    isPasswordStarted = true;
    typeIntoInput(etinPassword, ETIN_PASSWORD_VALUE, () => {
        isPasswordDone = true;
        updateEtinLoginState();
    });
});


/* ============================================================
   NEW eTIN REGISTRATION
   ============================================================ */

function makeRandomNid() {
    const baseDigits = String(Math.floor(1000000 + Math.random() * 9000000));
    const extraDigits = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    return baseDigits + extraDigits;
}

function resetEtinRegistration() {
    if (registrationFields.length === 0) {
        registrationFields = [
            { input: document.getElementById("etin-name"), value: "User", started: false, done: false },
            { input: document.getElementById("etin-phone"), value: "01*********", started: false, done: false },
            { input: document.getElementById("etin-address"), value: "123/A", started: false, done: false },
            { input: document.getElementById("etin-nid"), value: "", started: false, done: false },
            { input: document.getElementById("etin-email"), value: "****@*****.com", started: false, done: false },
            { input: document.getElementById("etin-profession"), value: "*******", started: false, done: false }
        ];
    }

    registrationFields.forEach((field) => {
        field.input.value = "";
        field.started = false;
        field.done = false;
    });

    registrationFields.find((field) => field.input.id === "etin-nid").value = makeRandomNid();

    setButtonEnabled(etinRegisterButton, false);
}

function updateEtinRegistrationState() {
    const completedCount = registrationFields.filter((field) => field.done).length;
    setEtinProgress();

    if (completedCount === registrationFields.length) {
        scene4Step = 4;
        setButtonEnabled(etinRegisterButton, true);
        setEtinProgress();
    }
}

function showEtinRegistration() {
    scene4Step = registrationFields.every((field) => field.done) ? 4 : 3;
    showScene4Panel("registration-visible");
    updateEtinRegistrationState();
}

function attachRegistrationFieldEvents() {
    registrationFields.forEach((field) => {
        field.input.addEventListener("click", (event) => {
            event.stopPropagation();

            if ((scene4Step !== 3 && scene4Step !== 4) || field.started || field.done) {
                return;
            }

            field.started = true;
            typeIntoInput(field.input, field.value, () => {
                field.done = true;
                updateEtinRegistrationState();
            });
        });
    });
}


/* ============================================================
   SCENE FLOW
   ============================================================ */

function resetEtinExperience() {
    scene4TypingSession += 1;
    resetEtinLogin();
    resetEtinRegistration();
    scene4Step = 0;
    showScene4Panel("welcome-visible");
    scene4.classList.add("waiting-for-click");
    setEtinProgress();
}

function openScene4() {
    console.log("Opening Scene 4 - eTIN Portal");

    const scene3 = document.getElementById("scene-3");
    if (scene3) {
        scene3.classList.remove("active");
    }

    scene4.classList.add("active");
    resetEtinExperience();

    scene4BackgroundVideo.currentTime = 0;
    scene4BackgroundVideo.play().catch((error) => {
        console.error("Could not play Scene 4 background video:", error);
    });

    etinAudio.onended = () => {
        console.log("eTIN audio finished.");
        hideEtinAudioStatus();
    };

    etinAudio.currentTime = 0;
    etinAudio.play()
        .then(() => {
            console.log("eTIN audio started.");
            showEtinAudioStatus();
        })
        .catch((error) => {
            console.error("Could not play eTIN audio:", error);
            hideEtinAudioStatus();
        });
}

scene4ClickLayer.addEventListener("click", () => {
    if (scene4Step === 0) {
        stopEtinAudio();
        showEtinLogin();
        return;
    }

    if (scene4Step === 5) {
        scene4Step = 6;
        openScene5();
    }
});

etinLoginButton.addEventListener("click", (event) => {
    event.stopPropagation();

    if (scene4Step !== 2 || etinLoginButton.disabled) {
        return;
    }

    console.log("eTIN login pressed. Showing New eTIN Registration.");
    showEtinRegistration();
});

etinRegisterButton.addEventListener("click", (event) => {
    event.stopPropagation();

    if (scene4Step !== 4 || etinRegisterButton.disabled) {
        return;
    }

    scene4Step = 5;
    showScene4Panel("certificate-visible");
    scene4.classList.add("waiting-for-click");
    setEtinProgress();
    console.log("Showing Print Your eTIN Certificate.");
});

/* ============================================================
   REBUILD THE FINAL STATE OF SCENE 4

   Used when Scene 5 hands control back, so the player lands
   on "PRINT YOUR eTIN CERTIFICATE" instead of the welcome text.
   ============================================================ */

function showEtinCertificate() {
    scene4TypingSession += 1;
    stopEtinAudio();

    /*
        The certificate is only reachable with a completed
        login and a completed registration, so both are
        refilled before it is shown.
    */

    etinUserId.value = ETIN_USER_ID_VALUE;
    etinPassword.value = ETIN_PASSWORD_VALUE;
    isUserIdStarted = true;
    isPasswordStarted = true;
    isUserIdDone = true;
    isPasswordDone = true;
    setButtonEnabled(etinLoginButton, true);

    registrationFields.forEach((field) => {
        field.input.value = field.value;
        field.started = true;
        field.done = true;
    });

    setButtonEnabled(etinRegisterButton, true);

    scene4Step = 5;
    showScene4Panel("certificate-visible");
    scene4.classList.add("waiting-for-click");
    setEtinProgress();
}


/* ============================================================
   SHARED BACK BUTTON

   Scene 4 owns the green palette.

   The welcome text is the first step, so from there the
   button hands control back to the end of Scene 3.
   ============================================================ */

registerSceneBackButton("scene-4", {

    theme: "etin",

    previousScene: 3,

    resumeAtEnd: showEtinCertificate,

    goBack: () => {
        if (scene4Step === 5) {
            showEtinRegistration();
            return true;
        }

        if (scene4Step === 3 || scene4Step === 4) {
            showEtinLogin();
            if (isUserIdDone && isPasswordDone) {
                scene4Step = 2;
                setEtinProgress();
            }
            return true;
        }

        if (scene4Step === 1 || scene4Step === 2) {
            showEtinWelcome();
            return true;
        }

        /*
            Welcome text — hand back to Scene 3.
        */

        return false;
    }

});

function openScene5() {
    console.log("Opening Scene 5");
    scene4.classList.remove("active");
    scene4BackgroundVideo.pause();
    stopEtinAudio();

    const scene5 = document.getElementById("scene-5");
    if (scene5) {
        scene5.classList.add("active");
    }
}

resetEtinRegistration();
attachRegistrationFieldEvents();
