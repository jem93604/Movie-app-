import Search from "./components/Search";
import { useState, useEffect } from "react";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";
import { useDebounce } from "react-use";
import { updateSearchCount } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchmovies = async (SearchTerm) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = SearchTerm
          ? `${API_BASE_URL}/search/movie?sort_by=popularity.desc&query=${encodeURIComponent(SearchTerm)}`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies ");
      }
      const data = await response.json();
      console.log(endpoint);

      if (data.response === false) {
        setErrorMessage(data.message || "Failed to fetch movies");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);

      const normalizedTerm = SearchTerm?.trim().toLowerCase();
      if (SearchTerm && data.results.length > 0) {
        await updateSearchCount(
            normalizedTerm.trim().toLowerCase(),
            data.results[0],
        );
        for (let i = 0; i < 10; i++) {
          console.log(SearchTerm, data.results[0]);
        }
      }
    } catch (error) {
      setErrorMessage(`${error} while fetching movies try again later `);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchmovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
      <main>
        <div className="pattern" />
        <div className="wrapper">
          <header>
            <img src="/hero-img.png" alt="Hero-banner" className="Hero" />
            <h1>
              Find <span className="text-gradient">Movies</span> without hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>
          <section className="all-movies">
            {searchTerm ? (
                <h1 className="mt-[40px]">Results </h1>
            ) : (
                <h1 className="mt-[40px]">
                  Popular <span className="text-gradient">Movies</span>
                </h1>
            )}

            {isLoading ? (
                <Spinner />
            ) : errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>
            ) : (
                <ul className="movie-list">
                  {movieList.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                  ))}
                </ul>
            )}
          </section>
        </div>
      </main>
  );
};

export default App;