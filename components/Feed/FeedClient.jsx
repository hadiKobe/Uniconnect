"use client"
import { useState } from "react"
import Post from "@/components/Posts/Post"
import { useGetPosts } from "@/hooks/Posts/getPosts"
import LoadingPage from "@/components/Loading/LoadingPage"
import { useFilterStore } from "@/hooks/Filters/useFilterStore"
import { usePathname } from "next/navigation"

import { Button } from "../ui/button"
import { List, GraduationCap, User, Plus, Briefcase, BookOpen, ShoppingBag, Filter } from "lucide-react"
import { AddPost } from "../Posts/AddPost"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

function DropDownMenu({ initial, name, filters, onChange }) {
  const isArray = Array.isArray(filters)

  return (
    <Select value={initial} onValueChange={onChange}>
      <SelectTrigger className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150">
        <SelectValue placeholder={`Choose ${name} Type`} />
      </SelectTrigger>

      <SelectContent className="border border-gray-200 shadow-lg rounded-md bg-white">
        <SelectItem value=" " className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-50 transition rounded">
          All
        </SelectItem>

        {isArray &&
          filters.map((value, index) => (
            <SelectItem
              key={index}
              value={value}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-50 transition rounded"
            >
              {value}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  )
}

export default function FeedClient({ section }) {

  const pathname = usePathname();

  const location = useFilterStore((state) => state.filters[pathname]?.location || '');
  const filter = useFilterStore((state) => state.filters[pathname]?.filter || '');
  const specific = useFilterStore((state) => state.filters[pathname]?.specific || '');
  const setFilters = useFilterStore((state) => state.setFilters); // extract the function
  const resetFilters = useFilterStore((state) => state.resetFilters);

  const set = (updates) => setFilters(pathname, updates);

  const [showAddPost, setShowAddPost] = useState(false)

  const { posts, onDeletePost, loading, error } = useGetPosts(filter, section, specific, location)

  const handlePostAdded = () => {
    // Changing filter state will auto-trigger refetch via hook
    setFilter((prev) => prev + " ") // trigger small change to re-run hook
    setShowAddPost(false)
  }

  const handlePostDeleted = (post_id) => {
    onDeletePost(post_id)
  }

  const filters = {
    job: ["Full-Time", "Part-Time", "Internship"],
    location: ["Beirut", "Bekaa", "Rayak", "Tripoli", "Nabatyeh", "Campus A"],
    tutor: ["Computer Science", "Maths", "Physics"],
    market: ["Book", "Course", "Lab Coat"],
  }

  // Get section icon
  const getSectionIcon = () => {
    switch (section) {
      case "job":
        return <Briefcase className="w-4 h-4" />
      case "tutor":
        return <BookOpen className="w-4 h-4" />
      case "market":
        return <ShoppingBag className="w-4 h-4" />
      default:
        return <List className="w-4 h-4" />
    }
  }

  // Get section color
  const getSectionColor = () => {
    switch (section) {
      case "job":
        return "bg-blue-50 text-blue-700"
      case "tutor":
        return "bg-purple-50 text-purple-700"
      case "market":
        return "bg-green-50 text-green-700"
      default:
        return "bg-gray-50 text-gray-700"
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">

      {/* Main container */}
      <div className="flex flex-col gap-4">

        {/* Filters + New Post - Sticky header */}
        <div className="bg-white/90 backdrop-blur-sm sticky top-0 z-40 py-2 px-3 rounded-lg shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={filter === "" ? "default" : "ghost"}
              size="sm"
              className="rounded-full text-sm font-medium"
              onClick={() => set({ filter: "" })}
            >
              <List className="w-4 h-4 mr-1.5" />
              All
            </Button>

            <Button
              variant={filter === "major" ? "default" : "ghost"}
              size="sm"
              className="rounded-full text-sm font-medium"
              onClick={() => set({ filter: "major" })}
            >
              <GraduationCap className="w-4 h-4 mr-1.5" />
              MyMajor
            </Button>

            <Button
              variant={filter === "friends" ? "default" : "ghost"}
              size="sm"
              className="rounded-full text-sm font-medium"
              onClick={() => set({ filter: "friends" })}
            >
              <User className="w-4 h-4 mr-1.5" />
              MyFeed
            </Button>

            <div className="ml-auto">
              <Dialog open={showAddPost} onOpenChange={setShowAddPost}>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Post</span>
                    <span className="sm:hidden">Post</span>
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-2xl w-full">
                  <DialogHeader>
                    <DialogTitle>Create a New Post</DialogTitle>
                  </DialogHeader>
                  <AddPost onPostAdded={handlePostAdded} />
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Mobile filters - horizontal scrollable row */}
          {section !== "home" && (
            <div className="mt-2 lg:hidden overflow-x-auto pb-2 flex items-center gap-2">
              <div className="flex-shrink-0">
                <Badge variant="outline" className={`${getSectionColor()} border-0 flex items-center gap-1 px-2 py-1`}>
                  {getSectionIcon()}
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </Badge>
              </div>
              <div className="flex-shrink-0">
                <DropDownMenu
                  initial={specific}
                  name={section.charAt(0).toUpperCase() + section.slice(1)}
                  filters={filters[section]}
                  onChange={(value) => set({ specific: value.trim() })}
                />
              </div>
              <div className="flex-shrink-0">
                <DropDownMenu
                  initial={location}
                  name="Location"
                  filters={filters.location}
                  onChange={(value) => set({ location: value.trim() })}
                />
              </div>
            </div>
          )}
        </div>

        {/* Section title with icon */}
        <div className="flex items-center gap-2 px-1">
          <Badge variant="outline" className={`${getSectionColor()} border-0 flex items-center gap-1 px-2 py-1`}>
            {getSectionIcon()}
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </Badge>
          {/* <h2 className="text-xl font-semibold">
            {section === "home"
              ? "Feed"
              : section === "job"
                ? "Job Listings"
                : section === "tutor"
                  ? "Tutoring Services"
                  : section === "market"
                    ? "Marketplace"
                    : section.charAt(0).toUpperCase() + section.slice(1)}
          </h2> */}

          {/* Active filters display */}
          <div className="flex items-center gap-1 ">
            {specific && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {specific}
              </Badge>
            )}
            {location && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {location}
              </Badge>
            )}
            {filter &&
              <Badge variant="secondary" className="flex items-center gap-1">
                {filter}
              </Badge>
            }
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main content area */}
          <div className="w-full lg:w-3/4">
            {/* Posts with layout based on section */}
            <div
              className={
                section === "market"
                  ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
                  : section === "job"
                    ? "flex flex-col gap-3"
                    : section === "tutor"
                      ? "flex flex-col gap-3"
                      : "flex flex-col gap-3"
              }
            >
              {loading ? (
                <LoadingPage />
              ) : error ? (
                <div className="p-4 text-center rounded-lg bg-red-50 text-red-500 border border-red-100">
                  <p>Error: {error}</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="p-6 text-center rounded-lg bg-gray-50 border border-gray-100">
                  <p className="text-muted-foreground">No posts found. Be the first to post!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <Post
                    key={post.id}
                    post={post}
                    onDelete={handlePostDeleted}
                    section={section}
                    className={
                      section === "job"
                        ? "border border-blue-100 bg-blue-50/30 rounded-lg p-4"
                        : section === "tutor"
                          ? "border border-purple-100 bg-purple-50/30 rounded-lg p-4"
                          : section === "home"
                            ? "border border-gray-200 rounded-lg p-4 bg-white"
                            : ""
                    }
                  />
                ))
              )}
            </div>
          </div>

          {/* Desktop sidebar for filters */}
          {section !== "home" && (
            <div className="w-full lg:w-1/4 lg:sticky lg:top-6 lg:self-start">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">

                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4" />
                  <h3 className="font-medium">Filters</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {section.charAt(0).toUpperCase() + section.slice(1)} Type
                    </label>
                    <DropDownMenu
                      initial={specific}
                      name={section.charAt(0).toUpperCase() + section.slice(1)}
                      filters={filters[section]}
                      onChange={(value) => set({ specific: value.trim() })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <DropDownMenu
                      initial={location}
                      name="Location"
                      filters={filters.location}
                      onChange={(value) => set({ location: value.trim() })}
                    />
                  </div>

                  <div className="flex items-center justify-center rounded-lg p-3">
                    <Button
                    variant="destructive"
                      size="sm"
                      onClick={() => resetFilters(pathname)}
                      className="text-sm"
                    >
                      Reset Filters
                    </Button>
                  </div>


                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
