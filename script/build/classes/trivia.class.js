export class Trivia {
    //own properties
    questions;
    numOfQuestions;
    category;
    difficulty;
    answersResults = {
        correct: [],
        incorrect: [],
    };
    //constructor
    constructor(numOfQuestions = 10, category, difficulty) {
        this.numOfQuestions = numOfQuestions;
        this.category = category;
        this.difficulty = difficulty;
    }
    //Trivia.prototype
    async getQuestions() {
        let response = await fetch(`https://opentdb.com/api.php?amount=${this.numOfQuestions}&category=${this.category}&difficulty=${this.difficulty}&type=multiple`);
        await response
            .json()
            .then((response) => response.results)
            .then((results) => (this.questions = results));
    }
    registerAsCorrect(questionIndex) {
        this.answersResults.correct.push(questionIndex);
    }
    registerAsIncorrect(questionIndex) {
        this.answersResults.incorrect.push(questionIndex);
    }
    //    Static method
    async getCategories() {
        const categories = await fetch("https://opentdb.com/api_category.php");
        return await categories.json().then((result) => result.trivia_categories);
    }
}
