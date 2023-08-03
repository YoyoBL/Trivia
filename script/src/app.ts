import { Question } from "./classes/question.class.js";
import { Trivia } from "./classes/trivia.class.js";

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
const $endMessage = document.getElementById("end-message") as HTMLDivElement;
const $question = document.getElementById("question") as HTMLElement;
const $questionNumber = document.getElementById(
   "question-number"
) as HTMLElement;
const $answersNode = document.querySelectorAll<HTMLDivElement>(".answer");
const $answers = Array.from($answersNode);
// console.log($endMessage);

let trivia: Trivia;

let questions: Question[] = [];

let currentQuestionIndex = 0;
// for testing
// currentQuestionIndex = 8;
//

const answersResults: {
   correct: number[];
   incorrect: number[];
} = {
   correct: [],
   incorrect: [],
};

// Listeners_________________________________________________________________

// start btn
$startBtn.addEventListener("click", startGame);

// answers listeners
function listenToAnswers() {
   window.addEventListener("click", (e) => {
      let $answer = e.target as HTMLElement;
      if ($answer.matches(".answer") && $answer.closest(".answers-area")) {
         const correctAnswer =
            trivia.questions[currentQuestionIndex].correct_answer;
         //correct answer
         if ($answer.innerHTML === correctAnswer) {
            colorAnswers("info", "danger");

            $answer.classList.replace("border-danger", "border-success");
            trivia.registerAsCorrect(currentQuestionIndex);
            //incorrect-answer
         } else {
            colorAnswers("info", "danger");

            // makes sure text is decoded before
            const decode = document.createElement("div");
            decode.innerHTML = correctAnswer;

            const correctAnswerDivElement = $answers.find(
               (e) => e.innerHTML === decode.innerHTML
            );
            correctAnswerDivElement.classList.replace(
               "border-danger",
               "border-success"
            );
            trivia.registerAsIncorrect(currentQuestionIndex);
         }
         setTimeout(() => {
            if (currentQuestionIndex !== trivia.numOfQuestions - 1) {
               colorAnswers("danger", "info");
               colorAnswers("success", "info");
               currentQuestionIndex++;
               $questionNumber.innerHTML = `Question ${
                  currentQuestionIndex + 1
               }`;
               renderQuestion();
            } else {
               endGame();
            }
         }, 1000);
      }
   });
}

// Functions___________________________________________________________________

// fill category select
async function fillCategorySelector() {
   const categories = await Trivia.getCategories();

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
   debugger;
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
   } catch (error) {
      $mainMenu.insertAdjacentHTML(
         "beforeend",
         `<div class="text-danger">${error}</div>`
      );
   }
}

function renderQuestion() {
   const currentQuestion = trivia.questions[currentQuestionIndex];
   $question.innerHTML = currentQuestion.question;

   let answers = currentQuestion.combineAnswers();
   answers = shuffleArray(answers);
   currentQuestion.combinedAnswers = answers;
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

function endGame() {
   $gameArea.classList.add("d-none");
   $endMessage.classList.remove("d-none");

   const [$congrats, $results] = Array.from(
      document.getElementById("end-message-text").children
   );

   let correctAnswers = trivia.answersResults.correct.length;
   // correctAnswers = 5;
   const numOfQuestions = trivia.numOfQuestions;
   let message = "";
   if (correctAnswers <= numOfQuestions * 0.2) {
      $congrats.classList.add("text-danger");
      message = "You suck!🤓";
   } else if (correctAnswers <= numOfQuestions * 0.6) {
      $congrats.classList.add("text-info");
      message = "Not bad!😊";
   } else {
      $congrats.classList.add("text-success");
      message = "Your'e awesome!!!🌟🌟🌟";
   }

   $congrats.innerHTML = message;
   $results.innerHTML = `You've got ${correctAnswers}/${numOfQuestions} right`;

   const $reviewQuestionsAccordion =
      document.getElementById("review-questions");

   function accordionItemHtml(
      index = 0,
      { question, combinedAnswers, correct_answer }: Question
   ) {
      let html = `
      <div class="accordion-item">
      <h2 class="accordion-header ">
         <button
            class="accordion-button ${index === 0 ? "" : "collapsed"} ${
         trivia.answersResults.correct.includes(index)
            ? "bg-success-subtle"
            : "bg-danger-subtle"
      }"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapse${index}"
            aria-expanded="${index === 0 ? "true" : "false"}"
            aria-controls="collapse${index}"
         >
            Question ${index + 1}
         </button>
      </h2>
      <div
         id="collapse${index}"
         class="accordion-collapse ${
            index === 0 ? "collapse show" : "collapse"
         } "
         data-bs-parent="#accordionExample"
      >
         <div class="accordion-body">
            <div class="position-relative mb-3 p-2">
               <p class="p-4 mb-0">
                 ${question}
               </p>
            </div>
            <!-- Answers -->
            <div class="row row-cols-2 g-3">`;

      for (let answer of combinedAnswers) {
         html += `<div class="col">
               <div
                  class="answer border border  ${
                     answer === correct_answer
                        ? "border-success"
                        : "border-danger"
                  } border-3 rounded-3"
               >
                  ${answer}
               </div>
            </div>`;
      }

      html += `
            </div>
         </div>
      </div>
   </div>
         `;
      return html;
   }

   let html = "";
   let index = 0;

   for (let question of trivia.questions) {
      html += accordionItemHtml(index++, question);
   }

   $reviewQuestionsAccordion.innerHTML = html;
}
