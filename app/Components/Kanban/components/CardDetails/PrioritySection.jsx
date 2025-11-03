export default function PrioritySection({ card }) {
  const colors = {
    Low: "bg-green-500/10 text-green-400 border-green-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    High: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <h3 className="text-sm font-semibold text-white/80 mb-2 uppercase tracking-wide">
        Priority
      </h3>
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
          colors[card.priority] || "bg-white/5 text-white/50 border-white/10"
        }`}
      >
        {card.priority || "None"}
      </span>
    </div>
  );
}
