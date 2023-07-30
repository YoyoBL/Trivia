import { Question } from "./classes/question.class.js";
import { getQuestions, getCategories } from "./data.js";

const $startBtn = document.getElementById("start-btn");
const $numberOfQuestions = document.getElementById(
   "number-of-questions"
) as HTMLSelectElement;
const $category = document.getElementById("category") as HTMLSelectElement;
const $difficultyLevel = document.getElementById(
   "difficulty-level"
) as HTMLSelectElement;
const $mainMenu = document.getElementById("main-menu") as HTMLDivElement;
const $gameArea = document.getElementById("game-area") as HTMLDivElement;
const $question = document.getElementById("question") as HTMLElement;
const $answersNode = document.querySelectorAll<HTMLDivElement>(".answer");
const $answers = Array.from($answersNode);

// console.log($answers);

let questions: Question[] = [];

let currentQuestionIndex = 0;

const answersResults: {
   correct: number[];
   incorrect: number[];
} = {
   correct: [],
   incorrect: [],
};

// Listeners_________________________________________________________________

// start btn
$startBtn.addEventListener("click", () => {
   startGame();
   $mainMenu.classList.add("d-none");
   $gameArea.classList.remove("d-none");
});

function listenToAnswers() {
   window.addEventListener("click", (e) => {
      let $answer = e.target as HTMLElement;
      if ($answer.matches(".answer") && $answer.closest(".answers-area")) {
         const correctAnswer = questions[currentQuestionIndex].correct_answer;
         if ($answer.innerHTML === correctAnswer) {
            colorAnswers("info", "danger");

            $answer.classList.replace("border-danger", "border-success");
            answersResults.correct.push(currentQuestionIndex);
         } else {
            colorAnswers("info", "danger");

            const correctAnswerDivElement = $answers.find(
               (e) => e.innerHTML === correctAnswer
            );
            correctAnswerDivElement.classList.replace(
               "border-danger",
               "border-success"
            );
            answersResults.incorrect.push(currentQuestionIndex);
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

   function selectorOptionHtml(categoryId: number, category: string) {
      return (html = `
     <option value="${categoryId}">${category}</option>
     `);
   }

   let html: string = "";
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
   questions = questions.map(
      (question) =>
         new Question(
            question.category,
            question.difficulty,
            question.question,
            question.correct_answer,
            question.incorrect_answers
         )
   );
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

function colorAnswers(from: string, to: string) {
   for (let answer of $answers) {
      answer.classList.replace(`border-${from}`, `border-${to}`);
   }
}

function shuffleArray(arr: string[]) {
   for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
   }
   return arr;
}
