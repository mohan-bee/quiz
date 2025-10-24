const quizBox = document.getElementById("quiz-box");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const resultBox = document.getElementById("result-box");
const scoreEl = document.getElementById("score");
// NEW: stats elements
const lastScoreEl = document.getElementById("last-score");
const highScoreEl = document.getElementById("high-score");

let currentQuestion = 0;
let score = 0;

const questions = [
  {
    question: "What does HTML stand for?",
    answers: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
    correct: 0
  },
  {
    question: "Which language is used for styling web pages?",
    answers: ["HTML", "CSS", "Python"],
    correct: 1
  },
  {
    question: "What does JS stand for?",
    answers: ["Java Source", "JavaScript", "JustScript"],
    correct: 1
  }
];

function loadQuestion() {
  const q = questions[currentQuestion];
  questionEl.textContent = q.question;
  answersEl.innerHTML = "";
  q.answers.forEach((a, index) => {
    const btn = document.createElement("button");
    btn.textContent = a;
    btn.addEventListener("click", () => selectAnswer(index));
    answersEl.appendChild(btn);
  });
}

function selectAnswer(selected) {
  const q = questions[currentQuestion];
  const buttons = answersEl.querySelectorAll("button");
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("correct");
    else if (i === selected) btn.classList.add("wrong");
  });

  if (selected === q.correct) score++;
  nextBtn.style.display = "block";
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    nextBtn.style.display = "none";
    loadQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");
  scoreEl.textContent =`${score} / ${questions.length}`;
  // NEW: persist last/high scores and update UI
  localStorage.setItem("lastScore", score);
  const prevHigh = parseInt(localStorage.getItem("highScore") || "0", 10);
  if (score > prevHigh) {
    localStorage.setItem("highScore", score);
    if (highScoreEl) highScoreEl.textContent = `${score} / ${questions.length}`;
  }
  if (lastScoreEl) lastScoreEl.textContent = `${score} / ${questions.length}`;
}

const restartBtn = document.getElementById("restart-btn");

// Save score in local storage
window.addEventListener("beforeunload", () => {
  localStorage.setItem("lastScore", score);
});

// Restart functionality
restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  resultBox.classList.add("hidden");
  quizBox.classList.remove("hidden");
  nextBtn.style.display = "none";
  loadQuestion();
});

// Show last score (optional)
window.addEventListener("load", () => {
  const last = localStorage.getItem("lastScore");
  if (last) console.log("Your last quiz score was:", last);
});

// NEW: update stats UI on load
window.addEventListener("load", () => {
  const last = parseInt(localStorage.getItem("lastScore"), 10);
  const high = parseInt(localStorage.getItem("highScore"), 10);
  if (!isNaN(last) && lastScoreEl) lastScoreEl.textContent = `${last} / ${questions.length}`;
  if (!isNaN(high) && highScoreEl) highScoreEl.textContent = `${high} / ${questions.length}`;
});

loadQuestion();

