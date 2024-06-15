import { FaArrowLeftLong } from "react-icons/fa6";
import logo from '../img/logo.png'
import { useNavigate,useLocation } from "react-router-dom";
import { OrderContext } from "../contexts/OrderContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import Shimmer from "../components/Shimmer";
import { useEffect } from "react";



const fakeOrders = [
  {
    _id: 'order1',
    products: [
      { _id: 'product1', productName: "Massager", price: 2999, quantity: 2, image: "image_url_1" },
      { _id: 'product2', productName: "Trimmer", price: 1999, quantity: 1, image: "image_url_2" },
    ],
    confirmedAt: '2024-06-10T10:30:00Z',
    shippedAt: '2024-06-11T15:45:00Z',
  },
  {
    _id: 'order2',
    products: [
      { _id: 'product3', productName: "Neckband", price: 499, quantity: 1, image: "image_url_3" },
      { _id: 'product4', productName: "Bluetooth Speaker", price: 1499, quantity: 1, image: "image_url_4" },
    ],
    confirmedAt: '2024-06-05T12:00:00Z',
    shippedAt: '2024-06-06T18:30:00Z',
    outForDeliveryAt: '2024-06-07T10:00:00Z',
  },
  {
    _id: 'order3',
    products: [
      { _id: 'product5', productName: "Smart Watch", price: 5999, quantity: 1, image: "image_url_5" },
    ],
    confirmedAt: '2024-05-28T08:15:00Z',
    shippedAt: '2024-05-29T14:20:00Z',
    outForDeliveryAt: '2024-05-30T09:45:00Z',
    deliveredAt: '2024-05-30T16:30:00Z',
  },

];


const OrderTracking = () => {
    
    const location =useLocation()
    const navigate= useNavigate()
    const [order,setOrder]=useState(null)
    // const {fetchOrders,orders } = useContext(OrderContext)
  //  const {orderId,productId} = useParams() 
  const orderId = 'order1' ;
  productId= 'product1';
  useEffect(()=>{
    const foundOrder = fakeOrders.find(order=>order._id===orderID) 
    const product = fakeOrders.foundOrder.products.find(product=>product._id === productId)
    setOrder(foundOrder)
  },[])


    const handleNavigate=()=>{
        navigate(-1)
    }
  if(!order){
    return <Shimmer className="animate-pulse"/>
  } 

  return (
    <div>
        <header className="fixed w-full h-[64px]  shadow-md px-3 flex pt-5 gap-x-1 bg-hero2 bg-contain bg-tertiary justify-between">
        <div className="flex "> 
            <div className="w-5 h-10" onClick={handleNavigate}>
            <FaArrowLeftLong className="text-xl text-white" />
            </div>
       
        <div className="w-20 ">
                <img src={logo} alt ="enteBuddy logo w-full h-12" />
        </div>
        </div> 
        <div className="text-primary text-center text-lg font-poppins font-normal">
        
        </div>

        </header>

    <main className="pt-[70px] min-h-screen ">
       <div className="py-3 px-2">
             <section>
               <div className="font-poppins text-center text-sm text-gray-400 border-b border-gray-200 pb-3">
                ORDER ID : {order._id}
                </div> 
                <div className="py-5 px-8 font-mono text-lg flex justify-between items-center border-b border-gray-200">
                 <div className="desc">
                      <div>
                        {product.productName}  
                      </div>                
                      <div>
                        Quantity : {product.quantity}  
                      </div>                
                      <div>
                      ₹  {product.price}  
                      </div>                
                 </div>
                 <div className="w-28 h-24 px-2 py-2  flex justify-center items-center">
                                        <img
                                            src={logo}
                                            alt="massager image"
                                            className="w-full h-full object-fit"
                                        />
                                    </div>
                </div>
             </section>
        <section>
       

        </section>

       </div>

    </main>

    
    </div>
  )
}

export default OrderTracking