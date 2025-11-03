"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Board from "./Board";
import CommandPalette from "./CommandPalette";
import WorkspaceManager from "./WorkspaceManager";
import Analytics from "./Analytics";
import useGlobalShortcuts from "../../hooks/useGlobalShortcuts"
import { Keyboard, Command, Square, ChevronUp } from "lucide-react";

const Kanban = ({
  todoTitle = "TODO",
  backLog = "Backlog",
  progress = "Progress",
  completed = "Completed",
  searchQuery = "",
  filterPriority = "All",
  filterType = "All",
  cards = [],
  setCards,
}) => {
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState("default");
  const [showAnalytics, setShowAnalytics] = useState(false);

  // ✅ Integrate global shortcuts (replaces manual keydown handling)
  useGlobalShortcuts({
    setCards,
    onOpenCommandPalette: () => setShowCommandPalette(true),
    activeWorkspace,
    showCommandPalette,
    showAnalytics,
    setShowCommandPalette,
    setShowAnalytics,
  });

  // Auto-move overdue tasks to backlog
  useEffect(() => {
    const checkOverdueTasks = () => {
      const today = new Date().toISOString().split("T")[0];
      setCards((prev) =>
        prev.map((card) => {
          if (
            card.deadline &&
            card.deadline < today &&
            card.column !== "backlog" &&
            card.column !== "done"
          ) {
            return { ...card, column: "backlog" };
          }
          return card;
        })
      );
    };

    checkOverdueTasks();
    // Check every hour
    const interval = setInterval(checkOverdueTasks, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [setCards]);

  return (
    <motion.div className="min-h-[80vh] w-full text-neutral-50 overflow-hidden relative">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-4 px-4">
        <div className="flex gap-2">
          <button
            onClick={() => setShowAnalytics(true)}
            className="flex items-center gap-1 px-3 py-1 bg-white/20 border-white/50 hover:bg-blue-500/20 border hover:border-blue-500 rounded-lg text-white/70 hover:text-blue-300 transition-colors text-sm"
          >
            Analytics <div className="flex items-center text-sm">
              (<Command size={14}/> <ChevronUp size={14}/> A)
            </div>
          </button>
          <button
            onClick={() => setShowCommandPalette(true)}
            className="flex items-center gap-1 px-3 py-1 bg-white/20 border-white/50 hover:bg-purple-500/20 border hover:border-purple-500 rounded-lg text-white/70 hover:text-purple-300 transition-colors text-sm"
          >
            Command <div className="flex items-center text-sm">
              (<Command size={14}/> K)
            </div>
          </button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="h-full w-full"
      >
        <Board
          todoTitle={todoTitle}
          backLog={backLog}
          progress={progress}
          completed={completed}
          searchQuery={searchQuery}
          filterPriority={filterPriority}
          filterType={filterType}
          cards={cards}
          setCards={setCards}
        />
      </motion.div>

      {/* Modals */}
      {showCommandPalette && (
        <CommandPalette
          onClose={() => setShowCommandPalette(false)}
          cards={cards}
          setCards={setCards}
          activeWorkspace={activeWorkspace}
        />
      )}

      {showAnalytics && (
        <Analytics onClose={() => setShowAnalytics(false)} cards={cards} />
      )}
    </motion.div>
  );
};

export default Kanban;
