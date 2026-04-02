import React from "react";

const ReviewSkeleton = () => {
  const SkBlock = ({ w = "100%", h = 16, rounded = 6, className = "" }) => (
    <div
      className={`animate-pulse bg-white/[0.08] ${className}`}
      style={{ width: w, height: h, borderRadius: rounded, flexShrink: 0 }}
    />
  );

  const ReviewCardSkeleton = ({ lines = 4, titleWidth = "55%" }) => (
    <div className="bg-white/[0.02] border-b border-white/5 p-4 sm:p-6">
      {/* Rating badge + headline */}
      <div className="flex items-center gap-3 mb-3">
        <SkBlock w={44} h={26} rounded={4} />
        <SkBlock w={titleWidth} h={20} />
      </div>

      {/* Username + date */}
      <div className="flex gap-3 mb-4">
        <SkBlock w={80} h={14} />
        <SkBlock w={110} h={14} />
      </div>

      {/* Review body lines */}
      <div className="flex flex-col gap-2 mb-6">
        {Array.from({ length: lines }).map((_, i) => (
          <SkBlock
            key={i}
            w={i === lines - 1 ? "65%" : i % 2 === 0 ? "100%" : "90%"}
            h={14}
          />
        ))}
      </div>

      {/* Helpful pill */}
      <SkBlock w={130} h={34} rounded={999} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#f5f5f5] py-6 sm:py-10 md:py-20 px-4 sm:px-[5%]">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 mb-8 sm:mb-10 border-b border-white/10 pb-8">
          {/* Poster */}
          <SkBlock w={112} h={160} rounded={8} className="flex-shrink-0" />

          {/* Title block */}
          <div className="flex-1 flex flex-col gap-3 w-full">
            <SkBlock w="55%" h={32} />
            <SkBlock w="35%" h={16} />
          </div>

          {/* Rating + button */}
          <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
            <div className="flex items-baseline gap-2">
              <SkBlock w={70} h={30} />
              <SkBlock w={36} h={18} />
            </div>
            <SkBlock w={140} h={42} rounded={8} className="w-full sm:w-[140px]" />
          </div>
        </header>

        {/* Filter bar */}
        <div className="flex justify-between items-center mb-6 bg-white/5 p-3 sm:p-4 rounded-lg">
          <SkBlock w={90} h={13} />
        </div>

        {/* Review cards */}
        <div className="flex flex-col gap-2">
          <ReviewCardSkeleton lines={4} titleWidth="55%" />
          <ReviewCardSkeleton lines={3} titleWidth="40%" />
          <ReviewCardSkeleton lines={4} titleWidth="62%" />
        </div>

      </div>
    </div>
  );
};

export default ReviewSkeleton;