/* ============================================================
   SCENE 13 — eAUDIT CASE SELECTION
   ============================================================ */

const scene13 = document.getElementById("scene-13");
const scene13BackgroundVideo = document.getElementById("scene-13-background");
const eauditMessageText = document.getElementById("eaudit-message-text");
const eauditMessageContinue = document.getElementById("eaudit-message-continue");
const eauditInstruction = document.getElementById("eaudit-instruction");
const eauditCaseGrid = document.getElementById("eaudit-case-grid");
const eauditSelectionSubmit = document.getElementById("eaudit-selection-submit");

const eauditCaseData = [
    {
        number: 1,
        title: "Turnover Increased, Reported Income Decreased",
        level: "High",
        percentage: 92
    },
    {
        number: 2,
        title: "Complete Data Consistency",
        level: "Low",
        percentage: 14
    },
    {
        number: 3,
        title: "Large Refund Claim",
        level: "High",
        percentage: 87
    },
    {
        number: 4,
        title: "Small Business – Consistent Filing History",
        level: "Low",
        percentage: 11
    },
    {
        number: 5,
        title: "Tax Official’s Own File",
        level: "High",
        percentage: 81
    }
];

const eauditCaseAudios = eauditCaseData.map((caseData) => {
    const audio = new Audio(`assets/audio/case${caseData.number}.mp3`);
    audio.preload = "auto";
    return audio;
});

const eauditSelectPromptAudio = new Audio("assets/audio/select2.mp3");
eauditSelectPromptAudio.preload = "auto";

let scene13Step = "fact";
let activeCaseIndex = null;
let revealedCaseCount = 0;
const selectedAuditCases = new Set();


/*
    Risk colour ramp.

    The percentage is the only input, so changing a case's
    percentage is the only thing needed to move its colour.
    0 sits at the greenest end and 100 at the reddest, running
    through yellow-green, amber and orange on the way.

    Hue on its own is not enough. At a single fixed lightness
    the greens and yellows come out far brighter than the reds,
    and the revealed card prints white text over this colour,
    so the low end of the scale washed the text out.

    Lightness therefore climbs towards red and dips back across
    the yellow band, which keeps every point on the scale dark
    enough to carry that white text while leaving the red end
    the most vivid.
*/

const RISK_GREEN_HUE = 120;

const RISK_LIGHTNESS_BASE = 31.5;

const RISK_LIGHTNESS_RISE = 18.5;

const RISK_LIGHTNESS_YELLOW_DIP = 12;


function getRiskColor(percentage) {
    const normalizedRisk = Math.max(0, Math.min(1, percentage / 100));

    const hue = RISK_GREEN_HUE * (1 - normalizedRisk);

    const lightness =
        RISK_LIGHTNESS_BASE +
        RISK_LIGHTNESS_RISE * normalizedRisk -
        RISK_LIGHTNESS_YELLOW_DIP * Math.sin(Math.PI * normalizedRisk);

    return `hsl(${hue.toFixed(1)} 82% ${lightness.toFixed(1)}%)`;
}


function buildEauditCards() {
    eauditCaseGrid.textContent = "";

    eauditCaseData.forEach((caseData, index) => {
        const card = document.createElement("button");
        card.className = "eaudit-case";
        card.type = "button";
        card.dataset.caseIndex = String(index);
        card.style.setProperty("--risk-color", getRiskColor(caseData.percentage));
        card.setAttribute("aria-label", `Reveal Return ${caseData.number}`);

        const inner = document.createElement("span");
        inner.className = "eaudit-case-inner";

        const front = document.createElement("span");
        front.className = "eaudit-case-face eaudit-case-front";

        const image = document.createElement("img");
        image.className = "eaudit-case-image";
        image.src = "assets/photos/case.png";
        image.alt = `Return ${caseData.number}`;

        const caption = document.createElement("span");
        caption.className = "eaudit-case-caption";
        caption.textContent = `Return ${caseData.number}`;

        front.append(image, caption);

        const risk = document.createElement("span");
        risk.className = "eaudit-case-face eaudit-case-risk";

        const caseLabel = document.createElement("span");
        caseLabel.className = "eaudit-risk-case-label";
        caseLabel.textContent = `Return ${caseData.number}`;

        const title = document.createElement("span");
        title.className = "eaudit-risk-title";
        title.textContent = `${caseData.number}. ${caseData.title}`;

        const metrics = document.createElement("span");
        metrics.className = "eaudit-risk-metrics";

        const level = document.createElement("span");
        level.className = "eaudit-risk-level eaudit-risk-metric";

        const levelLabel = document.createElement("span");
        levelLabel.className = "eaudit-risk-metric-label";
        levelLabel.textContent = "Risk Level";

        const levelValue = document.createElement("span");
        levelValue.className = "eaudit-risk-metric-value";
        levelValue.textContent = caseData.level;

        level.append(levelLabel, levelValue);

        const percentage = document.createElement("span");
        percentage.className = "eaudit-risk-percentage eaudit-risk-metric";

        const percentageLabel = document.createElement("span");
        percentageLabel.className = "eaudit-risk-metric-label";
        percentageLabel.textContent = "Risk Percentage";

        const percentageValue = document.createElement("span");
        percentageValue.className = "eaudit-risk-metric-value eaudit-risk-percentage-value";
        percentageValue.textContent = `${caseData.percentage}%`;

        percentage.append(percentageLabel, percentageValue);
        metrics.append(level, percentage);

        const statement = document.createElement("span");
        statement.className = "eaudit-risk-statement";
        statement.textContent = `${caseData.level.toUpperCase()}-RISK RETURN`;

        risk.append(caseLabel, title, metrics, statement);
        inner.append(front, risk);
        card.append(inner);

        card.addEventListener("click", () => handleEauditCardClick(index));
        eauditCaseGrid.append(card);
    });
}


