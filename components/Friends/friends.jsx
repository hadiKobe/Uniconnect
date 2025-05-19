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
  const [loading, setLoading] = useState(true)


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
    }finally {
    setLoading(false);
  }
  };
  
  useEffect(() => {
    fetchData()
  }, [userID])


 return (
  <div className="mx-auto py-6 space-y-6 max-w-7xl px-4">
    <h1 className="text-3xl font-bold">Friends</h1>

    {/* Responsive layout: stack on small screens, side-by-side on md+ */}
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left section: Friend Requests, My Friends, Suggested */}
      <div className="w-full lg:w-3/4 space-y-6">
        <div className="max-h-[500px] overflow-y-auto">
          <FriendRequestsSection requests={friendRequests} loading={loading} />
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          <MyFriendsSection friends={myFriends} loading={loading} />
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          <SuggestedFriendsSection suggestions={suggestedFriends} loading={loading} />
        </div>
      </div>

      {/* Right section: Sent Requests */}
      <div className="w-full lg:w-1/4">

          <SentRequestsSection requests={sentRes} loading={loading} />
        
      </div>
    </div>
  </div>
);
}