import { FiUser } from "react-icons/fi";

export default function AssigneeSection({ card }) {
  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-white/80 uppercase mb-1 tracking-wide">
          Assignee
        </h3>
        <p className="text-sm text-white/70">
          {card.assignee || "Unassigned"}
        </p>
      </div>
      <div className="p-2 bg-purple-500/10 rounded-full text-purple-300">
        <FiUser size={16} />
      </div>
    </div>
  );
}
