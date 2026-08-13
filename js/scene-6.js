/* ============================================================
   SCENE 6 — SUBMIT RETURN
   ============================================================ */


/* ============================================================
   ELEMENTS
   ============================================================ */

const scene6 =
    document.getElementById(
        "scene-6"
    );


const scene6Question =
    document.getElementById(
        "scene-6-question"
    );


const scene6Yes =
    document.getElementById(
        "scene-6-yes"
    );


const scene6No =
    document.getElementById(
        "scene-6-no"
    );


const scene6Response =
    document.getElementById(
        "scene-6-response"
    );


const scene6ResponseText =
    document.getElementById(
        "scene-6-response-text"
    );


const scene6ClickLayer =
    document.getElementById(
        "scene-6-click-layer"
    );


const scene6BackgroundVideo =
    document.getElementById(
        "scene-6-background"
    );


const scene6BackButton =
    document.getElementById(
        "scene-6-back"
    );


/* ============================================================
   SCENE 6 STATE
   ============================================================ */

/*
    0 = asking question

    1 = response is being displayed

    2 = move to Scene 7
*/

let scene6Step = 0;


/* ============================================================
   RESET TO QUESTION
   ============================================================ */

function resetScene6Question() {

    scene6Step = 0;

    scene6Question.style.display =
        "flex";

    scene6Response.classList.remove(
        "active"
    );

    scene6ResponseText.textContent =
        "";

    scene6.classList.remove(
        "message-active"
    );

}


/* ============================================================
   OPEN SCENE 6
   ============================================================ */

function openScene6() {

    console.log(
        "Opening Scene 6 — Submit Return"
    );


    /*
        Hide previous scene.
    */

    if (typeof scene5 !== "undefined") {

        scene5.classList.remove(
            "active"
        );

    }


    /*
        Show Scene 6.
    */

    scene6.classList.add(
        "active"
    );


    /*
        Reset state.
    */

    resetScene6Question();


    scene6BackgroundVideo.currentTime = 0;

    scene6BackgroundVideo.play()
        .catch((error) => {

            console.error(
                "Could not play Scene 6 background video:",
                error
            );

        });

}


/* ============================================================
   INTERNAL BACK BUTTON
   ============================================================ */

scene6BackButton.addEventListener(
    "click",
    (event) => {

        event.stopPropagation();

        if (
            scene6Step === 1
        ) {

            resetScene6Question();

        }

    }
);


/* ============================================================
   YES
   ============================================================ */

scene6Yes.addEventListener(
    "click",
    (event) => {

        /*
            Prevent the click from
            reaching the full-screen
            progression layer.
        */

        event.stopPropagation();


        /*
            Make sure we are still
            selecting an option.
        */

        if (scene6Step !== 0) {

            return;

        }


        console.log(
            "Return submission: YES"
        );


        /*
            Move to response state.
        */

        scene6Step = 1;


        /*
            Hide question and buttons.
        */

        scene6Question.style.display =
            "none";


        /*
            Show response.
        */

        scene6ResponseText.textContent =
            "Proceeding to eReturn";


        scene6Response.classList.add(
            "active"
        );


        /*
            Enable click anywhere.
        */

        scene6.classList.add(
            "message-active"
        );

    }
);


/* ============================================================
   NO
   ============================================================ */

scene6No.addEventListener(
    "click",
    (event) => {

        /*
            Prevent the click from
            reaching the full-screen
            progression layer.
        */

        event.stopPropagation();


        /*
            Make sure we are still
            selecting an option.
        */

        if (scene6Step !== 0) {

            return;

        }


        console.log(
            "Return submission: NO"
        );


        /*
            Move to response state.
        */

        scene6Step = 1;


        /*
            Hide question and buttons.
        */

        scene6Question.style.display =
            "none";


        /*
            Show response.
        */

        scene6ResponseText.textContent =
            "Oh, c'mon dude, you must submit your return!";


        scene6Response.classList.add(
            "active"
        );


        /*
            Enable click anywhere.
        */

        scene6.classList.add(
            "message-active"
        );

    }
);


/* ============================================================
   CLICK AFTER RESPONSE
   ============================================================ */

scene6ClickLayer.addEventListener(
    "click",
    () => {

        /*
            Only proceed after
            YES or NO was selected.
        */

        if (scene6Step !== 1) {

            return;

        }


        scene6Step = 2;


        console.log(
            "Moving to Scene 7"
        );


        scene6BackgroundVideo.pause();


        /*
            Open Scene 7.
        */

        openScene7();

    }
);
