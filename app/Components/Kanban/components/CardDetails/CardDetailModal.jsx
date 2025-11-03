import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import HeaderSection from "./HeaderSection";
import DescriptionSection from "./DescriptionSection";
import DueDateSection from "./DueDateSection";
import PrioritySection from "./PrioritySection";
import SubtasksSection from "./SubtasksSection";
import CommentsSection from "./CommentsSection";
import AssigneeSection from "./AssigneeSection";
import TagSection from "./TagSection";

export default function CardDetailModal({ card, onClose }) {
  // Render nothing if no card is selected
  if (!card) return null;

  return createPortal(
    <AnimatePresence>
      {card && (
        <>
          {/* 🔲 Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={onClose} // close when clicking backdrop
          />

          {/* 🪟 Right Slide-In Panel */}
          <motion.div
            className="
              fixed top-0 right-0 
              h-screen w-[40vw] 
              bg-black/40 backdrop-blur-xl
              border-l border-white/10 
              shadow-2xl 
              z-50 
              flex flex-col
            "
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Header (Title + Close Button) */}
            <HeaderSection card={card} onClose={onClose} />

            {/* Scrollable Content */}
            <div
              className="
                flex-1 overflow-y-auto 
                p-5 space-y-5 
                scrollbar-thin scrollbar-thumb-white/10
              "
            >
              <DescriptionSection card={card} />
              <DueDateSection card={card} />
              <PrioritySection card={card} />
              <SubtasksSection card={card} />

              {/* 🧩 Comments section with safeguard for nested object rendering */}
              <CommentsSection
                card={{
                  ...card,
                  comments: card.comments?.map(comment =>
                    typeof comment === "string"
                      ? comment
                      : comment?.text || ""
                  ),
                }}
              />

              <AssigneeSection card={card} />
              <TagSection card={card} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
