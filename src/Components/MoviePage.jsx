import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import netflix from '/src/assets/netflix_logo.png'
import amazon from '/src/assets/amazon_logo.png'
import disney from '/src/assets/hotstar.png'
import mxPlayer from '/src/assets/mx_player.png'
import sonyLiv from '/src/assets/SonyLIV_logo.png'
import jiostar from '/src/assets/jiohotstar.png'
import zee5 from '/src/assets/zee5_logo.png'
import jiocinema from '/src/assets/Jio_cinema_logo.png'
import appletv from '/src/assets/apple-tv.jpg'
import lionsgate from '/src/assets/lionsgate_logo.png'
import sunnxt from '/src/assets/sunnxt_logo.png'
import { AuthContext } from "./AuthContext";
import { Heart, HeartCrack, HeartIcon, HeartOff, X , Loader2} from "lucide-react";
import { MoreHorizontal } from "lucide-react";
import MoviePageSkeleton from "./MoviePageSkeleton";
import PageNotFound from "./PageNotFound";

const tmdbApi = import.meta.env.VITE_TMDB_API_KEY;

export default function MoviePage() {
  const apikey = import.meta.env.VITE_OMDB_API_KEY;

  const { media, imdbId } = useParams(); // get movie name from URL
  const [trailerLoading, setTrailerLoading] = useState(false);

  const [movieNotFound, setMovieNotFound] = useState(false);
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loadingMovie, setLoadingMovie] = useState(true);

  const [watchProviders, setWatchProviders] = useState([]);
  // const [watchLoading, setWatchLoading] = useState(false);
  const [embedUrl, setEmbedUrl] = useState(null);

  const baseurl = import.meta.env.VITE_BASE_URL;

  const [inWatchlist, setInWatchlist] = useState(false);
  const [inFavourite, setInFavourite] = useState(false);

  const [moreOpen, setMoreOpen] = useState(false);
  const moreOpenRef = useRef(null);

  const [addToCollectionOpen, setAddtoCollectionOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const [fetchingCollections, setFetchingCollections] = useState(false);
  const [addingMovieToCollection, setAddingMovieToCollection] = useState(false);

  const [favLoading, setFavLoading] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  const navigate = useNavigate();

  const { user } = useContext(AuthContext);


  //FUNCTION TO GET SIMILAR MOVIES
  async function getSimilarMovies() {

    const imdbIdFinal = movie?.imdbId || movie?.imdbID || imdbId;

    try {
      const response = await fetch(`${baseurl}/movies/similar/${imdbIdFinal}`);

      if (!response.ok) {
        const error = await response.json();
        console.error("Error Fetching similar movies: ", error);
        return;
      }

      const result = await response.json();
      const data = result.results || [];

      let similarData = [];

      const tmdbPosterUrl = "https://image.tmdb.org/t/p/w500";

      similarData = data.map((movie) => ({
        poster: movie.poster_path
          ? tmdbPosterUrl + movie.poster_path
          : movie.backdrop_path
            ? tmdbPosterUrl + movie.backdrop_path
            : null,

        title: movie.title,
        rating: Math.round(movie.vote_average),
        tmdb_id: movie.id

      }))

      setSimilarMovies(similarData);
    } catch (error) {
      console.error("Error:", error);
    }
  }



  // MAIN USE EFFECT
  useEffect(() => {

    async function fetchMovie() {
      try {

        setLoadingMovie(true);
        const res = await fetch(
          `https://www.omdbapi.com/?i=${encodeURIComponent(imdbId)}&type=${media}&apikey=${apikey}`
        );
        const data = await res.json();

        if (data.Response === "True") {
          const mappedMovie = {
            title: data.Title,
            poster: data.Poster,
            year: data.Year,
            runtime: data.Runtime,
            genres: data.Genre.split(", "),
            synopsis: data.Plot,
            rating: data.imdbRating,
            cast: data.Actors.split(", ").map((name) => ({
              name,
              img: "/placeholder.jpg", // OMDb has no actor images
            })),
            gallery: [data.Poster],
            details: {
              director: data.Director,
              writers: data.Writer,
              budget: "N/A", // OMDb does not provide

            },
            imdbId: data.imdbId || data.imdbID,
            media_type: data.media || data.Type || data.Media,
          };
          setMovie(mappedMovie);

        } else {
          setMovie(null);
          setMovieNotFound(true);
        }
      } catch (error) {
        console.log("Error:", error);
      } finally {
        setLoadingMovie(false);
      }

    }


    //FUNCTION TO CHECK MOVIE IS IN WATCHLIST OF USER
    async function checkMovie(imdbId) {

      if (!imdbId) return;

      const token = localStorage.getItem("token");

      if (!token || !user) {
        setInWatchlist(false);
        setInFavourite(false);
        return;
      }

      try {
        const response = await fetch(`${baseurl}/list/check/${imdbId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const result = await response.json();
        console.log(result);

        setInWatchlist(result.watchlist);
        setInFavourite(result.favourite);

      } catch (err) {
        console.log("Error:", err);
        setInWatchlist(false);
        setInFavourite(false);
      }

    }

    fetchMovie();
    getSimilarMovies();
    checkMovie(movie?.imdbId || movie?.imdbID || imdbId);

  }, [imdbId]);

  // UseEffect to handle openCollectionMenu
  useEffect(() => {
    if (moreOpen === false) return;

    const handleClickOutside = (e) => {
      if (moreOpenRef.current && !moreOpenRef.current.contains(e.target)) {
        setMoreOpen(null);
      }
    }

    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };

  }, [moreOpen])



  //PROVDER MAP
  const PROVIDER_MAP = {
    // Netflix
    "Netflix": "Netflix",

    // Amazon Prime Video
    "Amazon Prime Video": "Amazon",
    "Prime Video": "Amazon",
    "Amazon Video": "Amazon",
    "Amazon": "Amazon",

    // Disney / Hotstar
    "Disney Plus Hotstar": "Disney",
    "Disney+ Hotstar": "Disney",
    "Hotstar": "Disney",
    "Disney Plus": "Disney",
    "Disney+": "Disney",
    "Disney": "Disney",

    // Apple TV
    "Apple TV+": "Apple TV",
    "Apple TV Plus": "Apple TV",
    "Apple TV": "Apple TV",
    "AppleTV": "Apple TV",

    // Sony
    "Sony LIV": "Sony LIV",
    "SonyLIV": "Sony LIV",

    // Zee
    "Zee5": "Zee5",
    "ZEE5": "Zee5",

    // Jio
    "Jio Cinema": "JioCinema",
    "JioCinema": "JioCinema",
    "Jio Hotstar": "JioHotstar",
    "JioStar": "JioHotstar",

    // MX
    "MX Player": "MX Player",
    "MXPlayer": "MX Player",

    // Optional / rare but seen
    "Lionsgate Play": "Lionsgate Play",
    "Sun NXT": "Sun NXT"
  };


  const PROVIDER_LOGOS = {
    // Netflix
    "Netflix": netflix,

    // Amazon
    "Amazon": amazon,

    // Disney / Hotstar
    "Disney": disney,

    // Jio
    "JioCinema": jiocinema,

    "JioHotstar": jiostar,

    // Sony
    "Sony LIV": sonyLiv,


    // Zee
    "Zee5": zee5,

    // MX
    "MX Player": mxPlayer,

    // Apple
    "Apple TV": appletv,

    "Lionsgate Play": lionsgate,
    "Sun NXT": sunnxt
  };

  // GET Stream Section
  useEffect(() => {
    if (!imdbId) return;

    async function fetchStream() {
      const watch_apikey = import.meta.env.VITE_WATCHMODE_API_KEY;

      const url = `https://api.watchmode.com/v1/title/${imdbId}/sources/?apiKey=${watch_apikey}&regions=IN`;

      try {
        const response = await fetch(url);
        const result = await response.json();

        if (result.length == 0) return;



        const data = result
          .map(movie => {
            const provider = PROVIDER_MAP[movie.name];
            if (!provider || !(movie.type === 'rent' || movie.type === 'sub' || movie.type === 'free')) return;
            return {
              name: provider,
              url: movie.web_url,
              logo: PROVIDER_LOGOS[provider],
              type: movie.type
            };
          })
          .filter(Boolean)
          .filter((v, i, a) => a.findIndex(p => p.name === v.name) === i);



        setWatchProviders(data);

      } catch (error) {
        // console.error(error);
      }

    }

    fetchStream();

  }, [imdbId])


  async function handleWatchTrailer(imdbId) {
    if (!imdbId) return;

    try {
      setTrailerLoading(true);
      const response = await fetch(`${baseurl}/movies/trailer/${imdbId}`);
      if (!response.ok) {
        throw new Error("Trailer not found");
      }

      const data = await response.json();
      setEmbedUrl(data.trailerUrl);
    } catch (err) {
      toast.error("Failed to load trailer");
    } finally {
      setTrailerLoading(false);
    }
  }

  async function handleAddToWatchlist() {

    if (inWatchlist === true) return;

    const token = localStorage.getItem("token");

    if (!movie) return;

    if (!user || !token) {
      toast.error("Login to add movies to watchlist!!");
      return;
    }

    const imdbIdFinal = movie?.imdbId || movie?.imdbID || imdbId;

    const data = {
      imdbId: imdbIdFinal,
      title: movie.title,
      posterPath: movie.poster,
      rating: movie.rating === 'N/A' ? null : movie.rating
    }

    setWatchlistLoading(true);

    try {
      const response = await fetch(`${baseurl}/list/watchlist/add`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.text();
      console.log(result);
      toast.success(result);
      setInWatchlist(true);
    } catch (err) {
      toast.error("Error adding to watchlist");
      console.error("Error adding to watchlist:", err);
    } finally{
      setWatchlistLoading(false);
    }
  }

  async function handleRemoveFromWatchlist() {

    if (inWatchlist === false) return;

    const token = localStorage.getItem("token");

    console.log("Remove Watchlist call");

    if (!movie || !user || !token) return;

    const imdbIdFinal = movie?.imdbId || movie?.imdbID || imdbId;

    try {
      const response = await fetch(`${baseurl}/list/watchlist/remove`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: imdbIdFinal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      toast.success("Removed from Watchlist");
      setInWatchlist(false);
    } catch (err) {
      toast.error("Error removing from watchlist");
      console.error("Error removing from to watchlist:", err);
    }
  }

  function handleCelebsClick(name) {
    const encoded_name = encodeURIComponent(name);

    navigate(`/bio/${encoded_name}`)
  }


  //Function to add to Favs
  async function addToFavourite() {
    if (favLoading || inFavourite) return;

    const token = localStorage.getItem("token");

    if (!movie) return;

    if (!user || !token) {
      toast.error("Login to add movies to Favourites!!");
      return;
    }

    const imdbIdFinal = movie?.imdbId || movie?.imdbID || imdbId;

    const data = {
      imdbId: imdbIdFinal,
      title: movie.title,
      posterPath: movie.poster,
      rating: movie.rating === 'N/A' ? null : movie.rating
    };

    const prevFavourite = inFavourite;

    setInFavourite(true);
    setFavLoading(true);


    try {
      const response = await fetch(`${baseurl}/list/favourites/add`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.text();
      console.log(result);
      toast.success(result);
      setInFavourite(true);
    } catch (err) {
      setInFavourite(prevFavourite);
      toast.error("Error adding to favourites");
      console.error("Error adding to favourites:", err);
    } finally {
      setFavLoading(false);
    }
  }

  //Function to remove from Favs
  async function removeFavourite() {
    if (inFavourite === false) return;

    const token = localStorage.getItem("token");

    if (!movie) return;

    if (!user || !token) {
      toast.error("Login to remove from favourites!!");
      return;
    }

    const imdbIdFinal = movie?.imdbId || movie?.imdbID || imdbId;

    try {
      const response = await fetch(`${baseurl}/list/favourites/remove`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: imdbIdFinal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      toast.success("Removed from favourites");
      setInFavourite(false);
    } catch (err) {
      toast.error("Error removing from favourites");
      console.error("Error removing from to favourites:", err);
    }
  }


  //Function to get collection of user
  async function getCollections() {

    const token = localStorage.getItem('token');

    if (!token || !user) {
      toast.error("You are not logged in!!");
      return;
    }

    if (!imdbId || !movie) return;

    try {
      const response = await fetch(`${baseurl}/collection/get`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });

      const result = await response.json();

      setCollections(result);
    } catch (error) {
      toast.error("Error fetching user's collection!");
      console.log("Error:", error);
    }
  }

  // Function to add to Collection
  async function handleAddToCollection() {
    setFetchingCollections(true);

    try {
      await getCollections();
      setMoreOpen(false);
      setAddtoCollectionOpen(true);
    } finally {
      setFetchingCollections(false);
    }
  }

  async function handleAddMovieToCollection(collection) {
    const token = localStorage.getItem('token');

    if (!token || !user) {
      toast.error("You are not logged in !!");
      return;
    }
    const imdbIdFinal = movie?.imdbId || movie?.imdbID || imdbId;
    const requestDto = {
      "imdbId": imdbIdFinal,
      "collectionId": collection.id,
      "title": movie.title,
      "posterPath": movie.poster,
      "rating": movie.rating
    }

    try {
      setAddingMovieToCollection(true);
      const response = await fetch(`${baseurl}/collectionmovie/add`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestDto)
      });


      if (!response.ok) {
        const error = await response.json();

        console.log("Error:", error.error);
        toast.error(error.error);
        return;
      } else {
        const result = await response.text();
        toast.success(result);
      }
    } catch (error) {
      toast.error("Could not add movie to collection!");
      console.log("Error:", error);
    } finally {
      setAddtoCollectionOpen(false);
      setMoreOpen(false);
      setAddingMovieToCollection(false);
    }
  }

  //Function to handle Share
  async function handleShare() {
    if (!movie || !imdbId) return;

    const imdbIdFinal = movie?.imdbId || movie?.imdbID || imdbId;

    const url = `${window.location.origin}/page/${movie.media_type}/${imdbIdFinal}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: movie.title,
          text: `Check out movie "${movie.title}"`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      }
    } catch (err) {
      console.error(err);
    }
  }

  if (loadingMovie === true) return <MoviePageSkeleton />;

  if (movieNotFound === true) return <PageNotFound />;

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-7xl">
        {/* TOP CARD */}
        <div className="relative bg-[#141518] rounded-2xl p-5 md:p-8 shadow-2xl overflow-hidden">

          <button onClick={() => setMoreOpen(moreOpen ? false : true)}
            className="absolute cursor-pointer top-2 md:top-3 right-3">
            <MoreHorizontal />
          </button>

          {
            moreOpen && (
              <div
                ref={moreOpenRef}
                className="absolute top-8 z-10 right-2 w-40 rounded-lg bg-gray-800 shadow-lg border border-gray-700"
              >
                <button
                  onClick={handleAddToCollection}
                  disabled={fetchingCollections}
                  className="w-full px-2 py-2 text-left text-sm hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {fetchingCollections ? (
                    <div className="flex justify-center items-center">
                      <div className="h-4 w-4 border-2 border-gray-500 border-t-[#00FFD1] rounded-full animate-spin" />
                    </div>
                  ) : (
                    "Add to Collection"
                  )}
                </button>

                <button onClick={handleShare}
                  className="w-full px-2 py-2 text-left text-sm hover:bg-gray-700">
                  Share Movie
                </button>
              </div>
            )
          }

          {
            !moreOpen && addToCollectionOpen && (
              <div
                className="absolute top-8 right-10 w-64 max-h-50 overflow-auto bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-20"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <button onClick={() => setAddtoCollectionOpen(false)}>
                  <X size={15} className="right-2 absolute top-1" />
                </button>

                <div className="max-h-72 overflow-y-auto">
                  {collections.length === 0 ? (
                    <p className="px-4 pb-2">No collections yet</p>
                  ) : (
                    addingMovieToCollection ? (
                      <div className="flex items-center justify-center py-6">
                        <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      collections.map((item) => (
                        <button
                          key={item.id}
                          className="w-full px-4 py-3 text-left text-white hover:bg-zinc-800 transition-colors duration-200 border-b border-zinc-800 last:border-b-0"
                          onClick={() => handleAddMovieToCollection(item)}
                        >
                          {item.name}
                        </button>
                      ))
                    )
                  )}
                </div>
              </div>
            )
          }

          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-30 rounded-2xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row gap-6 z-10">
            {/* Poster */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="w-44 hover:scale-110 transition duration-300 md:w-52 lg:w-56 rounded-xl overflow-hidden shadow-lg">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover  block"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">{movie.title}</h1>
              <p className="text-gray-300 mt-1">{movie.tagline}</p>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className="text-sm md:text-base lg:text-lg text-gray-400">{movie.year}</span>
                <span className="text-sm md:text-base lg:text-lg text-gray-400">•</span>
                <span className="text-sm md:text-base lg:text-lg text-gray-400">{movie.runtime}</span>

                <div className="flex gap-2 ml-2">
                  {movie.genres.map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 rounded-full bg-green-500/80 text-xs md:text-sm lg:text-base font-medium"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* TRAILER */}
              <div className="flex items-center gap-3 mt-4">
                <div className="flex gap-3 text-sm md:text-sm lg:text-lg md:ml-5">
                  <button
                    onClick={() => handleWatchTrailer(imdbId)}
                    className="cursor-pointer md:px-4 md:py-2 px-3 py-2 bg-teal-500/95 rounded-full font-medium shadow-md hover:scale-[1.01] transition flex items-center gap-2"
                    disabled={trailerLoading}
                  >
                    {trailerLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "▶ Watch Trailer"
                    )}
                  </button>
                </div>
              </div>
              {embedUrl && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
                  <div className="relative w-full max-w-3xl aspect-video rounded-lg overflow-hidden shadow-2xl">
                    <iframe
                      width="100%"
                      height="100%"
                      src={embedUrl}
                      title={`${movie.title} Trailer`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen

                      className="rounded-lg"
                    />
                    <button
                      className="absolute top-2 right-2 text-white text-3xl font-bold hover:text-red-500"
                      onClick={() => setEmbedUrl("")}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 mt-4">
                <div className="flex w-full md:w-2/3 text-sm md:text-sm items-center justify-between lg:text-lg md:ml-5">
                  <button
                    onClick={inWatchlist ? handleRemoveFromWatchlist : handleAddToWatchlist}
                    disabled={watchlistLoading}
                    className="md:px-4 md:py-2 px-3 py-2 bg-transparent border border-teal-400 text-teal-400 rounded-full font-medium shadow-md hover:bg-teal-500/20 transition"
                  >
                    {inWatchlist ? "❌ Remove from Watchlist" : "➕ Add to Watchlist"}
                  </button>


                  <button onClick={inFavourite ? removeFavourite : addToFavourite} disabled={favLoading} className=" hover:cursor-pointer">
                    <Heart className={`h-10 w-10 md:h-12 md:w-12 ${inFavourite ? "fill-red-600" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0D0D0F] rounded-lg p-4 border border-gray-800">
                  <h3 className="text-sm md:text-base lg:text-xl font-semibold text-gray-200">Synopsis</h3>
                  <p className="text-xs md:text-sm lg:text-base text-gray-400 mt-2">{movie.synopsis}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CAST, REVIEWS, DETAILS */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-4">

            {/* STREAMING INFO */}
            <div className="bg-[#141518] rounded-xl p-4 border border-gray-800">
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3">Stream On</h3>
              <div className="flex gap-5 md:gap-10 overflow-x-auto pb-2">
                {!watchProviders || watchProviders.length == 0 ? <span>N/A</span>
                  :
                  watchProviders.filter(c => c.type == 'sub' || c.type == 'free' || c.type == 'rent').map((c) => (
                    <div key={c.name} className="ml-1 md:ml-2 flex flex-col items-center w-20 text-center">
                      <a href={c.url} target="_blank" rel="noopener noreferrer">
                        <img src={c.logo} alt={c.name} className=" w-15 h-15 p-0.1 md:w-17 md:h-17 object-contain md:p-0.5 border rounded-lg 
                     shadow-md hover:scale-101 transition-transform duration-200 cursor-pointer" />
                      </a>
                      <p className=" hover:underline text-center text-xs cursor-pointer md:text-sm  lg:text-base mt-2 text-gray-300">{c.name}</p>
                    </div>
                  ))}
              </div>
            </div>

            {/* CAST */}
            <div className="bg-[#141518] rounded-xl p-4 border border-gray-800">
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-3">Cast</h3>
              <div className="flex gap-5 md:gap-10 overflow-x-auto pb-2">
                {movie.cast.map((c) => (
                  <div key={c.name} className="flex-shrink-0 w-20 text-center">
                    <p onClick={() => handleCelebsClick(c.name)} className=" hover:underline text-xs cursor-pointer text-blue-400 md:text-sm  lg:text-base mt-2 ">{c.name}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* REVIEWS */}
            <div className="bg-[#141518] rounded-xl p-4 border border-gray-800">
              <h3 className="text-lg font-semibold mb-3">User Reviews & Ratings</h3>
              <div className="flex items-center gap-4">
                <div className="flex flex-row gap-4 items-center ">
                  <div className="text-4xl font-bold text-yellow-400">{movie.rating}</div>
                  <div className="text-sm md:text-xl -ml-3">⭐</div>
                  <div className="text-xs md:text-sm lg:text-lg text-gray-400">Average Rating</div>
                </div>
              </div>
              <Link
                to={`/reviews/${imdbId}`}
                state={movie}
                className="group flex items-center gap-1 mt-5 text-blue-400 hover:text-blue-300 text-sm sm:text-base font-medium transition-colors duration-200"
              >
                <span className="border-b border-transparent group-hover:border-blue-300 pb-0.5">
                  See All Reviews
                </span>
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            {/* MORE LIKE THIS */}
            <div className="bg-[#141518] rounded-xl p-4 border border-gray-800">
              <h3 className="text-lg font-semibold mb-3">More Like This</h3>
              <Section data={similarMovies} />
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-4">
            <div className="bg-[#141518] rounded-xl p-4 border border-gray-800">
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2">Details</h3>
              <p className="text-sm md:text-base lg:text-lg">
                <span className=" text-gray-300">Director: </span>
                <span onClick={() => handleCelebsClick(movie.details.director)} className="text-blue-400 hover:underline cursor-pointer">{movie.details.director}</span>
              </p>
              <p className="text-sm md:text-base lg:text-lg text-gray-300">Writers: {movie.details.writers}</p>
              <p className="text-sm md:text-base lg:text-lg text-gray-300">Budget: {movie.details.budget}</p>
            </div>

          </aside>
        </div>

        <div className="h-12" />
      </div>


    </div>
  );
}

const Section = ({ data }) => {

  if (!data || data.length === 0) return (
    <div className="flex flex-col items-center justify-center m-4 p-4 min-h-[200px]">

      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-bounce mb-4"></div>

      <p className="text-center lg:text-2xl md:text-xl text-lg font-medium text-gray-700 animate-pulse">
        Loading Similar Movies...
      </p>

    </div>
  );



  return (
    <section className="md:px-8 md:py-6 px-2 py-4">
      <div className="flex justify-between items-center mb-4">
        {/* <button className="text-cyan-400">See All</button> */}
      </div>
      <div className="flex gap-5 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {data.filter(movie => movie.poster && movie.poster !== "N/A").map((item, index) => (
          <MovieCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
};


const MovieCard = ({ title, poster, rating, tmdb_id }) => {
  // const navigate = useNavigate();

  // async function handleViewDetails(e) {
  //   console.log("Clicked on: " + title)

  //   e.preventDefault();
  //   let finalImdbId = imdbId;

  //   if (!finalImdbId && tmdb_id) {
  //     const mediaType = Type === "series" || Type === "tv" ? "tv" : "movie";
  //     finalImdbId = await fetchImdbId(tmdb_id, mediaType);
  //   }


  //   if (finalImdbId) {
  //     navigate(`/page/${Type}/${encodeURIComponent(finalImdbId)}`);
  //   } else {
  //     // console.warn("Could not navigate: IMDb ID missing");
  //   }
  // }

  // async function fetchImdbId(tmdb_id, media) {
  //   try {
  //     // console.log("Fetching ImdbId")
  //     const res = await fetch(`https://api.themoviedb.org/3/${media}/${tmdb_id}/external_ids?api_key=${tmdbApi}`);
  //     const data = await res.json();
  //     const imdbId = data.imdb_id;
  //     return imdbId;
  //   } catch (error) {
  //     // console.log("Could not fetch ImdbIb" + error);
  //     return null;
  //   }
  // }

  return (
    <div className="cursor-pointer md:w-[180px] w-[110px] flex-shrink-0 rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300 bg-gray-900 text-white">
      {/* Image with gradient overlay */}
      <div className="relative h-30 md:h-50 w-full">
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

        {/* Rating badge */}
        <span className="absolute top-2 right-2 bg-yellow-400 text-black md:text-sm text-xs font-bold px-2 py-1 rounded-md shadow">
          ⭐ {rating}
        </span>
      </div>

      {/* Title */}
      <div className="p-3">
        <h3 className="text-sm md:text-xl font-semibold truncate">{title}</h3>
      </div>
    </div>
  );
};