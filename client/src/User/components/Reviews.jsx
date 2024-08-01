import React, { useContext, useEffect, useState } from "react";
import { ReviewFormContext } from "../contexts/ReviewFormContext";

const Reviews = ({ handleReviewCount }) => {
  const { reviews } = useContext(ReviewFormContext);
  if (reviews) {
    useEffect(() => {
      handleReviewCount(reviews.length);
    }, [reviews]);
  }

  return (
    <div>
      <ul className="">
        <li className="pt-3 text-left border px-4 m-2 font-poppins">
          <div className="flex items-start">
            <div className="flex flex-col ">
              {reviews &&
                reviews.map((item) => (
                  <div key={item._id} className="mb-3">
                    <p className="mt-5 text-sm font-bold text-gray-900">
                      {item.name}
                    </p>
                    <p className="rating mt-1">
                      {[...Array(item.rating)].map((star, index) => (
                        <input
                          key={index}
                          type="radio"
                          name={`rating-${item.rating}`}
                          className="mask mask-star-2 bg-[#DE5B9D] w-5 h-5"
                          disabled
                        />
                      ))}
                    </p>
                    <p className="mt-1 text-base text-gray-900">
                      {item.review}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Reviews;
