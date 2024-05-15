import React from 'react';

const RatingBar = () => {
  const ratings = [5, 4, 3, 2, 1]; // Array of possible ratings

  return (
    <>
        <div className='text-center text-3xl text-black font-poppins mb-7'>Customer reviews</div>
      {ratings.map((rating) => (
        <div key={rating} className="flex items-center mt-4">
          <a
            href="#"
            className="text-sm font-normal text-black dark:text-blue-500 hover:underline"
          >
            {rating} star
          </a>
          <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
            <div
              className="h-5 bg-yellow-300 rounded"
              style={{ width: `${(rating / 5) * 100}%` }} // Dynamic width based on rating
            />
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-6 ">
            {(rating / 5) * 100}%
          </span>
        </div>
      ))}
    </>
  );
};

export default RatingBar;