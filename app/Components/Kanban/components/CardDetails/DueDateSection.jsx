import { FiCalendar } from "react-icons/fi";

export default function DueDateSection({ card }) {
  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-white/80 uppercase mb-1 tracking-wide">
          Due Date
        </h3>
        <p className="text-sm text-white/70">
          {card.dueDate || "Not set"}
        </p>
      </div>
      <div className="p-2 bg-blue-500/10 rounded-full text-blue-400">
        <FiCalendar size={16} />
      </div>
    </div>
  );
}
