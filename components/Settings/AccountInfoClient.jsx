"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Camera, Loader2, User } from "lucide-react"
import { useGetUserInfo } from "@/hooks/Settings/getUserInfo"

const AccountInfo = () => {
   // Get user info from the hook
   const { userInfo, loading, error } = useGetUserInfo()

   // Initialize form data with empty values, will be updated when userInfo loads
   const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      major: "",
      joined_in: new Date(),
      bio: "",
      address: "",
      phone_number: "",
      expected_graduation_date: new Date(),
      graduation_progress: 0,
      gpa: "",
   })

   const [joinedDate, setJoinedDate] = useState(null)
   const [gradDate, setGradDate] = useState(null)

   // Update form data when userInfo is loaded
   useEffect(() => {
      if (userInfo) {
         // Ensure all values are defined to prevent uncontrolled to controlled warnings
         const sanitizedUserInfo = {
            first_name: userInfo.first_name || "",
            last_name: userInfo.last_name || "",
            major: userInfo.major || "",
            joined_in: userInfo.joined_in || new Date(),
            bio: userInfo.bio || "",
            address: userInfo.address || "",
            phone_number: userInfo.phone_number || "",
            expected_graduation_date: userInfo.expected_graduation_date || new Date(),
            graduation_progress: userInfo.graduation_progress || 0,
            gpa: userInfo.gpa || "",
            profile_picture: userInfo.profile_picture || null,
         }

         setFormData(sanitizedUserInfo)
         setJoinedDate(sanitizedUserInfo.joined_in)
         setGradDate(sanitizedUserInfo.expected_graduation_date)
      }
   }, [userInfo])

   const handleInputChange = (e) => {
      const { name, value } = e.target
      setFormData((prev) => ({ ...prev, [name]: value }))
   }

   const handleSubmit = (e) => {
      e.preventDefault()

      // Validate required fields
      if (!formData.first_name || !formData.last_name || !formData.major) {
         alert("Please fill in all required fields")
         return
      }

      // In a real app, you would save the data to your database here
      console.log("Form submitted:", formData)
   }

   const isModified = JSON.stringify(formData) !== JSON.stringify(userInfo);

   // Show loading state
   if (loading) {
      return (
         <div className="flex justify-center items-center h-[50vh]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading user information...</span>
         </div>
      )
   }

   // Show error state
   if (error) {
      return (
         <div className="flex justify-center items-center h-[50vh] text-destructive">
            <p>Error loading user information. Please try again later.</p>
         </div>
      )
   }

   return (
      <div className="container mx-auto py-6 max-w-3xl">
         <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Account Settings</h1>

            <div className="hidden md:flex justify-end gap-4">
               <Button type="button" variant="outline" >Cancel</Button>
               <Button type="submit" disabled={!isModified}>Save Changes</Button>
            </div>
         </div>

         <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Profile Picture Section */}
               <Card>
                  <CardHeader>
                     <CardTitle>Profile Picture</CardTitle>
                     <CardDescription>Upload a profile picture to personalize your account</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center space-y-4">
                     <Avatar className="h-32 w-32">
                        <AvatarImage src={formData.profile_picture || "/placeholder.svg?height=128&width=128"} alt="Profile" />
                        <AvatarFallback className="text-4xl">
                           <User size={64} />
                        </AvatarFallback>
                     </Avatar>

                     <Button type="button" variant="outline" className="flex items-center gap-2">
                        <Camera size={16} />
                        Upload Photo
                     </Button>
                  </CardContent>
               </Card>

               {/* Personal Information */}
               <Card>
                  <CardHeader>
                     <CardTitle>Personal Information</CardTitle>
                     <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="first_name">
                              First Name <span className="text-destructive">*</span>
                           </Label>
                           <Input
                              id="first_name"
                              name="first_name"
                              value={formData.first_name || ""}
                              onChange={handleInputChange}
                              required
                           />
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="last_name">
                              Last Name <span className="text-destructive">*</span>
                           </Label>
                           <Input
                              id="last_name"
                              name="last_name"
                              value={formData.last_name || ""}
                              onChange={handleInputChange}
                              required
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="major">
                              Major <span className="text-destructive">*</span>
                           </Label>
                           <Input id="major" name="major" value={formData.major || ""} onChange={handleInputChange} required />
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="phone_number">Phone Number</Label>
                           <Input
                              id="phone_number"
                              name="phone_number"
                              value={formData.phone_number}
                              onChange={handleInputChange}
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" value={formData.address} onChange={handleInputChange} />
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                           id="bio"
                           name="bio"
                           value={formData.bio}
                           onChange={handleInputChange}
                           className="min-h-[100px]"
                        />
                     </div>
                  </CardContent>
               </Card>

               {/* Academic Information */}
               <Card>
                  <CardHeader>
                     <CardTitle>Academic Information</CardTitle>
                     <CardDescription>Update your academic details and progress</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label>Joined In</Label>
                           <Popover>
                              <PopoverTrigger asChild>
                                 <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {joinedDate ? format(joinedDate, "PPP") : "Select date"}
                                 </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                 <Calendar
                                    mode="single"
                                    selected={joinedDate}
                                    onSelect={(date) => {
                                       setJoinedDate(date)
                                       setFormData((prev) => ({ ...prev, joined_in: date }))
                                    }}
                                    initialFocus
                                 />
                              </PopoverContent>
                           </Popover>
                        </div>

                        <div className="space-y-2">
                           <Label>Expected Graduation</Label>
                           <Popover>
                              <PopoverTrigger asChild>
                                 <Button variant="outline" className="w-full justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {gradDate ? format(gradDate, "PPP") : "Select date"}
                                 </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                 <Calendar
                                    mode="single"
                                    selected={gradDate}
                                    onSelect={(date) => {
                                       console.log(date);
                                       setGradDate(date)
                                       setFormData((prev) => ({ ...prev, expected_graduation_date: date }))
                                    }}
                                    initialFocus
                                 />
                              </PopoverContent>
                           </Popover>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="gpa">GPA</Label>
                        <Input id="gpa" name="gpa" value={formData.gpa} onChange={handleInputChange} />
                     </div>

                     <div className="space-y-2">
                        <div className="flex justify-between">
                           <Label>Graduation Progress</Label>
                           <span className="text-sm text-muted-foreground">{formData.graduation_progress}%</span>
                        </div>
                        <Progress value={formData.graduation_progress} className="h-2" />
                        <p className="text-sm text-muted-foreground">Percentage of credits completed</p>
                     </div>
                  </CardContent>
               </Card>


            </div>
         </form>

         <div className="flex md:hidden justify-end gap-4 mt-6">
            <Button type="button" variant="outline" >Cancel</Button>
            <Button type="submit" disabled={!isModified}>Save Changes</Button>
         </div>
      </div>
   )
}

export default AccountInfo
