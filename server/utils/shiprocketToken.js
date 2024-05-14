const generateShiprocketToken = async () => {
    try {
      if (
        !shipRocketAuthToken ||
        Date.now() - shipRocketAuthToken.timeStamp > 5 * 24 * 60 * 60 * 1000
      ) {
        const credentials = {
          email: process.env.SHIPROCKET_EMAIL,
          password: process.env.SHIPROCKET_PASSWORD,
        };
        let loginResponse = await fetch(
          "https://apiv2.shiprocket.in/v1/external/auth/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          }
        );
        loginResponse = await loginResponse.json();
        shipRocketAuthToken = {
          token: loginResponse.token,
          timeStamp: Date.now(),
        };
      }
  
      return shipRocketAuthToken.token;
    } catch (err) {
      console.log("Error in generating shiprocket token : ", err);
    }
  };

  export default generateShiprocketToken