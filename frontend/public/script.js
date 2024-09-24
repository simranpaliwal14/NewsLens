document.addEventListener('DOMContentLoaded', () => {
    fetchNews();

    const categoryFilter = document.getElementById('category-filter');
    categoryFilter.addEventListener('change', () => {
        fetchNews();
    });

    let currentPage = 1;

    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchNews();
        }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        currentPage++;
        fetchNews();
    });
});

async function fetchNews() {
    const category = document.getElementById('category-filter').value;
    try {
        const response = await fetch(`http://localhost:3000/news/fetch?page=${currentPage}&category=${category}`);
        const data = await response.json();
        displayNews(data.articles);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = ''; // Clear previous articles

    articles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${article.title}</h3>
            <p>${article.description || 'No description available.'}</p>
            <p><strong>Source:</strong> ${article.source.name}</p>
            <p><strong>Published At:</strong> ${new Date(article.publishedAt).toLocaleString()}</p>
            <img src="${article.urlToImage}" alt="${article.title}">
            <a href="${article.url}" target="_blank">Read more</a>
        `;
        newsContainer.appendChild(card);
    });
}
