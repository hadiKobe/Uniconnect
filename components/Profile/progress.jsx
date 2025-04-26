"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function GraduationProgressCard({ progress, graduationYear }) {
  const year = graduationYear ? graduationYear.split(" ")[1] : "soon"; // 👈 fallback if missing

  return (
    <Card>
      <CardHeader>
        <CardTitle>Graduation Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress toward degree</span>
            <span className="font-medium">{progress ?? 0}%</span> {/* 👈 default to 0% */}
          </div>
          <Progress value={progress ?? 0} className="h-2" /> {/* 👈 default if progress missing */}
        </div>
        <p className="text-sm text-muted-foreground">
          You're on track to graduate {year !== "soon" ? `in ${year}` : "soon"}. Keep up the good work!
        </p>
      </CardContent>
    </Card>
  )
}
