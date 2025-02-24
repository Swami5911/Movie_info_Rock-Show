const apiKey = '5b3b774b'; // Your OMDb API key

// Function to fetch featured movies
async function fetchFeaturedMovies() {
    const response = await fetch(`https://www.omdbapi.com/?s=India&apikey=${apiKey}`);
    const data = await response.json();
    if (data.Response === "True") {
        displayFeaturedMovies(data.Search);
    } else {
        console.error("Error fetching featured movies:", data.Error);
    }
}

// Function to display featured movies
function displayFeaturedMovies(movies) {
    const featuredMovies = document.getElementById("featuredMovies");
    featuredMovies.innerHTML = movies.map(movie => `
    <div class="movie-card" onclick="window.location.href='details.html?id=${movie.imdbID}'">
      <img src="${movie.Poster}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
    </div>
  `).join('');
}

// Function to fetch movies based on search query
async function fetchMovies(query) {
    const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=${apiKey}`);
    const data = await response.json();
    if (data.Response === "True") {
        displayMovies(data.Search);
    } else {
        displayError("No movies found.");
    }
}

// Function to display search results
function displayMovies(movies) {
    const movieResults = document.getElementById("movieResults");
    movieResults.innerHTML = movies.map(movie => `
    <div class="movie-card" onclick="window.location.href='details.html?id=${movie.imdbID}'">
      <img src="${movie.Poster}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
    </div>
  `).join('');
}

// Function to display error message
function displayError(message) {
    const movieResults = document.getElementById("movieResults");
    movieResults.innerHTML = `<p class="error">${message}</p>`;
}

// Event listener for search button
document.getElementById("searchButton").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value;
    if (query) {
        fetchMovies(query);
    }
});

// Load more functionality
let currentPage = 1;
document.getElementById("loadMoreButton").addEventListener("click", async () => {
    currentPage++;
    const query = document.getElementById("searchInput").value;
    const response = await fetch(`https://www.omdbapi.com/?s=${query}&page=${currentPage}&apikey=${apiKey}`);
    const data = await response.json();
    if (data.Response === "True") {
        displayMovies(data.Search);
    }
});

// Favorites functionality
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

function addToFavorites(movie) {
    if (!favorites.some(fav => fav.imdbID === movie.imdbID)) {
        favorites.push(movie);
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }
}

function displayFavorites() {
    const favoritesSection = document.getElementById("favoritesSection");
    favoritesSection.innerHTML = favorites.map(movie => `
    <div class="movie-card" onclick="window.location.href='details.html?id=${movie.imdbID}'">
      <img src="${movie.Poster}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
    </div>
  `).join('');
}

// Call displayFavorites to show favorites on page load
displayFavorites();

// Fetch featured movies on page load
fetchFeaturedMovies();

async function fetchMovieDetails(imdbID) {
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
    const data = await response.json();
    displayMovieDetails(data);
}

function displayMovieDetails(movie) {
    const movieDetails = document.getElementById("movieDetails");

    if (!movie.Poster || movie.Poster === "N/A") {
        movie.Poster = "https://via.placeholder.com/300x450?text=No+Image"; // Placeholder image
    }

    movieDetails.innerHTML = `
      <div class="movie-details">
        <img src="${movie.Poster}" alt="${movie.Title}">
        <div class="movie-info">
          <h3>${movie.Title}</h3>
          <p><strong>Year:</strong> ${movie.Year}</p>
          <p><strong>Genre:</strong> ${movie.Genre}</p>
          <p><strong>Director:</strong> ${movie.Director}</p>
          <p><strong>Actors:</strong> ${movie.Actors}</p>
          <p><strong>Plot:</strong> ${movie.Plot}</p>
        </div>
      </div>
    `;
}



// Fetch movie details on page load
const urlParams = new URLSearchParams(window.location.search);
const imdbID = urlParams.get('id');
if (imdbID) {
    fetchMovieDetails(imdbID);
}

async function fetchMoviesByCategory(category) {
    let searchQuery = category;

    if (category === "game") {
        searchQuery = "game";  // Special handling for game-related movies
    }

    const response = await fetch(`https://www.omdbapi.com/?s=${searchQuery}&apikey=${apiKey}`);
    const data = await response.json();

    if (data.Response === "True") {
        displayMovies(data.Search);
    } else {
        displayError("No movies found for this category.");
    }
}

// Event listener for category selection
document.getElementById("movieCategory").addEventListener("change", (event) => {
    fetchMoviesByCategory(event.target.value);
});
document.addEventListener("DOMContentLoaded", () => {
    fetchFeaturedMovies();        // Load featured movies
    fetchMoviesByCategory("action");  // Load action movies by default
    displayFavorites();           // Load favorite movies
});
