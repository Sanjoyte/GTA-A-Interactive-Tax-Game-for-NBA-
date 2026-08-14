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


const ereturnDocumentGrid =
    document.getElementById(
        "ereturn-document-grid"
    );


const ereturnSummaryTitle =
    document.getElementById(
        "ereturn-summary-title"
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
    {
        title: "Income Details",
        cards: [
            {
                id: "employment",
                label: "Employment",
                summary: "Income from Employment = 11,72,000 ৳"
            },
            {
                id: "rent",
                label: "Rent",
                summary: "Income from Rent = 6,00,000 ৳"
            },
            {
                id: "other-sources",
                label: "Others",
                summary: "Income from Other Sources (Honorarium) = 2,00,000 ৳"
            }
        ],
        total: "Total Income = 19,72,000 ৳"
    },
    {
        title: "Expenditure Details",
        cards: [
            {
                id: "personal",
                label: "Personal",
                summary: "Personal expense = 3,00,000 ৳"
            },
            {
                id: "accommodation",
                label: "Accommodation",
                summary: "Accomodation = 4,71,192 ৳"
            },
            {
                id: "education",
                label: "Education",
                summary: "Education = 75,000 ৳"
            },
            {
                id: "festival",
                label: "Festival",
                summary: "Festival expense = 50,000 ৳"
            }
        ],
        total: "Total = 8,96,192 ৳"
    },
    {
        title: "Asset & Liabilities",
        cards: [
            {
                id: "land",
                label: "Land",
                summary: "Non-Agri Land = 67,00,000 ৳"
            },
            {
                id: "car",
                label: "Car",
                summary: "Car = 60,00,000 ৳"
            },
            {
                id: "jewelry",
                label: "Jewelry",
                summary: "Jewelry = 2,50,000 ৳"
            },
            {
                id: "household",
                label: "Household",
                summary: "Furniture & Devices = 1,20,000 ৳"
            },
            {
                id: "cash",
                label: "Cash",
                summary: "Bank & Cash in Hand = 40,78,000 ৳"
            },
            {
                id: "liabilities",
                label: "Liabilities",
                summary: "Institutional Liabilities = 3,12,000 ৳"
            }
        ],
        total: "Net Wealth = 1,68,36,000 ৳"
    },
    {
        title: "Tax Calculation",
        cards: [
            {
                id: "tax",
                label: "Tax",
                summary: "Tax Payable = 2,83,000 ৳"
            },
            {
                id: "rebate",
                label: "Rebate",
                summary: "Rebate = 50,000 ৳"
            },
            {
                id: "credit",
                label: "Credit",
                summary: "Tax credit = 10,000 ৳"
            }
        ],
        total: "Final tax liability = 2,23,000 ৳"
    }
];


const ERETURN_DETAIL_REVEAL_DELAY = 140;
const ERETURN_TOTAL_REVEAL_DELAY = 650;


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


function renderEreturnSummaryRound() {

    const summaryRound =
        ereturnSummaryRounds[
            ereturnSummaryRoundIndex
        ];

    ereturnSummaryTitle.textContent =
        summaryRound.title;

    const documentCards =
        summaryRound.cards.map(
            (cardData) => {

                const card =
                    document.createElement(
                        "button"
                    );

                card.className =
                    "ereturn-document-card";

                card.type =
                    "button";

                card.dataset.document =
                    cardData.id;

                card.setAttribute(
                    "aria-label",
                    `Reveal ${cardData.label} details`
                );

                card.setAttribute(
                    "aria-pressed",
                    "false"
                );

                const cardTitle =
                    document.createElement(
                        "span"
                    );

                cardTitle.className =
                    "ereturn-page-title";

                cardTitle.textContent =
                    cardData.label;

                card.append(cardTitle);

                return card;

            }
        );

    ereturnDocumentGrid.replaceChildren(
        ...documentCards
    );

    ereturnDocumentGrid.style.setProperty(
        "--ereturn-card-count",
        String(summaryRound.cards.length)
    );

    const detailLines =
        summaryRound.cards.map(
            (cardData) => {

                const line =
                    document.createElement(
                        "div"
                    );

                line.className =
                    "ereturn-calculation-line";

                line.dataset.summarySource =
                    cardData.id;

                line.textContent =
                    cardData.summary;

                return line;

            }
        );

    const totalLine =
        document.createElement(
            "div"
        );

    totalLine.className =
        "ereturn-calculation-line ereturn-calculation-line--total";

    totalLine.dataset.summaryTotal =
        "true";

    totalLine.textContent =
        summaryRound.total;

    ereturnCalculationLines.replaceChildren(
        ...detailLines,
        totalLine
    );

    ereturnCalculationLines.classList.toggle(
        "ereturn-calculation-lines--dense",
        summaryRound.cards.length + 1 > 5
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

    ereturnDocumentGrid
        .querySelectorAll(
            ".ereturn-document-card"
        )
        .forEach(
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


    ereturnDocumentGrid
        .querySelectorAll(
            ".ereturn-document-card"
        )
        .forEach(
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

    ereturnDocumentGrid
        .querySelectorAll(
            ".ereturn-document-card"
        )
        .forEach(
            (card) => {

                card.classList.toggle(
                    "selected",
                    selectedReturnDocuments.has(
                        card.dataset.document
                    )
                );

                card.setAttribute(
                    "aria-pressed",
                    selectedReturnDocuments.has(
                        card.dataset.document
                    )
                        ? "true"
                        : "false"
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
                    line.dataset.summaryTotal !== "true" &&
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

ereturnDocumentGrid.addEventListener(
    "click",
    (event) => {

        const card =
            event.target.closest(
                ".ereturn-document-card"
            );

        if (!card) {

            return;

        }

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

        card.setAttribute(
            "aria-pressed",
            "true"
        );


        const summaryRound =
            ereturnSummaryRounds[
                ereturnSummaryRoundIndex
            ];


        const isFinalRequiredCard =
            selectedReturnDocuments.size ===
            summaryRound.cards.length;


        const summaryLine =
            ereturnCalculationLines
                .querySelector(
                    `[data-summary-source="${card.dataset.document}"]`
                );


        window.setTimeout(
            () => {

                if (
                    summarySession === ereturnSummarySession &&
                    selectedReturnDocuments.has(
                        card.dataset.document
                    )
                ) {

                    summaryLine.classList.add(
                        "visible"
                    );

                }

            },
            ERETURN_DETAIL_REVEAL_DELAY
        );


        if (!isFinalRequiredCard) {

            return;

        }


        window.setTimeout(
            () => {

                if (
                    summarySession !== ereturnSummarySession ||
                    selectedReturnDocuments.size !== summaryRound.cards.length
                ) {

                    return;

                }


                ereturnCalculationLines
                    .querySelector(
                        "[data-summary-total]"
                    )
                    .classList.add(
                        "visible"
                    );


                scene7Step =
                    "action-ready";

                scene7.classList.add(
                    "submit-ready"
                );

                ereturnActionButton.disabled =
                    false;

            },
            ERETURN_DETAIL_REVEAL_DELAY +
            ERETURN_TOTAL_REVEAL_DELAY
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
