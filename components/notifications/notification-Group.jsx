
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"



export function NotificationGroup({ title, children }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="divide-y">{children}</CardContent>
    </Card>
  )
}
