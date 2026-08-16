/* ============================================================
   #SCENE 3 — SERVICE SELECTION
   ============================================================ */


/* ============================================================
   SCENE 3 ELEMENTS
   ============================================================ */

const scene3 =
    document.getElementById("scene-3");



const serviceCards =
    document.querySelectorAll(".service-card");

const serviceCardsContainer =
    document.getElementById("service-cards");

const serviceMessage =
    document.getElementById("service-message");

const serviceMessageText =
    document.getElementById("service-message-text");

const serviceMessageHint =
    document.getElementById("service-message-hint");

const scene3ClickLayer =
    document.getElementById("scene-3-click-layer");


/* ============================================================
   SCENE 3 AUDIO
   ============================================================ */

const etinReqAudio =
    new Audio("assets/audio/etinreq.mp3");

etinReqAudio.preload = "auto";


function playEtinReqAudio() {

    etinReqAudio.currentTime = 0;

    etinReqAudio.play().catch(
        (error) => {

            console.log(
                "eTIN required audio blocked:",
                error
            );

        }
    );

}


/* ============================================================
   SCENE 3 STATE
   ============================================================ */

let selectedService = null;

let serviceStep = 0;


/*
    Remembers the last card the player picked so the scene
    can be rebuilt when Scene 4 hands control back.
*/

let lastSelectedService = null;


/*
    serviceStep:

    0 = choosing service

    1 = "eTIN REQUIRED"

    2 = "TAKING YOU TO eTIN PORTAL"

    3 = move to Scene 4
*/


/* ============================================================
   OPEN SCENE 3
   ============================================================ */

function openScene3() {

    console.log(
        "Opening Scene 3 — Service Selection"
    );


    /* --------------------------------------------------------
       Hide Scene 2
       -------------------------------------------------------- */

    scene2.classList.add("hidden");


    /* --------------------------------------------------------
       Show Scene 3
       -------------------------------------------------------- */

    scene3.classList.add("active");


    /* --------------------------------------------------------
       Reset Scene 3 state
       -------------------------------------------------------- */

    selectedService = null;

    serviceStep = 0;


    /* --------------------------------------------------------
       Stop eTIN required audio
       -------------------------------------------------------- */

    etinReqAudio.pause();

    etinReqAudio.currentTime = 0;


    /* --------------------------------------------------------
       Reset service cards
       -------------------------------------------------------- */

    serviceCardsContainer.classList.remove(
        "locked"
    );


    serviceCards.forEach(
        (card) => {

            card.classList.remove(
                "selected"
            );

        }
    );


    /* --------------------------------------------------------
       Hide message
       -------------------------------------------------------- */

    serviceMessage.classList.remove(
        "active"
    );

    serviceMessageText.textContent = "";

    serviceMessageHint.textContent = "";


    /* --------------------------------------------------------
       Disable click layer
       -------------------------------------------------------- */

    scene3.classList.remove(
        "message-active"
    );

}


/* ============================================================
   SERVICE CARD CLICK
   ============================================================ */

serviceCards.forEach(
    (card) => {

        card.addEventListener(
            "click",
            (event) => {

                /*
                    Only allow card selection
                    during the initial step.
                */

                if (
                    serviceStep !== 0
                ) {

                    return;

                }


                event.stopPropagation();


                /*
                    Store selected service.
                */

                selectedService =
                    card.dataset.service;

                lastSelectedService =
                    selectedService;


                console.log(
                    "Selected service:",
                    selectedService
                );


                /*
                    Highlight selected card.
                */

                card.classList.add(
                    "selected"
                );


                /*
                    Disable all cards.
                */

                serviceCardsContainer.classList.add(
                    "locked"
                );


                /*
                    Move to message step 1.
                */

                serviceStep = 1;


                /*
                    Show:

                    eTIN REQUIRED
                */

                showServiceMessage(
                    "eTIN REQUIRED",
                    "TAP TO CONTINUE"
                );


                /*
                    Play the eTIN required
                    audio as soon as the
                    message window appears.
                */

                playEtinReqAudio();


                /*
                    Enable full-screen
                    click progression.
                */

                scene3.classList.add(
                    "message-active"
                );

            }
        );

    }
);


