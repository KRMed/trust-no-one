async function getRandomWord() {
    const res = await fetch('https://random-word-api.herokuapp.com/word');
    const [word] = await res.json();
    return word;
}

async function getNewsArticles() {
    const BASE_URL = "https://newsdata.io/api/1/latest";
    const parameters = {
        apikey: import.meta.env.VITE_NEWS_API_KEY,
        category: "entertainment,food,sports,lifestyle",
        language: "en",
        size: "1" // Can be modified for database
    };
    const urlParams = new URLSearchParams(parameters);
    
    const url = `${BASE_URL}?${urlParams}`;
    // console.log(url)
    const response = await fetch(url);
    const data = await response.json();
    if (data.status !== "success") {
        return null;
    }
    const article = data.results[0];

    const ret_data = {
        title: article.title,
        content: article.description,
        link: article.link
    };
    return ret_data;
}

export async function getQuestion() {
    const choice = Math.floor(Math.random() * (2)); // Either 0 or 1; 0 for word, 1 for article
    // const choice = 1; // Testing line

    return choice ? { type: "article", data: await getNewsArticles() } : { type: "word", data: await getRandomWord()};
}