const audioFiles = [
    "audio/sougou_tsunami_high_1.wav",
    "audio/sougou_tsunami_high_1.5.wav",
    "audio/sougou_tsunami_low_1.wav",
    "audio/sougou_tsunami_low_1.5.wav",
    "audio/sougou_jarert_high_1.wav",
    "audio/sougou_jarert_high_1.5.wav",
    "audio/sougou_jarert_low_1.wav",
    "audio/sougou_jarert_low_1.5.wav",
    "audio/sougou_tamagawa_high_1.wav",
    "audio/sougou_tamagawa_high_1.5.wav",
    "audio/sougou_tamagawa_low_1.wav",
    "audio/sougou_tamagawa_low_1.5.wav"
];

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}
shuffle(audioFiles);

let index = 0;
let answerDone = false;
let ratingDone = false;

let soundResults = [];

document.getElementById("playButton").onclick = () => {
    const audio = new Audio(audioFiles[index]);
    audio.play();
};

function createChoiceButtons() {
    const container = document.getElementById("choice-buttons");
    container.innerHTML = "";

    const choices = [
        "津波が来ています。逃げてください。",
        "Jアラートが発令されました。",
        "多摩川が氾濫しました。"
    ];

    choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.textContent = choice;

        btn.onclick = () => {
            checkAnswer(choice);
        };

        container.appendChild(btn);
    });
}

createChoiceButtons();

function checkAnswer(choice) {
    const file = audioFiles[index];

    let correct = "";
    if (file.includes("tsunami")) correct = "津波が来ています。逃げてください。";
    else if (file.includes("jarert")) correct = "Jアラートが発令されました。";
    else if (file.includes("tamagawa")) correct = "多摩川が氾濫しました。";

    let score = (choice === correct) ? 1 : 0;

    soundResults.push({
        file,
        score
    });

    answerDone = true;

    document.getElementById("ratingTitle").style.display = "block";
    createRatingButtons();
}

function createRatingButtons() {
    const container = document.getElementById("rating-buttons");
    container.innerHTML = "";

    for (let i = 1; i <= 10; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;

        btn.onclick = () => {
            soundResults[soundResults.length - 1].visibilityScore = i;

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
            soundResults[soundResults.length - 1].evacScore = i;
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

    if (index >= audioFiles.length) {
        saveCSV();
        alert("すべて終了しました。CSVが保存されます。");
        return;
    }

    answerDone = false;
    ratingDone = false;

    document.getElementById("ratingTitle").style.display = "none";
    document.getElementById("evacTitle").style.display = "none";
    document.getElementById("rating-buttons").innerHTML = "";
    document.getElementById("evac-buttons").innerHTML = "";
    document.getElementById("message").textContent = "";
    document.getElementById("nextButton").style.display = "none";
}

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") proceedNext();
});

document.getElementById("nextButton").onclick = () => proceedNext();

function saveCSV() {
    const colorResults = JSON.parse(localStorage.getItem("colorResults"));

    let csv = "type,warning,textColor,bgColor,blink,file,score,visibilityScore,evacScore\n";

    colorResults.forEach(r => {
        csv += `color,${r.warning},${r.textColor},${r.bgColor},${r.blink},,${r.score},${r.visibilityScore},${r.evacScore}\n`;
    });

    soundResults.forEach(r => {
        csv += `sound,,,,,${r.file},${r.score},${r.visibilityScore},${r.evacScore}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "experiment_results.csv";
    a.click();
}
