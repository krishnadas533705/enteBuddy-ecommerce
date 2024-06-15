import { createContext, useState } from "react";

export const userContext = createContext();

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => {
    return localStorage.getItem("enteBuddyUser") || null;
  });
  

  return (
    <userContext.Provider value={{ userId, setUserId }}>
      {children}
    </userContext.Provider>
  );
};

export default UserProvider;
