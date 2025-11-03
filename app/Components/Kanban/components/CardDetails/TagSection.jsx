import { FiTag } from "react-icons/fi";

export default function TagSection({ card }) {
  if (!card.tags || card.tags.length === 0)
    return (
      <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">
          Tags
        </h3>
        <p className="text-sm text-white/40 italic">No tags</p>
      </div>
    );

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <h3 className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide">
        Tags
      </h3>
      <div className="flex flex-wrap gap-2">
        {card.tags.map((tag, i) => (
          <span
            key={i}
            className="px-3 py-1 bg-blue-500/10 text-blue-300 rounded-full text-xs border border-blue-500/20"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
