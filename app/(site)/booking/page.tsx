import React, { Suspense } from "react";
import Booking from "./Booking";

const BookingPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Booking />
    </Suspense>
  );
};

export default BookingPage;
