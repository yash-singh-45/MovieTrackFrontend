export  const Skeleton = () => {
    return (
        <div className='bg-[#0F1115] min-h-screen font-sans sm:p-2 lg:p-5 text-white overflow-hidden animate-pulse'>

            <div className='mx-4 mt-5 mb-2 md:mx-4 md:mt-15 lg:mx-10 lg:mt-20 bg-[#1E1E23] shadow-2xl rounded-2xl p-1.5 md:px-5 md:py-2'>

                {/* Title and Sort Bar */}
                <div className='my-1 md:my-2 flex justify-between items-center'>
                    <div className='h-10 bg-gray-800 rounded w-48' />
                    <div className='h-8 bg-gray-800 rounded-2xl w-32 mr-1 md:mr-5' />
                </div>

                {/* Movie Grid Skeleton */}
                <div className="grid grid-cols-3 my-5 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-6">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="bg-[#1A1C22] border border-gray-800 rounded-lg overflow-hidden">
                            <div className="w-full aspect-square bg-gray-800" />
                            <div className="md:p-3 p-1">
                                <div className="h-3 bg-gray-800 rounded w-3/4 mb-1" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};
