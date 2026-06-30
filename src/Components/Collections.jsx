import React, { useContext, useEffect, useState } from 'react'
import { replace, useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from './AuthContext';
import { Skeleton } from './Skeleton';
import toast from 'react-hot-toast';
import PageNotFound from './PageNotFound';

const Collections = () => {

    const { publicId } = useParams();
    const { user } = useContext(AuthContext);
    const baseurl = import.meta.env.VITE_BASE_URL;
    const navigate = useNavigate();
    const [collection, setCollection] = useState(null);

    const [collectionNotFound, setCollectionNotFound] = useState(false);

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getCollectionData() {

        try {
            const response = await fetch(`${baseurl}/collection/${publicId}`);

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.error);
                setCollectionNotFound(true);
                return;
            }

            const result = await response.json();
            setCollection(result);
        } catch (error) {
            toast.error("Failed to fetch collection info!");
            console.log(error);
        }
    }
    async function getMovies() {
        const token = localStorage.getItem('token');
        let loggedIn = true;

        if (!token || !user) loggedIn = false;

        try {
            const response = await fetch(`${baseurl}/collectionmovie/get/${publicId}`, {
                headers: loggedIn ? {
                    Authorization: `Bearer ${token}`,
                } :
                    {}
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.error);
                return;
            }

            const movies = await response.json();
            setMovies(movies);

        } catch (error) {
            console.error(error);
            toast.error("Failed to load movies.");
        }
    }

    useEffect(() => {
        async function loadData() {
            setLoading(true);

            try {
                await Promise.all([
                    getCollectionData(),
                    getMovies()
                ]);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [publicId]);

    if (loading) return <Skeleton />
    if(collectionNotFound) return <PageNotFound />

    if (movies.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#0F1117] text-white px-4">
                <svg
                    className="w-24 h-24 text-gray-500 mb-6 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3h18v18H3V3z M9 9h6v6H9V9z"
                    />
                </svg>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-2">No movies in this collection yet!</h2>

                <button
                    onClick={() => navigate("/", {
                        replace: true
                    })} // navigate to home or movies page
                    className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white text-base md:text-lg lg:text-xl rounded-full font-medium shadow-md transition"
                >
                    Browse Movies
                </button>
            </div>
        );
    }



    return (
        <div className="bg-[#0F1117] min-h-screen px-4 sm:px-10 py-8 text-white">

            <div className="mb-6">
                <div className='flex flex-col md:flex-row  md:items-center md:gap-4'>
                    <h2 className="text-xl md:text-2xl font-semibold">
                        {collection ? collection.name : "Collection"}
                    </h2>
                    <h1 className=" p-1 md:mt-2 text-sm text-gray-400">
                        {collection ? `by ${collection.username}` : ""}
                    </h1>
                </div>

                <p className="text-gray-400 mt-2 md:mt-0 text-sm md:text-base">Showing {movies.length} movies</p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6">
                {movies.map((movie) => (
                    <MovieCard key={movie.imdbId} movie={movie} navigate={navigate} />
                ))}
            </div>
        </div>
    )
}

export default Collections

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
                    src={movie.posterPath || movie.poster}
                    alt={movie.title}
                    className="w-full aspect-square   object-cover"
                />
            </div>
            <div className="md:p-2 p-1">
                <p className="md:text-sm lg:text-lg text-xs font-semibold mb-1 truncate ">{movie.title}</p>
            </div>
        </div>
    );
}
