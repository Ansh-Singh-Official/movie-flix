import { useState, useEffect } from 'react';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null); // Tracks the clicked movie

  // Using the API key i got in my mail from the omdbapi website😊
  const API_KEY = "50d81d4e"; 

  // FUNCTION 1: Fetches the list of movies for the website using the API i have provided above 😊
  const fetchMovies = async (title) => {
    if (!title) return;
    setLoading(true);
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${title}&apikey=50d81d4e`);
      const data = await response.json();
      if (data.Search) {
        setMovies(data.Search);
      } else {
        setMovies([]);
      }
    } catch (error) {
      console.error("Search Error:", error);
    }
    setLoading(false);
  };

  // FUNCTION 2: Fetches full details (Plot, Actors, Rating) for one movie
  const fetchMovieDetails = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.omdbapi.com/?i=${id}&plot=full&apikey=50d81d4e`);
      const data = await response.json();
      setSelectedMovie(data);
      // Scroll to top when opening details
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Detail Error:", error);
    }
    setLoading(false);
  };

  // Initial search as this will be my basic home screen when the user opens the website😊
  useEffect(() => {
    fetchMovies(null);
  }, []);

  return (
    <div style={styles.container}>
      {/* Internal CSS for the Grid and Animations */}
      <style>{`
        .movie-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 30px;
          padding: 20px 0;
          max-width: 1200px;
          margin: 0 auto;
        }
        .movie-card {
          background: #1e293b;
          border-radius: 15px;
          overflow: hidden;
          transition: all 0.3s ease;
          border: 1px solid #334155;
          cursor: pointer;
        }
        .movie-card:hover {
          transform: translateY(-10px);
          border-color: #eab308;
          box-shadow: 0 10px 20px rgba(0,0,0,0.4);
        }
        .movie-poster {
          width: 100%;
          height: 320px;
          object-fit: cover;
        }
        .movie-info {
          padding: 15px;
        }
        .movie-title {
          font-size: 1.1rem;
          font-weight: bold;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>

      {/* --- CONDITION 1: SHOW MOVIE DETAILS PAGE ALONG WITH POSTERS (IF SUCCESSFUL) --- */}
      {selectedMovie ? (
        <div style={styles.detailContainer}>
          <button style={styles.backButton} onClick={() => setSelectedMovie(null)}>
            ← BACK TO SEARCH
          </button>
          
          <div style={styles.detailFlex}>
            <img 
              src={selectedMovie.Poster !== "N/A" ? selectedMovie.Poster : "https://via.placeholder.com/400"} 
              style={styles.largePoster} 
              alt={selectedMovie.Title}
            />
            <div style={styles.textDetails}>
              <h1 style={styles.detailTitle}>{selectedMovie.Title}</h1>
              <div style={styles.metaData}>
                <span>{selectedMovie.Year}</span> • <span>{selectedMovie.Runtime}</span> • <span>⭐ {selectedMovie.imdbRating}</span>
              </div>
              <p style={styles.plot}>{selectedMovie.Plot}</p>
              <p><strong>Cast:</strong> {selectedMovie.Actors}</p>
              <p><strong>Director:</strong> {selectedMovie.Director}</p>
              <p><strong>Genre:</strong> {selectedMovie.Genre}</p>

              {/* STREAMING BUTTON */}
              <a 
                href={`https://www.google.com/search?q=watch+${selectedMovie.Title}+online`} 
                target="_blank" 
                rel="noreferrer"
                style={styles.ottButton}
              >
                CHECK STREAMING ON OTT ↗
              </a>
            </div>
          </div>
        </div>
      ) : (
        /* --- CONDITION 2: SHOW SEARCH GRID AREA AND ALL THE RESULTS --- */
        <>
         <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter italic leading-[0.85]">MOVIE<span className="text-yellow-500">FLIX</span>
</h1>
          
          <div style={styles.searchBox}>
            <input
              style={styles.input}
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchMovies(searchTerm)}
            />
            <button style={styles.button} onClick={() => fetchMovies(searchTerm)}>
              {loading ? "..." : "SEARCH"}
            </button>
          </div>

          <div className="movie-grid">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <div 
                  key={movie.imdbID} 
                  className="movie-card" 
                  onClick={() => fetchMovieDetails(movie.imdbID)}
                >
                  <img 
                    src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/400"} 
                    alt={movie.Title} 
                    className="movie-poster"
                  />
                  <div className="movie-info">
                    <p style={{color: '#eab308', fontSize: '12px', margin: '0 0 5px 0'}}>{movie.Type.toUpperCase()}</p>
                    <h3 className="movie-title">{movie.Title}</h3>
                    <span style={{color: '#94a3b8', fontSize: '14px'}}>{movie.Year}</span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{textAlign: 'center', width: '100%', gridColumn: '1/-1'}}>
                {loading ? "Loading..." : "No movies found. Try searching for something else!"}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// STYLING PART FOR THE ENTIRE WEBSITE (COLORS, FONTS, LAYOUTS, ETC) --- USING INLINE STYLES FOR SIMPLICITY 😊
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: 'white',
    padding: '40px 20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    color: '#eab308',
    fontSize: '3.5rem',
    textAlign: 'center',
    margin: '0 0 40px 0',
    fontWeight: '900',
    letterSpacing: '-2px',
  },
  searchBox: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '50px',
  },
  input: {
    padding: '12px 25px',
    borderRadius: '50px',
    border: '2px solid #334155',
    backgroundColor: '#1e293b',
    color: 'white',
    fontSize: '16px',
    width: '100%',
    maxWidth: '400px',
    outline: 'none',
  },
  button: {
    padding: '12px 30px',
    borderRadius: '50px',
    border: 'none',
    backgroundColor: '#eab308',
    color: '#0f172a',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '16px',
  },
  /* Detailing Page Styles and their margin and borders etc...  */
  detailContainer: { maxWidth: '1000px', margin: '0 auto' },
  backButton: {
    backgroundColor: '#334155', color: 'white', border: 'none', padding: '10px 20px', 
    borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold'
  },
  detailFlex: { display: 'flex', gap: '50px', marginTop: '40px', flexWrap: 'wrap' },
  largePoster: { width: '350px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' },
  textDetails: { flex: 1, minWidth: '300px' },
  detailTitle: { fontSize: '3rem', color: '#eab308', margin: '0 0 10px 0' },
  metaData: { color: '#94a3b8', marginBottom: '20px', fontSize: '1.1rem' },
  plot: { fontSize: '1.2rem', lineHeight: '1.7', color: '#cbd5e1', marginBottom: '25px' },
  ottButton: {
    display: 'inline-block', marginTop: '20px', padding: '18px 35px', 
    backgroundColor: '#eab308', color: '#0f172a', fontWeight: 'bold', 
    borderRadius: '12px', textDecoration: 'none', fontSize: '1.1rem'
  }
};