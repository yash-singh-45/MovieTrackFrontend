import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="bg-[#0F1117] min-h-screen text-white px-4 sm:px-10 py-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {/* Avatar Circle */}
          <div className="bg-gray-700 w-16 h-16 rounded-full"></div>
          <div className="space-y-2">
            {/* Name */}
            <div className="bg-gray-700 h-6 w-32 rounded"></div>
            {/* Email */}
            <div className="bg-gray-700 h-4 w-48 rounded"></div>
          </div>
        </div>
        {/* Button */}
        <div className="bg-gray-700 h-10 w-28 rounded mt-4 sm:mt-0"></div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#1A1C22] p-4 rounded border border-gray-800 h-24 flex flex-col items-center justify-center space-y-2">
            <div className="bg-gray-700 h-8 w-12 rounded"></div>
            <div className="bg-gray-700 h-3 w-20 rounded"></div>
          </div>
        ))}
      </div>

      {/* Activity Skeleton */}
      <div className="mb-8">
        <div className="flex justify-between mb-4">
          <div className="bg-gray-700 h-6 w-32 rounded"></div>
          <div className="bg-gray-700 h-4 w-16 rounded"></div>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="min-w-[150px] bg-[#1A1C22] rounded-lg border border-gray-800">
              <div className="bg-gray-700 h-32 w-full"></div>
              <div className="p-2 space-y-2">
                <div className="bg-gray-700 h-4 w-24 rounded"></div>
                <div className="bg-gray-700 h-3 w-12 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Skeleton */}
      <div className="bg-[#1A1C22] p-6 rounded-lg border border-gray-800 space-y-4">
        <div className="bg-gray-700 h-6 w-40 rounded mb-4"></div>
        <div className="bg-gray-700 h-4 w-full rounded"></div>
        <div className="bg-gray-700 h-4 w-full rounded"></div>
        <div className="bg-gray-700 h-4 w-3/4 rounded"></div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;