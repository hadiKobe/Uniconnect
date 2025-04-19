"use client"

import { useState, useEffect } from "react"
import { FriendRequestsSection } from "./requests"
import { MyFriendsSection } from "./myFriends"
import { SuggestedFriendsSection } from "./suggested"
import { useSession } from "next-auth/react"

export function FriendsPage() {
  const { data: session } = useSession()
  const userID = session?.user?.id

  const [friendRequests, setFriendRequests] = useState([])
  const [myFriends, setMyFriends] = useState([])
  const [suggestedFriends, setSuggestedFriends] = useState([])

  const fetchData = async () => {
    if (!userID) return
    try {
      const [requestsRes, friendsRes, suggestedRes] = await Promise.all([
        fetch("/api/Friends/Requests/get"),
        fetch(`/api/Friends/get/${userID}`),
        fetch("/api/Friends/suggested"),
      ])

      const [requestsData, friendsData, suggestedData] = await Promise.all([
        requestsRes.json(),
        friendsRes.json(),
        suggestedRes.json(),
      ])

      setFriendRequests(requestsData.friendRequests || [])
      setMyFriends(friendsData.friends || [])
      setSuggestedFriends(suggestedData.nonFriends || [])
    } catch (error) {
      console.error("Failed to load friend data:", error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [userID])

  const acceptRequest = async (id) => {
    try {
      const response = await fetch(`/api/Friends/Requests/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId: id, status: "accepted" }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Friend request accepted!")
        fetchData() // refresh UI
      } else {
        alert(data.error || "Failed to accept friend request.")
      }
    } catch (error) {
      console.error("Error updating friend request:", error)
    }
  }

  const rejectRequest = async (id) => {
    try {
      const response = await fetch(`/api/Friends/Requests/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId: id, status: "declined" }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Friend request declined!")
        fetchData() // refresh UI
      } else {
        alert(data.error || "Failed to decline friend request.")
      }
    } catch (error) {
      console.error("Error updating friend request:", error)
    }
  }

  const removeFriend = async (id) => {
    try {
      const response = await fetch(`/api/Friends/unFriend`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId: id }),
      });
  
      if (response.ok) {
        alert("Friend removed successfully!");
        fetchData(); // refresh UI
      } else {
        const data = await response.json();
        alert(data.error || "Failed to remove friend.");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };
  

  const addSuggested = async (id) => {
    try {
      const response = await fetch(`/api/Friends/Requests/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId: id }),
      })

      const data = await response.json()

      if (data.message) {
        alert(data.message)
        fetchData() // refresh everything
      } else {
        alert("Failed to send friend request.")
      }
    } catch (error) {
      console.error("Error sending friend request:", error)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-4xl">
      <h1 className="text-3xl font-bold">Friends</h1>

      <div className="space-y-6">
        <FriendRequestsSection
          requests={friendRequests}
          onAccept={acceptRequest}
          onReject={rejectRequest}
        />
        <MyFriendsSection friends={myFriends} onRemove={removeFriend} />
        <SuggestedFriendsSection suggestions={suggestedFriends} onAdd={addSuggested} />
      </div>
    </div>
  )
}
