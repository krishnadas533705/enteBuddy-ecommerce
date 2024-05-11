    // validation.js

// Validate name
export const validateName = (name) => {
    return name.trim().length > 0;
};

// Validate email
export const validateEmail = (email) => {
    // Regular expression for email validation
   
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   
    return emailRegex.test(email);
};

// Validate phone number
export const validatePhoneNumber = (phoneNumber) => {
    // Regular expression for phone number validation
    const phoneNumberRegex = /^\d{10}$/;
    return phoneNumberRegex.test(phoneNumber);
};

// Validate pin code
export const validatePinCode = (pinCode) => {
    // Regular expression for pin code validation (assuming 6 digits)
    const pinCodeRegex = /^\d{6}$/;
    return pinCodeRegex.test(pinCode);
};
