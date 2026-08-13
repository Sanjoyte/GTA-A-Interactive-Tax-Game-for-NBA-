/* ============================================================
   SCENE 7 — eRETURN DASHBOARD
   ============================================================ */


/* ============================================================
   ELEMENTS
   ============================================================ */

const scene7 =
    document.getElementById(
        "scene-7"
    );


const ereturnLoginPanel =
    document.getElementById(
        "ereturn-login-panel"
    );


const ereturnTin =
    document.getElementById(
        "ereturn-tin"
    );


const ereturnPassword =
    document.getElementById(
        "ereturn-password"
    );


const ereturnLoginButton =
    document.getElementById(
        "ereturn-login-button"
    );


const ereturnLoginHint =
    document.getElementById(
        "ereturn-login-hint"
    );


const ereturnAudioStatus =
    document.getElementById(
        "ereturn-audio-status"
    );


const scene7BackgroundVideo =
    document.getElementById(
        "scene-7-background"
    );


const scene7BackButton =
    document.getElementById(
        "scene-7-back"
    );


const ereturnDashboard =
    document.getElementById(
        "ereturn-dashboard"
    );


const ereturnDocumentCards =
    document.querySelectorAll(
        ".ereturn-document-card"
    );


const ereturnCalculationLines =
    document.getElementById(
        "ereturn-calculation-lines"
    );


const ereturnActionButton =
    document.getElementById(
        "ereturn-action-button"
    );


/* ============================================================
   AUDIO
   ============================================================ */

const ereturnAudio =
    new Audio(
        "assets/audio/ereturn.mp3"
    );


ereturnAudio.preload =
    "auto";


/* ============================================================
   STATE
   ============================================================ */

const selectedReturnDocuments =
    new Set();


const taxCalculationLines = [

    "Tax Payable = 4,42,500 BDT",

    "Rebate = 50,000 BDT",

    "Tax credit = 10,000 BDT",

    "Final tax liability = 3,82,500 BDT"

];


let scene7Step =
    "login";


let calculationRevealTimers =
    [];


let ereturnTinFilled = false;


let ereturnPasswordFilled = false;


/* ============================================================
   OPEN SCENE 7
   ============================================================ */

function openScene7() {

    console.log(
        "Opening Scene 7 — eReturn"
    );


    document
        .querySelectorAll(".scene")
        .forEach(
            (scene) => {

                scene.classList.remove(
                    "active"
                );

            }
        );


    scene7.classList.add(
        "active"
    );


    gameState.currentScene =
        "scene-7";


    resetScene7();


    scene7BackgroundVideo.currentTime = 0;


    scene7BackgroundVideo.play()
        .catch(
            (error) => {

                console.log(
                    "Could not play Scene 7 background video:",
                    error
                );

            }
        );


    ereturnAudio.currentTime =
        0;


    ereturnAudio.play()
        .then(
            () => {

                console.log(
                    "eReturn audio started."
                );


                showEreturnAudioStatus();

            }
        )
        .catch(
            (error) => {

                console.log(
                    "Could not play eReturn audio:",
                    error
                );

                hideEreturnAudioStatus();

            }
        );

}

/* ============================================================
   RESET SCENE 7
   ============================================================ */

function resetScene7() {

    scene7Step =
        "login";


    hideEreturnAudioStatus();


    calculationRevealTimers.forEach(
        (timer) => {

            clearTimeout(
                timer
            );

        }
    );


    calculationRevealTimers =
        [];


    selectedReturnDocuments.clear();


    scene7.classList.remove(
        "login-ready",
        "dashboard-visible",
        "documents-ready",
        "calculation-visible",
        "submit-ready"
    );


    ereturnLoginPanel.style.display =
        "";

    ereturnDashboard.style.display =
        "";


    ereturnTin.value =
        "";

    ereturnPassword.value =
        "";


    ereturnTinFilled = false;

    ereturnPasswordFilled = false;

    ereturnLoginButton.disabled =
        true;


    ereturnLoginHint.textContent =
        "CLICK TIN NUMBER AND PASSWORD TO FILL";


    ereturnDocumentCards.forEach(
        (card) => {

            card.classList.remove(
                "selected"
            );

        }
    );


    ereturnCalculationLines.textContent =
        "";


    ereturnActionButton.textContent =
        "Calculate Return";

}


/* ============================================================
   AUDIO FINISHED
   ============================================================ */

ereturnAudio.addEventListener(
    "ended",
    () => {

        console.log(
            "eReturn audio finished."
        );

        hideEreturnAudioStatus();

    }
);


/* ============================================================
   LOGIN HELPERS
   ============================================================ */

function showEreturnAudioStatus() {

    ereturnAudioStatus.classList.add(
        "is-visible"
    );

}


function hideEreturnAudioStatus() {

    ereturnAudioStatus.classList.remove(
        "is-visible"
    );

}


function createRandomTinNumber() {

    let tinNumber = "";

    for (
        let digitIndex = 0;
        digitIndex < 14;
        digitIndex += 1
    ) {

        const minimumDigit =
            digitIndex === 0 ? 1 : 0;

        tinNumber += Math.floor(
            Math.random() * (10 - minimumDigit)
        ) + minimumDigit;

    }

    return tinNumber;

}


