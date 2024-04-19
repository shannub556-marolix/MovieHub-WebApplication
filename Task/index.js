document.addEventListener('DOMContentLoaded', function () {
    const moviesGrid = document.getElementById('moviesGrid');
    const searchInput = document.getElementById('searchInput');
    const genreFilter = document.getElementById('genreFilter');
    const yearFilter = document.getElementById('yearFilter');
    const nextPageButton = document.getElementById('nextPageButton');
    const prevPageButton = document.getElementById('prevPageButton');
    const loadingSpinner = document.getElementById('loadingSpinner'); // New: Reference to the loading spinner
    const but = document.getElementById('but'); // New: Reference to the loading spinner


    let moviesData = []; // Array to hold movie data
    let currentPage = 1;
    const moviesPerPage = 20;
    const totalMovies = 200; // Total number of movies to fetch
    
    function showLoadingSpinner() {
        loadingSpinner.style.display = 'block'; // Show the loading spinner
        but.style.display = 'none'; // Hide the main section
        footerSection.style.display = 'none'; // Hide the footer section
    }
    
    function hideLoadingSpinner() {
        loadingSpinner.style.display = 'none'; // Hide the loading spinner
        but.style.display = 'block'; // Show the main section
        footerSection.style.display = 'block'; // Show the footer section
    }
    
    function fetchAndStoreMovies(page) {
        showLoadingSpinner(); // Show loading spinner while fetching data
        
        const accessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4YjQwMjI5MThhMzQ5NmM1N2IzMjM4MzljMWJiNDg2ZSIsInN1YiI6IjY2MDUxNDllZDdmNDY1MDE3Y2RiYjU4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2jRm6WMHajunAM29SxOwGpvArK9YNb34JNMwqrJhlRU'; // Replace with your access token
        const apiUrl = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}&region=IN`;
    
        fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const newMovies = data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                genre: movie.genre_ids.map(id => getGenreName(id)),
                year: movie.release_date.split('-')[0],
                poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                release_date: movie.release_date,
                popularity: movie.popularity,
                vote_average: movie.vote_average,
                vote_count: movie.vote_count,
                overview: movie.overview
            }));
    
            // Filter out movies already present in moviesData array
            const uniqueNewMovies = newMovies.filter(movie => !moviesData.some(existingMovie => existingMovie.id === movie.id));
    
            moviesData = moviesData.concat(uniqueNewMovies);
    
            if (moviesData.length < totalMovies && page < data.total_pages) {
                fetchAndStoreMovies(page + 1); // Fetch next page if total movies not reached
            } else {
                localStorage.setItem('moviesData', JSON.stringify(moviesData)); // Store movies in local storage
                loadMoviesFromLocalStorage(); // Load movies after fetching all data
                hideLoadingSpinner(); // Hide the loading spinner once data is loaded
                // CODE TO SAVE FILE IN JSON FORMAT
                // const jsonStr = JSON.stringify(moviesData, null, 2);

                // // Create a Blob from the JSON string
                // const blob = new Blob([jsonStr], { type: 'application/json' });
            
                // // Use FileSaver to save the Blob as a file
                // const outputFile = "combined_data.json";
                // saveAs(blob, outputFile);
            }
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
            hideLoadingSpinner(); // Hide the loading spinner if there's an error
        });
    }
    
    fetchAndStoreMovies(1); // Start fetching movies from page 1

    function loadMoviesFromLocalStorage() {
        const storedMovies = localStorage.getItem('moviesData');
        if (storedMovies) {
            moviesData = JSON.parse(storedMovies);
            filterAndDisplayMovies(); // Apply filters and display movies
            populateGenresFilter(moviesData); // Populate genre filter options
            populateYearsFilter(moviesData); // Populate year filter options
        } else {
            fetchAndStoreMovies(1); // Fetch movies if not in local storage
        }
    }

    function filterAndDisplayMovies() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedGenre = genreFilter.value;
        const selectedYear = yearFilter.value;
    
        let filteredMovies = moviesData.filter(movie => {
            const matchesSearchTerm = movie.title.toLowerCase().includes(searchTerm);
            const matchesGenre = selectedGenre === '' || movie.genre.includes(selectedGenre);
            const matchesYear = selectedYear === '' || movie.year === selectedYear;
            return matchesSearchTerm && matchesGenre && matchesYear;
        });
    
        let paginatedMovies;
        if (searchTerm === '' && selectedGenre === '' && selectedYear === ''){
            const startIndex = (currentPage - 1) * moviesPerPage;
            const endIndex = startIndex + moviesPerPage;
            paginatedMovies = filteredMovies.slice(startIndex, endIndex);
        } else {
            paginatedMovies = filteredMovies;

        }
    
        displayMovies(paginatedMovies);
        lazyLoadImages(); // Lazy load images after displaying movies
    }
    
    function displayMovies(movies) {
        // Clear the movies grid before populating it with new movie cards
        moviesGrid.innerHTML = '';
    
        if (movies.length === 0) {
            moviesGrid.innerHTML = '<p>No movies found</p>';
            return;
        }
    
        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card', 'animate__animated', 'animate__fadeIn'); // Add animation classes
            movieCard.innerHTML = `
                <img src="${movie.poster}" data-src="${movie.poster}" alt="${movie.title}" class="movie-image">
                <div class="movie-info">
                    <h2 class="movie-title">${movie.title}</h2>
                    <p>${movie.genre.join(', ')} (${movie.year})</p>
                </div>
            `;
            const movieTitle = movieCard.querySelector('.movie-title');
            movieTitle.addEventListener('click', () => openMovieDetails(movie.id));
            const movieimage = movieCard.querySelector('.movie-image');
            movieimage.addEventListener('click', () => openMovieDetails(movie.id));
            moviesGrid.appendChild(movieCard);
        });
    }
    
    function lazyLoadImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.onload = () => {
                img.removeAttribute('data-src');
            };
            img.src = img.dataset.src;
        });
    }

    function populateYearsFilter(movies) {
        const years = movies.map(movie => movie.year);
        const uniqueYears = Array.from(new Set(years));
        uniqueYears.sort((a, b) => b - a); // Sort in descending order
        yearFilter.innerHTML = ''; // Clear previous options
        yearFilter.insertAdjacentHTML('beforeend', '<option value="">All Years</option>'); // Add default option
        uniqueYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
    }

    function populateGenresFilter(movies) {
        const allGenres = movies.flatMap(movie => movie.genre);
        const uniqueGenres = Array.from(new Set(allGenres));
        genreFilter.innerHTML = ''; // Clear previous options
        genreFilter.insertAdjacentHTML('beforeend', '<option value="">All Genres</option>'); // Add default option
        uniqueGenres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });
    }

    function getGenreName(id) {
        switch (id) {
            case 28:
                return 'Action';
            case 35:
                return 'Comedy';
            case 18:
                return 'Drama';
            default:
                return 'Unknown';
        }
    }

    function openMovieDetails(movieId) {
        window.open(`./index2.html?id=${movieId}`, '_blank');
    }

    nextPageButton.addEventListener('click', () => {
        if (currentPage < Math.ceil(moviesData.length / moviesPerPage)) {
            window.scrollTo(0, 0);
            currentPage++;
            filterAndDisplayMovies();
        }
    });

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            window.scrollTo(0, 0);
            currentPage--;
            filterAndDisplayMovies();
        }
    });

    // Event listeners for input and filter changes
    searchInput.addEventListener('input', filterAndDisplayMovies);
    genreFilter.addEventListener('change', filterAndDisplayMovies);
    yearFilter.addEventListener('change', filterAndDisplayMovies);

    loadMoviesFromLocalStorage(); // Initial fetch for the first page
});

function myFunction() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}
