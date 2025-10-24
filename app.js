const quizBox = document.getElementById("quiz-box");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const resultBox = document.getElementById("result-box");
const scoreEl = document.getElementById("score");

let currentQuestion = 0;
let score = 0;

// --- New Feature: Timer per question ---
let timerInterval = null;
const TIMER_SECONDS = 15; // seconds per question
let timeLeft = TIMER_SECONDS;

// Create and insert timer element
const timerEl = document.createElement("div");
timerEl.id = "timer";
timerEl.style.margin = "10px 0";
timerEl.style.fontWeight = "bold";
timerEl.style.color = "#e67e22";
quizBox.insertBefore(timerEl, answersEl);

// ...existing code...
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
  // --- New Feature: Reset and start timer ---
  resetTimer();
  startTimer();

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
  // --- New Feature: Stop timer on answer ---
  stopTimer();

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
  // --- New Feature: Hide timer on result ---
  timerEl.style.display = "none";
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
  timerEl.style.display = "block"; // Show timer again
  loadQuestion();
});

// Show last score (optional)
window.addEventListener("load", () => {
  const last = localStorage.getItem("lastScore");
  if (last) console.log("Your last quiz score was:", last);
});

// --- New Feature: Timer functions ---
function startTimer() {
  timeLeft = TIMER_SECONDS;
  timerEl.textContent = `⏰ Time Left: ${timeLeft}s`;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏰ Time Left: ${timeLeft}s`;
    if (timeLeft <= 0) {
      stopTimer();
      autoSelect();
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function resetTimer() {
  stopTimer();
  timeLeft = TIMER_SECONDS;
  timerEl.textContent = `⏰ Time Left: ${timeLeft}s`;
}

// --- New Feature: Auto-select if time runs out ---
function autoSelect() {
  const q = questions[currentQuestion];
  const buttons = answersEl.querySelectorAll("button");
  // If already answered, do nothing
  if ([...buttons].some(btn => btn.disabled)) return;
  // Mark as wrong (no answer selected)
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add("correct");
  });
  nextBtn.style.display = "block";
}

loadQuestion();