function stopEauditCaseAudio() {
    eauditCaseAudios.forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
        audio.onended = null;
    });

    eauditSelectPromptAudio.pause();
    eauditSelectPromptAudio.currentTime = 0;
}


function resetEauditCards() {
    stopEauditCaseAudio();
    activeCaseIndex = null;
    revealedCaseCount = 0;
    selectedAuditCases.clear();
    scene13.classList.remove("card-revealing", "selection-ready", "selection-complete");
    buildEauditCards();
}


function showEauditFact() {
    scene13Step = "fact";
    scene13.classList.remove("cases-visible");

    const factTitle = document.createElement("span");
    factTitle.textContent = "DID YOU KNOW?";

    const factDetail = document.createElement("span");
    factDetail.className = "eaudit-fact-detail";

    const factNumber = document.createElement("span");
    factNumber.className = "eaudit-fact-number";
    factNumber.textContent = "49,54,469";

    factDetail.append(factNumber, " eRETURNS HAVE BEEN FILED IN THE PREVIOUS YEAR.");

    eauditMessageText.replaceChildren(factTitle, factDetail);
    eauditMessageContinue.style.display = "inline-block";
}


function showEauditInvitation() {
    scene13Step = "invitation";
    scene13.classList.remove("cases-visible");
    eauditMessageText.textContent = "LET'S SELECT SOME RETURNS FOR AUDIT!";
    eauditMessageContinue.style.display = "inline-block";
}


function showEauditCases() {
    scene13Step = "revealing";
    scene13.classList.add("cases-visible");
    eauditInstruction.textContent = "Select to Audit";
    resetEauditCards();
}


function finishEauditCaseReveal(index) {
    if (activeCaseIndex !== index) {
        return;
    }

    const card = eauditCaseGrid.querySelector(`[data-case-index="${index}"]`);
    card.classList.remove("focused");
    card.classList.add("settled");
    card.setAttribute("aria-label", `Return ${index + 1} risk assessment revealed`);

    eauditCaseAudios[index].onended = null;

    activeCaseIndex = null;
    revealedCaseCount += 1;
    scene13.classList.remove("card-revealing");

    if (revealedCaseCount === eauditCaseData.length) {
        scene13Step = "selecting";
        eauditInstruction.textContent = "SELECT 2 TO 5 FILES FOR AUDIT";
        eauditCaseGrid.querySelectorAll(".eaudit-case").forEach((caseCard) => {
            caseCard.setAttribute("aria-pressed", "false");
        });

        eauditSelectPromptAudio.currentTime = 0;
        eauditSelectPromptAudio.play().catch((error) => {
            console.log("Could not play select2 audio:", error);
        });
    } else {
        eauditInstruction.textContent = "SELECT ANOTHER RETURN TO REVIEW ITS RISK ASSESSMENT";
    }
}


function closeActiveEauditCaseReveal() {
    if (activeCaseIndex === null) {
        return;
    }

    const closingCaseIndex = activeCaseIndex;
    stopEauditCaseAudio();
    finishEauditCaseReveal(closingCaseIndex);
}


