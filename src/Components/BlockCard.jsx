import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BlockCard = ({ heroMovies, loading, setLoading }) => {
    const navigate = useNavigate();


    const apikey = import.meta.env.VITE_TMDB_API_KEY;
    const baseurl = import.meta.env.VITE_BASE_URL;

    const slides = heroMovies?.length > 0
        ? [heroMovies[heroMovies.length - 1], ...heroMovies, heroMovies[0]]
        : [];

    const [current, setCurrent] = useState(1); // Start at index 1 (the first real movie)
    const [isTransitioning, setIsTransitioning] = useState(true);

    const intervalRef = React.useRef(null);
    const startX = React.useRef(0);
    const isSwiping = React.useRef(false);

    const startAutoPlay = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            nextSlide();
        }, 5000);
    };

    useEffect(() => {
        if (!heroMovies?.length) return;
        startAutoPlay();
        return () => clearInterval(intervalRef.current);
    }, [heroMovies]);

    // Instantly teleport to real boundary index without animation when reaching clone items
    useEffect(() => {
        if (!heroMovies?.length) return;

        if (current === 0) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrent(heroMovies.length);
            }, 700); // Must match duration-700
            return () => clearTimeout(timer);
        }

        if (current === heroMovies.length + 1) {
            const timer = setTimeout(() => {
                setIsTransitioning(false);
                setCurrent(1);
            }, 700); // Must match duration-700
            return () => clearTimeout(timer);
        }
    }, [current, heroMovies]);

    const nextSlide = () => {
        setIsTransitioning(true);
        setCurrent(prev => prev + 1);
    };

    const prevSlide = () => {
        setIsTransitioning(true);
        setCurrent(prev => prev - 1);
    };

    const pause = () => clearInterval(intervalRef.current);
    const resume = () => startAutoPlay();

    useEffect(() => {
        if (!heroMovies?.length) return;
        heroMovies.forEach(movie => {
            const img = new Image();
            img.src = movie.image;
        });
    }, [heroMovies]);

    if (!heroMovies || heroMovies.length === 0) {
        return (
            <section className="relative px-8 py-8">
                <p className="text-white text-center">Loading movies...</p>
            </section>
        );
    }

    // Convert current infinite index back to base index for navigation and indicator dots
    const activeRealIndex = current === 0
        ? heroMovies.length - 1
        : current === heroMovies.length + 1
            ? 0
            : current - 1;

    async function handleViewDetails() {
        const currentMovie = heroMovies[activeRealIndex];
        if (!currentMovie.imdbId || currentMovie.imdbId === null) {
            const imdbId = await getImdbIdFromTmdbId(currentMovie);
            currentMovie.imdbId = imdbId;
        }
        navigate(`/page/${currentMovie.media_type}/${encodeURIComponent(currentMovie.imdbId)}`);
    }

    async function getImdbIdFromTmdbId(currentMovie) {

        if(!currentMovie) return null;

        try {
            const url = `${baseurl}/tmdbapi/getimdb/${currentMovie.media_type}/${currentMovie.tmdbId}`;

            const response = await fetch(url);

            if (!response.ok) {
                console.log("Error fetching imdbId");
            }

            const result = await response.json();
            console.log(result);

            const imdbId = result.imdb_id;

            return imdbId;
        } catch (err) {
            console.log(err);
        }
    }
    const handleTouchStart = (e) => {
        pause();
        startX.current = e.touches[0].clientX;
        isSwiping.current = false;
    };

    const handleTouchEnd = (e) => {
        const endX = e.changedTouches[0].clientX;
        const diff = startX.current - endX;

        if (Math.abs(diff) < 50) {
            resume();
            return;
        }
        isSwiping.current = true;

        if (diff > 0) nextSlide();
        else prevSlide();

        resume();
    };

    if (loading) return <BlockCardSkeleton />;

    return (
        <section className=" relative md:px-8 md:py-8 px-2 py-2" >
            <div
                className="rounded-lg  w-full overflow-hidden relative cursor-pointer min-h-50 max-h-200 aspect-video"
                onMouseEnter={pause}
                onMouseLeave={resume}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onClick={() => {
                    if (isSwiping.current) {
                        isSwiping.current = false;
                        return;
                    }
                    handleViewDetails();
                }}>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        prevSlide();
                    }}
                    className="absolute left-0.5 md:left-2 top-1/2 -translate-y-1/2 z-20
             h-12 w-8 md:h-20 md:w-12 rounded-full bg-black/40 backdrop-blur-md
             flex items-center justify-center text-white
             hover:bg-black/70 transition cursor-pointer opacity-0 hover:opacity-80"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 opacity-90" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        nextSlide();
                    }}
                    className="absolute right-0.5 md:right-2 top-1/2 -translate-y-1/2 z-20
             h-12 w-8 md:h-20 md:w-12 rounded-full bg-black/40 backdrop-blur-md
             flex items-center justify-center text-white
             hover:bg-black/70 transition cursor-pointer opacity-0 hover:opacity-80 "
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className=" h-5 w-5 md:h-6 md:w-6 opacity-90" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Sliding Track Viewport */}
                <div
                    className={`absolute inset-0 w-full h-full flex ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
                    style={{ transform: `translateX(-${current * 100}%)` }}
                >
                    {slides.map((movie, i) => (
                        <div key={i} className="relative min-w-full h-full flex-shrink-0 overflow-hidden">
                            <img
                                src={movie.image}
                                alt={movie.title}
                                className={`w-full h-full object-cover transition-transform ease-out pointer-events-none
                                    ${i === current ? 'scale-105 duration-[6000ms]' : 'scale-100 duration-700'}`}
                            />

                            <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none">
                                <h2
                                    className={`md:text-5xl text-2xl font-bold md:mb-2 mb-1 text-white transition-all duration-700 delay-100 ease-out
                                        ${i === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                                >
                                    {movie.title}
                                </h2>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {heroMovies.map((_, i) => (
                        <button
                            key={i}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsTransitioning(true);
                                setCurrent(i + 1);
                                startAutoPlay();
                            }}
                            className={`w-1 h-1 md:w-2 md:h-2 rounded-full transition-all duration-300 ${i === activeRealIndex ? 'bg-white md:w-6 w-3' : 'bg-white/40'
                                }`}
                        />
                    ))}
                </div>

            </div>
        </section >
    )
}

