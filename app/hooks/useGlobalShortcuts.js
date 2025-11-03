import { useEffect, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";

export default function useGlobalShortcuts({
  setCards,
  onOpenCommandPalette,
  activeWorkspace,
  showCommandPalette,
  showAnalytics,
  setShowCommandPalette,
  setShowAnalytics,
}) {
  const pressedKeys = useRef(new Set());

  // --- 🔹 Handle keydown/keyup globally to prevent conflicts or repeat triggers ---
  useEffect(() => {
    const handleKeyDown = (e) => pressedKeys.current.add(e.key.toLowerCase());
    const handleKeyUp = (e) => pressedKeys.current.delete(e.key.toLowerCase());

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // --- 🔹 Add New Task ---
  useHotkeys(
    "a",
    () => {
      if (showCommandPalette || showAnalytics) return;
      const newCard = {
        id: `card-${Date.now()}`,
        column: "todo",
        title: "New Task",
        description: "",
        priority: "Medium",
        type: "Front-End",
        date: new Date().toISOString().split("T")[0],
        deadline: "",
        comments: [],
        links: [],
        attachments: [],
        assignees: [],
        timer: { isRunning: false, startTime: null, totalTime: 0 },
        checklists: [],
        createdAt: new Date().toISOString(),
      };
      setCards((prev) => [...prev, newCard]);
    },
    [setCards, showCommandPalette, showAnalytics]
  );

  // --- 🔹 Add to Backlog ---
  useHotkeys(
    "b",
    () => {
      if (showCommandPalette || showAnalytics) return;
      const newCard = {
        id: `card-${Date.now()}`,
        column: "backlog",
        title: "Backlog Task",
        description: "",
        priority: "Low",
        type: "Research",
        date: new Date().toISOString().split("T")[0],
        deadline: "",
        comments: [],
        links: [],
        attachments: [],
        assignees: [],
        timer: { isRunning: false, startTime: null, totalTime: 0 },
        checklists: [],
        createdAt: new Date().toISOString(),
      };
      setCards((prev) => [...prev, newCard]);
    },
    [setCards, showCommandPalette, showAnalytics]
  );

  // --- 🔹 Clear Completed Tasks ---
  useHotkeys(
    "x",
    () => {
      if (showCommandPalette || showAnalytics) return;
      if (window.confirm("Clear all completed tasks?")) {
        setCards((prev) => prev.filter((card) => card.column !== "done"));
      }
    },
    [setCards, showCommandPalette, showAnalytics]
  );

  // --- 🔹 Archive Old Tasks ---
  useHotkeys(
    "o",
    () => {
      if (showCommandPalette || showAnalytics) return;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      setCards((prev) => {
        const oldTasks = prev.filter(
          (card) =>
            new Date(card.createdAt) < thirtyDaysAgo && card.column === "done"
        );
        if (oldTasks.length === 0) {
          alert("No old tasks found to archive.");
          return prev;
        }
        alert(`Archived ${oldTasks.length} old tasks.`);
        return prev.map((card) =>
          new Date(card.createdAt) < thirtyDaysAgo && card.column === "done"
            ? { ...card, column: "backlog" }
            : card
        );
      });
    },
    [setCards, showCommandPalette, showAnalytics]
  );

  // --- 🔹 Move Overdue Tasks ---
  useHotkeys(
    "m",
    () => {
      if (showCommandPalette || showAnalytics) return;
      const today = new Date().toISOString().split("T")[0];
      setCards((prev) => {
        const overdueTasks = prev.filter(
          (card) =>
            card.deadline &&
            card.deadline < today &&
            card.column !== "backlog" &&
            card.column !== "done"
        );
        if (overdueTasks.length === 0) {
          alert("No overdue tasks found.");
          return prev;
        }
        alert(`Moved ${overdueTasks.length} overdue tasks to backlog.`);
        return prev.map((card) =>
          card.deadline &&
          card.deadline < today &&
          card.column !== "backlog" &&
          card.column !== "done"
            ? { ...card, column: "backlog" }
            : card
        );
      });
    },
    [setCards, showCommandPalette, showAnalytics]
  );

  // --- 🔹 Show Current Workspace ---
  useHotkeys(
    "w",
    () => {
      if (showCommandPalette) return;
      alert(`Current workspace: ${activeWorkspace}`);
    },
    [activeWorkspace, showCommandPalette]
  );

  // --- 🔹 Show Workspace Stats ---
  useHotkeys(
    "s",
    () => {
      if (showCommandPalette) return;
      alert(`Workspace Stats for ${activeWorkspace}`);
    },
    [activeWorkspace, showCommandPalette]
  );

  // --- 🔹 Start Pomodoro ---
  useHotkeys(
    "p",
    () => {
      if (showCommandPalette) return;
      alert("Starting 25-minute Pomodoro session! 🍅");
    },
    [showCommandPalette]
  );

  // --- 🔹 Filter High Priority ---
  useHotkeys(
    "h",
    () => {
      if (showCommandPalette) return;
      alert("Filtering high priority tasks...");
    },
    [showCommandPalette]
  );

  // --- 🔹 Open Command Palette ---
  useHotkeys(
    "ctrl+k, cmd+k",
    (e) => {
      e.preventDefault();
      onOpenCommandPalette();
    },
    [onOpenCommandPalette]
  );

  // --- 🔹 Toggle Analytics View ---
  useHotkeys(
    "ctrl+shift+a, cmd+shift+a",

    (e) => {
      e.preventDefault();
      if (!showCommandPalette) setShowAnalytics((prev) => !prev);
    },
    [showCommandPalette, setShowAnalytics]
  );

  // --- 🔹 Close Modals (ESC) ---
  useHotkeys(
    "esc",
    () => {
      setShowCommandPalette(false);
      setShowAnalytics(false);
    },
    [setShowCommandPalette, setShowAnalytics]
  );
}
