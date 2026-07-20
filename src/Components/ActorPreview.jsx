import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useParams, useNavigate } from 'react-router-dom';

export default function ActorPagePreview() {

    const [castSortBy, setCastSortBy] = useState("popularity");
    const [crewSortBy, setCrewSortBy] = useState("popularity");
    const [loading, setLoading] = useState(false);
    const baseurl = import.meta.env.VITE_BASE_URL;
    const [personData, setPersonData] = useState(null);
    const [overView, setOverview] = useState(null);
    const [castCredits, setCastCredits] = useState([]);
    const [crewCredits, setCrewCredits] = useState([]);
    const navigate = useNavigate();

    const location = useLocation();
    const { name } = useParams();
    const [tmdbId, setTmdbId] = useState(location.state?.id);

    async function fetchTmdbIdFromName(name) {
        try {
            setLoading(true);
            const url = `${baseurl}/tmdbapi/persons/id/${encodeURIComponent(name)}`;

            const response = await fetch(url);

            if (!response.ok) {
                toast.error("Failed to load bio");
                navigate(-1);
                return;
            }

            const result = await response.json();
            const data = result.results
                .sort((a, b) => b.popularity - a.popularity)[0];

            if (!data) {
                toast.error("Person not found");
                navigate(-1);
                return;
            }

            setTmdbId(data?.id);

        } catch (error) {
            console.log("Error:" + error);
            toast.error("Server Error!");
            navigate(-1);
        } finally {
            setLoading(false);
        }
    }

    async function fetchData() {

        if (!tmdbId || tmdbId == null) return;

        try {
            setLoading(true);

            const url = `${baseurl}/tmdbapi/persons/data/${tmdbId}`;

            const response = await fetch(url);
            if (!response.ok) {
                toast.error("Failed to load bio");
                navigate(-1);
                return;
            }

            const data = await response.json();

            setOverview({
                name: data.name,
                profile_path: data.profile_path ? `https://image.tmdb.org/t/p/w780/${data.profile_path}` : null,
                biography: data.biography,
                birthday: data.birthday,
                place_of_birth: data.place_of_birth,
                popularity: data.popularity,
                known_for_department: data.known_for_department === "Acting" ? "Actor" : data.known_for_department === "Directing" ? "Director" : data.known_for_department === "Writing" ? "Writer" : "Artist",
                homepage: data.homepage
            })

            setCastCredits(data.combined_credits?.cast || []);
            setCrewCredits(data.combined_credits?.crew || []);

        } catch (error) {
            console.log("Error:" + error);
            toast.error("Server Error!");
            navigate(-1);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {

        if (!name) return;

        if (!tmdbId || tmdbId == null) {
            fetchTmdbIdFromName(name);
        } else {
            fetchData();
        }
    }, [name, tmdbId])


    return (
        <Actors
            overview={overView}
            castdata={castCredits}
            castSortBy={castSortBy}
            crewSortBy={crewSortBy}
            setCastSortBy={setCastSortBy}
            setCrewSortBy={setCrewSortBy}
            setCastCredits={setCastCredits}
            setCrewCredits={setCrewCredits}
            navigate={navigate}
            loading={loading}
            crewdata={crewCredits}
        />
    );
}

function Actors({ castdata, crewdata, overview, castSortBy, crewSortBy, setCastCredits, setCrewCredits,
    navigate, loading, setCastSortBy, setCrewSortBy }) {

    if (loading || !overview) {
        return <ActorsSkeleton />;
    }

    const sortData = (data, type) => {
        const sorted = [...data];

        switch (type) {
            case "rating":
                return sorted.sort((a, b) => b.vote_average - a.vote_average);

            case "year":
                return sorted.sort(
                    (a, b) =>
                        new Date(b.release_date || b.first_air_date) -
                        new Date(a.release_date || a.first_air_date)
                );

            default: // popularity
                return sorted.sort((a, b) => b.popularity - a.popularity);
        }
    };

    const handleCastSort = (e) => {
        const value = e.target.value;
        setCastSortBy(value);
        setCastCredits(prev => sortData(prev, value));
    };

    const handleCrewSort = (e) => {
        const value = e.target.value;
        setCrewSortBy(value);
        setCrewCredits(prev => sortData(prev, value));
    };

    return (
        <div className='bg-[#0F1115] min-h-screen font-sans sm:p-4 lg:p-8 text-white overflow-x-hidden antialiased'>

            <div className='flex flex-col md:flex-row px-4 py-6 md:px-8 lg:px-12 md:py-8 gap-8 items-center md:items-start border border-white/5 bg-[#16181D]/60 backdrop-blur-md rounded-3xl shadow-2xl relative overflow-hidden group'>

                <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none transition-all duration-700 group-hover:bg-cyan-500/10" />

                <div className='w-full md:w-1/3 flex justify-center md:justify-start shrink-0 relative z-10'>
                    {overview?.profile_path ? (
                        <div className="relative group/poster w-48 h-64 sm:w-56 sm:h-76 md:w-64 md:h-84 lg:w-76 lg:h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                            <img
                                src={overview.profile_path}
                                alt={overview.name}
                                className='w-full h-full object-cover transform transition-transform duration-700 group-hover/poster:scale-105'
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        </div>
                    ) : (
                        <div className='border border-dashed border-gray-700 rounded-2xl w-48 h-64 md:w-64 md:h-84 flex items-center justify-center bg-[#1E1E23] text-gray-500 font-medium text-sm'>
                            No Profile Captured
                        </div>
                    )}
                </div>

                <div className="w-full md:w-2/3 flex flex-col justify-between min-h-[256px] md:min-h-[336px] relative z-10 text-center md:text-left pt-2">
                    <div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-3">
                            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] tracking-widest font-black uppercase px-2.5 py-1 rounded-md">
                                {overview.known_for_department}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-xl">
                            {overview.name}
                        </h1>

                        <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mb-5 text-xs md:text-sm font-medium text-slate-400">
                            {overview.birthday && (
                                <div className="flex items-center gap-1.5">
                                    <span className="text-slate-600 font-bold">BORN:</span>
                                    <span className="text-slate-300">{overview.birthday}</span>
                                </div>
                            )}
                            {overview.place_of_birth && (
                                <div className="flex items-center gap-1.5 border-l border-white/10 pl-6 hidden sm:flex">
                                    <span className="text-slate-600 font-bold">ORIGIN:</span>
                                    <span className="text-slate-300 truncate max-w-[200px]">{overview.place_of_birth}</span>
                                </div>
                            )}
                        </div>

                        <p className="border rounded-lg text-justify text-slate-400 p-2 scrollbar-thin max-h-72 overflow-y-auto pr-2 text-sm md:text-base leading-relaxed font-light"
                            style={{
                                scrollbarWidth: "none",
                                msOverflowStyle: "none",
                            }}>
                            {overview?.biography}
                        </p>
                    </div>


                </div>
            </div>

            <div className=' mx-2 mt-8 mb-6 md:mx-4 md:mt-12 lg:mx-8 lg:mt-16 bg-[#16181D]/60 backdrop-blur-md border border-white/5 shadow-2xl rounded-3xl p-3 md:p-8'>

                <div className='flex justify-between items-center border-b border-white/5 pb-5'>
                    <div className="space-y-0.5">
                        <label className='text-2xl md:text-3xl font-black tracking-tight text-white' htmlFor="cast-sort">Filmography</label>
                        <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Explore theatrical index history records</p>
                    </div>
                </div>

                {/* Cinema Visual Matrix Grid */} {
                    castdata.length != 0 &&
                    <div className=' p-2 border border-white/50 rounded-lg'>
                        <div className='flex justify-between'>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                                Cast
                            </h2>

                            <select
                                id="cast-sort"
                                value={castSortBy}
                                onChange={handleCastSort}
                                className=' px-1 md:px-3.5 md:py-2 rounded-xl text-xs font-semibold md:font-bold border border-white/10 bg-[#0F1115] text-white hover:bg-[#16181D] focus:outline-none focus:border-cyan-500 transition-all cursor-pointer'
                            >
                                <option value="" disabled>↑↓ Sort By</option>
                                <option value="popularity">Popularity</option>
                                <option value="rating">Top Ratings</option>
                                <option value="year">Released Year</option>
                            </select>
                        </div>

                        <div style={{
                            overflowY: "auto",
                            scrollbarWidth: "thin",
                            scrollbarColor: "#555 transparent"
                        }}
                            className=" grid grid-cols-3 py-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 my-2 max-h-[400px] md:max-h-[525px] overflow-y-auto">

                            {castdata
                                .filter(movie => movie.vote_average !== 0 && movie.poster_path)
                                .map((movie) => (
                                    <MovieCard
                                        key={movie.credit_id || `${movie.id}-${movie.media_type}`}
                                        movie={movie}
                                        navigate={navigate}
                                    />
                                ))
                            }
                        </div>
                    </div>
                }

                {
                    crewdata.length != 0 && 
                    <div className='border border-white/50 mt-15 p-2 rounded-lg'>
                        <div className='flex justify-between'>
                            <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                                Crew
                            </h2>

                            <select
                                id="crew-sort"
                                value={crewSortBy}
                                onChange={handleCrewSort}
                                className=' px-1 md:px-3.5 md:py-2 rounded-xl text-xs font-semibold md:font-bold border border-white/10 bg-[#0F1115] text-white hover:bg-[#16181D] focus:outline-none focus:border-cyan-500 transition-all cursor-pointer'
                            >
                                <option value="" disabled>↑↓ Sort By</option>
                                <option value="popularity">Popularity</option>
                                <option value="rating">Top Ratings</option>
                                <option value="year">Released Year</option>
                            </select>
                        </div>


                        <div style={{
                            overflowY: "auto",
                            scrollbarWidth: "thin",
                            scrollbarColor: "#555 transparent"
                        }}
                            className=" grid grid-cols-3 py-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 my-2 max-h-[400px] md:max-h-[525px] overflow-y-auto">

                            {crewdata
                                .filter(movie => movie.vote_average !== 0 && movie.poster_path)
                                .map((movie) => (
                                    <MovieCard
                                        key={movie.credit_id || `${movie.id}-${movie.media_type}`}
                                        movie={movie}
                                        navigate={navigate}
                                    />
                                ))
                            }
                        </div>
                    </div>
                }
            </div>
        </div >
    );
}

