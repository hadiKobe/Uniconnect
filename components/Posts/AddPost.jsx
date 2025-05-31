"use client";
import { useState, useRef, useEffect } from "react";
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
import useAddPost from "@/hooks/Posts/addPost";

function capitalizeEachWord(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}


export function AddPost({ onPostAdded }) {
  const [postType, setPostType] = useState("general");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const fileInputRef = useRef(null);
  const { loading, error, success, fetchAddPost } = useAddPost();

  const [value, setValue] = useState("");
  const handleChange = (e) => {
    const text = e.target.value;
    if (text.length <= 10000) {
      setValue(text);
    }
  };

  const tabs = [
    { name: 'General', icon: FileText },
    { name: 'Tutor', icon: GraduationCap },
    { name: 'Market', icon: ShoppingBag },
    { name: 'Job', icon: Briefcase }
  ];

  const commonInputs = ['location']
  const inputs = {
    Market: ['product_name', 'price', 'type'],
    Tutor: ['subject', 'rate'],
    Job: ['position', 'salary', 'type'],
  }

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
        details.subject = document.getElementById("tutor-subject")?.value || "";
        details.rate = document.getElementById("tutor-rate")?.value || "";
        details.location = document.getElementById("tutor-location")?.value || "";
        break;
      case "market":
        description = document.getElementById("market-description").value;
        details.price = document.getElementById("market-price")?.value || "";
        details.location = document.getElementById("market-location")?.value || "";
        details.type = document.getElementById("market-type")?.value || "";
        details.product_name = document.getElementById("market-product_name")?.value || "";
        break;
      case "job":
        description = document.getElementById("job-description").value;
        details.salary = document.getElementById("job-salary")?.value || "";
        details.location = document.getElementById("job-location")?.value || "";
        details.type = document.getElementById("job-type")?.textContent || "";
        details.position = document.getElementById("job-position")?.value || "";
        // console.log(details.position);
        break;
      default:
        return;
    }

    try {
      const uploadedMediaUrls = [];

      for (const file of mediaFiles) {
        const uploadResult = await uploadMedia(file, "posts");

        if (!uploadResult?.publicUrl) {
          throw new Error("Failed to upload media.");
        }

        uploadedMediaUrls.push(uploadResult.publicUrl);
      }

      const payload = {
        description,
        category,
        details,
        mediaUrls: uploadedMediaUrls,
      };

      const added = await fetchAddPost(payload); // ✅ this now returns true or false

      if (added) {
        toast.success("Post added successfully");
        onPostAdded(); // ✅ refresh posts and/or close modal
        setMediaFiles([]);
        setMediaPreviews([]);
      } else {
        toast.error("Something went wrong while adding post");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Post was not added.");
    }
  };



  return (
    <Card className="w-full max-w-screen-lg lg:px-6 mx-auto border-0 shadow-none">


      <CardContent className="p-4 ">
        <Tabs defaultValue="general" onValueChange={(value) => setPostType(value)}>
          <TabsList className="grid grid-cols-4 mb-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.name.toLowerCase()} value={tab.name.toLowerCase()} className="flex items-center gap-2">
                <tab.icon className="h-4 w-4" />
                <span className="font-bold">{tab.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <form onSubmit={handleSubmit}>

            {/* General */}
            <TabsContent value="general">
              <div className="space-y-4">
                <div className="mb-2">
                  <Label
                    htmlFor="general-description"
                    className="block mb-1 ml-1 text-sm font-bold text-gray-700"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="general-description"
                    placeholder="What's on your mind..?"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 break-all"
                  />
                </div>
              </div>

            </TabsContent>

            {Object.entries(inputs).map(([name, inputs]) => (
              <TabsContent key={name} value={name.toLowerCase()}>
                <div className="grid grid-cols-2 gap-2">

                  {inputs.map((input) => (
                    <div key={input} className="mb-2">
                      <Label
                        htmlFor={`${name.toLowerCase()}-${input}`}
                        className="block mb-1 ml-1 text-sm font-bold text-gray-700"
                      >
                        {capitalizeEachWord(input.replace('_', ' '))}
                      </Label>
                      <Input
                        id={`${name.toLowerCase()}-${input}`}
                        required
                        className="w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ))}

                  {commonInputs.map((input) => (
                    <div key={input} className="mb-4">
                      <Label
                        htmlFor={`${name.toLowerCase()}-${input}`}
                        className="block mb-1 ml-1 text-sm font-bold text-gray-700"
                      >
                        {capitalizeEachWord(input.replace('_', ' '))}
                      </Label>
                      <Input
                        id={`${name.toLowerCase()}-${input}`}
                        required
                        className="w-full px-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ))}

                </div>

                <div className="mb-4">
                  <Label
                    htmlFor={`${name.toLowerCase()}-description`}
                    className="block mb-1 ml-1 text-sm font-bold text-gray-700"
                  >
                    Description
                  </Label>
                  <Textarea
                    id={`${name.toLowerCase()}-description`}
                    placeholder="What do you offer..?"
                    required
                    value={value}
                    onChange={handleChange}
                    className="w-full px-3 break-all py-2 border border-gray-300 rounded-md shadow-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </TabsContent>
            ))}

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
                        src={preview || null}
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
    </Card >
  );
}
