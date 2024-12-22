import { ChatView } from "../components/chat-view";
import { Layout } from "../components/layout";

const sampleMessages = [
  {
    id: "1",
    content:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters.",
    timestamp: "6:30 pm",
    sender: "other",
  },
  // Add more sample messages here
] ;

export default function ChatPage({ params }: { params: { id: string } }) {
  console.log(params);
  return (
    <Layout className="h-[100dvh]">
      <ChatView
        recipientName="Clifford Morgan"
        label="Artisan"
        messages={sampleMessages}
      />
    </Layout>
  );
}
