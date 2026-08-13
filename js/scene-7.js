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


let scene7Step =
    "login";


let ereturnTinFilled = false;


let ereturnPasswordFilled = false;


let ereturnTinStarted = false;


let ereturnPasswordStarted = false;


let ereturnTypingSession = 0;


let ereturnSummarySession = 0;


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

    ereturnTypingSession += 1;
    ereturnSummarySession += 1;

    scene7Step =
        "login";


    hideEreturnAudioStatus();


    selectedReturnDocuments.clear();


    scene7.classList.remove(
        "login-ready",
        "dashboard-visible",
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

    ereturnTinStarted = false;

    ereturnPasswordStarted = false;

    ereturnLoginButton.disabled =
        true;


    ereturnDocumentCards.forEach(
        (card) => {

            card.classList.remove(
                "selected"
            );

        }
    );


    ereturnCalculationLines
        .querySelectorAll(
            ".ereturn-calculation-line"
        )
        .forEach(
            (line) => {

                line.classList.remove(
                    "visible"
                );

            }
        );


    ereturnActionButton.textContent =
        "Submit Return";

    ereturnActionButton.disabled =
        true;

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


}


function typeEreturnValue(
    input,
    value,
    onComplete
) {

    const typingSession =
        ereturnTypingSession;

    let characterIndex = 0;

    input.value = "";

    function typeNextCharacter() {

        if (
            typingSession !== ereturnTypingSession
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
        updateEreturnLoginState();

    }

    typeNextCharacter();

}


function showEreturnLogin() {

    scene7Step =
        "login";


    scene7.classList.remove(
        "dashboard-visible",
        "submit-ready"
    );


    ereturnLoginPanel.style.display =
        "";

    ereturnDashboard.style.display =
        "";

}


function undoLastEreturnPageSelection() {

    const selectedDocuments =
        Array.from(
            selectedReturnDocuments
        );

    const documentToUndo =
        selectedDocuments[
            selectedDocuments.length - 1
        ];

    if (!documentToUndo) {

        return false;

    }

    ereturnSummarySession += 1;

    selectedReturnDocuments.delete(
        documentToUndo
    );

    ereturnDocumentCards.forEach(
        (card) => {

            card.classList.toggle(
                "selected",
                selectedReturnDocuments.has(
                    card.dataset.document
                )
            );

        }
    );

    ereturnCalculationLines
        .querySelectorAll(
            ".ereturn-calculation-line"
        )
        .forEach(
            (line) => {

                line.classList.toggle(
                    "visible",
                    selectedReturnDocuments.has(
                        line.dataset.summarySource
                    )
                );

            }
        );

    scene7Step =
        "documents";

    scene7.classList.remove(
        "submit-ready"
    );

    ereturnActionButton.disabled =
        true;

    return true;

}


/* ============================================================
   CLICK-TO-FILL LOGIN FIELDS
   ============================================================ */

ereturnTin.addEventListener(
    "click",
    () => {

        if (
            scene7Step !== "login" ||
            ereturnTinStarted ||
            ereturnTinFilled
        ) {

            return;

        }


        ereturnTinStarted = true;

        typeEreturnValue(
            ereturnTin,
            createRandomTinNumber(),
            () => {

                ereturnTinFilled = true;

            }
        );

    }
);


ereturnPassword.addEventListener(
    "click",
    () => {

        if (
            scene7Step !== "login" ||
            ereturnPasswordStarted ||
            ereturnPasswordFilled
        ) {

            return;

        }


        ereturnPasswordStarted = true;

        typeEreturnValue(
            ereturnPassword,
            "password",
            () => {

                ereturnPasswordFilled = true;

            }
        );

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
            scene7Step === "documents" ||
            scene7Step === "submit"
        ) {

            if (
                undoLastEreturnPageSelection()
            ) {

                return;

            }

            showEreturnLogin();

            return;

        }


        if (
            scene7Step === "login" &&
            (ereturnTinStarted || ereturnPasswordStarted)
        ) {

            ereturnTin.value = "";
            ereturnPassword.value = "";
            ereturnTinFilled = false;
            ereturnPasswordFilled = false;
            ereturnTinStarted = false;
            ereturnPasswordStarted = false;
            ereturnTypingSession += 1;

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


                if (
                    selectedReturnDocuments.has(
                        card.dataset.document
                    )
                ) {

                    return;

                }


                selectedReturnDocuments.add(
                    card.dataset.document
                );

                const summarySession =
                    ereturnSummarySession;

                card.classList.add(
                    "selected"
                );


                ereturnCalculationLines
                    .querySelectorAll(
                        `[data-summary-source="${card.dataset.document}"]`
                    )
                    .forEach(
                        (line, index) => {

                            window.setTimeout(
                                () => {

                                    if (
                                        summarySession === ereturnSummarySession &&
                                        selectedReturnDocuments.has(
                                            card.dataset.document
                                        )
                                    ) {

                                        line.classList.add(
                                            "visible"
                                        );

                                    }

                                },
                                180 * index
                            );

                        }
                    );


                const sourceLineCount =
                    ereturnCalculationLines
                        .querySelectorAll(
                            `[data-summary-source="${card.dataset.document}"]`
                        )
                        .length;


                window.setTimeout(
                    () => {

                        if (
                            summarySession !== ereturnSummarySession
                        ) {

                            return;

                        }

                        const allPagesSelected =
                            selectedReturnDocuments.size ===
                            ereturnDocumentCards.length;

                        const allSummaryLinesVisible =
                            ereturnCalculationLines
                                .querySelectorAll(
                                    ".ereturn-calculation-line.visible"
                                )
                                .length === 4;

                        if (
                            allPagesSelected &&
                            allSummaryLinesVisible
                        ) {

                            scene7Step =
                                "submit";

                            scene7.classList.add(
                                "submit-ready"
                            );

                            ereturnActionButton.disabled =
                                false;

                        }

                    },
                    180 * Math.max(0, sourceLineCount - 1) + 30
                );

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
            scene7Step === "submit" &&
            !ereturnActionButton.disabled
        ) {

            openScene8();

        }

    }
);
