
import { IconTrendingUp } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type FrameworkCount = {
  framework: string;
  count: number;
  countLabel?: string;
};

type CountsCardProps = {
  data: FrameworkCount[];
  isLoading?: boolean;
  error?: string | null;
  totalRules?: number;
};

export function CountsCard({ data, isLoading, error, totalRules }: CountsCardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6">
      {isLoading ? (
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Loading frameworks...</CardDescription>
            <CardTitle className="text-2xl font-semibold">Loading...</CardTitle>
          </CardHeader>
        </Card>
      ) : error ? (
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Error</CardDescription>
            <CardTitle className="text-2xl font-semibold text-red-500">{error}</CardTitle>
          </CardHeader>
        </Card>
      ) : (
        data.map(({ framework, count, countLabel }) => {
          const percent = totalRules && totalRules > 0 ? ((count / totalRules) * 100).toFixed(1) : null;
          return (
            <Card className="@container/card" key={framework}>
              <CardHeader>
                <CardDescription>{framework}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {count.toLocaleString()} {countLabel ? countLabel : "rules"}
                </CardTitle>
                <CardAction>
                  <Badge variant="outline">
                    <IconTrendingUp />
                    {percent && !countLabel ? `${percent}% of all rules` : ""}
                  </Badge>
                </CardAction>
              </CardHeader>
            </Card>
          );
        })
      )}
    </div>
  )
}
