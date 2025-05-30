"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function GraduationProgressCard({ progress, graduationYear }) {
  const year = graduationYear ? graduationYear.split(" ")[1] : "soon"; // 👈 fallback if missing
  const getProgressMessage = (value) => {
    if (value === 0) return "Just getting started. Every step counts!";
    if (value < 25) return "Solid foundation being built. Keep the momentum.";
    if (value < 50) return "Progress is visible. Halfway point in sight.";
    if (value < 75) return "More than halfway there. Stay focused.";
    if (value < 100) return "Almost done. Graduation is around the corner.";
    return "All requirements completed. Graduation ready.";
  };
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
         <div className="relative w-full overflow-hidden rounded">
        <Progress value={Math.min(progress ?? 0, 100)} className="h-2" />
      </div>
 {/* 👈 default if progress missing */}
        </div>
        <p className="text-sm text-muted-foreground">
          {getProgressMessage(progress)} 
        </p>
      </CardContent>
    </Card>
  )
}
