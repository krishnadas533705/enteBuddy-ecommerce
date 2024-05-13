const validateProductData = (productData, setError) => {
  const {
    title,
    category,
    description,
    quantity,
    price,
    discount,
    primaryImage,
    secondaryImages,
  } = productData;
  let error = false;

  if (title == "" || !title) {
    setError((previous) => ({
      ...previous,
      title: "Product title is required!",
    }));
  
    error = true;
  }

  if (category == "" || !category) {
    setError((previous) => ({
      ...previous,
      category: "Select a category!",
    }));
    error = true;
  }
  if (description == "" || !description) {
    setError((previous) => ({
      ...previous,
      description: "Description is required!",
    }));
    error = true;
  }

  if (!quantity) {
    setError((previous) => ({
      ...previous,
      quantity: "Product quantity is required!",
    }));
    error = true;
  } else if (quantity < 1) {
    setError((previous) => ({
      ...previous,
      quantity: "Quantity should not be less than one.",
    }));
    error = true;
  }

  if (!price) {
    setError((previous) => ({
      ...previous,
      price: "Product price is required!",
    }));
    error = true;
  } else if (price < 1) {
    setError((previous) => ({
      ...previous,
      price: "Price should not be 0 or a negative number.",
    }));
    error = true;
  }

  if (discount && discount < 1) {
    setError((previous) => ({
      ...previous,
      discount: "Discount should not be less than 1",
    }));
    error = true;
  }

  if (!primaryImage) {
    setError((previous) => ({
      ...previous,
      primaryImage: "PrimaryImage is required!",
    }));
    error = true;
  }

  if (!secondaryImages) {
    setError((previous) => ({
      ...previous,
      secondaryImages: "Atleast one secondary image should be added.",
    }));
    error = true;
  }

  return error;
};

export default validateProductData;
