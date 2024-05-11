export const validateCoupon = (couponData, setCouponError) => {
  let error = false;
  if (couponData.title == "" || couponData.title == null) {
    setCouponError((prev) => ({
      ...prev,
      title: "Coupon title is required",
    }));
    error = true;
  }
  if (couponData.startDate == "" || couponData.startDate == null) {
    setCouponError((prev) => ({
      ...prev,
      startDate: "Start Date is required",
    }));
    error = true;
  }
  if (couponData.endDate == "" || couponData.endDate == null) {
    setCouponError((prev) => ({ ...prev, endDate: "End Date is required" }));
    error = true;
  }
  if (couponData.discount == "" || couponData.discount == null) {
    setCouponError((prev) => ({ ...prev, discount: "Discount is required" }));
    error = true;
  }
  if (couponData.discount < 1 || couponData.discount > 100) {
    setCouponError((prev) => ({
      ...prev,
      discount: "Discount should be between 0 and 100",
    }));
    error = true;
  }
  if (couponData.couponCode == "" || couponData.couponCode == null) {
    setCouponError((prev) => ({
      ...prev,
      couponCode: "Coupon must be generated.",
    }));
    error = true;
  }

  return error
};
