"use client";

type BubbleProps = {
  message: string;
  isUser: boolean;
};

export default function Bubble({ message, isUser }: BubbleProps) {
  return (
    <div className={`mb-2 px-4 py-2 rounded max-w-[80%] ${isUser ? "bg-blue-100 ml-auto" : "bg-gray-200"}`}>
      <p className="text-sm">{message}</p>
    </div>
  );
}
