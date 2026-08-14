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


const ereturnSummaryRounds = [
    [
        "Income from Employment = 11,72,000 BDT",
        "Income from Rent = 6,00,000 BDT",
        "Income from Other Sources (Honorarium) = 2,00,000 BDT",
        "Total Income = 19,72,000"
    ],
    [
        "Personal expense = 3,00,000 BDT",
        "Accomodation = 4,71,192 BDT",
        "Education = 75,000 BDT",
        "Festival expense = 50,000 BDT",
        "Total = 8,96,192 BDT"
    ],
    [
        "Non-Agri Land = 67,00,000 BDT",
        "Car = 60,00,000 BDT",
        "Jewelry = 2,50,000 BDT",
        "Furniture & Devices = 1,20,000 BDT",
        "Bank & Cash in Hand = 40,78,000 BDT",
        "Institutional Liabilities = 3,12,000 BDT",
        "Net Wealth = BDT 1,68,36,000"
    ],
    [
        "Tax Payable = 2,83,000 BDT",
        "Rebate = 50,000 BDT",
        "Tax credit = 10,000 BDT",
        "Final tax liability = 2,23,000 BDT"
    ]
];


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


let ereturnSummaryRoundIndex = 0;


function getEreturnSummarySource(lineIndex) {

    const sourceCards =
        Array.from(
            ereturnDocumentCards
        );

    const sourceIndex =
        Math.min(
            lineIndex,
            sourceCards.length - 1
        );

    return sourceCards[sourceIndex]
        .dataset.document;

}


function renderEreturnSummaryRound() {

    const summaryLines =
        ereturnSummaryRounds[
            ereturnSummaryRoundIndex
        ];

    const lineElements =
        summaryLines.map(
            (lineText, lineIndex) => {

                const line =
                    document.createElement(
                        "div"
                    );

                line.className =
                    "ereturn-calculation-line";

                if (
                    lineIndex === summaryLines.length - 1
                ) {

                    line.classList.add(
                        "ereturn-calculation-line--total"
                    );

                }

                line.dataset.summarySource =
                    getEreturnSummarySource(
                        lineIndex
                    );

                line.textContent =
                    lineText;

                return line;

            }
        );

    ereturnCalculationLines.replaceChildren(
        ...lineElements
    );

    ereturnCalculationLines.classList.toggle(
        "ereturn-calculation-lines--dense",
        summaryLines.length > 5
    );

    ereturnActionButton.textContent =
        ereturnSummaryRoundIndex ===
        ereturnSummaryRounds.length - 1
            ? "Submit Return"
            : "Next";

}


function resetEreturnSummarySelection() {

    ereturnSummarySession += 1;
    selectedReturnDocuments.clear();

    ereturnDocumentCards.forEach(
        (card) => {

            card.classList.remove(
                "selected"
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

}


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

    ereturnSummaryRoundIndex = 0;


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


    renderEreturnSummaryRound();

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
            scene7Step === "action-ready"
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
                                .length ===
                            ereturnCalculationLines
                                .querySelectorAll(
                                    ".ereturn-calculation-line"
                                )
                                .length;

                        if (
                            allPagesSelected &&
                            allSummaryLinesVisible
                        ) {

                            scene7Step =
                                "action-ready";

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
            scene7Step === "action-ready" &&
            !ereturnActionButton.disabled
        ) {

            if (
                ereturnSummaryRoundIndex ===
                ereturnSummaryRounds.length - 1
            ) {

                openScene8();
                return;

            }

            ereturnSummaryRoundIndex += 1;
            resetEreturnSummarySelection();
            renderEreturnSummaryRound();

        }

    }
);
