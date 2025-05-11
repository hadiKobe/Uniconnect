"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Camera, Loader2, User } from "lucide-react"
import { useGetUserInfo } from "@/hooks/Settings/getUserInfo"
import { useChangeInfo } from "@/hooks/Settings/changeInfo"
import { toast } from "sonner"
import { PhotoUploadDialog } from "./PhotoUpload"

const AccountInfo = () => {
   const { userInfo, loading, error } = useGetUserInfo()
   const { fetchChangeInfo, loadingChange } = useChangeInfo()

   const [originalData, setOriginalData] = useState({})
   const [changedFields, setChangedFields] = useState({})
   const [openUploadPhoto, setOpenUploadPhoto] = useState(false);

   const handleImageUploaded = (imageUrl) => {
      handleInputChange({ target: { name: "profile_picture", value: imageUrl } })
      setOpenUploadPhoto(false)
   }

   const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      major: "",
      joined_in: {
         year: "",
         month: "",
      },
      bio: "",
      address: "",
      phone_number: "",
      expected_graduation_date: {
         year: "",
         month: "",
      },
      graduation_progress: 0,
      gpa: "",
   })

   const handleInputChange = (e) => {
      const { name, value } = e.target

      setChangedFields((prev) => {
         const updated = { ...prev }
         value === originalData[name] ? delete updated[name] : (updated[name] = value)
         return updated
      })
      setFormData((prev) => ({ ...prev, [name]: value }))
   }

   useEffect(() => {
      if (userInfo) {
         const { joined_in = "", expected_graduation_date = "" } = userInfo

         const [joined_year, joined_month] = joined_in ? joined_in.split("-") : ["0", "0"]
         const [graduation_year, graduation_month] = expected_graduation_date
            ? expected_graduation_date.split("-")
            : ["0", "0"]

         const sanitizedUserInfo = {
            first_name: userInfo.first_name || "",
            last_name: userInfo.last_name || "",
            major: userInfo.major || "",
            joined_in: {
               year: joined_year || "",
               month: joined_month || "",
            },
            bio: userInfo.bio || "",
            address: userInfo.address || "",
            phone_number: userInfo.phone_number || "",
            expected_graduation_date: {
               year: graduation_year || "",
               month: graduation_month || "",
            },
            graduation_progress: userInfo.graduation_progress || 0,
            gpa: userInfo.gpa || "",
            profile_picture: userInfo.profile_picture || null,
         }
         setFormData(sanitizedUserInfo)
         setOriginalData(sanitizedUserInfo)
      }
   }, [userInfo])

   // useEffect(() => {
   //    console.log("changed fields :", changedFields)
   // }, [changedFields])

   // useEffect(() => {
   //    console.log("form data :", formData)
   // }, [formData])

   // useEffect(() => {
   //    console.log("original data :", originalData)
   // }, [originalData])

   const handleProgressChange = (e) => {
      const value = Number.parseInt(e.target.value) || 0
      const clampedValue = Math.min(100, Math.max(0, value))
      setFormData((prev) => ({ ...prev, graduation_progress: clampedValue }))
   }

   const handleSubmit = async (e) => {
      e.preventDefault()
      if (changedFields.first_name === "" || changedFields.last_name === "" || changedFields.major === "") {
         toast.error("Please fill in all required fields")
         return
      }

      const result = await fetchChangeInfo(changedFields)

      if (!result.infoChanged) {
         if (result?.notAllowedChangeMajor !== undefined) toast.error("Major changed in the last 5 months")
         else toast.error(result.msg || "Update failed")
         return
      }

      toast.success("Info changed successfully")
      setChangedFields({})
      setOriginalData({ ...formData })
   }

   const handleCancel = () => {
      if (originalData) {
         const originalFormData = JSON.parse(originalData)
         setFormData(originalFormData)
      }
   }

   const isModified = originalData ? JSON.stringify(formData) !== JSON.stringify(originalData) : false

   if (!userInfo) {
      return (
         <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin text-muted-foreground" size={40} />
         </div>
      );
   }

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
               <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
               </Button>
               <Button type="submit" form="account-form" disabled={!isModified || loadingChange}>
                  Save Changes
               </Button>
            </div>
         </div>

         <form id="account-form" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Profile Picture Section */}
               <Card>
                  <CardHeader>
                     <CardTitle>Profile Picture</CardTitle>
                     <CardDescription>Upload a profile picture to personalize your account</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center space-y-4">
                     <Avatar className="h-32 w-32">
                        <AvatarImage src={formData.profile_picture || "/placeholder.svg"} alt="Profile" />
                        <AvatarFallback className="text-4xl">
                           <User size={64} />
                        </AvatarFallback>
                     </Avatar>

                     <Button type="button" variant="outline" className="flex items-center gap-2" onClick={() => { setOpenUploadPhoto(true) }}>
                        <Camera size={16} />
                        Upload Photo
                     </Button>

                     <PhotoUploadDialog open={openUploadPhoto} onOpenChange={setOpenUploadPhoto} onImageUploaded={handleImageUploaded} initialImageUrl={formData.profile_picture} />
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
                           <Input
                              id="major"
                              name="major"
                              value={formData.major || ""}
                              onChange={handleInputChange}
                              required
                           />
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="phone_number">Phone Number</Label>
                           <Input
                              id="phone_number"
                              name="phone_number"
                              value={formData.phone_number || ""}
                              onChange={handleInputChange}
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" name="address" value={formData.address || ""} onChange={handleInputChange} />
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                           id="bio"
                           name="bio"
                           value={formData.bio || ""}
                           onChange={handleInputChange}
                           className="min-h-[100px]"
                        />
                     </div>
                  </CardContent>
               </Card>

               {/* Academic Information */}
               <Card className="md:col-span-2">
                  <CardHeader>
                     <CardTitle>Academic Information</CardTitle>
                     <CardDescription>Update your academic details and progress</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label>Joined In</Label>

                        </div>

                        <div className="space-y-2">
                           <Label>Expected Graduation</Label>

                        </div>
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="gpa">GPA</Label>
                        <Input id="gpa" name="gpa" value={formData.gpa || ""} onChange={handleInputChange} />
                     </div>

                     <div className="space-y-2">
                        <div className="flex justify-between">
                           <Label htmlFor="graduation_progress">Graduation Progress</Label>
                           <span className="text-sm text-muted-foreground">{formData.graduation_progress}%</span>
                        </div>
                        <Input
                           id="graduation_progress"
                           name="graduation_progress"
                           type="number"
                           min="0"
                           max="100"
                           value={formData.graduation_progress}
                           onChange={(e) => {
                              handleProgressChange(e)
                              handleInputChange(e)
                           }}
                           className="mb-2"
                        />
                        <Progress value={formData.graduation_progress} className="h-2" />
                        <p className="text-sm text-muted-foreground">Percentage of credits completed</p>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </form >

         <div className="flex md:hidden justify-end gap-4 mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
               Cancel
            </Button>
            <Button type="submit" form="account-form" disabled={!isModified}>
               Save Changes
            </Button>
         </div>
      </div >
   )
}



export default AccountInfo
