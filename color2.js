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

// 色 × 点滅 の全組み合わせを作成
let combinations = [];
for (let color of colors) {
    for (let blink of blinkOptions) {
        combinations.push({ color, blink });
    }
}

// シャッフル
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

// 点滅開始
function startBlink() {
    const box = document.getElementById("color-box");
    let visible = true;

    if (blinkInterval) clearInterval(blinkInterval);

    blinkInterval = setInterval(() => {
        box.style.visibility = visible ? "hidden" : "visible";
        visible = !visible;
    }, 300);
}

// 点滅停止
function stopBlink() {
    if (blinkInterval) clearInterval(blinkInterval);
    document.getElementById("color-box").style.visibility = "visible";
}

// 次の警報を表示
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

    createChoiceButtons(warning);
}

// 5択ボタン生成
function createChoiceButtons(correctWarning) {
    const container = document.getElementById("choice-buttons");
    container.innerHTML = "";

    warnings.forEach(w => {
        const btn = document.createElement("button");
        btn.textContent = w;
        btn.onclick = () => checkAnswer(w, correctWarning);
        container.appendChild(btn);
    });
}

// 判定
function checkAnswer(choice, correct) {
    const last = colorResults[colorResults.length - 1];
    last.score = (choice === correct) ? 1 : 0;

    answerDone = true;

    document.getElementById("ratingTitle").style.display = "block";
    createRatingButtons();
}

// 見やすさ評価ボタン生成
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

// 避難評価ボタン生成
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

// 次へ進む
function proceedNext() {
    if (!answerDone || !ratingDone) {
        document.getElementById("message").textContent =
            "判定と評価を両方終えてください。";
        return;
    }

    index++;

    // 全組み合わせ終了 → sound2.html へ進む（最新版）
    if (index >= combinations.length) {
        localStorage.setItem("colorResults", JSON.stringify(colorResults));
        window.location.href = "sound2.html";   // ←ここが最重要修正点！
        return;
    }

    // 次の問題へ
    answerDone = false;
    ratingDone = false;

    document.getElementById("ratingTitle").style.display = "none";
    document.getElementById("evacTitle").style.display = "none";
    document.getElementById("rating-buttons").innerHTML = "";
    document.getElementById("evac-buttons").innerHTML = "";
    document.getElementById("message").textContent = "";
    document.getElementById("nextButton").style.display = "none";

    showNext();
}

// Enterキーで次へ
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") proceedNext();
});

// 次へボタン
document.getElementById("nextButton").onclick = () => proceedNext();

// 初回表示
showNext();
