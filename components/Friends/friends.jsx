"use client"

import { useState, useEffect } from "react"
import { FriendRequestsSection } from "./requests"
import { MyFriendsSection } from "./myFriends"
import { SuggestedFriendsSection } from "./suggested"
import { useSession } from "next-auth/react"
import { SentRequestsSection } from "./sent"

export function FriendsContent() {
  const { data: session } = useSession()
  const userID = session?.user?.id

  const [friendRequests, setFriendRequests] = useState([])
  const [myFriends, setMyFriends] = useState([])
  const [suggestedFriends, setSuggestedFriends] = useState([])
  const [sentRes, setSentRes] = useState([])

  const fetchData = async () => {
    if (!userID) return;
  
    try {
      // 1. Run all 4 fetch requests at the same time
      const [requestsRes, friendsRes, suggestedRes, sentRequestsRes] = await Promise.all([
        fetch("/api/Friends/Requests/get"),          // received friend requests
        fetch(`/api/Friends/get/${userID}`),         // current user's friends
        fetch("/api/Friends/suggested"),             // suggested friends
        fetch("/api/Friends/Requests/sendByMe"),     // requests sent by the user
      ]);
  
      // 2. Parse all responses as JSON
      const [requestsData, friendsData, suggestedData, sentData] = await Promise.all([
        requestsRes.json(),
        friendsRes.json(),
        suggestedRes.json(),
        sentRequestsRes.json(),
      ]);
  
      // 3. Update local state with the parsed data
      setFriendRequests(requestsData.friendRequests || []);
      setMyFriends(friendsData.friends || []);
      setSuggestedFriends(suggestedData.nonFriends || []);
      setSentRes(sentData.sentRequests || []);
    } catch (error) {
      console.error("Failed to load friend data:", error);
    }
  };
  
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

  const onDelete = async (requestId) => {
    try {
      const response = await fetch(`/api/Friends/Requests/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      });
  
      const data = await response.json();
  
      if (data.message) {
        alert(data.message);
        fetchData(); // ✅ Refresh UI after deletion
      } else {
        alert("Failed to delete friend request.");
      }
    } catch (error) {
      console.error("Error deleting friend request:", error);
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
    <div className="mx-auto py-6 space-y-6 max-w-7xl px-4">
      <h1 className="text-3xl font-bold">Friends</h1>
  
      {/* Flex Row: 3/4 main content | 1/4 sent requests */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - 3/4 width */}
        <div className="w-full md:w-3/4 space-y-6">
          <FriendRequestsSection
            requests={friendRequests}
            onAccept={acceptRequest}
            onReject={rejectRequest}
          />
          <MyFriendsSection friends={myFriends} onRemove={removeFriend} />
          <SuggestedFriendsSection
            suggestions={suggestedFriends}
            onAdd={addSuggested}
          />
        </div>
  
        {/* Right side - 1/4 width */}
        <div className="w-full md:w-1/4">
          <SentRequestsSection requests={sentRes} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );
  
} 
