import { useContext,useState } from 'react'
import { ReviewFormContext } from '../contexts/ReviewFormContext'

const Test = () => { 
 
    const {onClose} = useContext(ReviewFormContext) 
    const [userInput,setUserInput]= useState({
        name : '',
        review: '',
        rating : 0
    })
    const handleChange=(e)=>{ 
        const {name,value} = e.target 
        console.log(value)
        setUserInput((prev)=>({...prev, [name] : value}))
    }
    




  return (
    <div>
        <div className='fixed inset-0 bg-black z-10 bg-opacity-25 text-white backdrop-blur-sm flex justify-center items-center '>
            <div className='flex flex-col w-full m-10 md:w-4/12'>
                <button onClick={onClose} className='place-self-end text-xl mb-2'>
                        X
                </button> 
            <div className='w-full bg-hero2 bg-contain bg-tertiary rounded-lg px-5 py-6 text-black'>
               <form className='w-full my-5'> 
                    <div className='mb-4'>

                        <input
                         type="text"
                         name ="name"
                         placeholder='name'
                         label="name" 
                         className='px-4 rounded-lg w-full  '
                         onChange={handleChange} 
                         value= {userInput.name}
                        />
                    </div>   
                    <div>



                    </div>




               </form>
            </div>

            </div>
        </div>


    </div>
  )
}

export default Test