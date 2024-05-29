import {createContext,useState,useEffect} from 'react'

export const AgeVerificationContext = createContext()

const AgeVerificationProvider = ({children}) =>{ 
     
    useEffect (()=>{
       const modalState= localStorage.getItem("modalState") 
       if(modalState){
        setAgeVerificationModal(false)
       } 
       else 
       setAgeVerificationModal(true)
    },[])

    const [ageVerificationModal,setAgeVerificationModal] = useState(null);

    const onClose=()=>{
        setAgeVerificationModal(false);
        localStorage.setItem("modalState","closed")
    }

    return (
        <AgeVerificationContext.Provider value={{ageVerificationModal,setAgeVerificationModal,onClose}}>
            {children}
        </AgeVerificationContext.Provider>
    );

} 
export default AgeVerificationProvider 