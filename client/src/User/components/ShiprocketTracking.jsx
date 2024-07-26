import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../contexts/UserContext";
import { FaCheck } from "react-icons/fa";

function ShiprocketTracking({ order }) {
  const [shipment, setShipment] = useState(null);
  const [trackingData, setTrackingData] = useState(null);
  const { userId } = useContext(userContext);
  useEffect(() => {
    if (order && order.shippingMethod == "shiprocket") {
      (async () => {
        const response = await fetch(
          `/api/user/getTrackingData/${userId}/${order.shipRocketOrderId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setShipment(data);
          setTrackingData(data.shipment_track[0]);
        }
      })();
    }
  }, []);
  return (
    <div>
      {trackingData && (
        <div className="flex-auto p-6 relative">
          <div className="absolute left-[35px] top-8 h-[70%] border-r-2 border-gray-200"></div>

          <div className="relative mb-8 flex flex-col justify-center ">
            <div
              className={`
              absolute inline-flex h-6 w-6 items-center justify-center rounded-full p-[5px] bg-green-500 text-white
                
              `}
            >
              <FaCheck className="text-white" />
            </div>
            <div className="ml-12 w-auto pt-1">
              <h6 className="text-sm font-semibold text-green-900 ">
                Order Placed
              </h6>

              <p className="mt-1 text-xs text-gray-500">
                {new Date(order.orderDate).toDateString()}
              </p>
            </div>
          </div>

          {/* Picked up */}

          <div className="relative mb-8 flex flex-col justify-center ">
            <div
              className={`
              absolute inline-flex h-6 w-6 items-center justify-center rounded-full p-[5px] bg-green-500 text-white
                ${
                  trackingData.current_status == "PICKED UP" ||
                  trackingData.current_status == "OUT FOR DELIVERY" ||
                  trackingData.current_status == "DELIVERED"
                    ? "bg-green-500 text-white"
                    : "bg-white border border-gray-300"
                }
              `}
            >
              {/* Conditionally render checkmark or blank circle */}
              {trackingData.current_status == "PICKED UP" ||
              trackingData.current_status == "OUT FOR DELIVERY" ||
              trackingData.current_status == "DELIVERED" ? (
                <FaCheck className="text-white" />
              ) : null}
            </div>
            <div className="ml-12 w-auto pt-1">
              <h6 className="text-sm font-semibold text-green-900 ">
                PICKED UP
              </h6>

              {trackingData.pickup_date && (
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(trackingData.pickup_Date).toDateString()}
                </p>
              )}
            </div>
          </div>

          {/* out for delivery */}

          <div className="relative mb-8 flex flex-col justify-center ">
            <div
              className={`
              absolute inline-flex h-6 w-6 items-center justify-center rounded-full p-[5px] bg-green-500 text-white
                ${
                  trackingData.current_status == "OUT FOR DELIVERY" ||
                  trackingData.current_status == "DELIVERED"
                    ? "bg-green-500 text-white"
                    : "bg-white border border-gray-300"
                }
              `}
            >
              {/* Conditionally render checkmark or blank circle */}
              {trackingData.current_status == "OUT FOR DELIVERY" ||
              trackingData.current_status == "DELIVERED" ? (
                <FaCheck className="text-white" />
              ) : null}
            </div>
            <div className="ml-12 w-auto pt-1">
              <h6 className="text-sm font-semibold text-green-900 ">
                OUT FOR DELIVERY
              </h6>

              {(trackingData.current_status == "OUT FOR DELIVERY" ||
                trackingData.current_status == "DELIVERED") &&
              shipment.shipment_track_activities ? (
                <div>
                  <p className="mt-1 text-xs text-gray-500">
                    {shipment.shipment_track_activities[0].location}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(
                      shipment.shipment_track_activities[0].date
                    ).toDateString()}
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          {/* Delivered */}
          <div className="relative mb-8 flex flex-col justify-center ">
            <div
              className={`
              absolute inline-flex h-6 w-6 items-center justify-center rounded-full p-[5px] bg-green-500 text-white
                ${
                  trackingData.current_status == "DELIVERED"
                    ? "bg-green-500 text-white"
                    : "bg-white border border-gray-300"
                }
              `}
            >
              {/* Conditionally render checkmark or blank circle */}
              {trackingData.current_status == "DELIVERED" ? (
                <FaCheck className="text-white" />
              ) : null}
            </div>
            <div className="ml-12 w-auto pt-1">
              <h6 className="text-sm font-semibold text-green-900 ">
                DELIVERY COMPLETE
              </h6>

              {trackingData.current_status == "DELIVERED" ? (
                <div>
                  <p className="mt-1 text-xs text-gray-500">
                    {trackingData.delivered_to}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(trackingData.delivered_date).toDateString()}
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShiprocketTracking;
