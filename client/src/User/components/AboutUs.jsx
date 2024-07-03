import { IoCloseCircleOutline } from "react-icons/io5";
import { useRef } from "react";

const AboutUs = ({ onClose }) => {
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
                    <h1 className=" font-extrabold text-3xl text-center text-primary">
                        About us{" "}
                    </h1>

                    <hr />
                    <p className="text-md font-bold max-w-72 text-center text-secondary">
                    "Right for exploration couldn't be suppressed under misconceptions or taboos; regardless of gender. In our life, everyone needs at least that one connection, closer to a person to embrace and share their emotions. But before that, one has to completely understand "what do you really want", there comes ENTE BUDDY as your soulmate to unravel through your feats of love, fleeting and thereby leading to deeply comprehend your own self-pleasure!"
                    You can find us at our physical address: <p className="font-medium">1st
                    Floor, 26/489/B, Sulaiman Sait Road, Maradu, Ernakulam, Kerala</p>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
