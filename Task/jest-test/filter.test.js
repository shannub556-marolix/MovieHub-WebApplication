import { filterMovies } from "./testindex.js";

describe('filterMovies function', () => {
    const moviesData = [
        { title: 'Movie 1', genre: 'Action', year: '2020' },
        { title: 'Movie 2', genre: 'Comedy', year: '2021' },
        { title: 'Movie 3', genre: 'Action', year: '2019' }
    ];

    let searchInput, genreFilter, yearFilter;

    beforeEach(() => {
        // Mocking searchInput, genreFilter, and yearFilter
        searchInput = { value: '' };
        genreFilter = { value: '' };
        yearFilter = { value: '' };
    });

    test('should return all movies if no filters are applied', () => {
        const filteredMovies = filterMovies(moviesData, searchInput, genreFilter, yearFilter);
        expect(filteredMovies).toEqual(moviesData);
    });

    test('should return movies filtered by search term', () => {
        searchInput.value = 'movie 1'; // Searching for 'movie 1'
        const filteredMovies = filterMovies(moviesData, searchInput, genreFilter, yearFilter);
        expect(filteredMovies).toEqual([{ title: 'Movie 1', genre: 'Action', year: '2020' }]);
    });

    test('should return movies filtered by genre', () => {
        genreFilter.value = 'Action'; // Filtering by genre 'Action'
        const filteredMovies = filterMovies(moviesData, searchInput, genreFilter, yearFilter);
        expect(filteredMovies).toEqual([
            { title: 'Movie 1', genre: 'Action', year: '2020' },
            { title: 'Movie 3', genre: 'Action', year: '2019' }
        ]);
    });

    test('should return movies filtered by year', () => {
        yearFilter.value = '2021'; // Filtering by year '2021'
        const filteredMovies = filterMovies(moviesData, searchInput, genreFilter, yearFilter);
        expect(filteredMovies).toEqual([{ title: 'Movie 2', genre: 'Comedy', year: '2021' }]);
    });

    test('should return movies filtered by multiple criteria', () => {
        searchInput.value = 'movie'; // Searching for 'movie'
        genreFilter.value = 'Comedy'; // Filtering by genre 'Comedy'
        yearFilter.value = '2021'; // Filtering by year '2021'
        const filteredMovies = filterMovies(moviesData, searchInput, genreFilter, yearFilter);
        expect(filteredMovies).toEqual([{ title: 'Movie 2', genre: 'Comedy', year: '2021' }]);
    });

    test('should return an empty array if no movies match the criteria', () => {
        searchInput.value = 'Action'; // Searching for 'Action' which is not in any title
        genreFilter.value = 'Horror'; // Filtering by genre 'Horror' which is not in any genre
        yearFilter.value = '2022'; // Filtering by year '2022' which is not in any year
        const filteredMovies = filterMovies(moviesData, searchInput, genreFilter, yearFilter);
        expect(filteredMovies).toEqual([]);
    });
});