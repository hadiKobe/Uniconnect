export async function fetchStudent(userID) {
    const res = await fetch(`/api/user/getInfo/${userID}`);
    if (!res.ok) throw new Error("Failed to fetch student data");
    const data = await res.json();
    return data.userInfo;
  }
  
  export async function fetchPosts(userID) {
    const res = await fetch(`/api/posts/getUserPost/${userID}`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  }
  
  export  async function fetchFriends(userID) {
    const res = await fetch(`/api/Friends/get/${userID}`);
    if (!res.ok) throw new Error("Failed to fetch friends");
    const data = await res.json();
    return data.friends || [];
  }
  