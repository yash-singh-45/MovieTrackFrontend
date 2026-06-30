import { SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex items-center justify-center px-4">
      <div className="text-center max-w-md">

        <SearchX
          size={60}
          className="mx-auto text-gray-500 mb-5"
        />

        <h1 className="text-2xl font-semibold text-white">
          Page not found
        </h1>

        <p className="mt-3 text-gray-400">
          We couldn't find the page you're looking for.
          <br />
          It may be invalid.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-8 px-5 py-2.5 bg-white text-black rounded-lg hover:bg-gray-200 transition cursor-pointer"
        >
          Back to Home
        </button>

      </div>
    </div>
  );
}