"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiCpu,
  FiBell,
  FiTrash2,
} from "react-icons/fi";

const NotificationsPage = () => {
  const [activeTab, setActiveTab] = useState("All");

  // --- Local Notification State (for instant visual updates) ---
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "task",
      icon: <FiCheckCircle />,
      message: "Task #24 marked as completed.",
      time: "2h ago",
      read: false,
    },
    {
      id: 2,
      type: "project",
      icon: <FiUser />,
      message: "Anya joined Project Alpha.",
      time: "5h ago",
      read: true,
    },
    {
      id: 3,
      type: "system",
      icon: <FiAlertCircle />,
      message: "GitHub integration failed. Reconnect required.",
      time: "1d ago",
      read: false,
    },
    {
      id: 4,
      type: "mention",
      icon: <FiUser />,
      message: "Ravi mentioned you in Project Beta.",
      time: "1d ago",
      read: false,
    },
    {
      id: 6,
      type: "system",
      icon: <FiAlertCircle />,
      message: "GitHub integration failed. Reconnect required.",
      time: "1d ago",
      read: false,
    },
  ]);

  // ==========================================================
  // 🔹 FUNCTION: Mark Single Notification as Read (Instant)
  // ==========================================================
  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );

    /* -----------------------------------------------
       🔧 BACKEND INTEGRATION (Future):
       await fetch(`/api/notifications/${id}/mark-read`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ read: true }),
       });
       ----------------------------------------------- */
  };

  // ==========================================================
  // 🔹 FUNCTION: Mark All as Read
  // ==========================================================
  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    /* -----------------------------------------------
       🔧 BACKEND INTEGRATION (Future):
       await fetch(`/api/notifications/mark-all-read`, {
         method: "POST",
       });
       ----------------------------------------------- */
  };

  // ==========================================================
  // 🔹 FUNCTION: Clear All Notifications
  // ==========================================================
  const handleClearAll = () => {
    setNotifications([]);

    /* -----------------------------------------------
       🔧 BACKEND INTEGRATION (Future):
       await fetch(`/api/notifications/clear-all`, {
         method: "DELETE",
       });
       ----------------------------------------------- */
  };

  // --- Filter Notifications by Type ---
  const filteredNotifications =
    activeTab === "All"
      ? notifications
      : notifications.filter((n) => n.type === activeTab.toLowerCase());

  return (
    <motion.div
      className="min-h-[85vh] w-full p-6 text-white/90 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* -------------------- HEADER -------------------- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Notifications</h2>
          <div>
            <p className="text-sm text-gray-300">
              You have {notifications.filter((n) => !n.read).length} unread
              updates today.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleMarkAllAsRead}
            className="px-4 py-1.5 text-sm bg-white/10 border border-white/20 rounded-full backdrop-blur-md text-white/70 hover:bg-white/20"
          >
            Mark all as read
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleClearAll}
            className="flex items-center px-4 py-1.5 text-sm bg-white/10 border border-white/20 hover:border-red-400/20 rounded-full backdrop-blur-md text-white/70 hover:text-red-300 hover:bg-red-500/10"
          >
            <FiTrash2 className="inline-block mr-1" /> Clear all
          </motion.button>
        </div>
      </div>

      {/* -------------------- FILTER TABS -------------------- */}
      <div className="flex gap-1 mb-6 border-b border-white/10 pb-2 text-sm overflow-x-auto no-scrollbar">
        {["All", "Task", "Project", "System", "Mention", "AI"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 rounded-full transition ${
              activeTab === tab
                ? "bg-white/15 text-white"
                : "text-white/50 hover:text-white/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* -------------------- NOTIFICATION LIST -------------------- */}
      <div className="max-h-[65vh] overflow-y-auto pr-2 no-scrollbar space-y-2">
        <AnimatePresence>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => handleMarkAsRead(n.id)}
                className={`flex items-center gap-3 rounded-xl border border-white/10 backdrop-blur-md p-3 transition cursor-pointer ${
                  n.read
                    ? "bg-transparent opacity-60 hover:bg-white/5"
                    : "bg-white/10 hover:bg-white/20 opacity-100"
                }`}
              >
                {/* Notification Icon */}
                <div
                  className={`text-lg p-2 rounded-full bg-white/10 text-white/70`}
                >
                  {n.icon}
                </div>

                {/* Notification Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm">{n.message}</p>
                    {/* 🔹 Subtle green unread dot (Gmail-style) */}
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    )}
                  </div>
                  <span className="text-xs text-white/40">{n.time}</span>
                </div>

                {/* TODO: Connect click -> open related item (task/project/AI insight) */}
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white/50 py-10 text-sm"
            >
              <FiBell className="mx-auto mb-2 text-2xl opacity-60" />
              No notifications found.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* -------------------- AI SUMMARY SECTION -------------------- */}
      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
        <h3 className="font-semibold text-white/80 mb-2">
          <FiCpu className="inline-block mr-2 text-white/60" />
          Daily AI Summary
        </h3>
        <p className="text-sm text-white/60 leading-relaxed">
          You completed <span className="text-white/80">5 tasks</span> today
          across <span className="text-white/80">3 Workspaces</span>. AI suggests
          revisiting <span className="text-white/80">Task #18</span> for better
          time allocation.
          {/* TODO: Replace this with AI-generated summary from backend */}
        </p>
      </div>
    </motion.div>
  );
};

export default NotificationsPage;

/* ==========================================================
   🔧 NOTES FOR BACKEND INTEGRATION
   ==========================================================
   ✅ Local State Used: Provides instant Gmail-style UX feedback.
   1. Replace local useState() with useEffect() fetching from API.
   2. Each notification object should contain:
      { id, type, message, time, read, relatedTaskId?, relatedProjectId? }
   3. Replace handleMarkAsRead, handleMarkAllAsRead, handleClearAll
      with API calls (endpoints already commented above).
   4. Optionally add socket/real-time listener for live updates.
   5. AI Summary Section:
      - Fetch data from backend analytics or AI endpoint.
   ==========================================================
   ✅ UX Improvements:
   - Gmail-style subtle green unread indicator.
   - Smooth read-state transition.
   - Hidden scrollbar.
   ========================================================== */
