document.addEventListener('DOMContentLoaded', () => {
    const searchbtn = document.getElementById('searchbtn');
    const searchInput = document.getElementById('searchInput');
    const contentDiv = document.getElementById('content');
  
    searchbtn.addEventListener('click', () => {
      const q = searchInput.value.trim(); // Get the search query from the input field
  
      // Construct the URL for the API request
      const apiUrl = `http://localhost:3000/search?q=${encodeURIComponent(q)}&location=Washington%2C%20United%20States`;
  
      // Fetch data from server
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          // Clear previous content
          contentDiv.innerHTML = '';
  
          // Process search results
          if (data && data.organic_results && data.organic_results.length > 0) {
            data.organic_results.forEach(result => {
              // Create a div for each search result
              const resultDiv = document.createElement('div');
              resultDiv.classList.add('search-result');
  
              // Create HTML structure for each search result
              resultDiv.innerHTML = `
                <h3><a href="${result.link}" target="_blank">${result.title}</a></h3>
                <cite>${result.displayed_link}</cite>
                <p>${result.snippet}</p>
              `;
  
              // Check if result includes an image
              if (result.thumbnail) {
                const img = document.createElement('img');
                img.src = result.thumbnail;
                img.alt = result.title;
                resultDiv.appendChild(img);
              }
  
              // Append each search result to contentDiv
              contentDiv.appendChild(resultDiv);
            });
          } else {
            // If no results found
            contentDiv.innerHTML = '<p>No results found.</p>';
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          contentDiv.innerHTML = '<p>Error fetching data. Please try again later.</p>';
        });
    });
  });