import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Campaign } from "@/types/marketing"

interface CampaignOverviewProps {
  campaign: Campaign
}

export function CampaignOverview({ campaign }: CampaignOverviewProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{campaign.name}</h2>
          <Badge
            variant="secondary"
            className={cn(
              campaign.status === "active" && "bg-green-100 text-green-600",
              campaign.status === "scheduled" && "bg-blue-100 text-blue-600",
              campaign.status === "completed" && "bg-gray-100 text-gray-600",
              campaign.status === "paused" && "bg-yellow-100 text-yellow-600",
              campaign.status === "draft" && "bg-purple-100 text-purple-600",
            )}
          >
            {campaign.status}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <span>
              {campaign.discount.type === "percentage"
                ? `${campaign.discount.value}% off`
                : `$${campaign.discount.value} off`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>
              {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium">Target Audience</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {campaign.targetAudience.map((audience) => (
              <div key={audience} className="flex items-center gap-2 rounded-lg border bg-muted px-3 py-1 text-sm">
                <Users className="h-4 w-4" />
                <span className="capitalize">{audience.replace("_", " ")}</span>
              </div>
            ))}
          </div>
        </div>

        {campaign.performance && (
          <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Impressions</p>
              <p className="text-2xl font-bold">{campaign.performance.impressions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversions</p>
              <p className="text-2xl font-bold">{campaign.performance.conversions.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold">${campaign.performance.revenue.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">{campaign.status === "active" ? "Pause Campaign" : "Activate Campaign"}</Button>
        <Button>Edit Campaign</Button>
      </div>
    </div>
  )
}

