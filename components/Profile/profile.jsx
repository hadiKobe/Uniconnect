"use client";

import { useState, useEffect } from "react";
import { ProfileHeader } from "@/components/Profile/header";
import Posts from "./posts";

const Profile = ({ userID }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("Received userID:", userID);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/user/getInfo/${userID}`);
        const data = await response.json();
        setStudent(data.userInfo);
      } catch (error) {
        console.error("Failed to load student data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userID) fetchData();
  }, [userID]);

  if (loading) return <p>Loading...</p>;
  if (!student) return <p>No student data found.</p>;

  return (
    <div className="space-y-6">
      <ProfileHeader student={student} />
      <Posts userId={userID} />
    </div>
  );
};

export default Profile;
