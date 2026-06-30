import React from "react";

export default function MoviePageSkeleton() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white p-4 md:p-8 flex justify-center animate-pulse">
      <div className="w-full max-w-7xl">

        {/* TOP CARD */}
        <div className="bg-[#141518] rounded-2xl p-5 md:p-8 shadow-2xl">

          <div className="flex flex-col md:flex-row gap-6">

            {/* Poster */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="w-44 h-64 md:w-52 md:h-80 lg:w-56 lg:h-[340px] rounded-xl bg-zinc-700"></div>
            </div>

            {/* Info */}
            <div className="flex-1">

              {/* Title */}
              <div className="h-10 w-3/4 bg-zinc-700 rounded mb-4"></div>

              {/* Tagline */}
              <div className="h-5 w-1/2 bg-zinc-700 rounded mb-6"></div>

              {/* Meta */}
              <div className="flex gap-3 flex-wrap mb-6">
                <div className="h-5 w-14 bg-zinc-700 rounded"></div>
                <div className="h-5 w-16 bg-zinc-700 rounded"></div>
                <div className="h-8 w-20 bg-zinc-700 rounded-full"></div>
                <div className="h-8 w-24 bg-zinc-700 rounded-full"></div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 mb-6">
                <div className="h-11 w-40 bg-zinc-700 rounded-full"></div>
                <div className="h-11 w-48 bg-zinc-700 rounded-full"></div>
                <div className="h-11 w-11 bg-zinc-700 rounded-full"></div>
              </div>

              {/* Synopsis */}
              <div className="bg-[#0D0D0F] rounded-lg p-4 border border-gray-800">
                <div className="h-6 w-32 bg-zinc-700 rounded mb-4"></div>

                <div className="space-y-3">
                  <div className="h-4 bg-zinc-700 rounded"></div>
                  <div className="h-4 bg-zinc-700 rounded"></div>
                  <div className="h-4 w-5/6 bg-zinc-700 rounded"></div>
                  <div className="h-4 w-2/3 bg-zinc-700 rounded"></div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Left */}
          <div className="md:col-span-2 space-y-4">

            {/* Stream */}
            <div className="bg-[#141518] rounded-xl p-4 border border-gray-800">
              <div className="h-6 w-36 bg-zinc-700 rounded mb-5"></div>

              <div className="flex gap-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-lg bg-zinc-700"></div>
                    <div className="mt-2 h-3 w-14 bg-zinc-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cast */}
            <div className="bg-[#141518] rounded-xl p-4 border border-gray-800">
              <div className="h-6 w-24 bg-zinc-700 rounded mb-5"></div>

              <div className="flex gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-20 bg-zinc-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-[#141518] rounded-xl p-4 border border-gray-800">
              <div className="h-6 w-48 bg-zinc-700 rounded mb-5"></div>

              <div className="h-12 w-16 bg-zinc-700 rounded mb-3"></div>

              <div className="h-5 w-36 bg-zinc-700 rounded"></div>
            </div>

            {/* Similar Movies */}
            <div className="bg-[#141518] rounded-xl p-4 border border-gray-800">
              <div className="h-6 w-40 bg-zinc-700 rounded mb-5"></div>

              <div className="flex gap-5 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-[120px] md:w-[170px] flex-shrink-0"
                  >
                    <div className="h-44 md:h-60 bg-zinc-700 rounded-xl"></div>
                    <div className="mt-3 h-5 bg-zinc-700 rounded"></div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar */}
          <aside>
            <div className="bg-[#141518] rounded-xl p-4 border border-gray-800">
              <div className="h-6 w-24 bg-zinc-700 rounded mb-5"></div>

              <div className="space-y-4">
                <div className="h-5 bg-zinc-700 rounded"></div>
                <div className="h-5 bg-zinc-700 rounded"></div>
                <div className="h-5 bg-zinc-700 rounded"></div>
              </div>
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}