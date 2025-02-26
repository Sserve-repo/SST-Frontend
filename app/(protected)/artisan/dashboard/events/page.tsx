import EventsPage from "@/components/events/events-page";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | SphereServe",
};

const Events = () => {
  return (
    <>
      <EventsPage />
    </>
  );
};

export default Events;
