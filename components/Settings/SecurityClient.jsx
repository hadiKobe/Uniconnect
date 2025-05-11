"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, AlertCircle } from 'lucide-react'
import useChangePassowrd from "@/hooks/Settings/changePassword"
import { toast } from "sonner"

export default function SecurityClient() {
   const { loading, error, fetchChangePassword } = useChangePassowrd()
   const [currentPassword, setCurrentPassword] = useState("")
   const [newPassword, setNewPassword] = useState("")
   const [confirmPassword, setConfirmPassword] = useState("")
   const [formError, setFormError] = useState("")

   // Clear form error when inputs change
   useEffect(() => {
      if (formError) setFormError("")
   }, [currentPassword, newPassword, confirmPassword])

   // Display API error when it changes
   useEffect(() => {
      if (error) setFormError(error)
   }, [error])

   const handleChangePassword = async (e) => {
      e.preventDefault()
      setFormError("")

      // Password match validation
      if (confirmPassword !== newPassword) {
         setFormError("New password and confirmation do not match")
         return
      }

      // old password same as new password
      if(newPassword === currentPassword){
         setFormError("Your old password is the same as your new one")
         return
      }

      const result = await fetchChangePassword(currentPassword, confirmPassword)
      const { success, msg } = result

      success ? toast.success(msg) : toast.error(msg)

      // Clear form on success
      if (success) {
         setCurrentPassword("")
         setNewPassword("")
         setConfirmPassword("")
      }
   }

   return (
      <div className="w-full max-w-full md:max-w-3xl px-4 md:px-6 py-6 md:py-8">
         <Card className="w-full shadow-sm">
            <CardHeader>
               <CardTitle>Security Settings</CardTitle>
               <CardDescription>Manage your account security settings</CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleChangePassword}>
                  {formError && (
                     <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-center text-red-600">
                           <AlertCircle className="h-4 w-4 mr-2" />
                           <p className="text-sm font-medium">{formError}</p>
                        </div>
                     </div>
                  )}

                  <div className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                           id="current-password"
                           type="password"
                           value={currentPassword}
                           onChange={(e) => setCurrentPassword(e.target.value)}
                           disabled={loading}
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                           id="new-password"
                           type="password"
                           value={newPassword}
                           onChange={(e) => setNewPassword(e.target.value)}
                           disabled={loading}
                           required
                        />
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                           id="confirm-password"
                           type="password"
                           value={confirmPassword}
                           onChange={(e) => setConfirmPassword(e.target.value)}
                           disabled={loading}
                           required
                        />
                     </div>
                  </div>
                  <Button
                     type="submit"
                     className="w-full mt-6"
                     disabled={loading || !currentPassword || !confirmPassword || !newPassword}
                  >
                     {loading ? (
                        <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           Updating...
                        </>
                     ) : (
                        "Change Password"
                     )}
                  </Button>
               </form>
            </CardContent>
            <CardFooter className="flex flex-col items-start">
               <div className="text-sm text-muted-foreground mb-2">
                  Did you forget your password Again, Reallyy? Reset it here
               </div>
               <Button variant="outline" className="w-full" disabled={loading}>
                  Forgot Password
               </Button>
            </CardFooter>
         </Card>
      </div>
   )
}
