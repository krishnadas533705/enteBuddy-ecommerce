const PrintCoupons = ({
  allCoupons,
  currentCoupons,
  showPrinter,
  printer,
  currentCouponPrinter,
  showCurrentCouponsPrinter,
}) => {


  const printCoupons = (className)=>{
    let originalContent = document.body.innerHTML
    let printContent = document.querySelector('.' + className).outerHTML
    document.body.innerHTML = printContent
    window.print()
    document.body.innerHTML = originalContent
    showCurrentCouponsPrinter(false);
    showPrinter(false)
    window.location.reload()
  }

  return (
    <div className="">
      {printer && (
        <div
          id="content"
          className="fixed h-screen w-screen flex flex-col items-center justify-center overflow-auto inset-0 bg-black backdrop-blur-sm bg-opacity-30"
        >
          <div className="flex items-center justify-center h-full">
            <div className=" bg-white w-fit p-7 ">
              <h1 className="text-3xl text-gray-600 font-bold underline">
                PRINT COUPONS
              </h1>
              <div className="print-section-1">
                {allCoupons &&
                  allCoupons.map((coupon) => (
                    <div
                      className="list-none leading-loose my-5"
                      key={coupon._id}
                    >
                      <li>
                        <h1>
                          <span className="text-blue-900">Coupon Name : {coupon.title}</span>
                        </h1>
                        <h1>
                          <span className="text-emerald-700">
                            Coupon code : {coupon.couponCode}
                          </span>
                        </h1>
                      </li>
                    </div>
                  ))}
              </div>

              <div className="flex justify-end mt-3">
                <button
                  className="px-4 rounded py-2 bg-green-600 text-white font-bold"
                  onClick={() => {
                    printCoupons('print-section-1')
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
        <div className="fixed h-screen w-screen flex flex-col items-center justify-center overflow-auto inset-0 bg-black backdrop-blur-sm bg-opacity-30">
          <div className="flex items-center justify-center h-full">
            <div className=" bg-white w-full p-7 ">
              <h1 className="text-3xl text-gray-600 font-bold underline">
                PRINT COUPONS
              </h1>
              <div className="print-section-2">
                {currentCoupons &&
                  currentCoupons.map((coupon) => (
                    <div
                      className="list-none leading-loose my-5"
                      key={coupon._id}
                    >
                      <li>
                        <span className="text-blue-900 font-medium">{coupon.title}</span>
                        <p>
                          <span className="text-emerald-700 font-medium">
                            {coupon.couponCode}
                          </span>
                        </p>
                      </li>
                    </div>
                  ))}
              </div>

              <div className="flex justify-end mt-3">
                <button
                  className="px-4 rounded py-2 bg-green-600 text-white font-bold"
                  onClick={() => {
                    printCoupons('print-section-2')

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