export default BlockCard


const BlockCardSkeleton = () => {
    const placeholderDots = Array.from({ length: 5 });

    return (
        <section className="relative md:px-8 md:py-8 px-2 py-2 w-full">
            {/* Injecting YouTube-style keyframe animation inline to avoid extending tailwind.config.js */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes ytShimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .yt-shimmer-effect {
                    position: relative;
                    overflow: hidden;
                    background-color: #212121;
                }
                .yt-shimmer-effect::after {
                    content: "";
                    position: absolute;
                    top: 0; right: 0; bottom: 0; left: 0;
                    transform: translateX(-100%);
                    background: linear-gradient(
                        90deg, 
                        rgba(255, 255, 255, 0) 0%, 
                        rgba(255, 255, 255, 0.08) 50%, 
                        rgba(255, 255, 255, 0) 100%
                    );
                    animation: ytShimmer 1.5s infinite linear;
                }
            `}} />

            <div className="rounded-lg w-full overflow-hidden relative min-h-50 max-h-200 aspect-video yt-shimmer-effect">

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                    {/* Title Text Placeholder */}
                    <div className="h-8 md:h-12 w-2/3 md:w-1/2 bg-[#333333] rounded md:mb-2 mb-1 relative overflow-hidden">
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[ytShimmer_1.5s_infinite_linear]" />
                    </div>
                </div>

                {/* Indicator Dots Skeleton */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {placeholderDots.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1 w-1 md:h-2 rounded-full bg-[#333333] ${i === 0 ? 'md:w-6 w-3 bg-[#4d4d4d]' : 'md:w-2 w-1'
                                }`}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};