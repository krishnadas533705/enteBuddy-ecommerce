const validateBanner = (bannerData,setError) => {
  const { title, startDate, endDate, bannerImage } = bannerData;
  let error = false;

  if (title == "" || !title) {
    setError((previous) => ({
      ...previous,
      title: "Banner title is required!",
    }));
    error = true;
  }

  if (!startDate) {
    setError((previous) => ({
      ...previous,
      startDate: "Start date is required!",
    }));
    error = true;
  }

  if (!endDate) {
    setError((previous) => ({
      ...previous,
      endDate: "End date is required!",
    }));
    error = true;
  }

  if (!bannerImage) {
    setError((previous) => ({
      ...previous,
      bannerImage: "Banner Image is required!",
    }));
    error = true;
  }
  return error;
};

export default validateBanner;
