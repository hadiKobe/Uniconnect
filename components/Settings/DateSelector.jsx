"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function DateSelector({ startYear, year, month, onChange }) {

   // Get current year and calculate year range
   const currentYear = new Date().getFullYear()
   const baseYear = startYear ? parseInt(startYear) : 2001;
   const yearRange = Array.from({ length: currentYear + 5 - 2001 + 1 }, (_, i) => (baseYear + i).toString())

   // Month names
   const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
   ]

   // State for selected month and year
   const [selectedMonth, setSelectedMonth] = useState(undefined)
   const [selectedYear, setSelectedYear] = useState("none");

   useEffect(() => {
      setSelectedMonth(months[month - 1]);
      setSelectedYear(year || "none");
   }, [year, month])

   const handleYearChange = (value) => {
      const validYear = value !== "none" ? value : "";
      const validMonth = value === "none" ? ""
         :
         selectedMonth ? String(months.indexOf(selectedMonth) + 1).padStart(2, "0") : "01"; // Default to January

      setSelectedYear(value);

      if (onChange) {
         onChange({
            year: validYear,
            month: validYear ? validMonth : "", // No month if year is empty
         });
      }
   };

   const handleMonthChange = (value) => {
      const validMonth = String(months.indexOf(value) + 1).padStart(2, "0");

      setSelectedMonth(value);

      if (onChange) {
         onChange({
            year: selectedYear !== "none" ? selectedYear : "",
            month: validMonth,
         });
      }
   };

   // Set default month to January when year is selected
   useEffect(() => {
      if (selectedYear && selectedYear !== "none") {
         !selectedMonth && setSelectedMonth("January")
      } else {
         setSelectedMonth(prev => prev)
      }
   }, [selectedYear, selectedMonth])

   return (
      <div className="flex gap-4">
         <div className="flex-1 min-w-0 space-y-2">
            <Label htmlFor="year-select">Year</Label>
            <Select value={selectedYear} onValueChange={(value) => { value && handleYearChange(value) }}>
               <SelectTrigger id="year-select" className="w-full">
                  <SelectValue placeholder="Select year" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {yearRange.map((year) => (
                     <SelectItem key={year} value={year}>
                        {year}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>

         <div className="flex-1 min-w-0 space-y-2">
            <Label htmlFor="month-select">Month</Label>
            <Select value={selectedMonth} onValueChange={(value) => { value && handleMonthChange(value) }} disabled={selectedYear === "none" || !selectedYear}>
               <SelectTrigger id="month-select" className="w-full">
                  <SelectValue placeholder="Select month" />
               </SelectTrigger>
               <SelectContent>
                  {months.map((month) => (
                     <SelectItem key={month} value={month}>
                        {month}
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
         </div>
      </div>
   )
}
