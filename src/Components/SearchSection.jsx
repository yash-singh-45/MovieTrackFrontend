import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const baseurl = import.meta.env.VITE_BASE_URL;
const apikey = import.meta.env.VITE_OMDB_API_KEY;

const SearchSection = () => {

  const [movieResults, setMovieResults] = useState([]);
  const [personResults, setPersonResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();


  const storage_key = 'search_history';
  const max_items = 7;
  const query = searchParams.get("query");

  const normalizedQuery = query ? query.trim().toLowerCase() : "";
  const type = searchParams.get("type") ?? "movies";

  const getSearchHistory = () => {
    const data = localStorage.getItem(storage_key);
    return data ? JSON.parse(data) : [];
  };

  const saveSearch = (query, results) => {
    if (type === "personalities") return;

    let history = getSearchHistory();

    history = history.filter(item => item.query != query);

    history.unshift({
      query,
      results,
      timestamp: Date.now() / 1000
    });

    history = history.slice(0, max_items);

    localStorage.setItem(storage_key, JSON.stringify(history));
  }

  const getCacheSearched = (query) => {
    if (type === "personalities") return;

    const history = getSearchHistory();
    const data = history.find(item => item.query === query)
    if (!data) return null;

    const currTime = Date.now() / 1000;
    if (currTime - data.timestamp <= 21600) return data;
    else return null;
  }

  async function fetchMovies() {
    console.log("Fetch Movies Called");

    if (!query)
      return;

    const cached = getCacheSearched(normalizedQuery);
    if (cached) {

      setMovieResults(cached.results);
      return;
    }

    try {
      setLoading(true);
      console.log("Fetch Movie Api called");
      const movieRes = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&type=movie&apikey=${apikey}`);
      const movieData = await movieRes.json();

      console.log(movieData);

      const tvRes = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&type=series&apikey=${apikey}`);
      const tvData = await tvRes.json();

      const formatData = (data, type) => {
        if (!data || data.Response === "False") return [];
        return data.Search.filter(item => item.Poster && item.Poster != "N/A").map(item => ({
          title: item.Title,
          image: item.Poster !== "N/A" ? item.Poster : "/fallback-image.jpg",
          rating: "N/A", // Optional: fetch details if you want IMDb rating
          imdbId: item.imdbID,
          media_type: type,
        }));
      };



      const finalResults = [
        ...formatData(movieData, "movie"),
        ...formatData(tvData, "tv"),
      ];
      console.log(finalResults);

      setMovieResults(finalResults);
      saveSearch(normalizedQuery, finalResults);
    }
    catch (e) {
      console.log(e);
    }finally{
      setLoading(false);
    }
  }

  async function fetchPersons() {
    if (!query) return;

    const tmdbapikey = import.meta.env.VITE_TMDB_API_KEY;

    try {
      setLoading(true);
      const response = await fetch(
        `${baseurl}/tmdbapi/persons/${query}`
      );

      if (!response.ok) {
        toast.error("Failed to fetch personalities");
        throw new Error("Failed to fetch persons");
      }

      const result = await response.json();
      console.log(result.results);

      const data = result.results;

      const persons = data.filter(
        person => person.profile_path != null
      ).sort((a, b) => b.popularity - a.popularity);

      setPersonResults(persons);

    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false)
    }

  }

  useEffect(() => {

    if (type === "movies") {
      fetchMovies();
    } else if (type === "personalities") {
      fetchPersons();
    }

  }, [normalizedQuery, type]);


  return (
    <div className="bg-[#0F1117] min-h-screen px-4 sm:px-10 py-8 text-white">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-gray-700 border-t-[#00FFD1] rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-300">
            Searching for <span className="text-[#00FFD1]">{query}</span>...
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">
              Results for <span className="text-[#00FFD1]">{query}</span>
            </h2>
            <p className="text-gray-400">
              {type === "movies"
                ? movieResults.length === 0
                  ? "No Results"
                  : `Showing ${movieResults.length} results`
                : personResults.length === 0
                  ? "No Results"
                  : `Showing ${personResults.length} results`}
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6">
            {type === "movies"
              ? movieResults
                .filter((movie) => movie.rating !== 0)
                .map((movie) => (
                  <MovieCard
                    key={movie.imdbId}
                    movie={movie}
                    navigate={navigate}
                  />
                ))
              : personResults
                .filter((person) => person.popularity !== 0)
                .map((person) => (
                  <PersonCard
                    key={person.id}
                    person={person}
                    navigate={navigate}
                  />
                ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchSection;

function MovieCard({ movie, navigate }) {

  function handleClick(e) {
    e.preventDefault();
    navigate(`/page/${movie.media_type}/${encodeURIComponent(movie.imdbId)}`);

  }

  return (
    <div
      onClick={handleClick}
      className="bg-[#1A1C22] border border-cyan-500 rounded-lg overflow-hidden shadow-md transform transition-transform hover:scale-105 hover:border-2 md:hover:border-3 hover:shadow-xl cursor-pointer"
    >
      <div className="relative">
        <img
          src={movie.image}
          alt={movie.title}
          className="w-full aspect-square   object-cover"
        />
      </div>
      <div className="md:p-3 p-1">
        <p className="md:text-sm text-xs font-semibold mb-1 truncate ">{movie.title}</p>
      </div>
    </div>
  );
}



function PersonCard({ person, navigate }) {

  function handleClick(e) {
    e.preventDefault();

    const role = person.known_for_department === "Acting" ? "actor" : "director";
    const name = person.original_name;
    navigate(`/bio/${name}`, {
      state:{
        id:person.id
      }
    });
  }

  return (
    <div
      onClick={handleClick}
      className="bg-[#1A1C22] border border-cyan-500 rounded-lg overflow-hidden shadow-md transform transition-transform hover:scale-105 hover:border-2 md:hover:border-3 hover:shadow-xl cursor-pointer"
    >
      <div className="relative">
        <img
          src={
            person.profile_path
              ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
              : "/no-profile.png"
          }
          alt={person.name}
          className="w-full aspect-square object-cover"
        />
      </div>

      <div className=" p-2 md:p-3">
        <h3 className="text-sm font-semibold truncate">
          {person.name}
        </h3>

        <p className="text-xs text-cyan-400  md:mt-1">
          {person.known_for_department}
        </p>

        {person.known_for?.length > 0 && (
          <p className="text-xs text-gray-400 mt-0.5 md:mt-2 line-clamp-2">
            Known for{" "}
            <span className='text-white'>

              {person.known_for
                .slice(0, 3)
                .map((item) => item.title || item.name)
                .join(", ")}
            </span>

          </p>
        )}
      </div>
    </div>
  );
}