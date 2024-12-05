import React, { useMemo, useState, useEffect } from "react";

interface ServiceDetails {
  price: number;
  total_tax_rate: number;
}

interface Service {
  "Service Details": ServiceDetails;
}

const BookingOrderSummary: React.FC<{ service: Service | null }> = ({
  service,
}) => {
  const [processedData, setProcessedData] = useState<ServiceDetails | null>(
    null
  );

  const data = service?.["Service Details"] || null;
  const memoizedData = useMemo(() => data, [data]);

  useEffect(() => {
    if (memoizedData && memoizedData !== processedData) {
      setProcessedData(memoizedData);
    }
  }, [memoizedData, processedData]);

  return (
    <div className="bg-gray-100 shadow-md p-6 rounded-lg sticky top-24">
      <h2 className="text-xl font-semibold mb-4 text-black">Order Summary</h2>

      {/* Total Items and Price */}
      <div className="flex justify-between mb-2">
        <span>Price:</span>
        <span>${processedData?.price ?? "0.00"}</span>
      </div>

      {/* Tax */}
      <div className="flex justify-between mb-2">
        <span>Tax:</span>
        <span>${processedData?.total_tax_rate ?? "0.00"}</span>
      </div>

      {/* Grand Total */}
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span>
            $
            {processedData
              ? (
                  parseFloat(`${processedData.price}`) +
                  parseFloat(`${processedData.total_tax_rate}`)
                ).toFixed(2)
              : "0.00"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BookingOrderSummary;
