"use client";

import { useState, useEffect } from "react";
import { ProfileHeader } from "@/components/Profile/header";
import Posts from "./posts";
import { FriendsCard } from "./friends";
import { useGetFriends } from "@/hooks/Friends/getFriends";
import { GraduationProgressCard } from "./progress";
import { useSession } from "next-auth/react"

const Profile = ({ userID }) => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const { friends, loading: friendsLoading } = useGetFriends(userID);

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

  if (loading) return <p>Loading profile info...</p>;
  if (!student) return <p>No student data found.</p>;

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 md:px-6">
      <div className="grid gap-6">
        <ProfileHeader student={student} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GraduationProgressCard
            progress={student.graduation_progress}
            graduationYear={student.expected_graduation_date}
          />
          {friendsLoading ? (
            <p>Loading friends...</p>
          ) : (
            <FriendsCard friends={friends} />
          )}
        </div>
        <Posts userId={userID} />
      </div>
    </div> // ✅ Closing outer <div> was missing
  );
};

export default Profile;