function updateEreturnLoginState() {

    const isReady =
        ereturnTinFilled &&
        ereturnPasswordFilled;


    ereturnLoginButton.disabled =
        !isReady;


    ereturnLoginHint.textContent =
        isReady
            ? "READY TO LOGIN"
            : "CLICK TIN NUMBER AND PASSWORD TO FILL";

}


function showEreturnLogin() {

    scene7Step =
        "login";


    scene7.classList.remove(
        "dashboard-visible",
        "documents-ready",
        "calculation-visible",
        "submit-ready"
    );


    ereturnLoginPanel.style.display =
        "";

    ereturnDashboard.style.display =
        "";

}


/* ============================================================
   CLICK-TO-FILL LOGIN FIELDS
   ============================================================ */

ereturnTin.addEventListener(
    "click",
    () => {

        if (
            scene7Step !== "login" ||
            ereturnTinFilled
        ) {

            return;

        }


        ereturnTin.value =
            createRandomTinNumber();

        ereturnTinFilled = true;

        updateEreturnLoginState();

    }
);


ereturnPassword.addEventListener(
    "click",
    () => {

        if (
            scene7Step !== "login" ||
            ereturnPasswordFilled
        ) {

            return;

        }


        ereturnPassword.value =
            "password";

        ereturnPasswordFilled = true;

        updateEreturnLoginState();

    }
);


/* ============================================================
   INTERNAL BACK BUTTON
   ============================================================ */

scene7BackButton.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();


        if (
            scene7Step === "calculation" ||
            scene7Step === "submit"
        ) {

            calculationRevealTimers.forEach(
                (timer) => clearTimeout(timer)
            );

            calculationRevealTimers = [];

            scene7Step = "documents";

            scene7.classList.remove(
                "calculation-visible",
                "submit-ready"
            );

            scene7.classList.add(
                "documents-ready"
            );

            ereturnCalculationLines.textContent = "";
            ereturnActionButton.textContent = "Calculate Return";

            return;

        }


        if (
            scene7Step === "documents"
        ) {

            showEreturnLogin();

            return;

        }


        if (
            scene7Step === "login" &&
            (ereturnTinFilled || ereturnPasswordFilled)
        ) {

            ereturnTin.value = "";
            ereturnPassword.value = "";
            ereturnTinFilled = false;
            ereturnPasswordFilled = false;

            updateEreturnLoginState();

        }

    }
);


/* ============================================================
   LOGIN
   ============================================================ */

ereturnLoginButton.addEventListener(
    "click",
    () => {

        if (
            scene7Step !== "login"
        ) {

            return;

        }


        scene7Step =
            "documents";


        scene7.classList.add(
            "dashboard-visible"
        );


        console.log(
            "eReturn dashboard opened."
        );

    }
);


/* ============================================================
   DOCUMENT SELECTION
   ============================================================ */

ereturnDocumentCards.forEach(
    (card) => {

        card.addEventListener(
            "click",
            () => {

                if (
                    scene7Step !== "documents"
                ) {

                    return;

                }


                card.classList.toggle(
                    "selected"
                );


                if (
                    card.classList.contains(
                        "selected"
                    )
                ) {

                    selectedReturnDocuments.add(
                        card.dataset.document
                    );

                } else {

                    selectedReturnDocuments.delete(
                        card.dataset.document
                    );

                }


                if (
                    selectedReturnDocuments.size ===
                    ereturnDocumentCards.length
                ) {

                    scene7.classList.add(
                        "documents-ready"
                    );

                } else {

                    scene7.classList.remove(
                        "documents-ready"
                    );

                }

            }
        );

    }
);


/* ============================================================
   ACTION BUTTON
   ============================================================ */

ereturnActionButton.addEventListener(
    "click",
    () => {

        if (
            scene7Step === "documents" &&
            selectedReturnDocuments.size === ereturnDocumentCards.length
        ) {

            showTaxCalculation();

            return;

        }


        if (
            scene7Step === "submit"
        ) {

            openScene8();

        }

    }
);


/* ============================================================
   SHOW TAX CALCULATION
   ============================================================ */

function showTaxCalculation() {

    scene7Step =
        "calculation";


    scene7.classList.remove(
        "documents-ready"
    );


    scene7.classList.add(
        "calculation-visible"
    );


    ereturnActionButton.textContent =
        "Submit Return";


    ereturnCalculationLines.textContent =
        "";


    taxCalculationLines.forEach(
        (line, index) => {

            const lineElement =
                document.createElement(
                    "div"
                );


            lineElement.className =
                "ereturn-calculation-line";


            lineElement.textContent =
                line;


            ereturnCalculationLines.appendChild(
                lineElement
            );


            const timer =
                setTimeout(
                    () => {

                        lineElement.classList.add(
                            "visible"
                        );


                        if (
                            index ===
                            taxCalculationLines.length - 1
                        ) {

                            scene7Step =
                                "submit";


                            scene7.classList.add(
                                "submit-ready"
                            );

                        }

                    },
                    450 * (index + 1)
                );


            calculationRevealTimers.push(
                timer
            );

        }
    );

}
