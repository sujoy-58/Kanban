import { useState } from "react";

export default function DescriptionSection({ card, onUpdate }) {
  const [description, setDescription] = useState(card.description || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    if (description.trim() !== card.description) {
      onUpdate({ ...card, description });
    }
    setIsEditing(false);
  };

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">
          Description
        </h3>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs text-white/50 hover:text-white transition"
          >
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write details here..."
            className="w-full bg-white/5 border border-white/10 rounded-lg text-sm text-white/80 placeholder-white/40 p-2 focus:outline-none focus:border-blue-500/40 transition-all resize-none"
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={handleSave}
              className="px-3 py-1.5 text-xs bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition"
            >
              Save
            </button>
            <button
              onClick={() => {
                setDescription(card.description || "");
                setIsEditing(false);
              }}
              className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg text-white/80 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="p-2 bg-white/5 rounded-lg cursor-text hover:bg-white/10 transition text-white/70 text-sm"
        >
          {description.trim()
            ? description
            : "Click to add a description..."}
        </div>
      )}
    </div>
  );
}
