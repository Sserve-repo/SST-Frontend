import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  icon: React.ReactNode
  description: string
  descriptionColor: string
  iconColor: string
}

export function MetricCard({ title, value, icon, description, descriptionColor, iconColor }: MetricCardProps) {
  return (
    <Card className="border-gray-100">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={cn("rounded-lg p-3", iconColor)}>{icon}</div>
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className="flex items-center gap-1">
              <span className="text-orange-500">🐻</span>
              <p className={cn("text-xs", descriptionColor)}>{description}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MetricCard