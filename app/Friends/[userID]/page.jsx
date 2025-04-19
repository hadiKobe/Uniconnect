"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const Pages = () => {
  const { userID } = useParams();
  const [friends, setFriends] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [requests, setRequests] = useState([]); 

  const fetchFriends = async () => {
    try {
      const response = await fetch(`/api/Friends/get/${userID}`);
      const data = await response.json();
      setFriends(data.friends || []);
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    }
  };

  const fetchSuggested = async () => {
    try {
      const response = await fetch(`/api/Friends/suggested`);
      const data = await response.json();
      setSuggested(data.nonFriends || []);
    } catch (error) {
      console.error("Failed to fetch suggested friends:", error);
    }
  };
  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/Friends/Requests/get`);
      const data = await response.json();
      setRequests(data.friendRequests || []); // ✅ FIXED
    } catch (error) {
      console.error("Failed to fetch friend requests:", error);
    }
  };
  

  const updateRequest = async (requestId, status) => {
    try {
      const response = await fetch(`/api/Friends/Requests/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId, status }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(`Friend request ${status}!`);
      } else {
        alert(data.error || "Failed to update request.");
      }
    } catch (error) {
      console.error("Error updating friend request:", error);
    }
  };
  
  console.log("Friend Requests:", requests); // Debugging line
  console.log("Friends:", friends); // Debugging line 
  console.log("Suggested Friends:", suggested); // Debugging line

  const sendRequest = async (friendID) => {
    try {
      const response = await fetch(`/api/Friends/Requests/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId: friendID }),
      });
      const data = await response.json();

      if (data.message) {
        alert(data.message);
        fetchSuggested(); // Refresh suggested list
      } else {
        alert("Failed to send friend request.");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  useEffect(() => {
    if (userID) {
      fetchFriends();
      fetchSuggested();
      fetchRequests();
    }
  }, [userID]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Friends of User {userID}</h1>

      {/* Friends List */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Your Friends</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {friends.length === 0 ? (
            <p>No friends found.</p>
          ) : (
            friends.map((friend) => (
              <li
                key={friend.id}
                className="flex items-center space-x-4 border p-4 rounded-md shadow-sm"
              >
                <img
                  src={friend.profile_picture || "/default-avatar.png"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">
                    {friend.first_name} {friend.last_name}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Suggested Friends List */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Suggested Friends</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggested.length === 0 ? (
            <p>No suggested friends.</p>
          ) : (
            suggested.map((user) => (
              <li
                key={user.id}
                className="flex items-center justify-between border p-4 rounded-md shadow-sm"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={user.profile_picture || "/default-avatar.png"}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">
                      {user.first_name} {user.last_name}
                    </p>
                  </div>
                </div>
                <button
                  className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => sendRequest(user.id)}
                >
                  Add Friend
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
      {/* Friend Requests List */}
<div className="mb-8">
  <h2 className="text-lg font-semibold mb-3">Pending Friend Requests</h2>
  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {requests.length === 0 ? (
      <p>No pending requests.</p>
    ) : (
      requests.map((req) => (
        <li
          key={req.request_id}
          className="flex items-center justify-between border p-4 rounded-md shadow-sm"
        >
          <div className="flex items-center space-x-4">
            <img
              src={req.profile_picture || "/default-avatar.png"}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">
                {req.first_name} {req.last_name}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => {
                updateRequest(req.request_id, "accepted");
                fetchRequests(); // refresh list
                fetchFriends();  // refresh friend list if accepted
              }}
            >
              Accept
            </button>
            <button
              className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => {
                updateRequest(req.request_id, "declined");
                fetchRequests(); // refresh list
              }}
            >
              Decline
            </button>
          </div>
        </li>
      ))
    )}
  </ul>
</div>

    </div>
  );
};

export default Pages;
