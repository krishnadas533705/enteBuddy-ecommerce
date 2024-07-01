import React, { useEffect, useState } from "react";

const Banner = () => {
  const [bannerImage, setBannerImage] = useState(null);
  const API = import.meta.env.VITE_API_URL;
  useEffect(() => {
    (async () => {
      try {
        const banner = await fetch(`/api/user/fetchBanner`, {});
        if (banner.ok) {
          const newBanner = await banner.json();
          setBannerImage(newBanner.path);
        }
      } catch {
        throw new ERROR("Banner fetching failed");
      }
    })();
  }, []);
  return (
    <div className="w-full p-4 lg:px-16 lg:pt-7  ">
      {bannerImage && (
        <img
          src={API + bannerImage.split('server')[1]}
          alt="img"
          className="rounded-3xl lg:max-h-[400px] w-full object-fit"
        />
      )}
    </div>
  );
};

export default Banner;
