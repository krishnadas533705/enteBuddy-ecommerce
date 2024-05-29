
import { ReviewFormContext } from "../contexts/ReviewFormContext";
import { useContext, useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";

const ReviewForm = () => {
  const { onClose, onSubmit } = useContext(ReviewFormContext);
  const modalRef = useRef();
  const [hoverRating, setHoverRating] = useState(0);

  const [userInput, setUserInput] = useState({
    name: "",
    review: "",
    rating: 0,
  });
 
  useEffect(()=>{
    
    const timer = setInterval(()=>{
      console.log(helloo)
    },2000)
    return ()=>{ 
        clearInterval(timer)
        console.log("component unmounting and values are reset ")
    }

  })
  const [errors, setErrors] = useState({});

  const closeModal = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInput((prevInput) => ({ ...prevInput, [name]: value }));
  };

  const handleRatingClick = (rating) => {
    setUserInput((prevInput) => ({ ...prevInput, rating }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();


    
    const newErrors = {};
    if (!userInput.name.trim()) newErrors.name = "Name is required";
    if (!userInput.review.trim()) newErrors.review = "Review is required";
    if (userInput.rating === 0) {
        newErrors.rating = "Rating is required"; 
      }
 
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // No errors, submit the review 
      console.log(userInput)
    //   onSubmit(userInput); backend code can be written in review form context avde onSubmit function create chythu bakend req ayk
      onClose();    
      console.log("jioo")
    }
  };

  return (
    <div ref={modalRef} onClick={closeModal} className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm text-white">
      <div className="flex flex-col bg-hero2 bg-contain bg-[#3A2D3F] border border-blue-100 py-8 px-10 rounded-xl font-poppins gap-5 text-black">
        <button onClick={onClose} className="place-self-end text-white text-2xl">
          X
        </button>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="name"
              value={userInput.name}
              onChange={handleChange}
              className="mt-1 p-2 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="review" className="block text-sm font-medium text-gray-700">
              Review
            </label>
            <textarea
              id="review"
              name="review"
              placeholder="review"
              value={userInput.review}
              onChange={handleChange}
              className="mt-1 p-2 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0"
            />
            {errors.review && <p className="text-red-500 text-sm">{errors.review}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
              Rating
            </label>
            <div className="flex">
              {[...Array(5)].map((star, index) => {
                const ratingValue = index + 1;
                return (
                  <FaStar
                    key={index}
                    className="cursor-pointer"
                    size={24}
                    onClick={() => handleRatingClick(ratingValue)}
                    onMouseEnter={() => setHoverRating(ratingValue)} 
                    onMouseLeave={()=>{setHoverRating(0)}}
                   
                    color={
                      ratingValue <= (userInput.rating || hoverRating) ? "#ffc107" : "#e4e5e9"
                    }
                  />
                );
              })}
            </div>
            {errors.rating && <p className="text-red-500 text-sm">{errors.rating}</p>}
          </div>

          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;