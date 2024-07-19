import { useContext, useEffect, useState } from "react";
import AdminContext from "../../context/AdminContext";

const IconsList = ({
  listPrompt,
  setListPrompt,
  updateIcon,
}) => {
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
    updateIcon(path)
    setListPrompt(false)
  };
  return (
    <div
      className={`${
        listPrompt ? "" : "hidden"
      } inset-0 fixed overflow-auto backdrop-blur-sm bg-black bg-opacity-30`}
    >
      <div className="flex justify-center items-center w-full h-full px-3">
        <div className="relative bg-white rounded-lg shadow h-1/2 w-2/3  flex gap-5 p-8">
          {allIcons &&
            allIcons.map((icon) => (
              <div key={icon._id} className="">
                <img
                  className="h-16 w-16 hover:border-cyan-950 hover:cursor-pointer border-2 "
                  src={API + icon.path.split("server")[1]}
                  alt=""
                  onClick={(e)=>setICon(icon.path)}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default IconsList;
