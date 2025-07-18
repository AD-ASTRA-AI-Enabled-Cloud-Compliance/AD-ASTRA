"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProgressData {
  page?: number;
  total?: number;
  status?: string;
}

interface ProgressMessage {
  type: string;
  message?: string;
  data?: ProgressData;
  timestamp?: string;
  status?: string;
  progress: number;
  total_pages: number;
  current_page: number;
}

export default function ProgressDisplay() {
  const router = useRouter();
  const [messages, setMessages] = useState<ProgressMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "management") {
      alert("Access restricted to management users.");
      router.push("/login");
      return;
    }

    const ws = new WebSocket('ws://localhost:3000/api/ws');

    ws.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      try {
        const data: ProgressMessage = JSON.parse(event.data);
        console.log("Received WebSocket message:", data);
        setMessages(prev => [...prev, data]);
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
        setError('Failed to parse message');
      }
    };

    ws.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError('WebSocket error occurred');
      setIsConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="text-sm font-mono">
        {isConnected ? 
          <span className="text-green-500">●</span> : 
          <span className="text-red-500">●</span>
        } Connection Status
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <div className="space-y-2">
        {messages.filter(msg => msg.type === 'progress').map((msg, index) => (
          <div key={index} className="text-sm border p-2 rounded">
            <div className="font-semibold">{msg.message}</div>
            {msg.data?.page && msg.data?.total && (
              <div className="text-xs">
                Page {msg.data.page} of {msg.data.total}
              </div>
            )}
            {msg.timestamp && (
              <div className="text-xs text-gray-500">{msg.timestamp}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
