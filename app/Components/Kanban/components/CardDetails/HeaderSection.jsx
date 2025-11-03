import { FiX, FiTrash2 } from "react-icons/fi";

export default function HeaderSection({ card, onClose }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 backdrop-blur-lg">
      <h2 className="text-lg font-semibold text-white/90 truncate">{card.title}</h2>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
          <FiTrash2 size={16} />
        </button>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition-all"
        >
          <FiX size={18} />
        </button>
      </div>
    </div>
  );
}
