export function displayMovies(movies, moviesGrid) {
    if (movies.length === 0) {
        moviesGrid.innerHTML = '<p>No movies found</p>';
        return;
    }

    moviesGrid.innerHTML = ''; // Clear the existing content of moviesGrid

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}">
            <div class="movie-info">
                <h2 class="movie-title">${movie.title}</h2>
                <p>${movie.genre.join(', ')} (${movie.year})</p>
            </div>
        `;
        moviesGrid.appendChild(movieCard); // Append the movie card to moviesGrid
    });
}




export function filterMovies(moviesData, searchInput, genreFilter, yearFilter) {
    return moviesData.filter(movie => {
        const titleMatches = movie.title.toLowerCase().includes(searchInput.value.toLowerCase());
        const genreMatches = genreFilter.value === '' || movie.genre.toLowerCase() === genreFilter.value.toLowerCase();
        const yearMatches = yearFilter.value === '' || movie.year === yearFilter.value;
        return titleMatches && genreMatches && yearMatches;
    });
}



