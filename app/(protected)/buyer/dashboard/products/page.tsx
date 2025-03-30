import { Metadata } from "next";
import ProductsPage from "./Products";

export const metadata: Metadata = {
  title: "Products | SphereServe",
};

export default function Order() {
  return (
    <>
      <ProductsPage />
    </>
  );
}
