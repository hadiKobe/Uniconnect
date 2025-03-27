"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const majors = [
  "Computer Science", "Business Administration", "Psychology", "Mechanical Engineering",
  "Biology", "Finance", "Marketing", "Nursing", "Political Science", "Physics",
  "Electrical Engineering", "Economics", "Chemistry", "Mathematics", "English Literature",
  "Software Engineering", "Environmental Science", "Philosophy", "History", "Graphic Design",
];

const MajorSelector = ({ selectedMajor, onSelectMajor }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedMajor || "Select a Major"} <span className="ml-2">▼</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2">
        <ScrollArea className="h-48">
          <div className="space-y-1">
            {majors.map((major) => (
              <Button
                key={major}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => onSelectMajor(major)}
              >
                {major}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default MajorSelector;
