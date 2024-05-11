import { Preview, print } from "react-html2pdf";
const PrintCoupons = ({
  allCoupons,
  currentCoupons,
  showPrinter,
  printer,
  currentCouponPrinter,
  showCurrentCouponsPrinter,
}) => {
  return (
    <div className="">
      {printer && (
        <div
          id="content"
          className="fixed overflow-auto inset-0 bg-black backdrop-blur-sm bg-opacity-30"
        >
          <div className="flex items-center justify-center h-full">
            <div className=" bg-white w-full md:w-2/4 lg:w-1/4 p-7 ">
              <h1 className="text-3xl text-gray-600 font-bold underline">
                PRINT COUPONS
              </h1>
              <Preview id={"allCoupons"}>
                {allCoupons &&
                  allCoupons.map((coupon) => (
                    <div
                      className="list-none leading-loose my-5"
                      key={coupon._id}
                    >
                      {console.log("coupon ID : ", coupon._id)}
                      <li>
                        <h1>
                          <span className="text-blue-900">{coupon.title}</span>
                        </h1>
                        <h1>
                          <span className="text-emerald-700">
                            {coupon.couponCode}
                          </span>
                        </h1>
                      </li>
                    </div>
                  ))}
              </Preview>

              <div className="flex justify-end mt-3">
                <button
                  className="px-4 rounded py-2 bg-green-600 text-white font-bold"
                  onClick={() => {
                    print("EnteBuddy_coupons", "allCoupons");
                    showPrinter(false);
                  }}
                >
                  Print
                </button>
                <button
                  className="px-4 ms-2 rounded py-2 bg-slate-600 text-white font-bold"
                  onClick={() => showPrinter(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {currentCouponPrinter && (
        <div className="fixed overflow-auto inset-0 bg-black backdrop-blur-sm bg-opacity-30">
          <div className="flex items-center justify-center h-full">
            <div className=" bg-white w-full md:w-2/4 lg:w-1/4 p-7 ">
              <h1 className="text-3xl text-gray-600 font-bold underline">
                PRINT COUPONS
              </h1>
              <Preview id={"currentCoupons"}>
                {currentCoupons &&
                  currentCoupons.map((coupon) => (
                    <div
                      className="list-none leading-loose my-5"
                      key={coupon._id}
                    >
                      <li>
                        <span className="text-blue-900">{coupon.title}</span>
                        <p>
                          <span className="text-emerald-700">
                            {coupon.couponCode}
                          </span>
                        </p>
                      </li>
                    </div>
                  ))}
              </Preview>

              <div className="flex justify-end mt-3">
                <button
                  className="px-4 rounded py-2 bg-green-600 text-white font-bold"
                  onClick={() => {
                    print("EnteBuddy_coupons", "currentCoupons");
                    showCurrentCouponsPrinter(false);
                  }}
                >
                  Print
                </button>
                <button
                  className="px-4 ms-2 rounded py-2 bg-slate-600 text-white font-bold"
                  onClick={() => showCurrentCouponsPrinter(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintCoupons;
