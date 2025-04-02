import { useState } from "react";

export default function AddPost({ onPostAdded }) {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const randomNumber = Math.floor(Math.random() * 5) + 1;

    const res = await fetch("/api/posts/addPost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, userId: randomNumber }),
    });

    if (res.ok) {
      setContent("");
      onPostAdded();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={4}
          required
        ></textarea>

        <button
          type="submit"
          className="mt-1 mb-3 bg-red-950 text-white py-2 px-4 rounded-lg hover:bg-red-900 transition-colors"
        >
          Add Post
        </button>
      </form>
    </>
  );
}
