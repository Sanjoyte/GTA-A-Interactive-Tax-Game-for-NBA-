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
   SCENE 3 STATE
   ============================================================ */

let selectedService = null;

let serviceStep = 0;


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
                    "CLICK TO CONTINUE"
                );


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
                "CLICK TO CONTINUE"
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

