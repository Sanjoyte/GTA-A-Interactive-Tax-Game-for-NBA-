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
const eauditSelectionContinue = document.getElementById("eaudit-selection-continue");

const eauditCaseData = [
    {
        number: 1,
        title: "Turnover Increased, Reported Income Decreased",
        level: "High",
        percentage: 92,
        reasonLabel: "Why selected",
        reason: "Third-party data indicates that sales have increased nearly threefold, yet the income declared in the return is lower than the previous year.",
        tags: "Data Inconsistency | High Risk Score"
    },
    {
        number: 2,
        title: "Complete Data Consistency",
        level: "Low",
        percentage: 14,
        reasonLabel: "Why not selected",
        reason: "Tax deducted at source fully reconciles with eTDS data. Growth in assets and income is consistent and proportionate.",
        tags: "Full Reconciliation | Low Risk Score"
    },
    {
        number: 3,
        title: "Large Refund Claim",
        level: "High",
        percentage: 87,
        reasonLabel: "Why selected",
        reason: "A substantial refund has been claimed, but the supporting documents are incomplete or inadequate.",
        tags: "Refund Risk | Documentary Deficiency"
    },
    {
        number: 4,
        title: "Small Business – Consistent Filing History",
        level: "Low",
        percentage: 11,
        reasonLabel: "Why not selected",
        reason: "The taxpayer has filed returns regularly for several consecutive years. Transaction patterns show no unusual or abnormal activity.",
        tags: "Consistent Compliance | Low Risk Score"
    },
    {
        number: 5,
        title: "Tax Official’s Own File",
        level: "High",
        percentage: 81,
        reasonLabel: "Why selected",
        reason: "The system has no knowledge of the identity of the taxpayer. Selection is driven purely by risk factors. This file triggered two risk parameters.",
        tags: "Impartial / System-Driven Selection | Risk Factor Hit × 2"
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
    const hue = Math.max(2, Math.round(34 - percentage * 0.32));
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
        caseLabel.textContent = `Case ${caseData.number}`;

        const title = document.createElement("span");
        title.className = "eaudit-risk-title";
        title.textContent = caseData.title;

        const level = document.createElement("span");
        level.className = "eaudit-risk-level";
        level.textContent = `Risk Level: ${caseData.level}`;

        const percentage = document.createElement("span");
        percentage.className = "eaudit-risk-percentage";
        percentage.textContent = `Risk Percentage: ${caseData.percentage}%`;

        const reason = document.createElement("span");
        reason.className = "eaudit-risk-reason";
        reason.textContent = `${caseData.reasonLabel}: ${caseData.reason}`;

        const tags = document.createElement("span");
        tags.className = "eaudit-risk-tags";
        tags.textContent = `Tags: ${caseData.tags}`;

        risk.append(caseLabel, title, level, percentage, reason, tags);
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
    factTitle.textContent = "Did you know?";

    const factDetail = document.createElement("span");
    factDetail.className = "eaudit-fact-detail";
    factDetail.textContent = "49,54,469 eReturns have been filed in the previous year.";

    eauditMessageText.replaceChildren(factTitle, factDetail);
    eauditMessageContinue.style.display = "inline-block";
}


function showEauditInvitation() {
    scene13Step = "invitation";
    scene13.classList.remove("cases-visible");
    eauditMessageText.textContent = "Let’s select some returns for audit!";
    eauditMessageContinue.style.display = "inline-block";
}


function showEauditCases() {
    scene13Step = "revealing";
    scene13.classList.add("cases-visible");
    eauditInstruction.textContent = "SELECT A CASE TO REVEAL ITS RISK FACTORS";
    resetEauditCards();
}


function finishEauditCaseReveal(index) {
    if (activeCaseIndex !== index) {
        return;
    }

    const card = eauditCaseGrid.querySelector(`[data-case-index="${index}"]`);
    card.classList.remove("focused");
    card.classList.add("settled");
    card.setAttribute("aria-label", `Case ${index + 1} risk factors revealed`);

    activeCaseIndex = null;
    revealedCaseCount += 1;
    scene13.classList.remove("card-revealing");

    if (revealedCaseCount === eauditCaseData.length) {
        scene13Step = "selecting";
        eauditInstruction.textContent = "SELECT ANY 2 FILES FOR AUDIT";
    }
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
    } else {
        selectedAuditCases.add(index);
        card.classList.add("audit-selected");
    }

    scene13.classList.toggle("selection-ready", selectedAuditCases.size >= 2);
    eauditInstruction.textContent = selectedAuditCases.size >= 2
        ? `${selectedAuditCases.size} FILES SELECTED FOR AUDIT`
        : "SELECT ANY 2 FILES FOR AUDIT";
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
}


scene13.addEventListener("click", (event) => {
    if (event.target.closest("#scene-13-back")) {
        return;
    }

    if (scene13Step === "fact" || scene13Step === "invitation") {
        continueEauditMessage();
        return;
    }

    if (scene13Step === "selecting" && selectedAuditCases.size >= 2) {
        continueEauditSelection();
    }
}, true);


eauditMessageContinue.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        continueEauditMessage();
    }
});


eauditSelectionContinue.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        continueEauditSelection();
    }
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
        });
        scene13.classList.remove("selection-ready");
        eauditInstruction.textContent = "SELECT ANY 2 FILES FOR AUDIT";
        return;
    }

    if (scene13Step === "revealing" || scene13Step === "selecting") {
        resetEauditCards();
        showEauditInvitation();
    }
});


buildEauditCards();
