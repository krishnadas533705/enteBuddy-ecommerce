
import { ReviewFormContext } from "../contexts/ReviewFormContext";
import { useContext,useRef } from "react";

const ReviewForm = () => {
    const {onClose} = useContext(ReviewFormContext)
    const modalRef = useRef();

    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    };

  return (
    <div
    ref={modalRef}
    onClick={closeModal}
    className="text-white z-10 fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center"
>
    <div className="flex flex-col">
        <button onClick={onClose} className="place-self-end">
            X
        </button>
        <div className="border border-blue-100 py-8 px-10 bg-hero2 bg-contain bg-[#3A2D3F] rounded-xl flex flex-col gap-5 font-poppins ">
            <form> 
                <label className="mr-2">name</label>
                <input>
                </input>
            </form>
        </div>
    </div>
</div>
  )
}

export default ReviewForm