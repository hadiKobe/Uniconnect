"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input"; // ✅ Import this for search input

const majors = [
  "Computer Science", "Business Administration", "Psychology", "Mechanical Engineering",
  "Biology", "Finance", "Marketing", "Nursing", "Political Science", "Physics",
  "Electrical Engineering", "Economics", "Chemistry", "Mathematics", "English Literature",
  "Software Engineering", "Environmental Science", "Philosophy", "History", "Graphic Design",
];

const MajorSelector = ({ selectedMajor, onSelectMajor }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMajors = majors.filter((major) =>
    major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedMajor || "Select a Major"} <span className="ml-2">▼</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2 space-y-2">
        <Input
          placeholder="Search major..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-8 text-sm"
        />
        <ScrollArea className="h-48">
          <div className="space-y-1">
            {filteredMajors.map((major) => (
              <Button
                key={major}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => {
                  onSelectMajor(major);
                  setSearchTerm(""); // Optional: clear after selection
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
