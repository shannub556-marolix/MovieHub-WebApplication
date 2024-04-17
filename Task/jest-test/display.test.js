// Import the displayMovies function
import { displayMovies } from './testindex.js';

describe('displayMovies function', () => {
    // Define test data
    const movies = [
        { title: 'Movie 1', genre: ['Action', 'Thriller'], year: '2020', poster: 'poster1.jpg' },
        { title: 'Movie 2', genre: ['Comedy'], year: '2021', poster: 'poster2.jpg' },
        { title: 'Movie 3', genre: ['Drama'], year: '2019', poster: 'poster3.jpg' }
    ];

    test('should display movies correctly', () => {
        // Mock moviesGrid
        const moviesGrid = document.createElement('div');

        // Call displayMovies with test data and moviesGrid
        displayMovies(movies, moviesGrid);

        // Check if each movie card is appended to moviesGrid
        expect(moviesGrid.children.length).toBe(movies.length);

        // Check if movie information is correctly displayed in each movie card
        movies.forEach((movie, index) => {
            const movieCard = moviesGrid.children[index];
            expect(movieCard.querySelector('img').getAttribute('src')).toBe(movie.poster);
            expect(movieCard.querySelector('img').getAttribute('alt')).toBe(movie.title);
            expect(movieCard.querySelector('.movie-title').textContent).toBe(movie.title);
        });
    });

    test('should display "No movies found" message when no movies are provided', () => {
        // Mock moviesGrid
        const moviesGrid = document.createElement('div');

        // Call displayMovies with an empty array of movies and moviesGrid
        displayMovies([], moviesGrid);

        // Check if "No movies found" message is displayed
        expect(moviesGrid.innerHTML).toBe('<p>No movies found</p>');
    });
});
