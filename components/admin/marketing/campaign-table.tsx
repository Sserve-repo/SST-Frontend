"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CampaignDetailsDialog } from "./campaign-details-dialog"
import { EditCampaignDialog } from "./edit-campaign-dialog"
import { DeleteCampaignDialog } from "./delete-campaign-dialog"
import { MoreHorizontal, Pencil, Play, Pause, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Campaign } from "@/types/marketing"

interface CampaignTableProps {
  campaigns: Campaign[]
}

export function CampaignTable({ campaigns }: CampaignTableProps) {
  const [campaignToView, setCampaignToView] = useState<Campaign | null>(null)
  const [campaignToEdit, setCampaignToEdit] = useState<Campaign | null>(null)
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null)

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Target Audience</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Performance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>
                  <div className="font-medium">{campaign.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {campaign.discount.type === "percentage"
                      ? `${campaign.discount.value}% off`
                      : `$${campaign.discount.value} off`}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {campaign.type.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {campaign.targetAudience.map((audience) => (
                      <Badge key={audience} variant="outline" className="capitalize">
                        {audience.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm">
                      {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                      {new Date(campaign.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {campaign.performance ? (
                    <div className="space-y-1">
                      <div className="text-sm">
                        CTR: <span className="font-medium">{campaign.performance.ctr}%</span>
                      </div>
                      <div className="text-sm">
                        Revenue: <span className="font-medium">${campaign.performance.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">No data yet</span>
                  )}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setCampaignToView(campaign)}>View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setCampaignToEdit(campaign)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Campaign
                      </DropdownMenuItem>
                      {campaign.status === "active" ? (
                        <DropdownMenuItem>
                          <Pause className="mr-2 h-4 w-4" />
                          Pause Campaign
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>
                          <Play className="mr-2 h-4 w-4" />
                          Activate Campaign
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setCampaignToDelete(campaign)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Campaign
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CampaignDetailsDialog campaign={campaignToView} onOpenChange={(open) => !open && setCampaignToView(null)} />
      <EditCampaignDialog campaign={campaignToEdit} onOpenChange={(open) => !open && setCampaignToEdit(null)} />
      <DeleteCampaignDialog campaign={campaignToDelete} onOpenChange={(open) => !open && setCampaignToDelete(null)} />
    </>
  )
}

