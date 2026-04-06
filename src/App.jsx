import { useState, useEffect } from 'react';

export default function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("Avengers");

  // This runs when the app first opens
  useEffect(() => {
    fetchMovies("Avengers");
  }, []);

  const fetchMovies = async (title) => {
    const response = await fetch(`https://www.omdbapi.com/?s=${title}&apikey=cc990886`);
    const data = await response.json();
    if (data.Search) {
      setMovies(data.Search);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-black mb-10 text-center text-yellow-500 tracking-tighter">
          MOVIE FLIX
        </h1>

        {/* Search Bar */}
        <div className="flex gap-3 mb-12 max-w-xl mx-auto bg-slate-800 p-2 rounded-full border border-slate-700">
          <input
            className="flex-1 px-6 py-2 bg-transparent outline-none text-lg"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchMovies(searchTerm)}
          />
          <button 
            onClick={() => fetchMovies(searchTerm)}
            className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold px-6 py-2 rounded-full transition-all"
          >
            SEARCH
          </button>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {movies.map((movie) => (
            <div key={movie.imdbID} className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 hover:border-yellow-500 transition-all group">
              <div className="relative h-96">
                <img 
                  src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/400x600?text=No+Image"} 
                  alt={movie.Title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold">
                  {movie.Year}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold leading-tight line-clamp-2">{movie.Title}</h3>
                <p className="text-slate-400 text-sm mt-2 uppercase tracking-widest">{movie.Type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}