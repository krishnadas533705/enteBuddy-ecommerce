import React from "react";
import { useContext } from "react";
import { ReviewFormContext } from "../contexts/ReviewFormContext";
import ReviewForm from "./ReviewForm";
import { userContext } from "../contexts/UserContext";
import Test from "./Test";
import LogContext from "../contexts/LogContext";

const RatingBar = () => {
  const { reviewModal, setReviewModal, onClose, reviews } =
    useContext(ReviewFormContext);
  const reviewsCount = {};

  for (let rating = 1; rating <= 5; rating++) {
    reviewsCount[rating] = 0;
  }
  if (reviews) {
    reviews.forEach((review) => {
      reviewsCount[review.rating]++;
    });
  }
 
  const result = Object.keys(reviewsCount).map((rating) => ({
    rating: parseInt(rating, 10),
    count: reviewsCount[rating],
  }));

  result.sort((a, b) => b.rating - a.rating);

  const { userId } = useContext(userContext);
  let averageRating;
  if (reviews) {
    averageRating = result
      .reduce(
        (acc, curr) =>
          (acc = acc + (curr.rating * curr.count) / reviews.length),
        0
      )
      .toFixed(1);
  }

  const totalReviews = result.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="w-full md:w-3/4">
      <div className="md:px-10 max-w-screen-lg px-2 pt-10 pb-5">
        <div className="flex w-full flex-col">
          <div className="flex flex-col sm:flex-row">
            <h1 className="max-w-sm text-2xl mb-5 font-bold text-tertiary text-center font-poppins">
              Customer Reviews
            </h1>
            <div className="my-4 rounded-xl bg-white py-2 px-4 shadow sm:my-0 sm:ml-auto">
              <div className="flex h-16 items-center text-2xl font-bold text-blue-900">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-yellow-400 "
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {averageRating}
              </div>
              <p className="text-sm text-gray-500">Average User Rating</p>
            </div>
          </div>
          <div className="text-gray-700">
            <p className="font-medium">Reviews</p>
            <ul className="mb-6 mt-2 space-y-2">
              {result &&
                result.map((review, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm font-medium"
                  >
                    <span className="w-3">{review.rating}</span>
                    <span className="mr-4 text-yellow-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </span>
                    <div className="mr-4 h-2 w-96 overflow-hidden rounded-full bg-gray-300">
                      <div
                        className={`h-full w-24 bg-yellow-400`}
                        style={{
                          width: `${(review.count / totalReviews) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="w-3">{review.count}</span>
                  </li>
                ))}
            </ul>
          </div>
          {userId && (
            <button
              onClick={() => {
                setReviewModal(true);
              }}
              className="w-36 rounded-full bg-tertiary text-[#FEEE9F] bg-hero2 bg-contain py-3  font-medium"
            >
              Write a review
            </button>
          )}
        </div>
      </div>
      {reviewModal && <ReviewForm />}
    </div>
  );
};

export default RatingBar;
