import DocumentPanel from "../components/DocumentPanel";
import ChatWindow from "../components/ChatWindow";

export default function Home() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <DocumentPanel />
      <ChatWindow />
    </div>
  );
}