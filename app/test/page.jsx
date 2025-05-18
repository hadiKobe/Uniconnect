"use client";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useChat } from "@/hooks/chatSystem/chat";
import { useGetMessages } from "@/hooks/chatSystem/getMassages";



const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

export default function SessionChat() {
  const socket = useRef(null);
  const [userId, setUserId] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  const [targetUserId, setTargetUserId] = useState("");
  const [message, setMessage] = useState("");
  const [liveMessages, setLiveMessages] = useState([]);

  const { chat, loading, error } = useChat(userId, targetUserId); // Fetch chat and get chat._id
  const { messages: fetchedMessages, loading: loadingMessages } = useGetMessages(chat?._id); // Fetch historical messages

  useEffect(() => {
    socket.current = io(SOCKET_URL);

    socket.current.on("receivePrivateMessage", (data) => {
      setLiveMessages((prev) => [...prev, `From ${data.fromUserId}: ${data.message}`]);
    });

    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, []);

  const handleLogin = () => {
    if (socket.current && userId) {
      socket.current.emit("login", { userId });
      setSessionActive(true);
    }
  };

  const handleSelectChat = (targetId) => {
    setTargetUserId(targetId);
    setLiveMessages([]); // Clear live messages when switching chats
  };

  const handleSendMessage = () => {
    if (socket.current && message.trim() !== "" && chat?._id) {
      socket.current.emit("sendPrivateMessage", {
        fromUserId: userId,
        toUserId: targetUserId,
        message,
        chatId: chat?._id, // Send chatId properly
      });
      setLiveMessages((prev) => [...prev, `You to ${targetUserId}: ${message}`]);
      setMessage("");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      {!sessionActive ? (
        <>
          <h3>Enter Your User ID</h3>
          <input
            placeholder="Your User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
          />
          <button onClick={handleLogin} style={{ width: "100%", padding: "8px" }}>
            Start Session
          </button>
        </>
      ) : (
        <>
          <h3>Welcome, User {userId}</h3>
          <h4>Select Chat:</h4>
          <button
            onClick={() => handleSelectChat("14")}
            style={{ width: "48%", padding: "8px", marginRight: "4%" }}
          >
            Chat with User 14
          </button>
          <button
            onClick={() => handleSelectChat("20")}
            style={{ width: "48%", padding: "8px" }}
          >
            Chat with User 20
          </button>

          {targetUserId && (
            <>
              <h4 style={{ marginTop: "20px" }}>
                {loading || loadingMessages ? "Loading chat..." : `Chatting with User ${targetUserId}`}
              </h4>

              {error && <p style={{ color: "red" }}>Error loading chat: {error.message}</p>}

              <div
                style={{
                  border: "1px solid #ccc",
                  height: "200px",
                  overflowY: "scroll",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                {/* Historical Messages */}
                {fetchedMessages.map((msg, idx) => (
                  <p key={`history-${idx}`} style={{ margin: "5px 0" }}>
                    <strong>{msg.fromUserId}:</strong> {msg.message}
                  </p>
                ))}

                {/* Real-time Messages */}
                {liveMessages.map((msg, idx) => (
                  <p key={`live-${idx}`} style={{ margin: "5px 0" }}>{msg}</p>
                ))}
              </div>

              <input
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              />
              <button onClick={handleSendMessage} style={{ width: "100%", padding: "8px" }}>
                Send Message
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