/* ============================================================
   KEYBOARD SUPPORT FOR SERVICE CARDS
   ============================================================ */

serviceCards.forEach(
    (card) => {

        card.addEventListener(
            "keydown",
            (event) => {

                if (
                    serviceStep !== 0
                ) {

                    return;

                }


                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    card.click();

                }

            }
        );

    }
);


/* ============================================================
   SHOW SERVICE MESSAGE
   ============================================================ */

function showServiceMessage(
    message,
    hint
) {

    serviceMessageText.textContent =
        message;

    serviceMessageHint.textContent =
        hint;


    serviceMessage.classList.add(
        "active"
    );

}


/* ============================================================
   NEXT CLICK AFTER MESSAGE
   ============================================================ */

scene3ClickLayer.addEventListener(
    "click",
    () => {

        /*
            -----------------------------------------
            STEP 1

            eTIN REQUIRED
                    ↓
            TAKING YOU TO eTIN PORTAL
            -----------------------------------------
        */

        if (
            serviceStep === 1
        ) {

            serviceStep = 2;


            showServiceMessage(
                "TAKING YOU TO eTIN PORTAL",
                "TAP TO CONTINUE"
            );


            return;

        }


        /*
            -----------------------------------------
            STEP 2

            TAKING YOU TO eTIN PORTAL
                    ↓
            SCENE 4
            -----------------------------------------
        */

        if (
            serviceStep === 2
        ) {

            serviceStep = 3;


            openScene4();

        }

    }
);


/* ============================================================
   BACK TO SERVICE SELECTION
   ============================================================ */

function showServiceSelection() {

    serviceStep = 0;

    selectedService = null;


    etinReqAudio.pause();

    etinReqAudio.currentTime = 0;


    serviceCardsContainer.classList.remove(
        "locked"
    );


    serviceCards.forEach(
        (card) => {

            card.classList.remove(
                "selected"
            );

        }
    );


    serviceMessage.classList.remove(
        "active"
    );

    serviceMessageText.textContent = "";

    serviceMessageHint.textContent = "";


    scene3.classList.remove(
        "message-active"
    );

}


/* ============================================================
   REBUILD THE FINAL STATE OF SCENE 3

   Used when Scene 4 hands control back, so the player lands
   on "TAKING YOU TO eTIN PORTAL" instead of the card grid.
   ============================================================ */

function showServiceHandover() {

    const card =
        Array.from(serviceCards).find(
            (serviceCard) =>
                serviceCard.dataset.service ===
                lastSelectedService
        ) || serviceCards[0];


    selectedService =
        card.dataset.service;

    lastSelectedService =
        selectedService;


    card.classList.add(
        "selected"
    );


    serviceCardsContainer.classList.add(
        "locked"
    );


    etinReqAudio.pause();

    etinReqAudio.currentTime = 0;


    serviceStep = 2;


    showServiceMessage(
        "TAKING YOU TO eTIN PORTAL",
        "TAP TO CONTINUE"
    );


    scene3.classList.add(
        "message-active"
    );

}


/* ============================================================
   SHARED BACK BUTTON

   Scene 3 borrows the Scene 7 blue palette.

   The button only appears once a service has been picked,
   so it can never take the player back to Scene 2.
   ============================================================ */

registerSceneBackButton(
    "scene-3",
    {

        theme: "ereturn",

        previousScene: null,

        resumeAtEnd: showServiceHandover,

        isVisible: () => serviceStep >= 1 && serviceStep <= 2,

        goBack: () => {

            /*
                TAKING YOU TO eTIN PORTAL
                        ↓
                eTIN REQUIRED
            */

            if (serviceStep === 2) {

                serviceStep = 1;

                showServiceMessage(
                    "eTIN REQUIRED",
                    "TAP TO CONTINUE"
                );

                return true;

            }


            /*
                eTIN REQUIRED
                        ↓
                SERVICE SELECTION
            */

            if (serviceStep === 1) {

                showServiceSelection();

            }

            return true;

        }

    }
);

