
import { useState,useContext,createContext } from "react";

export const LogContext = createContext()

const LogProvider = ({children}) => {
  const [showModal,setShowModal] = useState(false);

  const onClose=()=>{
    setShowModal(false);
  } 
  return (
    <LogContext.Provider value= {{ showModal,setShowModal,onClose}}>
        {children}
    </LogContext.Provider>
  )

}

export default LogProvider