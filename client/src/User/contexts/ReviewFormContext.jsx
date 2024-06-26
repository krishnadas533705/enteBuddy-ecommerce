    import React, { createContext ,useContext,useState ,useEffect} from 'react'
    import { userContext } from './UserContext' 

    export const ReviewFormContext =createContext()

    const ReviewFormProvider = ({children,productId}) => {  
    
    const [reviewModal ,setReviewModal]= useState(false)
    const [reviews,setReviews]= useState([])
    const [loading,setLoading]=useState(false)
    const [error,setError]=useState(null) 

    const {userId} = useContext(userContext) 


    useEffect (()=>{ 
    
    if(productId){ 
        
        const fetchReviews = async()=>{
            
            try { 
                
                let productReviews = await fetch(`/api/user/fetchReviews/${productId}`) 
            
                if(productReviews.ok){ 
                    productReviews= await productReviews.json()
                    setReviews(productReviews.reviews) 
                    
                
                }
                else {
                    throw new Error("Failed to fetch  reviews.")

                }
                
            } catch(err){
                console.log(err)
                setError(err.message)
            }
            
        } 
        fetchReviews()
    }
        
    },[productId])

    const addReviews = async(userInput)=>{
        try {
            const response = await fetch(`/api/user/addReview/${userId}/${productId}`, {
                method : 'POST',
                headers : { 
                    'Content-Type': 'application/json'

                },
                credentials:'include',
                body : JSON.stringify(userInput)
                
            })
            
        
            if(response.ok) { 
                const addedReview = await response.json();
                console.log("new review ",addedReview)
                if (reviews) {
                    setReviews([...reviews,addedReview]);
                }
                else{
                    setReviews(addedReview);
                }

            } else {
                throw new Error("failed to add review")
            } 
        }catch(err){
            console.error(err)
            setError(err.message)  
        }
    }


        const onClose=()=>{
            setReviewModal(false)
        }
        return (
            <ReviewFormContext.Provider
            value={{ reviewModal, setReviewModal, onClose ,addReviews,reviews }}>
                    {children}
            </ReviewFormContext.Provider>
            );
                
    }

    export default ReviewFormProvider