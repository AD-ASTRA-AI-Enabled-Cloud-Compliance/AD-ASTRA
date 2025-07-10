import ChatWindow from "@/components/chat/ChatWindow";
import DocumentPanel from "@/components/chat/DocumentPanel";

export default function chat() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ChatWindow />
    </div>
  );
}