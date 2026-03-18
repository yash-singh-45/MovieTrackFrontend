import React, { useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Star, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { AuthContext } from './AuthContext';

const WriteReview = () => {
    const { imdbId } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { user } = useContext(AuthContext);

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [header, setHeader] = useState("");
    const [reviewBody, setReviewBody] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const movieTitle = state?.movie?.title || "Movie";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) return toast.error("Please select a rating");

        setIsSubmitting(true);

        const token = localStorage.getItem("token");

        const reviewData = {
            imdbId: imdbId,
            review: reviewBody.trim(), // Must be 20-500 chars
            userId: user.userId || user.id,
            rating: parseInt(rating), // Matches 'int rating'
            header: header.trim()     // Max 50 chars
        };

        if (reviewData.review.length < 100 || reviewData.review.length > 500) {
            return toast.error("Review length must be between 50 and 500 chars");
        }
        if (reviewData.header.length > 100) {
            return toast.error("Headline is too long (max 50)");
        }

        try {
            const response = await fetch("https://cinetrack-production-8848.up.railway.app/review", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(reviewData)
            });

            if (response.ok) {
                toast.success("Review submitted!");
                navigate(-1);
            } else {
                toast.error("Failed to submit review");
            }
        } catch (err) {
            toast.error("Server connection error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white p-4 sm:p-8 md:p-12 flex items-center justify-center">
            <div className="max-w-3xl w-full bg-[#1e293b] rounded-xl md:rounded-2xl p-5 sm:p-8 md:p-10 border border-white/10 shadow-2xl relative">

                {/* Close Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-3 right-3 sm:top-5 sm:right-5 text-gray-500 hover:text-white transition-colors p-2"
                >
                    <X size={24} />
                </button>

                <header className="mb-6 md:mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-1">Write a Review</h2>
                    <p className="text-blue-400 text-sm sm:text-base font-medium line-clamp-1">{movieTitle}</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">

                    {/* Responsive Star Rating */}
                    <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                        <label className="block text-gray-400 text-[10px] sm:text-xs font-bold mb-3 uppercase tracking-widest">
                            Your Rating
                        </label>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                            <div className="flex flex-wrap gap-1 sm:gap-1.5 max-w-[280px] sm:max-w-none">
                                {[...Array(10)].map((_, index) => {
                                    const starValue = index + 1;
                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            className="cursor-pointer transition-transform active:scale-90"
                                            onClick={() => setRating(starValue)}
                                            onMouseEnter={() => setHover(starValue)}
                                            onMouseLeave={() => setHover(0)}
                                        >
                                            <Star
                                                size={window.innerWidth < 640 ? 20 : 26}
                                                className={`transition-colors duration-150 ${starValue <= (hover || rating) ? "text-amber-400 fill-amber-400" : "text-gray-700"
                                                    }`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                            <span className="ml-2 text-xl sm:text-2xl font-black text-amber-400 min-w-[50px]">
                                {rating || hover || 0}<span className="text-gray-600 text-sm font-normal">/10</span>
                            </span>
                        </div>
                    </div>

                    {/* Headline Input */}
                    <div>
                        <label className="block text-gray-400 text-[10px] sm:text-xs font-bold mb-2 uppercase tracking-widest">
                            Headline
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Summarize your thoughts..."
                            value={header}
                            onChange={(e) => setHeader(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-600"
                        />
                    </div>

                    {/* Review Body */}
                    <div>
                        <label className="block text-gray-400 text-[10px] sm:text-xs font-bold mb-2 uppercase tracking-widest">
                            Detailed Review
                        </label>
                        <textarea
                            required
                            rows={window.innerWidth < 640 ? 5 : 8}
                            placeholder="What did you think of the plot, acting, and visuals?"
                            value={reviewBody}
                            onChange={(e) => setReviewBody(e.target.value)}
                            className={`w-full bg-black/20 border border-white/10 rounded-lg  ${reviewBody.length < 500 ? 'text-white-500' : 'text-red-500'}
                             px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2
                              focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none placeholder:text-gray-600`}
                        />

                        <div className="flex justify-between mt-2 px-1">
                            <p className={`text-xs font-medium ${reviewBody.length < 100 ? 'text-amber-500' : 'text-green-500'}`}>
                                {reviewBody.length < 100
                                    ? `Need ${100 - reviewBody.length} more characters...`
                                    : "✅"}
                            </p>
                            <p className="text-xs text-gray-500">{reviewBody.length}/500</p>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#f5c518] hover:bg-[#e2b616] disabled:bg-gray-700 text-black font-extrabold py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-yellow-500/5"
                    >
                        {isSubmitting ? (
                            <div className="h-5 w-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            <>
                                <Send size={18} className="hidden sm:block" />
                                <span className="text-sm sm:text-base uppercase tracking-wider">Submit Review</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WriteReview;