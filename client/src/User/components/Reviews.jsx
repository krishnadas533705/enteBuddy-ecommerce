import React, { useEffect, useState } from "react";
import Rating from "./Rating";

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        let productReviews = await fetch(`/api/user/fetchReviews/${productId}`);
        if (productReviews.ok) {
          productReviews = await productReviews.json();
          console.log("product reviews : ", productReviews);
          setReviews(productReviews.reviews);
        } else {
          throw new Error("Failed to fetch reviews.");
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <div>
      <ul className="">
        <li className="py-5 text-left border px-4 m-2 font-poppins">
          <div className="flex items-start">
            <div className="">
              <Rating />
              {reviews &&
                reviews.map((item) => (
                  <div key={item._id}>
                    <p className="mt-5 text-sm font-bold text-gray-900">
                      {item.name}
                    </p>
                    <p className="rating mt-1">{item.rating}
                      <input
                        key={item.userId}
                        type="radio"
                        name={`rating-${item._id}`}
                        className="mask mask-star-2 bg-yellow-400 w-5 h-5"
                        disabled
                      />
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
