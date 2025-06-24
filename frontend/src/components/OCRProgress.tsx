'use client';
import { useEffect, useState } from 'react';
import { useWebSocket, WebSocketProvider } from '../contexts/WebSocketContext';
import Markdown from 'react-markdown';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Button } from './ui/button';
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type ProgressBarProps = {
    onlyProgress?: boolean;
}

const OCRProgress = ({ onlyProgress }: ProgressBarProps) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [progress, setProgress] = useState(0);
    const { lastMessage, isConnected } = useWebSocket();

    useEffect(() => {
        if (lastMessage) {
            // console.log('[OCRProgress] New message received:', lastMessage);
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
                                        <div>
                                            {JSON.stringify(msg, null, 2)}
                                        </div>
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
    // console.log(messages)
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

                    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                        <Card className="@container/card">
                            <CardHeader>
                                <CardDescription>Total Revenue</CardDescription>
                                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                    $1,250.00
                                </CardTitle>
                                <CardAction>
                                    <Badge variant="outline">
                                        <IconTrendingUp />
                                        +12.5%
                                    </Badge>
                                </CardAction>
                            </CardHeader>
                            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                                <div className="line-clamp-1 flex gap-2 font-medium">
                                    Trending up this month <IconTrendingUp className="size-4" />
                                </div>
                                <div className="text-muted-foreground">
                                    Visitors for the last 6 months
                                </div>
                            </CardFooter>
                        </Card>
                        <Card className="@container/card">
                            <CardHeader>
                                <CardDescription>New Customers</CardDescription>
                                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                    1,234
                                </CardTitle>
                                <CardAction>
                                    <Badge variant="outline">
                                        <IconTrendingDown />
                                        -20%
                                    </Badge>
                                </CardAction>
                            </CardHeader>
                            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                                <div className="line-clamp-1 flex gap-2 font-medium">
                                    Down 20% this period <IconTrendingDown className="size-4" />
                                </div>
                                <div className="text-muted-foreground">
                                    Acquisition needs attention
                                </div>
                            </CardFooter>
                        </Card>
                        <Card className="@container/card">
                            <CardHeader>
                                <CardDescription>Active Accounts</CardDescription>
                                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                    45,678
                                </CardTitle>
                                <CardAction>
                                    <Badge variant="outline">
                                        <IconTrendingUp />
                                        +12.5%
                                    </Badge>
                                </CardAction>
                            </CardHeader>
                            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                                <div className="line-clamp-1 flex gap-2 font-medium">
                                    Strong user retention <IconTrendingUp className="size-4" />
                                </div>
                                <div className="text-muted-foreground">Engagement exceed targets</div>
                            </CardFooter>
                        </Card>
                        <Card className="@container/card">
                            <CardHeader>
                                <CardDescription>Growth Rate</CardDescription>
                                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                    4.5%
                                </CardTitle>
                                <CardAction>
                                    <Badge variant="outline">
                                        <IconTrendingUp />
                                        +4.5%
                                    </Badge>
                                </CardAction>
                            </CardHeader>
                            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                                <div className="line-clamp-1 flex gap-2 font-medium">
                                    Steady performance increase <IconTrendingUp className="size-4" />
                                </div>
                                <div className="text-muted-foreground">Meets growth projections</div>
                            </CardFooter>
                        </Card>
                    </div>
                </TooltipContent>
            </Tooltip>
        )
    );
};
