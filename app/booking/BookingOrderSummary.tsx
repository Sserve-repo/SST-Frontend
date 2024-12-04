import React from "react";

const BookingOrderSummary = ({ artisan }) => {
  const data = artisan && artisan["Service Details"];

  return (
    <div className="bg-gray-100 shadow-md p-6 rounded-lg sticky top-24">
      <h2 className="text-xl font-semibold mb-4 text-black">Order Summary</h2>

      {/* Total Items and Price */}
      <div className="flex justify-between mb-2">
        <span>Price:</span>
        <span>${data?.price}</span>
      </div>

      {/* Tax */}
      <div className="flex justify-between mb-2">
        <span>Tax:</span>
        <span>${data?.total_tax_rate} </span>
      </div>

      {/* Grand Total */}
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>${parseInt(data?.price) + data?.total_tax_rate}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingOrderSummary;
