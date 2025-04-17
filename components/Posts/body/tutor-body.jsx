
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, BookOpen, DollarSign } from "lucide-react";

const TutorBody = ({ tutorInfo }) => {
  const { subject, rate, location } = tutorInfo;

  return (
    <Card className="rounded-2xl border bg-white dark:bg-muted/10 shadow-sm">
      <CardContent className="p-6 space-y-5">
        {/* Subject */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">Subject</p>
          </div>
          <Badge variant="outline" className="text-sm px-3 py-1">{subject}</Badge>
        </div>

        {/* Rate */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <p className="text-sm text-muted-foreground">Hourly Rate</p>
          </div>
          <p className="text-sm font-medium text-foreground">${rate}/hr</p>
        </div>

        {/* Location */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-red-500" />
            <p className="text-sm text-muted-foreground">Location</p>
          </div>
          <p className="text-sm font-medium text-foreground">{location}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TutorBody;
