export async function getQuestions(numberOfQuestions, category, difficulty) {
    let response = await fetch(`https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`);
    return await response.json().then((response) => response.results);
}
export async function getCategories() {
    const categories = await fetch("https://opentdb.com/api_category.php");
    return await categories.json().then((result) => result.trivia_categories);
}
