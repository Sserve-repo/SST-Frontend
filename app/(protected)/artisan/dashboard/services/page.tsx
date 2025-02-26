import ServicesPage from '@/components/artisan/services/services-page'
import React from 'react'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | SphereServe",
};

const Services = () => {
  return (
    <>
      <ServicesPage />
    </>
  )
}

export default Services
