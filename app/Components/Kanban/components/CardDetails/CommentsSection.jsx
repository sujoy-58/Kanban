import { useState } from "react";
import { FiSend } from "react-icons/fi";

export default function CommentsSection({ card }) {
  const [comments, setComments] = useState(card.comments || []);
  const [input, setInput] = useState("");

  const addComment = () => {
    if (!input.trim()) return;
    setComments([...comments, input]);
    setInput("");
  };

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <h3 className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide">
        Comments
      </h3>
      <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 mb-3">
        {comments.length === 0 && (
          <p className="text-sm text-white/40 italic">No comments yet</p>
        )}
        {comments.map((c, i) => (
          <div
            key={i}
            className="p-2 bg-white/5 rounded-md border border-white/10 text-white/80 text-sm"
          >
            {c}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg p-2 text-sm text-white/80 placeholder-white/40 focus:border-blue-500/40 outline-none"
        />
        <button
          onClick={addComment}
          className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-all"
        >
          <FiSend size={16} />
        </button>
      </div>
    </div>
  );
}
