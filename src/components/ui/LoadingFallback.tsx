const LoadingFallback = () => (
    <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading application...</p>
        </div>
    </div>
);

export default LoadingFallback;