function revealEauditCase(index) {
    if (activeCaseIndex !== null) {
        return;
    }

    const card = eauditCaseGrid.querySelector(`[data-case-index="${index}"]`);

    if (card.classList.contains("revealed")) {
        return;
    }

    activeCaseIndex = index;
    card.classList.add("revealed", "focused");
    scene13.classList.add("card-revealing");
    eauditInstruction.textContent = `RETURN ${index + 1} RISK ASSESSMENT — CLICK ANYWHERE TO CLOSE`;

    const audio = eauditCaseAudios[index];
    audio.currentTime = 0;
    audio.onended = () => finishEauditCaseReveal(index);

    audio.play().catch((error) => {
        console.log(`Could not play Case ${index + 1} audio:`, error);
        finishEauditCaseReveal(index);
    });
}


function toggleEauditCaseSelection(index) {
    const card = eauditCaseGrid.querySelector(`[data-case-index="${index}"]`);

    if (selectedAuditCases.has(index)) {
        selectedAuditCases.delete(index);
        card.classList.remove("audit-selected");
        card.setAttribute("aria-pressed", "false");
    } else {
        selectedAuditCases.add(index);
        card.classList.add("audit-selected");
        card.setAttribute("aria-pressed", "true");
    }

    scene13.classList.toggle("selection-ready", selectedAuditCases.size >= 2);
    eauditInstruction.textContent = selectedAuditCases.size >= 2
        ? `${selectedAuditCases.size} FILES SELECTED — REVIEW AND SUBMIT`
        : "SELECT 2 TO 5 FILES FOR AUDIT";
}


function handleEauditCardClick(index) {
    if (scene13Step === "revealing") {
        revealEauditCase(index);
        return;
    }

    if (scene13Step === "selecting") {
        toggleEauditCaseSelection(index);
    }
}


function openScene13() {
    console.log("Opening Scene 13 — eAudit Case Selection");

    if (typeof scene12BackgroundVideo !== "undefined") {
        scene12BackgroundVideo.pause();
    }

    document.querySelectorAll(".scene").forEach((scene) => {
        scene.classList.remove("active");
    });

    scene13.classList.add("active");
    gameState.currentScene = "scene-13";

    resetEauditCards();
    showEauditFact();

    scene13BackgroundVideo.currentTime = 0;
    scene13BackgroundVideo.play().catch((error) => {
        console.log("Scene 13 background video could not autoplay:", error);
    });
}


function continueEauditMessage() {
    if (scene13Step === "fact") {
        showEauditInvitation();
        return;
    }

    if (scene13Step === "invitation") {
        showEauditCases();
    }
}


function continueEauditSelection() {
    if (scene13Step !== "selecting" || selectedAuditCases.size < 2) {
        return;
    }

    scene13Step = "complete";
    scene13.classList.add("selection-complete");
    scene13.classList.remove("selection-ready");
    eauditInstruction.textContent = `${selectedAuditCases.size} FILES READY FOR AUDIT`;

    openScene14();
}


scene13.addEventListener("click", (event) => {
    if (scene13Step === "revealing" && activeCaseIndex !== null) {
        event.preventDefault();
        event.stopPropagation();
        closeActiveEauditCaseReveal();
        return;
    }

    if (scene13Step === "fact" || scene13Step === "invitation") {
        continueEauditMessage();
    }
}, true);


eauditSelectionSubmit.addEventListener("click", (event) => {
    event.stopPropagation();
    continueEauditSelection();
});


/* ============================================================
   SHARED BACK BUTTON

   Scene 13 owns the purple palette.

   Once the eAudit intro is back at the "DID YOU KNOW?" step,
   the button falls back to Scene 12.
   ============================================================ */

registerSceneBackButton("scene-13", {

    theme: "eaudit",

    previousScene: 12,

    goBack: () => {
        if (scene13Step === "invitation") {
            showEauditFact();
            return true;
        }

        if (scene13Step === "complete") {
            scene13Step = "selecting";
            scene13.classList.remove("selection-complete");
            scene13.classList.toggle("selection-ready", selectedAuditCases.size >= 2);
            eauditInstruction.textContent = `${selectedAuditCases.size} FILES SELECTED FOR AUDIT`;
            return true;
        }

        if (scene13Step === "selecting" && selectedAuditCases.size > 0) {
            selectedAuditCases.clear();
            eauditCaseGrid.querySelectorAll(".audit-selected").forEach((card) => {
                card.classList.remove("audit-selected");
                card.setAttribute("aria-pressed", "false");
            });
            scene13.classList.remove("selection-ready");
            eauditInstruction.textContent = "SELECT 2 TO 5 FILES FOR AUDIT";
            return true;
        }

        if (scene13Step === "revealing" || scene13Step === "selecting") {
            resetEauditCards();
            showEauditInvitation();
            return true;
        }

        /*
            "DID YOU KNOW?" step — leave for Scene 12.
        */

        return false;
    }

});


buildEauditCards();
