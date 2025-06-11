import { useEffect, useState } from 'react';
import { useWebSocket, WebSocketProvider } from '../contexts/WebSocketContext';

const OCRProgress = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [progress, setProgress] = useState(0);
    const { lastMessage, isConnected } = useWebSocket();

    useEffect(() => {
        if (lastMessage) {
            console.log('[OCRProgress] New message received:', lastMessage);
            setMessages(prev => [...prev, lastMessage]);
            if (lastMessage.progress) {
                setProgress(lastMessage.message ? lastMessage.message : lastMessage.progress);
            }
        }
    }, [lastMessage]);
    console.log(lastMessage);

    return (
            
            <div className="space-y-4">
                <div className="p-4 border rounded-lg shadow-sm">
                    <div className="mb-2">
                        {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                    </div>
                    <div className="mb-2">
                        Current Progress: {progress}%
                    </div>
                    {progress > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    )}
                </div>

                <div className="p-4 border rounded-lg shadow-sm">
                    <h3 className="font-bold mb-2">Message History:</h3>
                    <ol className="space-y-2 max-h-48 overflow-auto">
                        {messages.map((msg, idx) => (
                            <li key={idx} className="text-sm">
                                {msg.message} {msg.progress ? `(${msg.progress}%)` : ''}
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

    );
};

export default OCRProgress;
