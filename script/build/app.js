import { Question } from "./classes/question.class.js";
import { getQuestions, getCategories } from "./data.js";
const $startBtn = document.getElementById("start-btn");
const $numberOfQuestions = document.getElementById("number-of-questions");
const $category = document.getElementById("category");
const $difficultyLevel = document.getElementById("difficulty-level");
const $mainMenu = document.getElementById("main-menu");
const $gameArea = document.getElementById("game-area");
const $question = document.getElementById("question");
const $answersNode = document.querySelectorAll(".answer");
const $answers = Array.from($answersNode);
// console.log($answers);
let questions = [];
let currentQuestionIndex = 0;
// Listeners_________________________________________________________________
// start btn
$startBtn.addEventListener("click", () => {
    startGame();
    $mainMenu.classList.add("d-none");
    $gameArea.classList.remove("d-none");
});
function listenToAnswers() {
    window.addEventListener("click", (e) => {
        let $answer = e.target;
        if ($answer.matches(".answer") && $answer.closest(".answers-area")) {
            const correctAnswer = questions[currentQuestionIndex].correct_answer;
            if ($answer.innerHTML === correctAnswer) {
                colorAnswers("info", "danger");
                $answer.classList.replace("border-danger", "border-success");
            }
            else {
                colorAnswers("info", "danger");
                const correctAnswerDivElement = $answers.find((e) => e.innerHTML === correctAnswer);
                correctAnswerDivElement.classList.replace("border-danger", "border-success");
            }
        }
        setTimeout(() => {
            colorAnswers("danger", "info");
            colorAnswers("success", "info");
            currentQuestionIndex++;
            renderQuestion();
        }, 1000);
    });
}
// Functions___________________________________________________________________
// fill category select
async function fillCategorySelector() {
    const categories = await getCategories();
    function selectorOptionHtml(categoryId, category) {
        return (html = `
     <option value="${categoryId}">${category}</option>
     `);
    }
    let html = "";
    for (let { id, name } of categories) {
        html += selectorOptionHtml(id, name);
    }
    $category.innerHTML = html;
}
fillCategorySelector();
async function startGame() {
    //    debugger;
    const numberOfQuestions = $numberOfQuestions.value;
    const category = $category.value;
    const difficultyLevel = $difficultyLevel.value;
    questions = await getQuestions(numberOfQuestions, category, difficultyLevel);
    questions = questions.map((question) => new Question(question.category, question.difficulty, question.question, question.correct_answer, question.incorrect_answers));
    renderQuestion();
    listenToAnswers();
}
function renderQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    $question.innerHTML = currentQuestion.question;
    const answers = currentQuestion.getAnswers();
    shuffleArray(answers);
    for (let i in answers) {
        $answers[i].innerHTML = answers[i];
    }
}
function colorAnswers(from, to) {
    for (let answer of $answers) {
        answer.classList.replace(`border-${from}`, `border-${to}`);
    }
}
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
