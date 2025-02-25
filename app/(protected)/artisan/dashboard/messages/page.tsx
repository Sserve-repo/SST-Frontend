import MessagesPage from "@/components/messages/messages-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages | SphereServe",
};

export default function Messages() {
  return (
    <>
      <MessagesPage />
    </>
  );
}
