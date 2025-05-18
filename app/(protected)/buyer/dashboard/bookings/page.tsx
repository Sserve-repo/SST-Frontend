import { Metadata } from "next";
import BookingsPage from "./_components/Booking";

export const metadata: Metadata = {
  title: "Orders | SphereServe",
};

export default function Order() {
  return (
    <>
      <BookingsPage />
    </>
  );
}
