/* ============================================================
   SCENE 13 — eAUDIT CASE SELECTION
   ============================================================ */

const scene13 = document.getElementById("scene-13");
const scene13BackgroundVideo = document.getElementById("scene-13-background");
const scene13Back = document.getElementById("scene-13-back");
const eauditMessageText = document.getElementById("eaudit-message-text");
const eauditMessageContinue = document.getElementById("eaudit-message-continue");
const eauditInstruction = document.getElementById("eaudit-instruction");
const eauditCaseGrid = document.getElementById("eaudit-case-grid");
const eauditSelectionSubmit = document.getElementById("eaudit-selection-submit");

const eauditCaseData = [
    {
        number: 1,
        title: "Material Turnover–Income Variance",
        level: "High",
        percentage: 92,
        reason: "Third-party information indicates an approximately threefold increase in sales, while declared income is lower than in the preceding assessment year.",
        indicators: "Third-Party Data Variance | Material Income Discrepancy"
    },
    {
        number: 2,
        title: "Reconciled Source Data and Consistent Disclosures",
        level: "Low",
        percentage: 14,
        reason: "Tax deducted at source is fully reconciled with eTDS records, and the reported growth in assets is proportionate to declared income.",
        indicators: "Full Data Reconciliation | Consistent Financial Profile"
    },
    {
        number: 3,
        title: "Material Refund Claim with Incomplete Evidence",
        level: "High",
        percentage: 87,
        reason: "A material refund has been claimed; however, the supporting documentation is incomplete and does not sufficiently substantiate the claim.",
        indicators: "Refund Exposure | Supporting-Evidence Deficiency"
    },
    {
        number: 4,
        title: "Consistent Filing and Transaction Profile",
        level: "Low",
        percentage: 11,
        reason: "Returns have been filed consistently over successive assessment years, with no material anomalies identified in the reported transaction pattern.",
        indicators: "Sustained Filing Compliance | No Material Anomaly"
    },
    {
        number: 5,
        title: "System-Identified Multi-Parameter Risk Exposure",
        level: "High",
        percentage: 81,
        reason: "The automated assessment is identity-neutral. This return has been flagged solely because two independent risk parameters exceeded their thresholds.",
        indicators: "System-Driven Assessment | Two Risk Parameters Triggered"
    }
];

const eauditCaseAudios = eauditCaseData.map((caseData) => {
    const audio = new Audio(`assets/audio/case${caseData.number}.mp3`);
    audio.preload = "auto";
    return audio;
});

let scene13Step = "fact";
let activeCaseIndex = null;
let revealedCaseCount = 0;
const selectedAuditCases = new Set();


function getRiskColor(percentage) {
    const normalizedRisk = Math.max(0, Math.min(1, percentage / 100));
    const hue = Math.round(34 - normalizedRisk * 32);
    return `hsl(${hue} 82% 42%)`;
}


function buildEauditCards() {
    eauditCaseGrid.textContent = "";

    eauditCaseData.forEach((caseData, index) => {
        const card = document.createElement("button");
        card.className = "eaudit-case";
        card.type = "button";
        card.dataset.caseIndex = String(index);
        card.style.setProperty("--risk-color", getRiskColor(caseData.percentage));
        card.setAttribute("aria-label", `Reveal Case ${caseData.number}`);

        const inner = document.createElement("span");
        inner.className = "eaudit-case-inner";

        const front = document.createElement("span");
        front.className = "eaudit-case-face eaudit-case-front";

        const image = document.createElement("img");
        image.className = "eaudit-case-image";
        image.src = "assets/photos/case.png";
        image.alt = `Case ${caseData.number}`;

        const caption = document.createElement("span");
        caption.className = "eaudit-case-caption";
        caption.textContent = `Case ${caseData.number}`;

        front.append(image, caption);

        const risk = document.createElement("span");
        risk.className = "eaudit-case-face eaudit-case-risk";

        const caseLabel = document.createElement("span");
        caseLabel.className = "eaudit-risk-case-label";
        caseLabel.textContent = `Automated Risk Assessment • Case ${caseData.number}`;

        const title = document.createElement("span");
        title.className = "eaudit-risk-title";
        title.textContent = caseData.title;

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

        const reason = document.createElement("span");
        reason.className = "eaudit-risk-reason";
        reason.textContent = `Assessment Basis: ${caseData.reason}`;

        const tags = document.createElement("span");
        tags.className = "eaudit-risk-tags";
        tags.textContent = `Risk Indicators: ${caseData.indicators}`;

        risk.append(caseLabel, title, metrics, reason, tags);
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
    factDetail.textContent = "49,54,469 eRETURNS HAVE BEEN FILED IN THE PREVIOUS YEAR.";

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
    eauditInstruction.textContent = "SELECT A CASE TO REVIEW ITS AUTOMATED RISK ASSESSMENT";
    resetEauditCards();
}


function finishEauditCaseReveal(index) {
    if (activeCaseIndex !== index) {
        return;
    }

    const card = eauditCaseGrid.querySelector(`[data-case-index="${index}"]`);
    card.classList.remove("focused");
    card.classList.add("settled");
    card.setAttribute("aria-label", `Case ${index + 1} risk assessment revealed`);

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
    } else {
        eauditInstruction.textContent = "SELECT ANOTHER CASE TO REVIEW ITS RISK ASSESSMENT";
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
    eauditInstruction.textContent = `CASE ${index + 1} RISK ASSESSMENT — CLICK ANYWHERE TO CLOSE`;

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
    if (event.target.closest("#scene-13-back")) {
        return;
    }

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


scene13Back.addEventListener("click", (event) => {
    event.stopPropagation();

    if (scene13Step === "invitation") {
        showEauditFact();
        return;
    }

    if (scene13Step === "complete") {
        scene13Step = "selecting";
        scene13.classList.remove("selection-complete");
        scene13.classList.toggle("selection-ready", selectedAuditCases.size >= 2);
        eauditInstruction.textContent = `${selectedAuditCases.size} FILES SELECTED FOR AUDIT`;
        return;
    }

    if (scene13Step === "selecting" && selectedAuditCases.size > 0) {
        selectedAuditCases.clear();
        eauditCaseGrid.querySelectorAll(".audit-selected").forEach((card) => {
            card.classList.remove("audit-selected");
            card.setAttribute("aria-pressed", "false");
        });
        scene13.classList.remove("selection-ready");
        eauditInstruction.textContent = "SELECT 2 TO 5 FILES FOR AUDIT";
        return;
    }

    if (scene13Step === "revealing" || scene13Step === "selecting") {
        resetEauditCards();
        showEauditInvitation();
    }
});


buildEauditCards();
