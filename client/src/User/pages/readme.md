import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Shimmer from '../components/Shimmer'
import { FaCheckCircle } from 'react-icons/fa'; 

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
 const  orderId='order1';
 const productId='product1'
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const foundOrder = fakeOrders.find(o => o._id === orderId);
    const product = foundOrder.products.find(product=>product._id===productId)
    setOrder(foundOrder);
  },[]);

  if (!order) {
    return <Shimmer/>
  }

  const orderStatusSteps = [
    { status: 'Order Confirmed', timestamp: order.confirmedAt },
    { status: 'Shipped', timestamp: order.shippedAt },
    { status: 'Out for Delivery', timestamp: order.outForDeliveryAt },
    { status: 'Delivered', timestamp: order.deliveredAt },
  ];

  const currentStatusIndex = orderStatusSteps.reduce((latestIndex, step, index) => {
    if (step.timestamp && new Date(step.timestamp) <= new Date()) {
      return index; // Update the latestIndex if the timestamp is valid and in the past
    }
    return latestIndex; // Keep the previous latestIndex if the timestamp is invalid or in the future
  }, -1); 


  return (
    <div className="relative my-10 flex h-full flex-col overflow-hidden rounded-2xl bg-white text-gray-600 shadow-lg ring-1 ring-gray-200">
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
      {/* Products Section */}
      <div className="p-6">
        {order.products.map(product => (
           <div key={`${order._id}-${product._id}`} className="mb-4">
            <p className="font-semibold">{product.productName}</p>
            <p className="text-sm text-gray-500">Price: ${product.price.toFixed(2)}</p>
            {/* Optionally, display product image: */}
            {/* <img src={product.image} alt={product.productName} className="mt-2 h-20 w-20 object-cover" /> */}
          </div>
        ))}
      </div>
      
      {/* Timeline Section */}
      <div className="flex-auto p-6 relative">
        <div className="absolute left-[35px] top-8 h-[70%] border-r-2 border-gray-200"></div>
        {orderStatusSteps.map((step, index) => (
        <div key={step.status} className="relative mb-7 flex flex-col justify-center">
         <div className={`
              absolute inline-flex h-6 w-6 items-center justify-center rounded-full 
              ${index <= currentStatusIndex 
                ? 'bg-green-500 text-white' 
                : 'bg-white border border-gray-300'
              }
            `}>
              {/* Conditionally render checkmark or blank circle */}
              {index <= currentStatusIndex ? (
                <FaCheckCircle className="text-green" />
              ) : null}
            </div>  
            <div className="ml-12 w-auto pt-1">
              <h6 className={`text-sm font-semibold ${index <= currentStatusIndex ? 'text-green-900' : 'text-gray-600'}`}>{step.status}</h6>
              {step.timestamp && (
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(step.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;