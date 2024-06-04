export const makePayment = (key, order, userId, orderDetails,clearCart,handleClose,navigate) => {
  try {
    console.log("order amount : ", order.amount);
    var options = {
      key,
      amount: order.amount,
      currency: "INR",
      name: "EnteBuddy",
      description: "EnteBuddy products",
      image: "",
      order_id: order.id,
      handler: async function (response) {
        await verifyPaymentAndPushOrder(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature,
          userId,
          orderDetails,
          order.amount,clearCart,handleClose,navigate
        );
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
      console.log("Payment failed : ", response.error.description);
    });
    rzp1.open();
  } catch (err) {
    console.log("Razorpay error : ", err);
  }
};

const verifyPaymentAndPushOrder = async (
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  userId,
  orderDetails,
  sellingPrice,clearCart,handleClose,navigate
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
        console.log("clear cart : ",clearCart )
        alert("order placed successfully");
<<<<<<< HEAD
        localStorage.setItem("enteBuddyCartPrice", 0);
        localStorage.setItem("enteBuddyCart", null);
        localStorage.setItem("enteBuddyCouponId", "");
=======
        localStorage.setItem('enteBuddyCartPrice',0)
        localStorage.setCart('enteBuddyCart',null)
        localStorage.setItem('enteBuddyCouponId','') 
        
        
>>>>>>> origin/master
      } else {
        alert("shipping failed");
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
          alert(
            "failed to place order, your amount will be refunded in two weeks."
          );
        }
      }
    }
  } catch (err) {
    console.log("error in payment verification : ", err);
  }
};
