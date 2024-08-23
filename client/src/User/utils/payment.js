import { toast } from "react-hot-toast";

export const makePayment = async (key, order, userId, orderDetails) => {
  return new Promise((resolve, reject) => {
    try {
      var options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "EnteBuddy",
        description: "EnteBuddy products",
        image: "https://entebuddy.com/assets/logo-Q9Lqe-yu.png",
        order_id: order.id,
        handler: async function (response) {
          await verifyPaymentAndPushOrder(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature,
            userId,
            orderDetails,
            order.amount
          );

          resolve();
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        notes: {},
        theme: {
          color: "#3399cc",
        },
      };
      var rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert("Payment failed, Try again.");
        reject();
      });
      rzp1.open();
    } catch (err) {
      console.log("Razorpay error : ", err);
    }
  });
};

const verifyPaymentAndPushOrder = async (
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  userId,
  orderDetails,
  sellingPrice
) => {
  try {
    const response = await fetch(`/api/payment/verifyPayment/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      }),
      credentials: "include",
    });

    if (response.ok) {
      const orderResponse = await fetch(`/api/user/newOrder/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...orderDetails,
          sellingPrice,
          paymentId: razorpay_payment_id,
        }),
        credentials: "include",
      });
      if (orderResponse.ok) {
        toast.success(`Order Placed successfully`);

        localStorage.setItem("enteBuddyCartPrice", 0);
        localStorage.setItem("enteBuddyCart", null);
        localStorage.setItem("enteBuddyCouponId", "");
      } else {
        toast.error("Shipping failed");
        const refundResponse = await fetch(
          `/api/payment/refundPayment/${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ paymentId: razorpay_payment_id }),
            credentials: "include",
          }
        );
        if (refundResponse.ok) {
          toast(
            "Failed to place order, your amount will be refunded in two weeks.",
            { duration: 5000 }
          );
        }
      }
    }
  } catch (err) {
    console.log("error in payment verification : ", err);
  }
};
