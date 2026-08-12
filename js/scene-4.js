/* ============================================================
   #SCENE 4 — eTIN PORTAL
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


const etinEmail =
document.getElementById(
    "etin-email"
);


const etinPassword =
document.getElementById(
    "etin-password"
);


const etinLoginButton =
document.getElementById(
    "etin-login-button"
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

/*

    0 = audio playing

    1 = waiting for first click
        ↓
        automatically fill login information

    2 = login button visible
        ↓
        user must click LOGIN

    3 = certificate message

    4 = move to Scene 5

*/

let scene4Step = 0;


/* ============================================================
   OPEN SCENE 4
   ============================================================ */

function openScene4() {

    console.log(
        "Opening Scene 4 — eTIN Portal"
    );


    /* ---------------------------------------------
       Hide Scene 3
       --------------------------------------------- */

    const scene3 =
    document.getElementById(
        "scene-3"
    );


    if (scene3) {

        scene3.classList.remove(
            "active"
        );

    }


    /* ---------------------------------------------
       Show Scene 4
       --------------------------------------------- */

    scene4.classList.add(
        "active"
    );


    /* ---------------------------------------------
       Reset Scene 4
       --------------------------------------------- */

    scene4Step = 0;

    scene4.classList.remove(
        "waiting-for-click"
    );

    scene4.classList.remove(
        "login-visible"
    );

    scene4.classList.remove(
        "certificate-visible"
    );


    etinEmail.value = "";

    etinPassword.value = "";


    /* ---------------------------------------------
       Play audio
       --------------------------------------------- */

    etinAudio.currentTime = 0;

    etinAudio.play()
        .then(() => {

            console.log(
                "eTIN audio started."
            );

        })
        .catch((error) => {

            console.error(
                "Could not play eTIN audio:",
                error
            );

        });


    /* ---------------------------------------------
       Wait until audio completely finishes
       --------------------------------------------- */

    etinAudio.onended =
    function () {

        console.log(
            "eTIN audio finished."
        );


        scene4Step = 1;


        scene4.classList.add(
            "waiting-for-click"
        );


        console.log(
            "Waiting for click to fill login."
        );

    };

}


/* ============================================================
   CLICK AFTER AUDIO
   ============================================================ */

scene4ClickLayer.addEventListener(
    "click",
    () => {

        /* -----------------------------------------
           STEP 1
           
           Fill email and password
           ----------------------------------------- */

        if (
            scene4Step === 1
        ) {

            etinEmail.value =
                "tariquerahman@gmail.com";


            etinPassword.value =
                "****";


            scene4Step = 2;


            scene4.classList.remove(
                "waiting-for-click"
            );


            scene4.classList.add(
                "login-visible"
            );


            console.log(
                "eTIN login information displayed."
            );


            return;

        }


        /* -----------------------------------------
           STEP 3
           
           Move to Scene 5
           ----------------------------------------- */

        if (
            scene4Step === 3
        ) {

            scene4Step = 4;


            openScene5();


        }

    }
);


/* ============================================================
   LOGIN BUTTON
   ============================================================ */

etinLoginButton.addEventListener(
    "click",
    (event) => {

        /*
            Prevent this click from
            reaching the full-screen
            click layer.
        */

        event.stopPropagation();


        /*
            Only allow login at step 2.
        */

        if (
            scene4Step !== 2
        ) {

            return;

        }


        console.log(
            "eTIN login pressed."
        );


        /*
            Show certificate message.
        */

        scene4Step = 3;


        scene4.classList.remove(
            "login-visible"
        );


        scene4.classList.add(
            "certificate-visible"
        );


        /*
            Enable full-screen
            click for next scene.
        */

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


    /*
        Scene 5 will be implemented later.
    */

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