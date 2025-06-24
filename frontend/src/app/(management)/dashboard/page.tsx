
import D3Force from "@/components/ui/d3force"
import UploadForm from "../components/uploadform"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"

export const iframeHeight = "800px"

export const description = "A sidebar with a header and a search form."

export default function Page() {

  // extractNodesAndLinks()
  return (
    <div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        <div className="bg-muted/50 aspect-video rounded-sm" >
          <D3Force />
          <Link href={'/explore_rules'} className="text-sm muted ">
            Explore...
          </Link>
        </div>
        <div className="bg-muted/50 aspect-video rounded-sm" />
      </div>
      <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-sm md:min-h-min" />
    </div>

  )
}
