import AppointmentsPage from '@/components/artisan/appointments/appointments-page'
import React from 'react'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Appointment | SphereServe",
};

const Appointments = () => {
  return (
    <>
      <AppointmentsPage />
    </>
  )
}

export default Appointments
