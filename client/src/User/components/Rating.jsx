import React from 'react';

const Rating = () => {
  const numStars = 5; // Adjust as needed

  const stars = [];
  for (let i = 1; i <= numStars; i++) {
    stars.push(
      <input
        key={i} // Add a unique key for each star
        type="radio"
        name={`rating-${i}`}
        className="mask mask-star-2 bg-[#DE5B9D] w-5 h-5"
        disabled  
      />
    );
  }

  return <div className="rating">{stars}</div>;
};

export default Rating;