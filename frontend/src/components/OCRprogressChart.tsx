// "use client"

// import { TrendingUp } from "lucide-react"
// import { Pie, PieChart } from "recharts"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"
// import { useWebSocket } from "@/contexts/WebSocketContext"
// import { useState, useEffect } from "react"

// export const description = "A donut chart"

// const chartData = [
//   { browser: "progress", visitors: 275, fill: "var(--color-chrome)" },
//   { browser: "progress", visitors: 2750, fill: "var(--color-chrome)" },
  
// ]

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   chrome: {
//     label: "Progress",
//     color: "var(--chart-1)",
//   },
  
// } satisfies ChartConfig

// export function OCRProgressChart() {
//     const [messages, setMessages] = useState<any[]>([]);
//     const [progress, setProgress] = useState(0);
//     const { lastMessage, isConnected } = useWebSocket();

//     useEffect(() => {
//         if (lastMessage) {
//             console.log('[OCRProgress] New message received:', lastMessage);
//             setMessages(prev => [...prev, lastMessage]);
//             if (lastMessage.progress) {
//                 setProgress(lastMessage.message ? lastMessage.message : lastMessage.progress);
//             }
//         }
//     }, [lastMessage]);
//     console.log(lastMessage);
//   return (

//     <ChartContainer
//       config={chartConfig}
//       className="mx-auto aspect-square max-h-[250px]"
//     >
//       <PieChart>
//         <ChartTooltip
//           cursor={false}
//           content={<ChartTooltipContent hideLabel />}
//         />
//         <Pie
//           data={chartData}
//           dataKey="visitors"
//           nameKey="browser"
//           innerRadius={60}
//         />
//       </PieChart>
//     </ChartContainer>
//   )
// }
