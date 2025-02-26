import AnalyticsPage from "@/components/vendor/analytics/analytics-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics | SphereServe",
};

export default function Analytics() {
  return (
    <>
      <AnalyticsPage />
    </>
  );
}
