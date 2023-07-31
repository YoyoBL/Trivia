export class Question {
   category: string;
   difficulty: "easy" | "medium" | "hard";
   question: string;
   correct_answer: string;
   incorrect_answers: string[];
   combinedAnswers: string[];

   constructor(
      category: string,
      difficulty: "easy" | "medium" | "hard",
      question: string,
      correct_answer: string,
      incorrect_answers: string[]
   ) {
      this.category = category;
      this.difficulty = difficulty;
      this.question = question;
      this.correct_answer = correct_answer;
      this.incorrect_answers = incorrect_answers;
   }

   combineAnswers() {
      return [...this.incorrect_answers, this.correct_answer];
   }
}
