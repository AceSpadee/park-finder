document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const query = document.getElementById('query').value;
    search(query);
});

async function search(query) {
    try {
        const response = await fetch(`/search?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayResults(data) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    data.results.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <h2>${item.title}</h2>
            <p>${item.snippet}</p>
            <a href="${item.url}" target="_blank">Read more</a>
        `;
        resultsContainer.appendChild(resultItem);
    });
}