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
    "voice";


let calculationRevealTimers =
    [];


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


    ereturnAudio.currentTime =
        0;


    ereturnAudio.play()
        .then(
            () => {

                console.log(
                    "eReturn audio started."
                );

            }
        )
        .catch(
            (error) => {

                console.log(
                    "Could not play eReturn audio:",
                    error
                );

                unlockEreturnLogin();

            }
        );

}


/* ============================================================
   RESET SCENE 7
   ============================================================ */

function resetScene7() {

    scene7Step =
        "voice";


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


    ereturnTin.disabled =
        true;

    ereturnPassword.disabled =
        true;

    ereturnLoginButton.disabled =
        true;


    ereturnLoginHint.textContent =
        "LISTENING TO eRETURN GUIDE";


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

        unlockEreturnLogin();

    }
);


/* ============================================================
   UNLOCK LOGIN
   ============================================================ */

function unlockEreturnLogin() {

    if (
        scene7Step !== "voice"
    ) {

        return;

    }


    scene7Step =
        "login";


    scene7.classList.add(
        "login-ready"
    );


    ereturnTin.disabled =
        false;

    ereturnPassword.disabled =
        false;

    ereturnLoginButton.disabled =
        false;


    ereturnLoginHint.textContent =
        "ENTER TIN AND PASSWORD";

}


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


/* ============================================================
   OPEN SCENE 8
   ============================================================ */

function openScene8() {

    console.log(
        "Moving to Scene 8."
    );


    const scene8 =
        document.getElementById(
            "scene-8"
        );


    if (!scene8) {

        console.log(
            "Scene 8 is not available yet."
        );

        return;

    }


    scene7.classList.remove(
        "active"
    );


    scene8.classList.add(
        "active"
    );


    gameState.currentScene =
        "scene-8";

}
