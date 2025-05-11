import { useEffect, useState } from "react";

export default function useGetPostById(postId) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/posts/single?postId=${postId}`);
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch post");
        }

        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  return { post, loading, error };
}
