import { useMemo } from "react";
import { FiCheckSquare } from "react-icons/fi";

export default function SubtasksSection({ card }) {
  const subtasks = card.subtasks || [];

  // Calculate progress
  const completedCount = useMemo(
    () => subtasks.filter(t => t.completed).length,
    [subtasks]
  );
  const totalCount = subtasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
      {/* Header with Icon */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FiCheckSquare className="text-white/70" />
          <h2 className="text-white font-semibold">Subtasks</h2>
        </div>
        {totalCount > 0 && (
          <span className="text-xs text-white/50">
            {completedCount}/{totalCount} done
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Subtasks List */}
      <div className="space-y-2 mt-3">
        {subtasks.length > 0 ? (
          subtasks.map((task, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 rounded-md hover:bg-white/10 transition"
            >
              <input
                type="checkbox"
                checked={task.completed}
                readOnly
                className="accent-green-500"
              />
              <span
                className={`text-sm ${
                  task.completed ? "text-white/40 line-through" : "text-white"
                }`}
              >
                {task.title}
              </span>
            </div>
          ))
        ) : (
          <p className="text-white/40 text-sm italic">
            No subtasks added yet.
          </p>
        )}
      </div>
    </div>
  );
}
