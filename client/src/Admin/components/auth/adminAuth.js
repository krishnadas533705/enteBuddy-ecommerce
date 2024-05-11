export const validateForm = (email,password) => {  
  let errors = {};
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/.test(email)) {
    console.log("email : ",email)
    errors.email = "Email not valid!";
  }

  if (password.length < 6) {
    errors.password = "Invalid password";
  }

  return errors;
};

export const verifyAdmin = async (email, password) => {
  try {
    const response = await fetch("/api/admin/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, password}),
      credentials:'include'
    });
    return await response.json()
  } catch (err) {
    console.log("Error : ",err)
  }
};