function MovieCard({ movie, navigate }) {

    // function handleClick(e) {
    //     e.preventDefault();
    //     navigate(`/page/${movie.media_type}/${encodeURIComponent(movie.id)}`);
    // }

    return (
        <div
            // onClick={handleClick}
            className="bg-[#1A1C22] border border-cyan-500 rounded-lg overflow-hidden shadow-md transform transition-transform hover:scale-105 hover:border-2 md:hover:border-3 hover:shadow-xl cursor-pointer"
        >
            <div className="relative">
                <img
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full aspect-square object-cover"
                />
            </div>
            <div className="md:p-3 p-1">
                <p className="md:text-sm text-xs font-semibold mb-1 truncate ">{movie.title ? movie.title : movie.original_name}</p>
                <p className='text-xs text-cyan-400'>{movie.job ? movie.job : "Acting"}</p>
            </div>
        </div>
    );

}

const ActorsSkeleton = () => {
    return (
        <div className='bg-[#0F1115] min-h-screen font-sans sm:p-4 lg:p-8 text-white overflow-hidden relative'>

            {/* Custom YouTube Shimmer Effect Injector */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .shimmer-bg {
                    position: relative;
                    overflow: hidden;
                    background-color: #27272A !important;
                }
                .shimmer-bg::after {
                    position: absolute;
                    top: 0; right: 0; bottom: 0; left: 0;
                    transform: translateX(-100%);
                    background-image: linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0) 0%,
                        rgba(255, 255, 255, 0.08) 20%,
                        rgba(255, 255, 255, 0.15) 60%,
                        rgba(255, 255, 255, 0) 100%
                    );
                    animation: shimmer 1.5s infinite;
                    content: '';
                }
            `}} />

            {/* Header Profile Box Skeleton */}
            <div className='flex flex-col md:flex-row px-4 py-6 md:px-8 lg:px-12 md:py-8 gap-8 items-center md:items-start border border-white/5 bg-[#16181D]/60 rounded-3xl'>
                {/* Avatar Poster Element */}
                <div className='w-full md:w-1/3 flex justify-center md:justify-start shrink-0'>
                    <div className='shimmer-bg rounded-2xl w-48 h-64 sm:w-56 sm:h-76 md:w-64 md:h-84 lg:w-76 lg:h-96' />
                </div>

                {/* Info Text Stack */}
                <div className="w-full md:w-2/3 flex flex-col justify-between min-h-[256px] md:min-h-[336px] gap-4 pt-2">
                    <div>
                        <div className='flex gap-2 mb-4 justify-center md:justify-start'>
                            <div className='h-5 shimmer-bg rounded w-16' />
                            <div className='h-5 shimmer-bg rounded w-32' />
                        </div>
                        <div className="h-12 shimmer-bg rounded-xl w-3/4 mb-4 mx-auto md:mx-0" />
                        <div className="h-4 shimmer-bg rounded w-1/3 mb-6 mx-auto md:mx-0" />
                        <div className="space-y-2.5">
                            <div className="h-4 shimmer-bg rounded w-full" />
                            <div className="h-4 shimmer-bg rounded w-[96%]" />
                            <div className="h-4 shimmer-bg rounded w-[92%]" />
                            <div className="h-4 shimmer-bg rounded w-[45%]" />
                        </div>
                    </div>
                    <div className="h-4 shimmer-bg rounded w-32 mt-4 mx-auto md:mx-0" />
                </div>
            </div>

            {/* Filmography Section Container Skeleton */}
            <div className='mx-4 mt-8 mb-6 md:mx-4 md:mt-12 lg:mx-8 lg:mt-16 bg-[#16181D]/60 rounded-3xl p-5 md:p-8 border border-white/5'>
                <div className='flex justify-between items-center border-b border-white/5 pb-5'>
                    <div className='h-8 shimmer-bg rounded-lg w-40' />
                    <div className='h-9 shimmer-bg rounded-xl w-32' />
                </div>

                {/* Responsive Grid Structure mirroring actual item setup */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 my-6 gap-4 md:gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-[#0F1115]/80 border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                            {/* Media Poster Frame */}
                            <div className="w-full aspect-[2/3] shimmer-bg" />
                            {/* Text lines beneath thumbnail metadata */}
                            <div className="p-3.5 space-y-2.5">
                                <div className="h-3.5 shimmer-bg rounded w-5/6" />
                                <div className="h-3 shimmer-bg rounded w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};