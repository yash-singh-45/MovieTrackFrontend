import { useState, useEffect } from 'react'
import BlockCard from './BlockCard';
import onebattle from '../assets/onebattle.jpg';
import intersteller from "../assets/Intersteller.webp";
import oppenheimer from "../assets/Oppenheimer.jpg";
import dhurandhar from '../assets/dhurandhar.jpg';
import meiyazhagan from "../assets/meiyazhagan.jpg";
import dark from "../assets/dark.jpg";

export default function HeroSection() {

  const apikey = import.meta.env.VITE_TMDB_API_KEY;
  const baseurl = import.meta.env.VITE_BASE_URL;

  const [loading, setLoading] = useState(true);
  const [heroMovies, setHeroMovies] = useState([]);

  const defaultHeroMovies = [
    {
      title: "Dhurandhar",
      image: dhurandhar,
      genre: "Action Drama Spy",
      imdbId: "tt33014583",
      media_type: "movie"
    },
    {
      title: "One Battle After Another",
      image: onebattle,
      genre: "Action Crime Drama",
      imdbId: "tt30144839",
      media_type: "movie"
    },
    {
      title: "Oppenheimer",
      image: oppenheimer,
      genre: "Biographical Thriller/Drama",
      imdbId: "tt15398776",
      media_type: "movie"
    },
    {
      title: "Interstellar",
      image: intersteller,
      genre: "Science Fiction",
      imdbId: "tt0816692",
      media_type: "movie"
    },
    {
      title: "Meiyazhagan",
      image: meiyazhagan,
      genre: "Drama Family Slice-of-life",
      imdbId: "tt26758372",
      media_type: "movie"
    },
    {
      title: "Dark",
      image: dark,
      genre: "Thriller Suspense Mystery",
      imdbId: "tt5753856",
      media_type: "tv"
    }
  ];

  const getHeroMovies = async () => {

    try {
      setLoading(true);
      const url = `${baseurl}/tmdbapi/heromovies`;

      const response = await fetch(url);

      if (!response.ok) {
        console.log("Could not load hero movies");
      }
      const result = await response.json();

      console.log(result);

      const movies = result.results
        .filter(item => item.backdrop_path)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 7)
        .map(item => ({
          title: item.title || item.name,
          image: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
          tmdbId: item.id,
          media_type: item.media_type,
          popularity: item.popularity,
        }));
      console.log(movies);

      setHeroMovies(movies);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHeroMovies();
  }, []);

  return (
    <BlockCard heroMovies={heroMovies ? heroMovies.length != 0 ? heroMovies : defaultHeroMovies : defaultHeroMovies} loading={loading} setLoading={setLoading} />
  );
}
