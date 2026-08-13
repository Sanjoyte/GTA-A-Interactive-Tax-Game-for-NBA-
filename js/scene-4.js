/* ============================================================
   #SCENE 4 - eTIN PORTAL
   ============================================================ */


/* ============================================================
   ELEMENTS
   ============================================================ */

const scene4 =
document.getElementById(
    "scene-4"
);


const scene4ClickLayer =
document.getElementById(
    "scene-4-click-layer"
);


const scene4BackgroundVideo =
document.getElementById(
    "scene-4-background"
);


const scene4BackButton =
document.getElementById(
    "scene-4-back"
);


const etinUserId =
document.getElementById(
    "etin-user-id"
);


const etinPassword =
document.getElementById(
    "etin-password"
);


const etinLoginButton =
document.getElementById(
    "etin-login-button"
);


const etinLoginHint =
document.getElementById(
    "etin-login-hint"
);


const etinAudioStatus =
document.getElementById(
    "etin-audio-status"
);


/* ============================================================
   AUDIO
   ============================================================ */

const etinAudio =
new Audio(
    "assets/audio/etin.mp3"
);

etinAudio.preload = "auto";


/* ============================================================
   SCENE 4 STATE
   ============================================================ */

const ETIN_USER_ID_VALUE =
    "user1234";


const ETIN_PASSWORD_VALUE =
    "********";


let scene4Step = 1;

let isUserIdStarted = false;
let isPasswordStarted = false;
let isUserIdDone = false;
let isPasswordDone = false;
let scene4TypingSession = 0;


/* ============================================================
   HELPERS
   ============================================================ */

function setEtinLoginEnabled(isEnabled) {

    etinLoginButton.disabled =
        !isEnabled;

    etinLoginButton.style.pointerEvents =
        isEnabled ? "auto" : "none";

    etinLoginButton.style.opacity =
        isEnabled ? "1" : "0.4";

    etinLoginHint.textContent =
        isEnabled
            ? "READY TO LOGIN"
            : "CLICK USER ID AND PASSWORD TO FILL";

}


function updateEtinLoginState() {

    if (
        isUserIdDone &&
        isPasswordDone
    ) {

        scene4Step = 2;

        setEtinLoginEnabled(
            true
        );

    }

}


function resetEtinForm() {

    scene4TypingSession += 1;
    scene4Step = 1;
    isUserIdStarted = false;
    isPasswordStarted = false;
    isUserIdDone = false;
    isPasswordDone = false;

    scene4.classList.remove(
        "waiting-for-click"
    );

    scene4.classList.remove(
        "certificate-visible"
    );

    etinUserId.value = "";
    etinPassword.value = "";

    setEtinLoginEnabled(
        false
    );

}


function showEtinAudioStatus() {

    if (!etinAudioStatus) {

        return;

    }

    etinAudioStatus.classList.add(
        "is-visible"
    );

}


function hideEtinAudioStatus() {

    if (!etinAudioStatus) {

        return;

    }

    etinAudioStatus.classList.remove(
        "is-visible"
    );

}


function typeIntoInput(
    input,
    value,
    onComplete
) {

    let characterIndex = 0;
    const typingSession =
        scene4TypingSession;

    input.value = "";

    const typeNextCharacter =
    function () {

        if (
            typingSession !== scene4TypingSession
        ) {

            return;

        }

        input.value =
            value.slice(
                0,
                characterIndex + 1
            );

        characterIndex += 1;

        if (
            characterIndex < value.length
        ) {

            window.setTimeout(
                typeNextCharacter,
                70
            );

            return;

        }

        onComplete();

        updateEtinLoginState();

    };

    typeNextCharacter();

}


/* ============================================================
   OPEN SCENE 4
   ============================================================ */

function openScene4() {

    console.log(
        "Opening Scene 4 - eTIN Portal"
    );


    const scene3 =
    document.getElementById(
        "scene-3"
    );


    if (scene3) {

        scene3.classList.remove(
            "active"
        );

    }


    scene4.classList.add(
        "active"
    );


    resetEtinForm();

    hideEtinAudioStatus();


    scene4BackgroundVideo.currentTime = 0;

    scene4BackgroundVideo.play()
        .catch((error) => {

            console.error(
                "Could not play Scene 4 background video:",
                error
            );

        });


    etinAudio.onended =
    function () {

        console.log(
            "eTIN audio finished."
        );

        hideEtinAudioStatus();

    };

    etinAudio.currentTime = 0;

    etinAudio.play()
        .then(() => {

            console.log(
                "eTIN audio started."
            );

            showEtinAudioStatus();

        })
        .catch((error) => {

            console.error(
                "Could not play eTIN audio:",
                error
            );

            hideEtinAudioStatus();

        });

}


/* ============================================================
   TYPEWRITER INPUTS
   ============================================================ */

etinUserId.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        if (
            isUserIdStarted ||
            isUserIdDone
        ) {

            return;

        }

        isUserIdStarted = true;

        typeIntoInput(
            etinUserId,
            ETIN_USER_ID_VALUE,
            () => {

                isUserIdDone = true;

            }
        );

    }
);


/* ============================================================
   INTERNAL BACK BUTTON
   ============================================================ */

scene4BackButton.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        if (
            scene4Step === 3
        ) {

            scene4Step = 2;

            scene4.classList.remove(
                "waiting-for-click"
            );

            scene4.classList.remove(
                "certificate-visible"
            );

            setEtinLoginEnabled(
                true
            );

            return;

        }

        if (
            scene4Step === 2 ||
            isUserIdStarted ||
            isPasswordStarted
        ) {

            resetEtinForm();

        }

    }
);


etinPassword.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        if (
            isPasswordStarted ||
            isPasswordDone
        ) {

            return;

        }

        isPasswordStarted = true;

        typeIntoInput(
            etinPassword,
            ETIN_PASSWORD_VALUE,
            () => {

                isPasswordDone = true;

            }
        );

    }
);


/* ============================================================
   CLICK AFTER CERTIFICATE
   ============================================================ */

scene4ClickLayer.addEventListener(
    "click",
    () => {

        if (
            scene4Step !== 3
        ) {

            return;

        }

        scene4Step = 4;

        openScene5();

    }
);


/* ============================================================
   LOGIN BUTTON
   ============================================================ */

etinLoginButton.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        if (
            scene4Step !== 2 ||
            etinLoginButton.disabled
        ) {

            return;

        }


        console.log(
            "eTIN login pressed."
        );


        scene4Step = 3;

        scene4.classList.add(
            "certificate-visible"
        );

        scene4.classList.add(
            "waiting-for-click"
        );


        console.log(
            "Showing Print Your eTIN Certificate."
        );

    }
);


/* ============================================================
   OPEN SCENE 5
   ============================================================ */

function openScene5() {

    console.log(
        "Opening Scene 5"
    );


    scene4.classList.remove(
        "active"
    );

    scene4BackgroundVideo.pause();

    hideEtinAudioStatus();


    const scene5 =
    document.getElementById(
        "scene-5"
    );


    if (scene5) {

        scene5.classList.add(
            "active"
        );

    }

}
