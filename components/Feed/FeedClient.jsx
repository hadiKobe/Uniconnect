"use client"
import { useState, useRef, useEffect, use } from "react"
import Post from "@/components/Posts/Post"
import { useGetPosts } from "@/hooks/Posts/getPosts"
import LoadingPage from "@/components/Loading/LoadingPage"
import { useFilterStore } from "@/hooks/Filters/useFilterStore"
import { usePathname } from "next/navigation"

import { Separator } from "@/components/ui/separator";
import { Button } from "../ui/button"
import { List, GraduationCap, User, Plus, Briefcase, BookOpen, ShoppingBag, Filter, MapPin } from "lucide-react"
import { AddPost } from "../Posts/AddPost"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

const PAGE_SIZE = 20
const PRELOAD_TRIGGER_INDEX = 15


function SearchBar({ initial, placeholder, onChange }) {
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onChange(e.target.value.trim()); // ✅ Trim only on enter
    }
  };

  const handleChange = (e) => {
    onChange(e.target.value); // ❌ Don't trim here — let user type spaces
  };

  return (
    <input
      type="text"
      value={initial}
      onChange={handleChange}
      onKeyDown={handleKeyPress}
      placeholder={placeholder}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
    />
  );
}

export default function FeedClient({ section }) {

  const labels = {
    job: "Type",
    tutor: "Subject",
    market: "Type"
  }
  const placeholders = {
    job: "e.g. Full-Time, Internship...",
    tutor: "e.g. CENG380, Translation...",
    market: "e.g. Book, Lab Coat...",
    default: "Search...",
  };

  const [open, setOpen] = useState(false)

  const [page, setPage] = useState(1)
  const triggerRef = useRef()

  const pathname = usePathname();

  const location = useFilterStore((state) => state.filters[pathname]?.location || '');
  const filter = useFilterStore((state) => state.filters[pathname]?.filter || '');
  const specific = useFilterStore((state) => state.filters[pathname]?.specific || '');
  const setFilters = useFilterStore((state) => state.setFilters); // extract the function
  const resetFilters = useFilterStore((state) => state.resetFilters);

  const [specificForm, setSpecificForm] = useState(specific || '');
  const [locationForm, setLocationForm] = useState(location || '');

  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const set = (updates) => setFilters(pathname, updates);

  const [showAddPost, setShowAddPost] = useState(false);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);

  const { posts, onDeletePost, loading, error } = useGetPosts(filter, section, specific, location, page, refetchTrigger);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1)
        }
      },
      { threshold: 1.0 }
    )

    if (triggerRef.current) observer.observe(triggerRef.current)
    return () => observer.disconnect()
  }, [loading, posts])

  useEffect(() => {
    if (page > 1) setLoadingMorePosts(loading); // ✅ true when loading, false when done

  }, [loading, page]);

  const handlePostAdded = () => {
    // Changing filter state will auto-trigger refetch via hook
    setRefetchTrigger(prev => prev + 1) // trigger small change to re-run hook
    setShowAddPost(false)
  }

  const handlePostDeleted = (post_id) => {
    onDeletePost(post_id)
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
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 overflow-x-hidden">

      {/* Main container */}
      <div className="flex flex-col gap-4">

        {/* Section title with icon */}
        <div className="flex items-center gap-2 px-1">
          <Badge variant="outline" className={`${getSectionColor()} border-0 flex items-center gap-1 px-2 py-1`}>
            {getSectionIcon()}
            {section.charAt(0).toUpperCase() + section.slice(1)} Section
          </Badge>
          {/* Active filters display */}
          <div className="flex items-center gap-1 ">
            {specific && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {getSectionIcon()}
                {specific}
              </Badge>
            )}
            {location && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {location}
              </Badge>
            )}
            {filter &&
              <Badge variant="secondary" className="flex items-center gap-1">
                {filter === "major" ? <GraduationCap className="w-4 h-4" /> : <User className="w-4 h-4" />}
                {filter}
              </Badge>
            }
          </div>
        </div>

        {/* Filters + New Post - Sticky header */}
        <div className=" py-2 px-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={filter === "" ? "default" : "ghost"}
              size="sm"
              disabled={filter === ""}
              className="rounded-md text-sm font-medium disabled:opacity-100 disabled:pointer-events-auto"
              onClick={() => { set({ filter: "" }) }}
            >
              <List className="w-4 h-4 mr-1.5" />
              All
            </Button>

            <Button
              variant={filter === "major" ? "default" : "ghost"}
              size="sm"
              disabled={filter === "major"}
              className="rounded-md text-sm font-medium disabled:opacity-100 disabled:pointer-events-auto"
              onClick={() => { set({ filter: "major" }) }}
            >
              <GraduationCap className="w-4 h-4 mr-1.5" />
              MyMajor
            </Button>

            <Button
              variant={filter === "friends" ? "default" : "ghost"}
              size="sm"
              disabled={filter === "friends"}
              className="rounded-md text-sm font-medium disabled:opacity-100 disabled:pointer-events-auto"
              onClick={() => { set({ filter: "friends" }) }}
            >
              <User className="w-4 h-4 mr-1.5" />
              MyFeed
            </Button>

            {section !== 'home' &&
              <div className="lg:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="top"
                    className="bg-white p-0 pt-4 rounded-b-2xl"
                  >
                    <SheetHeader className="px-0 py-0 ">
                      <SheetTitle className="text-xl px-5 flex items-center gap-2">
                        Filter Options
                        <Filter className="h-4 w-4" />
                      </SheetTitle>
                      <Separator className="w-24 h-[1.5px] rounded-full mt-3 mb-2 mx-auto" />

                    </SheetHeader>
                    <div className="flex flex-col gap-4 pt-1 pb-5 px-3">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-bold text-gray-700 min-w-[60px] flex-1 flex items-center">
                          {labels[section]}:
                        </label>
                        <div className="flex-4">
                          <SearchBar
                            initial={specificForm}
                            placeholder={placeholders[section] || placeholders.default}
                            onChange={setSpecificForm}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-sm font-bold text-gray-700 min-w-[60px] flex-1 flex items-center">
                          Location:
                        </label>
                        <div className="flex-4">
                          <SearchBar
                            initial={locationForm}
                            placeholder="e.g. Beirut, Campus Sour..."
                            onChange={setLocationForm}
                          />
                        </div>
                      </div>


                      <div className="flex gap-2 pt-2 justify-end">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setPage(1); // Reset page to 1
                            resetFilters(pathname)
                            setSpecificForm(''); // Clear specific form
                            setLocationForm(''); // Clear location form
                            setOpen(false); // Close sheet if open
                          }}
                          className="text-sm"
                        >
                          Reset Filters
                        </Button>

                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setPage(1);
                            set({ specific: specificForm, location: locationForm });
                            setOpen(false); // Close sheet if open
                          }}
                          className="text-sm"
                          disabled={!specificForm && !locationForm}
                        >
                          Search
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>}

            <div className="hidden sm:block">
              <Dialog open={showAddPost} onOpenChange={setShowAddPost}>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="rounded-md text-sm font-medium flex items-center gap-2"
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
              {loading && page === 1 ? (
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
                posts.map((post, idx) => (
                  <div
                    key={`${section}-${post.id}-${idx}`}
                    ref={
                      idx === PRELOAD_TRIGGER_INDEX + (page - 1) * PAGE_SIZE
                        ? triggerRef
                        : null
                    }
                    className="mb-4"
                  >
                    <Post
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
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Desktop sidebar for filters */}
          {section !== "home" && (
            <div className="hidden lg:block lg:w-1/4 lg:sticky lg:top-6 lg:self-start">
              <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">

                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-4 h-4" />
                  <h3 className="font-medium">Filters</h3>
                </div>

                <div className="space-y-3">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {labels[section]}
                    </label>
                    <SearchBar
                      initial={specificForm}
                      placeholder={placeholders[section] || placeholders.default}
                      onChange={setSpecificForm}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <SearchBar
                      initial={locationForm}
                      placeholder="e.g. Beirut, Campus Sour..."
                      onChange={setLocationForm}
                    />
                  </div>


                  <div className="flex items-center justify-between gap-2 rounded-lg p-3">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setPage(1); // Reset page to 1
                        resetFilters(pathname)
                        setSpecificForm(''); // Clear specific form
                        setLocationForm(''); // Clear location form
                      }}
                      className="text-sm"
                    >
                      Reset Filters
                    </Button>

                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => {
                        setPage(1);
                        set({ specific: specificForm, location: locationForm });
                      }}
                      className="text-sm"
                      disabled={!specificForm && !locationForm}
                    >
                      Search
                    </Button>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {loadingMorePosts && <div className="text-center py-4 text-muted">Loading more...</div>}

    </div >
  )
}
