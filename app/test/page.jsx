import { PostCard } from "../../components/PostsComponent/structure/post-card"

export default function Home() {
  const posts = [
    {
      id: "1",
      type: "market",
      title: "MacBook Pro 2021 M1 - Like New",
      content:
        "Selling my MacBook Pro 2021 with M1 chip. Only used for 6 months, in perfect condition with original packaging and accessories. Battery health at 98%.",
      author: {
        id: "user123", // Same as current user for testing delete functionality
        name: "Current User",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "2 hours ago",
      likes: 24,
      dislikes: 2,
      likedBy: ["user456"], // Not the current user
      dislikedBy: [], // Not the current user
      comments: [
        {
          id: "comment1",
          authorId: "user456",
          author: {
            name: "Jane Smith",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          content: "Is this still available? I'm interested!",
          createdAt: "1 hour ago",
        },
        {
          id: "comment2",
          authorId: "user789",
          author: {
            name: "Bob Johnson",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          content: "What's the battery cycle count?",
          createdAt: "30 minutes ago",
        },
      ],
      price: "1,200",
      location: "San Francisco",
      media: [
        {
          type: "image",
          url: "/placeholder.svg?height=400&width=600",
        },
        {
          type: "image",
          url: "/placeholder.svg?height=400&width=600",
        },
      ],
    },
    {
      id: "2",
      type: "tutor",
      title: "Math Tutor for High School and College Students",
      content:
        "I offer tutoring in Calculus, Linear Algebra, and Statistics. I have 5 years of experience teaching at university level and can help with homework, exam prep, or general understanding.",
      author: {
        id: "user456",
        name: "Maria Garcia",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "Yesterday",
      likes: 18,
      dislikes: 1,
      likedBy: ["user123"], // Current user has liked this
      dislikedBy: [],
      comments: [
        {
          id: "comment3",
          authorId: "user123", // Current user's comment
          author: {
            name: "Current User",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          content: "Do you offer online sessions?",
          createdAt: "12 hours ago",
        },
      ],
      subject: "Mathematics",
      rate: "45",
      location: "Online / In-person",
    },
    {
      id: "3",
      type: "job",
      title: "Frontend Developer - React/Next.js",
      content:
        "We're looking for a skilled Frontend Developer with experience in React and Next.js to join our growing team. Remote position with competitive benefits and flexible hours.",
      author: {
        id: "user789",
        name: "TechCorp Recruiting",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "2 days ago",
      likes: 56,
      dislikes: 3,
      likedBy: [],
      dislikedBy: ["user123"], // Current user has disliked this
      comments: [],
      type: "Full-time",
      salary: "120K-150K/year",
      location: "Remote",
      media: [
        {
          type: "video",
          url: "https://www.w3schools.com/html/mov_bbb.mp4",
          thumbnail: "/placeholder.svg?height=400&width=600",
        },
      ],
    },
    {
      id: "4",
      type: "general",
      title: "Community Cleanup Event This Weekend",
      content:
        "Join us this Saturday for our monthly community cleanup event at Central Park. We'll provide gloves, bags, and refreshments. Great way to meet neighbors and help keep our community beautiful!",
      author: {
        id: "user456",
        name: "Community Connect",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "3 days ago",
      likes: 89,
      dislikes: 5,
      likedBy: [],
      dislikedBy: [],
      comments: [
        {
          id: "comment4",
          authorId: "user789",
          author: {
            name: "Bob Johnson",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          content: "I'll be there! What time does it start?",
          createdAt: "2 days ago",
        },
        {
          id: "comment5",
          authorId: "user123", // Current user's comment
          author: {
            name: "Current User",
            avatar: "/placeholder.svg?height=32&width=32",
          },
          content: "Do we need to bring our own equipment?",
          createdAt: "1 day ago",
        },
      ],
      location: "Central Park",
      media: [
        {
          type: "image",
          url: "/placeholder.svg?height=400&width=600",
        },
      ],
    },
  ]

  return (
    <main className="container mx-auto py-8 px-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Community Posts</h1>

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  )
}
