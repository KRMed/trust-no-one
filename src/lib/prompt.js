async function getRandomWord() {
    const res = await fetch('https://random-word-api.herokuapp.com/word');
    const [word] = await res.json();
    return word;
}

let remainingArticles = [];
async function importNewsArticles() {
    const BASE_URL = "https://newsdata.io/api/1/latest";
    const parameters = {
        apikey: import.meta.env.VITE_NEWS_API_KEY,
        category: "entertainment,food,sports",
        language: "en",
        size: "10"
    };
    const urlParams = new URLSearchParams(parameters);
    
    const url = `${BASE_URL}?${urlParams}`;
    // console.log(url)
    const response = await fetch(url);
    const data = await response.json();
    if (data.status !== "success") {
        return [];
    }

    const ret_data = data.results.map(article => ({
        title: article.title,
        content: article.description,
        // link: article.link
    }));
    return ret_data;
}

async function getNewsArticle() {
    if (remainingArticles.length === 0) {
        remainingArticles = await importNewsArticles();
    }
    if (remainingArticles.length === 0) { // If still no articles, look for backup questions
        return null;
    }

    return remainingArticles.pop();
}

const BACKUP = [
    "Who do you think is better, Messi or Ronaldo?",
    "Is a hot dog a sandwich?",
    "What is the best programming language?",
    "Who is the greatest basketball player of all time?",
    "Would you rather spend a week in the forest or a night in a haunted house?",
    "Who is the most redeemable supervillain in comics?",
    "If you were to be stuck stranded on an island, what three things would you bring?",
];
let remainingBackup = [...BACKUP];
function getBackup() {
    if (remainingBackup.length === 0) {
        remainingBackup = [...BACKUP]; // Just refill
    }

    const random_idx = Math.floor(Math.random() * (remainingBackup.length)); // Randomized pick, so not always the same order
    const question = remainingBackup[random_idx];
    remainingBackup.splice(random_idx, 1);

    return question;
}

export async function getQuestion() {
    try {
        const choice = Math.floor(Math.random() * (2)); // Either 0 or 1; 0 for word, 1 for article

        if (choice) {
            const article = await getNewsArticle();

            if (article) return { type: "article", data: article };
        } else {
            const word = await getRandomWord()

            if (word) return { type: "word", data: word };
        }
    } catch (err) {
        return { type: "backup", data: getBackup() };
    }
}