import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext  } from '../contexts/UserContext';
import { CartContext } from '../contexts/CartContext';


const Logout = () => {
  const navigate = useNavigate();
  const {userId,setUserId} = useContext(userContext)
  const {setCart} = useContext(CartContext)

  const handleLogout = async () => {
    try {
      const response = await fetch(`/api/auth/signout/${userId}`, { 
        method: 'POST', 
        credentials: 'include' 
      });

      if (response.ok) {
        
        localStorage.clear();
       
        window.location.reload();
        
      } else {
        console.error('Logout failed:', response.statusText);
       
      }
    } catch (error) {
      console.error('Logout error:', error);
      
    }
  };

  return (
    <button type="button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;