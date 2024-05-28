import { useEffect,useState,useContext } from "react";
import { AgeVerificationContext } from "../contexts/AgeVerificationContext";

const AgeVerification = ( ) => {  
  
  const [isVerified,setIsVerified]= useState(true)
  const { onClose }= useContext(AgeVerificationContext)
  

  useEffect(() => {
    // Add class to body to disable scrolling
    document.body.classList.add('overflow-hidden');
    console.log('Component has mounted');
   

    // Clean up: Remove the class when the component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden'); 
      console.log('Component is unmounting');
    };
  }, []);
  return (
    <div className='fixed inset-0 bg-black bg-opacity-25 bg-backdrop-blur-sm flex justify-center items-center'>
        <div className='flex flex-col m-4   text-white p-5 bg-hero2 bg-contain bg-tertiary w-full md:w-1/4 h-2/4 rounded-3xl font-poppins'>
           <div className="text-2xl mt-20 mb-16 text-primary text-center">
             You are 21 years or elder ?
           </div> 
           
           
           {isVerified ?  ( <div  className="cursor-pointer flex justify-center"><div onClick={onClose} className="py-2 px-4 bg-primary text-black font-medium text-lg rounded-lg mr-2">yes</div>
            <div onClick={()=>setIsVerified(false)} className="py-2 px-4 bg-primary text-black font-medium text-lg rounded-lg">no</div> </div>)
            : 
            <>
            <div className="flex flex-col justify-center items-center">

              <div>
                    Try again when you are older .
              </div>
              <button onClick={()=>setIsVerified(true)} className="mt-5 bg-primary py-2 px-4 rounded-2xl text-black font-medium">
                oops i entered incorrectly 
              </button>
            </div>
            
            </>
            
            }
           
            
           </div>

        </div>
   
  )
}

export default AgeVerification