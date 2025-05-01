"use client";
import { useState, useRef } from "react";
import { toast } from "sonner";

import {
  X,
  ImageIcon,
  FileText,
  GraduationCap,
  Briefcase,
  ShoppingBag,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { uploadMedia } from "@/lib/supaBase/storage";
export function AddPost({ onPostAdded }) {
  const [postType, setPostType] = useState("general");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setMediaFiles((prev) => [...prev, ...newFiles]);

      const newPreviews = newFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setMediaPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeMedia = (index) => {
    URL.revokeObjectURL(mediaPreviews[index]);
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    let description = "";
    const category = postType;
    const details = {};

    switch (postType) {
      case "general":
        description = document.getElementById("general-description").value;
        break;

      case "tutor":
        description = document.getElementById("tutor-description").value;
        details.subject = document.getElementById("tutor-subject")?.textContent || "";
        details.rate = document.getElementById("tutor-rate")?.value || "";
        details.location = document.getElementById("tutor-location")?.value || "";
        break;

      case "market":
        description = document.getElementById("market-description").value;
        details.price = document.getElementById("market-price")?.value || "";
        details.location = document.getElementById("market-location")?.value || "";
        break;

      case "job":
        description = document.getElementById("job-description").value;
        details.salary = document.getElementById("job-salary")?.value || "";
        details.location = document.getElementById("job-location")?.value || "";
        details.type = document.getElementById("job-type")?.textContent || "";
        break;

      default:
        return;
    }

    try {
      const uploadedMediaUrls = [];

      for (const file of mediaFiles) {
        const uploadResult = await uploadMedia(file, 'posts');

        if (!uploadResult || !uploadResult.publicUrl) {
          throw new Error("Failed to upload media.");
        }

        uploadedMediaUrls.push(uploadResult.publicUrl);
      }




      // ✅ Step 2: Prepare final form data (with Supabase URLs)
      const payload = {
        description,
        category,
        details,
        mediaUrls: uploadedMediaUrls,  // Now sending URLs, not files
      };

      // ✅ Step 3: Send to your API
      const res = await fetch("/api/posts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Post Added successfully");
        // Clean up previews and state
        mediaPreviews.forEach((url) => URL.revokeObjectURL(url));
        setMediaPreviews([]);
        setMediaFiles([]);
        onPostAdded();
      } else {
        const error = await res.json();
        toast.error("Something went wrong while adding post", error.message);
      }
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Failed to submit post.");
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border-0 shadow-none">

      <CardContent className="p-4">
        <Tabs defaultValue="general" onValueChange={(value) => setPostType(value)}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="tutor" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Tutor</span>
            </TabsTrigger>
            <TabsTrigger value="market" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Market</span>
            </TabsTrigger>
            <TabsTrigger value="job" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Job</span>
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            {/* General */}
            <TabsContent value="general">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="general-description">Description</Label>
                  <Textarea
                    id="general-description"
                    placeholder="Share something with your university community..."
                    className="min-h-[120px]"
                    required
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tutor */}
            <TabsContent value="tutor">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tutor-subject">Subject</Label>
                  <Select required>
                    <SelectTrigger id="tutor-subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Mathematics</SelectItem>
                      <SelectItem value="cs">Computer Science</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                      <SelectItem value="chemistry">Chemistry</SelectItem>
                      <SelectItem value="biology">Biology</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="history">History</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tutor-rate">Hourly Rate ($)</Label>
                    <Input id="tutor-rate" type="number" min="0" placeholder="25" required />
                  </div>
                  <div>
                    <Label htmlFor="tutor-location">Location</Label>
                    <Input id="tutor-location" placeholder="Library, Online, etc." required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tutor-description">Description</Label>
                  <Textarea
                    id="tutor-description"
                    placeholder="Describe your tutoring service..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
              </div>
            </TabsContent>

            {/* Market */}
            <TabsContent value="market">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="market-price">Price ($)</Label>
                    <Input id="market-price" type="number" min="0" placeholder="50" required />
                  </div>
                  <div>
                    <Label htmlFor="market-location">Location</Label>
                    <Input id="market-location" placeholder="Pickup location" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="market-description">Description</Label>
                  <Textarea
                    id="market-description"
                    placeholder="Describe your item in detail..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
              </div>
            </TabsContent>

            {/* Job */}
            <TabsContent value="job">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="job-type">Job Type</Label>
                    <Select required>
                      <SelectTrigger id="job-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="volunteer">Volunteer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="job-location">Location</Label>
                    <Input id="job-location" placeholder="Remote or on-campus" required />
                  </div>
                </div>
                <div>
                  <Label htmlFor="job-salary">Salary/Compensation</Label>
                  <Input id="job-salary" placeholder="$XX-$XX per hour or $XXk per year" required />
                </div>
                <div>
                  <Label htmlFor="job-description">Description</Label>
                  <Textarea
                    id="job-description"
                    placeholder="Describe the job responsibilities and requirements..."
                    className="min-h-[120px]"
                    required
                  />
                </div>
              </div>
            </TabsContent>

            {/* Media Upload */}
            <div className="mt-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="image/*,video/*,application/pdf"
              />

              {mediaPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {mediaPreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Preview ${index}`}
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={triggerFileInput}
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="h-4 w-4" />
                  Add Media
                </Button>

                <Button type="submit" className="flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Post
                </Button>
              </div>
            </div>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
