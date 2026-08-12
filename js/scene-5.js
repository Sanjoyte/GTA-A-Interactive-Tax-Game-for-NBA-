/* ============================================================
   #SCENE 5 — eTIN VIDEO
   ============================================================ */


/* ============================================================
   ELEMENTS
   ============================================================ */

const scene5 =
    document.getElementById(
        "scene-5"
    );


const scene5Video =
    document.getElementById(
        "scene-5-video"
    );


const scene5Next =
    document.getElementById(
        "scene-5-next"
    );


/* ============================================================
   SCENE 5 STATE
   ============================================================ */

let scene5VideoFinished = false;


/* ============================================================
   INITIAL STATE
   ============================================================ */

scene5VideoFinished = false;

scene5Next.classList.add(
    "disabled"
);


/* ============================================================
   OPEN SCENE 5
   ============================================================ */

function openScene5() {

    console.log(
        "Opening Scene 5 — eTIN Video"
    );


    /*
        Hide all other scenes.

        We explicitly hide them here so
        Scene 5 does not overlap another scene.
    */

    document
        .querySelectorAll(".scene")
        .forEach(
            (scene) => {

                scene.classList.remove(
                    "active"
                );

            }
        );


    /*
        Show Scene 5.
    */

    scene5.classList.add(
        "active"
    );


    /*
        Reset video state.
    */

    scene5VideoFinished = false;


    scene5Next.classList.add(
        "disabled"
    );


    /*
        Start from the beginning.
    */

    scene5Video.currentTime = 0;


    /*
        Play the video.
    */

    const playPromise =
        scene5Video.play();


    /*
        Some browsers return a Promise
        from video.play().
    */

    if (
        playPromise !== undefined
    ) {

        playPromise.catch(
            (error) => {

                console.log(
                    "Video could not autoplay:",
                    error
                );

            }
        );

    }

}


/* ============================================================
   VIDEO FINISHED
   ============================================================ */

scene5Video.addEventListener(
    "ended",
    () => {

        console.log(
            "Scene 5 video finished."
        );


        /*
            Video is now complete.
        */

        scene5VideoFinished = true;


        /*
            Enable NEXT button.
        */

        scene5Next.classList.remove(
            "disabled"
        );

    }
);


/* ============================================================
   NEXT BUTTON
   ============================================================ */

scene5Next.addEventListener(
    "click",
    () => {

        /*
            Do nothing until the video
            has completely finished.
        */

        if (
            !scene5VideoFinished
        ) {

            return;

        }


        console.log(
            "Scene 5 NEXT clicked."
        );


        /*
            Move to Scene 6.
        */

        openScene6();

    }
);


/* ============================================================
   OPEN SCENE 6
   ============================================================ */

function openScene6() {

    console.log(
        "Opening Scene 6"
    );


    /*
        Hide Scene 5.
    */

    scene5.classList.remove(
        "active"
    );


    /*
        FUTURE:

        Scene 6 will be activated here.

        Example:

        document
            .getElementById("scene-6")
            .classList.add("active");
    */

}