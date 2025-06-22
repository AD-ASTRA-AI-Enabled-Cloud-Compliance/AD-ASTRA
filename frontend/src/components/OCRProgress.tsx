'use client';
import { useEffect, useState } from 'react';
import { useWebSocket, WebSocketProvider } from '../contexts/WebSocketContext';
import Markdown from 'react-markdown';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';


type ProgressBarProps = {
    onlyProgress?: boolean;
}

const OCRProgress = ({ onlyProgress }: ProgressBarProps) => {
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

    return (
        <div>
            {onlyProgress ? (
                <ProgressBar messages={lastMessage} />

            ) : (
                <>
                    <div className="space-y-4">
                        <div className="p-4 border rounded-lg shadow-sm">
                            <div className="mb-2">
                                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                            </div>
                            <div className="mb-2">
                                Current Progress: {lastMessage?.progress && lastMessage.progress}%
                            </div>
                            <ProgressBar messages={lastMessage} />

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

                    <Markdown>
                        {lastMessage && lastMessage.message}
                    </Markdown>

                </>

            )}

        </div>
    );
};

export default OCRProgress;

export const ProgressBar = ({ messages }: { messages: { progress: number, message: string } }) => {
    console.log(messages)
    return (
        messages?.progress > 0 && (
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="w-30 bg-gray-200 rounded-full h-1.5">
                        <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${messages.progress}%` }}
                        />

                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{messages?.message}</p>
                </TooltipContent>
            </Tooltip>
        )
    );
};
