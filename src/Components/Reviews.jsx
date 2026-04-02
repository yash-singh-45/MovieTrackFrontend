import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { ThumbsUp } from 'lucide-react';
import ReviewSkeleton from './ReviewSkeleton';
import { MessageSquare } from 'lucide-react';


const Reviews = () => {
  const { imdbId } = useParams();
  const location = useLocation();
  const movie = location.state || { title: "Movie", rating: "N/A", poster: "" };

  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const baseurl = import.meta.env.VITE_BASE_URL;

  const isLiked = false;
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);


  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchReview = async () => {
      const url = `${baseurl}/review/${imdbId}`;

      try {
        setIsLoading(true);
        const response = await fetch(url);

        const data = await response.json();

        if (response.ok) {
          setReviews(data);
        } else {
          toast.error(data.message || "Could not fetch reviews");
        }
      } catch (err) {
        toast.error("Could not connect to server");
      } finally {
        setIsLoading(false);
      }
    }

    fetchReview();
  }, [imdbId]);


  const handleWriteReview = () => {
    if (!user || user == null) {
      toast.error("Please login to write a review");
      navigate("/login");
      return;
    }
    navigate("write-review", { state: { movie } });
  }

  if(isLoading) return <ReviewSkeleton />

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f5f5f5] py-6 sm:py-10 md:py-20 px-4 sm:px-[5%]">
      <div className="max-w-5xl mx-auto">

        {/* Header Section */}
        <header className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 mb-8 sm:mb-10 border-b border-white/10 pb-8 text-center sm:text-left">
          <div className="w-24 h-36 sm:w-28 sm:h-40 bg-gray-800 rounded-lg shadow-2xl flex-shrink-0 overflow-hidden border border-white/10">
            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 sm:mb-2">User Reviews</h1>
            <label className="text-blue-400 text-sm sm:text-base font-medium hover:underline cursor-pointer block">
              {movie.title}
            </label>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col items-center justify-center sm:justify-between gap-3 sm:gap-4 w-full sm:w-auto mt-4 sm:mt-0">

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-amber-400">
                ★ {movie.rating}
              </span>
              <span className="text-gray-400 text-lg sm:text-xl">/10</span>
              <span className="text-gray-500 text-sm sm:text-base">
                IMDb
              </span>
            </div>

            <button onClick={handleWriteReview} className="w-full sm:w-auto md:w-full px-5 sm:px-6 py-2.5 cursor-pointer rounded-lg font-semibold text-sm sm:text-base bg-[#f5c518] text-black hover:bg-[#e2b616] transition-all duration-200 ease-in-out shadow-sm hover:shadow-md active:scale-95">
              + Write Review
            </button>

          </div>

        </header>

        {/* Filter Bar */}
        <div className="flex flex-row justify-between items-center mb-6 text-[10px] sm:text-xs md:text-sm text-gray-400 font-medium bg-white/5 p-3 sm:p-4 rounded-lg">
          <div className="uppercase tracking-wider">{reviews.length} REVIEWS</div>
        </div>

        {/* Reviews List */}
        <div className="flex flex-col gap-2">
          {
            (!reviews || reviews.length == 0) ? (
              <div className="flex flex-col items-center justify-center py-10 md:py-20 pb-10 md:pb-20 bg-white/[0.02] rounded-lg border border-dashed border-white/10">
                <span className="text-4xl mb-4"><MessageSquare size={48} className="text-gray-600 mb-4 stroke-[1.5px]" /></span>
                <p className="text-gray-500 font-medium">No reviews yet. Be the first to write one!</p>
              </div>

            ) : (
              reviews.map((rev) => (
                <div key={rev.reviewId} className="bg-white/[0.02] border-b border-white/5 p-4 sm:p-6 hover:bg-white/[0.04] transition-all">

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                    <div className="w-fit bg-amber-400 text-black px-2 py-0.5 rounded text-xs sm:text-sm font-bold flex items-center gap-1 shrink-0">
                      ★ {rev.rating}
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-white line-clamp-2">"{rev.header}"</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-400 mb-4">
                    <span className="text-blue-400 font-semibold cursor-pointer hover:underline">{rev.username}</span>
                    <span className="hidden xs:inline">•</span>
                    <span className="w-full xs:w-auto">{rev.date}</span>
                  </div>

                  <div className="text-gray-300 leading-relaxed max-w-4xl text-sm sm:text-base mb-6">
                    {rev.review}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[10px] sm:text-[11px] text-gray-500 font-bold tracking-wider uppercase">
                    <div className="flex items-center gap-3 sm:gap-4 border border-white/10 rounded-full px-3 sm:px-4 py-1.5 bg-black/20">
                      <span className="hidden xs:inline">Helpful?</span>
                      <button className="flex items-center gap-2 group transition-all hover:scale-100 cursor-pointer duration-200">
                        <ThumbsUp size={25} className={`transition-all duration-200 transform 
      ${isLiked
                            ? "text-blue-500 fill-blue-500 scale-110"
                            : "text-gray-500 group-hover:text-blue-400 group-hover:scale-110"
                          }`} />
                        <span className={`text-sm sm:text-base transition-colors duration-200 
    ${isLiked ? "text-blue-400 font-bold" : "text-gray-400 group-hover:text-blue-400"}`}>
                          {rev.likes}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Reviews;