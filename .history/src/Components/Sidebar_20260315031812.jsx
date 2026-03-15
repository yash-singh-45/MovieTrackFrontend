import { useNavigate } from "react-router-dom";
import { User, LogOut, LogIn, Heart, Bookmark } from 'lucide-react'; // Optional icons

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    
    // Check if user is logged in
    const isLoggedIn = !!localStorage.getItem("token");

    const handleNavigation = (path) => {
        navigate(path);
        onClose();
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
        onClose();
        window.location.reload(); // Refresh to update UI states
    };

    return (
        <>
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 z-40"
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-60 md:w-64 bg-[#111318] z-50
          transform transition-transform duration-300 border-l border-gray-800
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
            >
                <div className="p-6 text-white h-full flex flex-col">
                    <h2 className="text-2xl font-bold mb-8 text-[#00FFD1]">🎬 CineTrack</h2>

                    <nav className="flex flex-col gap-6 flex-1">
                        {/* Profile Section (Only if Logged In) */}
                        {isLoggedIn && (
                            <button
                                onClick={() => handleNavigation("/profile")}
                                className="cursor-pointer flex items-center gap-3 text-base md:text-lg text-[#00FFD1] hover:opacity-80 transition"
                            >
                                <User size={20} /> My Profile
                            </button>
                        )}

                        <button
                            onClick={() => handleNavigation("/watchlist")}
                            className="cursor-pointer flex items-center gap-3 text-base md:text-lg hover:text-red-400 transition"
                        >
                            <Bookmark size={20} /> Watchlist
                        </button>

                        <button
                            onClick={() => handleNavigation("/favorites")}
                            className="cursor-pointer flex items-center gap-3 text-base md:text-lg hover:text-yellow-400 transition"
                        >
                            <Heart size={20} /> Favorites
                        </button>
                    </nav>

                    {/* Bottom Action Button */}
                    <div className="mt-auto pb-4">
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-500 py-3 rounded-lg hover:bg-red-500 hover:text-white transition"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        ) : (
                            <button
                                onClick={() => handleNavigation("/login")}
                                className="w-full flex items-center justify-center gap-2 bg-[#00FFD1] text-black py-3 rounded-lg font-semibold hover:opacity-90 transition"
                            >
                                <LogIn size={18} /> Login
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;