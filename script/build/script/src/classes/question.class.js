export class Question {
    category;
    difficulty;
    question;
    correct_answer;
    incorrect_answers;
    constructor(category, difficulty, question, correct_answer, incorrect_answers) {
        this.category = category;
        this.difficulty = difficulty;
        this.question = question;
        this.correct_answer = correct_answer;
        this.incorrect_answers = incorrect_answers;
    }
    combineAnswers() {
        const answers = [...this.incorrect_answers, this.correct_answer];
        return answers;
    }
}
