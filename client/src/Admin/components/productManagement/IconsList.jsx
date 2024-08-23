import { useContext, useEffect, useState } from "react";
import AdminContext from "../../context/AdminContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

const IconsList = ({ listPrompt, setListPrompt, updateIcon }) => {
  const [allIcons, setAllIcons] = useState(null);
  const { adminId } = useContext(AdminContext);

  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    (async () => {
      try {
        let response = await fetch(`/api/admin/fetchIcons/${adminId}`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const allIcons = await response.json();
          setAllIcons(allIcons);
        } else {
          throw new Error("error in fetchin icons.");
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const setICon = (path) => {
    updateIcon(path);
    setListPrompt(false);
  };
  return (
    <div
      className={`${
        listPrompt ? "" : "hidden"
      } inset-0 fixed mt-36 max-h-screen min-h-screen flex flex-col items-center justify-center z-10 overflow-auto backdrop-blur-xl bg-black bg-opacity-30`}
    >
      <div className="flex justify-center text-center items-center w-full h-screen px-3">
        <div className=" bg-white rounded-lg shadow h-1/2 w-4/5 gap-5 pt-2 px-2 ">
          <div className="flex justify-end">
            <button
              className="text-black rounded-full text-sm px-2 py-1"
              onClick={() => {
                setListPrompt(false);
              }}
            >
              <FontAwesomeIcon icon={faClose} size="2x" />{" "}
            </button>
          </div>
          <div className="w-full ms-5">
            <h1 className="text-blue-600 underline font-bold text-lg">
              Choose your icon.
            </h1>
          </div>
          <div className="p-7">
            <div className="flex gap-6">
              {allIcons &&
                allIcons.map((icon) => (
                  <div key={icon._id} className="">
                    <img
                      className="h-16 w-16 hover:border-cyan-950 hover:cursor-pointer border-2 "
                      src={API + icon.path.split("server")[1]}
                      alt=""
                      onClick={(e) => setICon(icon.path)}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconsList;
 