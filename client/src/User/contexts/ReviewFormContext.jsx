import React, { createContext ,useState} from 'react' 

export const ReviewFormContext =createContext()

const ReviewFormProvider = ({children}) => {

    const [reviewModal ,setReviewModal]= useState(false)
    const onClose=()=>{
        setReviewModal(false)
    }
   
    return (
         <ReviewFormContext.Provider
          value={{ reviewModal, setReviewModal, onClose }}>
                {children}
         </ReviewFormContext.Provider>
        );
            
}

export default ReviewFormProvider