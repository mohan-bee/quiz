const quizBox = document.getElementById("quiz-box");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const resultBox = document.getElementById("result-box");
const scoreEl = document.getElementById("score");

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
  scoreEl.textContent = ${score} / ${questions.length};
}

loadQuestion();