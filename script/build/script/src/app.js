import { Trivia } from "./classes/trivia.class.js";
import * as he from "../../node_modules/he/he.js";
const $startBtn = document.getElementById("start-btn");
const $numberOfQuestions = document.getElementById("number-of-questions");
const $category = document.getElementById("category");
const $difficultyLevel = document.getElementById("difficulty-level");
const $mainMenu = document.getElementById("main-menu");
const $gameArea = document.getElementById("game-area");
const $question = document.getElementById("question");
const $questionNumber = document.getElementById("question-number");
const $answersNode = document.querySelectorAll(".answer");
const $answers = Array.from($answersNode);
let trivia;
let questions = [];
let currentQuestionIndex = 0;
const answersResults = {
    correct: [],
    incorrect: [],
};
// Listeners_________________________________________________________________
// start btn
$startBtn.addEventListener("click", () => startGame());
function listenToAnswers() {
    window.addEventListener("click", (e) => {
        let $answer = e.target;
        if ($answer.matches(".answer") && $answer.closest(".answers-area")) {
            const correctAnswer = trivia.questions[currentQuestionIndex].correct_answer;
            if ($answer.innerHTML === correctAnswer) {
                colorAnswers("info", "danger");
                $answer.classList.replace("border-danger", "border-success");
                answersResults.correct.push(currentQuestionIndex);
            }
            else {
                colorAnswers("info", "danger");
                const correctAnswerDivElement = $answers.find((e) => e.innerHTML === he.decode(correctAnswer));
                correctAnswerDivElement.classList.replace("border-danger", "border-success");
                answersResults.incorrect.push(currentQuestionIndex);
            }
            setTimeout(() => {
                colorAnswers("danger", "info");
                colorAnswers("success", "info");
                currentQuestionIndex++;
                $questionNumber.innerHTML = `Question ${currentQuestionIndex + 1}`;
                renderQuestion();
            }, 1000);
        }
    });
}
// Functions___________________________________________________________________
// fill category select
async function fillCategorySelector() {
    const categories = await Trivia.getCategories();
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
    const numberOfQuestions = $numberOfQuestions.value;
    const category = $category.value;
    const difficultyLevel = $difficultyLevel.value;
    trivia = new Trivia(Number(numberOfQuestions), category, difficultyLevel);
    try {
        await trivia.getQuestions();
        renderQuestion();
        listenToAnswers();
        $mainMenu.classList.add("d-none");
        $gameArea.classList.remove("d-none");
    }
    catch (error) {
        $mainMenu.innerHTML += `<div class="text-danger">${error}</div>`;
    }
}
function renderQuestion() {
    const currentQuestion = trivia.questions[currentQuestionIndex];
    $question.innerHTML = currentQuestion.question;
    const answers = currentQuestion.combineAnswers();
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
