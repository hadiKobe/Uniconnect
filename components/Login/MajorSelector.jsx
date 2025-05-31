"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";

const majors = [
  // Engineering Majors
  "Computer Engineering",
  "Communication Engineering",
  "Electronics Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Biomedical Engineering",
  "Surveying Engineering",
  "Industrial Engineering",
  "Civil Engineering", // ✅ added
  "Mechatronics Engineering", // ✅ added

  // Business & Economics
  "Accounting",
  "Economics",
  "Banking & Finance",
  "Business Management",
  "Marketing",
  "MIS",
  "Hospitality Management",

  // Education & Languages
  "Teacher Education",
  "Teaching English",
  "Translation",
  "Radio & TV",

  // Science & Health
  "Pharmacy",
  "Biology", // ✅ added
  "Chemistry", // ✅ added
  "Mathematics", // ✅ added
  "Nursing", // ✅ added
  "Public Health", // ✅ added

  // General
  "Freshman"
];


const MajorSelector = ({ selectedMajor, onSelectMajor }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false); // ✅ Control popover open state

  const filteredMajors = majors.filter((major) =>
    major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between ">
          <span className="truncate">{selectedMajor || "Select a Major"}</span>
          <span className="ml-2">▼</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-2 space-y-2 max-h-80 overflow-y-auto ">
        <Input
          placeholder="Search major..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8 text-sm"
        />
        <ScrollArea className="max-h-48">
          <div className="space-y-1">
            {filteredMajors.map((major) => (
              <Button
                key={major}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => {
                  onSelectMajor(major);
                  setSearchTerm("");
                  setOpen(false); // ✅ Close popover
                }}
              >
                {major}
              </Button>
            ))}
            {filteredMajors.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-2">
                No results
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default MajorSelector;
