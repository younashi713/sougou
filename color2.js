let warnings = [
    "緊急地震速報",
    "高潮に注意",
    "土砂災害警戒情報",
    "津波！逃げて！",
    "熱中症警戒アラート"
];

let colors = [
    { textColor: "white", bgColor: "red" },
    { textColor: "white", bgColor: "yellow" },
    { textColor: "white", bgColor: "purple" },
    { textColor: "white", bgColor: "black" }
];

let blinkOptions = [true, false];

let combinations = [];
for (let color of colors) {
    for (let blink of blinkOptions) {
        combinations.push({ color, blink });
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
shuffle(combinations);

let index = 0;
let answerDone = false;
let ratingDone = false;
let blinkInterval = null;

let colorResults = [];

function startBlink() {
    const box = document.getElementById("color-box");
    let visible = true;

    if (blinkInterval) clearInterval(blinkInterval);

    blinkInterval = setInterval(() => {
        box.style.visibility = visible ? "hidden" : "visible";
        visible = !visible;
    }, 300);
}

function stopBlink() {
    if (blinkInterval) clearInterval(blinkInterval);
    document.getElementById("color-box").style.visibility = "visible";
}

function showNext() {
    const box = document.getElementById("color-box");
    const combo = combinations[index];

    const warning = warnings[Math.floor(Math.random() * warnings.length)];

    box.textContent = warning;
    box.style.color = combo.color.textColor;
    box.style.backgroundColor = combo.color.bgColor;

    if (combo.blink) startBlink();
    else stopBlink();

    colorResults.push({
        warning,
        textColor: combo.color.textColor,
        bgColor: combo.color.bgColor,
        blink: combo.blink
    });
}

document.getElementById("checkButton").onclick = () => {
    const userAnswer = document.getElementById("answerInput").value.trim();
    const last = colorResults[colorResults.length - 1];

    last.score = (userAnswer === last.warning) ? 1 : 0;

    answerDone = true;

    document.getElementById("ratingTitle").style.display = "block";
    createRatingButtons();
};

function createRatingButtons() {
    const container = document.getElementById("rating-buttons");
    container.innerHTML = "";

    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;

        btn.onclick = () => {
            colorResults[colorResults.length - 1].visibilityScore = i;

            document.getElementById("evacTitle").style.display = "block";
            createEvacButtons();
        };

        container.appendChild(btn);
    }
}

function createEvacButtons() {
    const container = document.getElementById("evac-buttons");
    container.innerHTML = "";

    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;

        btn.onclick = () => {
            colorResults[colorResults.length - 1].evacScore = i;
            ratingDone = true;

            document.getElementById("message").textContent =
                "評価完了。Enterキーまたは「次へ」で進んでください。";

            document.getElementById("nextButton").style.display = "inline-block";
        };

        container.appendChild(btn);
    }
}

function proceedNext() {
    if (!answerDone || !ratingDone) {
        document.getElementById("message").textContent =
            "判定と評価を両方終えてください。";
        return;
    }

    index++;

    if (index >= combinations.length) {
        localStorage.setItem("colorResults", JSON.stringify(colorResults));
        window.location.href = "sound.html";
        return;
    }

    answerDone = false;
    ratingDone = false;

    document.getElementById("answerInput").value = "";
    document.getElementById("ratingTitle").style.display = "none";
    document.getElementById("evacTitle").style.display = "none";
    document.getElementById("rating-buttons").innerHTML = "";
    document.getElementById("evac-buttons").innerHTML = "";
    document.getElementById("message").textContent = "";
    document.getElementById("nextButton").style.display = "none";

    showNext();
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") proceedNext();
});

document.getElementById("nextButton").onclick = () => proceedNext();

showNext();
