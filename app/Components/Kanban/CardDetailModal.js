import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  FiX,
  FiEdit2,
  FiClock,
  FiCheckSquare,
  FiMessageSquare,
  FiLink,
  FiPaperclip,
  FiCalendar,
  FiPlay,
  FiPause,
  FiRotateCcw,
  FiTrash2,
  FiArrowLeft,
  FiMoreVertical,
  FiChevronRight,
  FiChevronDown,
  FiBookmark,
  FiCopy,
  FiTag,
  FiDownload,
  FiUpload
} from "react-icons/fi";

/**
 * CardDetailModal
 * - Right-docked panel (sticky to screen end)
 * - Dark, refined UI
 * - Inline edit for title/description/fields
 * - Working timer (start/pause/reset) using card.timer
 * - Checklists with progress + add/remove/toggle
 * - Comments with add/remove
 * - Links add/remove
 * - Attachments (client-side) add/download (object URL)
 * - Keyboard: Esc close, Ctrl/Cmd+S save when editing
 * - Focus trap + body scroll lock while open
 */
const CardDetailModal = ({ card, onClose, setCards, formatTime }) => {
  const [activeTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(card);
  const [newComment, setNewComment] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    checklists: true,
    comments: true,
    links: true,
    attachments: true,
    time: true
  });
  const [tick, setTick] = useState(0); // re-render timer each sec if running
  const fileInputRef = useRef(null);
  const panelRef = useRef(null);
  const titleInputRef = useRef(null);

  // Keep local copy in sync if card prop changes
  useEffect(() => setEditData(card), [card]);

  // Body scroll lock while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, []);

  // Focus the title input when toggling into editing
  useEffect(() => {
    if (isEditing) {
      const t = setTimeout(() => titleInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [isEditing]);

  // Timer ticking when running
  useEffect(() => {
    const current = card?.timer || {};
    if (!current.isRunning) return;
    const id = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [card?.timer?.isRunning]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      // Save: Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        if (isEditing) {
          e.preventDefault();
          handleSave();
        }
      }
      // Esc: close
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", handler, { capture: true });
    return () => window.removeEventListener("keydown", handler, { capture: true });
  }, [isEditing, editData]); // eslint-disable-line

  const toggleSection = (section) =>
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const persistUpdate = (updater) => {
    setCards((prev) => prev.map((c) => (c.id === card.id ? updater(c) : c)));
  };

  const handleSave = () => {
    persistUpdate(() => ({ ...card, ...editData, updatedAt: new Date().toISOString() }));
    setIsEditing(false);
  };

  const handleDeleteCard = () => {
    if (window.confirm("Delete this card permanently?")) {
      setCards((prev) => prev.filter((c) => c.id !== card.id));
      onClose();
    }
  };

  // Comments
  const handleAddComment = () => {
    const text = newComment.trim();
    if (!text) return;
    persistUpdate((c) => ({
      ...c,
      comments: [
        ...(c.comments || []),
        {
          id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
          text,
          timestamp: new Date().toISOString(),
          author: "You"
        }
      ]
    }));
    setNewComment("");
  };

  const handleDeleteComment = (commentId) => {
    persistUpdate((c) => ({
      ...c,
      comments: (c.comments || []).filter((cm) => cm.id !== commentId)
    }));
  };

  // Links
  const handleAddLink = () => {
    const href = newLink.trim();
    if (!href) return;
    persistUpdate((c) => ({ ...c, links: [...(c.links || []), href] }));
    setNewLink("");
  };

  const handleDeleteLink = (index) => {
    persistUpdate((c) => ({
      ...c,
      links: (c.links || []).filter((_, i) => i !== index)
    }));
  };

  // Checklist
  const handleAddChecklistItem = () => {
    const text = newChecklistItem.trim();
    if (!text) return;
    const newItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
      text,
      checked: false
    };
    persistUpdate((c) => ({ ...c, checklists: [...(c.checklists || []), newItem] }));
    setNewChecklistItem("");
  };

  const handleToggleChecklistItem = (itemId) => {
    persistUpdate((c) => ({
      ...c,
      checklists: (c.checklists || []).map((it) =>
        it.id === itemId ? { ...it, checked: !it.checked } : it
      )
    }));
  };

  const handleDeleteChecklistItem = (itemId) => {
    persistUpdate((c) => ({
      ...c,
      checklists: (c.checklists || []).filter((it) => it.id !== itemId)
    }));
  };

  const checklistProgress = useMemo(() => {
    const total = card.checklists?.length || 0;
    if (!total) return 0;
    const done = card.checklists.filter((i) => i.checked).length;
    return Math.round((done / total) * 100);
  }, [card.checklists, tick]); // tick to animate progress while toggling

  // Attachments
  const handleBrowseFiles = () => fileInputRef.current?.click();

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const toAdd = files.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type,
      uploadDate: new Date().toLocaleDateString(),
      url: URL.createObjectURL(f)
    }));
    persistUpdate((c) => ({ ...c, attachments: [...(c.attachments || []), ...toAdd] }));
    // clear input value so same file can be selected again later
    e.target.value = "";
  };

  // Time tracking
  const startTimer = () => {
    persistUpdate((c) => ({
      ...c,
      timer: {
        ...(c.timer || { totalTime: 0 }),
        isRunning: true,
        startTime: Date.now()
      }
    }));
  };

  const pauseTimer = () => {
    // add elapsed since start to totalTime
    const now = Date.now();
    const t = card.timer || { totalTime: 0, isRunning: false, startTime: null };
    const elapsed = t.isRunning && t.startTime ? Math.floor((now - t.startTime) / 1000) : 0;
    persistUpdate((c) => ({
      ...c,
      timer: {
        ...(c.timer || {}),
        isRunning: false,
        startTime: null,
        totalTime: (c.timer?.totalTime || 0) + elapsed
      }
    }));
  };

  const resetTimer = () => {
    persistUpdate((c) => ({
      ...c,
      timer: { isRunning: false, startTime: null, totalTime: 0 }
    }));
  };

  const liveTotalSeconds = useMemo(() => {
    const t = card.timer || { totalTime: 0, isRunning: false, startTime: null };
    if (!t.isRunning || !t.startTime) return t.totalTime || 0;
    const elapsed = Math.floor((Date.now() - t.startTime) / 1000);
    return (t.totalTime || 0) + elapsed;
  }, [card.timer, tick]);

  const cardAgeDays = useMemo(() => {
    const created = new Date(card.createdAt || card.date);
    return Math.max(0, Math.floor((Date.now() - +created) / (1000 * 60 * 60 * 24)));
  }, [card.createdAt, card.date]);

  const quickCopyId = () => {
    navigator.clipboard?.writeText(card.id);
  };

  // Helpers for field updates while editing
  const updateField = (key, value) => setEditData((d) => ({ ...d, [key]: value }));

  // Layout: right-docked panel (sticky to screen end), dark theme
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex justify-end bg-gray-200 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => {
          // close when clicking backdrop (not panel)
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          ref={panelRef}
          initial={{ x: "40%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "40%", opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 320 }}
          className="w-[40%] sm:w-[520px] md:w-[640px] lg:w-[720px] h-screen bg-white-900 text-neutral-100 shadow-2xl border-l border-white/10 flex flex-col"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 sticky top-0 z-10">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/10 transition"
                aria-label="Close"
              >
                <FiArrowLeft className="opacity-70" size={18} />
              </button>

              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={editData.title || ""}
                    onChange={(e) => updateField("title", e.target.value)}
                    className="w-full bg-transparent border-b border-blue-500/60 focus:outline-none text-xl md:text-2xl font-semibold pb-1 placeholder-white/40"
                    placeholder="Untitled task"
                  />
                ) : (
                  <h1 className="text-xl md:text-2xl font-semibold truncate">{card.title}</h1>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                  <span
                    className={`px-2.5 py-1 rounded-full font-medium ${
                      (card.priority || "Medium") === "High"
                        ? "bg-red-500/15 text-red-300 ring-1 ring-red-500/30"
                        : (card.priority || "Medium") === "Medium"
                        ? "bg-yellow-500/15 text-yellow-300 ring-1 ring-yellow-500/30"
                        : "bg-green-500/15 text-green-300 ring-1 ring-green-500/30"
                    }`}
                  >
                    {(card.priority || "Medium")} Priority
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30 font-medium">
                    {card.type || "General"}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-300 ring-1 ring-purple-500/30 font-medium capitalize">
                    {card.column}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  quickCopyId();
                }}
                className="p-2 rounded-xl hover:bg-white/10 transition"
                title="Copy Card ID"
              >
                <FiCopy className="opacity-70" size={18} />
              </button>
              <button className="p-2 rounded-xl hover:bg-white/10 transition" title="Bookmark">
                <FiBookmark className="opacity-70" size={18} />
              </button>
              <button
                onClick={() => setIsEditing((v) => !v)}
                className="p-2 rounded-xl hover:bg-white/10 transition"
                title={isEditing ? "Stop editing" : "Edit"}
              >
                <FiEdit2 className="opacity-70" size={18} />
              </button>
              <button className="p-2 rounded-xl hover:bg-white/10 transition" title="More">
                <FiMoreVertical className="opacity-70" size={18} />
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-5 space-y-6">

              {/* Meta / quick fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Created */}
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-xs text-white/50">Created</p>
                  <p className="text-sm font-medium">{card.date || "-"}</p>
                </div>

                {/* Due Date */}
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-xs text-white/50">Due Date</p>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editData.deadline || ""}
                      onChange={(e) => updateField("deadline", e.target.value)}
                      className="mt-1 w-full bg-neutral-800 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  ) : (
                    <p
                      className={`text-sm font-medium ${
                        card.deadline ? "text-red-300" : "text-white/40"
                      }`}
                    >
                      {card.deadline || "No due date"}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-xs text-white/50">Status</p>
                  {isEditing ? (
                    <select
                      value={editData.column}
                      onChange={(e) => updateField("column", e.target.value)}
                      className="mt-1 w-full bg-neutral-800 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 capitalize"
                    >
                      <option value="backlog">Backlog</option>
                      <option value="todo">Todo</option>
                      <option value="doing">Progress</option>
                      <option value="done">Completed</option>
                    </select>
                  ) : (
                    <p className="text-sm font-medium capitalize">{card.column}</p>
                  )}
                </div>
              </div>

              {/* Quick tags: priority, type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-xs text-white/50">Priority</p>
                  {isEditing ? (
                    <select
                      value={editData.priority || "Medium"}
                      onChange={(e) => updateField("priority", e.target.value)}
                      className="mt-1 w-full bg-neutral-800 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  ) : (
                    <div className="mt-1 inline-flex items-center gap-2 text-sm">
                      <FiTag className="opacity-60" />
                      <span>{card.priority || "Medium"}</span>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-white/10 p-3">
                  <p className="text-xs text-white/50">Type</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.type || ""}
                      onChange={(e) => updateField("type", e.target.value)}
                      className="mt-1 w-full bg-neutral-800 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., Front-End, Research"
                    />
                  ) : (
                    <p className="text-sm font-medium">{card.type || "General"}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleSection("description")}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    <FiEdit2 className="opacity-70" size={18} />
                    <span className="font-semibold">Description</span>
                  </div>
                  {expandedSections.description ? <FiChevronDown /> : <FiChevronRight />}
                </button>

                <AnimatePresence>
                  {expandedSections.description && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 pt-1 border-t border-white/10"
                    >
                      {isEditing ? (
                        <textarea
                          value={editData.description || ""}
                          onChange={(e) => updateField("description", e.target.value)}
                          className="w-full h-32 bg-neutral-800 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                          placeholder="Add a detailed description..."
                        />
                      ) : card.description ? (
                        <p className="text-white/90 leading-relaxed whitespace-pre-wrap text-sm">
                          {card.description}
                        </p>
                      ) : (
                        <p className="text-white/40 italic text-sm">No description provided</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Checklist */}
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleSection("checklists")}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    <FiCheckSquare className="opacity-70" size={18} />
                    <span className="font-semibold">Checklist</span>
                    {!!card.checklists?.length && (
                      <span className="text-xs text-white/50">
                        {card.checklists.filter((i) => i.checked).length}/{card.checklists.length}
                      </span>
                    )}
                  </div>
                  {expandedSections.checklists ? <FiChevronDown /> : <FiChevronRight />}
                </button>

                <AnimatePresence>
                  {expandedSections.checklists && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 pt-1 border-t border-white/10 space-y-4"
                    >
                      {card.checklists?.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-white/70">
                            <span>Progress</span>
                            <span className="font-medium">{checklistProgress}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-2 rounded-full bg-emerald-400"
                              style={{ width: `${checklistProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        {card.checklists?.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5"
                          >
                            <input
                              type="checkbox"
                              checked={!!item.checked}
                              onChange={() => handleToggleChecklistItem(item.id)}
                              className="w-4 h-4 accent-emerald-400"
                            />
                            <span
                              className={`flex-1 text-sm ${
                                item.checked ? "line-through text-white/40" : "text-white/90"
                              }`}
                            >
                              {item.text}
                            </span>
                            <button
                              onClick={() => handleDeleteChecklistItem(item.id)}
                              className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-red-300"
                              aria-label="Remove"
                            >
                              <FiX size={14} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a new item..."
                          value={newChecklistItem}
                          onChange={(e) => setNewChecklistItem(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddChecklistItem()}
                          className="flex-1 bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={handleAddChecklistItem}
                          className="px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-sm text-neutral-900 font-medium"
                        >
                          Add
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Comments */}
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleSection("comments")}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    <FiMessageSquare className="opacity-70" size={18} />
                    <span className="font-semibold">Comments</span>
                    {!!card.comments?.length && (
                      <span className="text-xs text-white/50">{card.comments.length}</span>
                    )}
                  </div>
                  {expandedSections.comments ? <FiChevronDown /> : <FiChevronRight />}
                </button>

                <AnimatePresence>
                  {expandedSections.comments && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 pt-1 border-t border-white/10 space-y-4"
                    >
                      <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                        {card.comments?.map((comment) => (
                          <div key={comment.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-500/30 ring-1 ring-blue-500/30 flex items-center justify-center text-white text-xs font-medium">
                              {comment.author?.charAt(0) || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium">{comment.author}</span>
                                <span className="text-[11px] text-white/50">
                                  {new Date(comment.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-white/90 break-words">{comment.text}</p>
                              <div className="flex items-center gap-4 mt-1">
                                <button className="text-xs text-white/50 hover:text-white/80">
                                  Like
                                </button>
                                <button className="text-xs text-white/50 hover:text-white/80">
                                  Reply
                                </button>
                                <button
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="text-xs text-red-300 hover:text-red-200"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {!card.comments?.length && (
                          <p className="text-sm text-white/40">No comments yet.</p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/30 ring-1 ring-emerald-500/30 flex items-center justify-center text-white text-xs font-medium">
                          Y
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                            className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <div className="flex justify-end mt-2">
                            <button
                              onClick={handleAddComment}
                              className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm text-neutral-900 font-medium"
                            >
                              Comment
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Links */}
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleSection("links")}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    <FiLink className="opacity-70" size={18} />
                    <span className="font-semibold">Links</span>
                    {!!card.links?.length && (
                      <span className="text-xs text-white/50">{card.links.length}</span>
                    )}
                  </div>
                  {expandedSections.links ? <FiChevronDown /> : <FiChevronRight />}
                </button>

                <AnimatePresence>
                  {expandedSections.links && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 pt-1 border-t border-white/10 space-y-3"
                    >
                      {card.links?.map((link, index) => (
                        <div
                          key={`${link}-${index}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition group"
                        >
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm truncate text-blue-300 hover:text-blue-200"
                          >
                            {link}
                          </a>
                          <button
                            onClick={() => handleDeleteLink(index)}
                            className="opacity-60 hover:opacity-100 p-1 text-red-300"
                            title="Remove link"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      ))}

                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="Paste a link..."
                          value={newLink}
                          onChange={(e) => setNewLink(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddLink()}
                          className="flex-1 bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          onClick={handleAddLink}
                          className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm text-neutral-900 font-medium"
                        >
                          Add
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Time Tracking */}
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleSection("time")}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    <FiClock className="opacity-70" size={18} />
                    <span className="font-semibold">Time Tracking</span>
                  </div>
                  {expandedSections.time ? <FiChevronDown /> : <FiChevronRight />}
                </button>

                <AnimatePresence>
                  {expandedSections.time && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 pt-1 border-t border-white/10"
                    >
                      <div className="text-center mb-5">
                        <div className="text-4xl font-bold font-mono mb-2">
                          {formatTime ? formatTime(liveTotalSeconds) : liveTotalSeconds + "s"}
                        </div>
                        <div className="text-white/60 text-sm">Total time spent</div>
                      </div>

                      <div className="grid grid-cols-4 gap-3 mb-5">
                        <div className="text-center p-3 rounded-lg bg-white/5">
                          <div className="text-lg font-semibold">
                            {Math.floor(liveTotalSeconds / 3600)}
                          </div>
                          <div className="text-[11px] text-white/60">Hours</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white/5">
                          <div className="text-lg font-semibold">
                            {Math.floor((liveTotalSeconds % 3600) / 60)}
                          </div>
                          <div className="text-[11px] text-white/60">Minutes</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white/5">
                          <div className="text-lg font-semibold">{liveTotalSeconds % 60}</div>
                          <div className="text-[11px] text-white/60">Seconds</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white/5">
                          <div className="text-lg font-semibold">
                            {Math.max(1, Math.floor(liveTotalSeconds / 1500))}
                          </div>
                          <div className="text-[11px] text-white/60">Sessions</div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {card.timer?.isRunning ? (
                          <button
                            onClick={pauseTimer}
                            className="flex-1 bg-amber-500 hover:bg-amber-600 text-neutral-900 py-2 rounded-lg transition flex items-center justify-center gap-2"
                          >
                            <FiPause size={16} />
                            Pause
                          </button>
                        ) : (
                          <button
                            onClick={startTimer}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-neutral-900 py-2 rounded-lg transition flex items-center justify-center gap-2"
                          >
                            <FiPlay size={16} />
                            Start
                          </button>
                        )}

                        <button
                          onClick={resetTimer}
                          className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white py-2 rounded-lg transition flex items-center justify-center gap-2"
                        >
                          <FiRotateCcw size={16} />
                          Reset
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Attachments */}
              <div className="rounded-xl border border-white/10 overflow-hidden">
                <button
                  onClick={() => toggleSection("attachments")}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-3">
                    <FiPaperclip className="opacity-70" size={18} />
                    <span className="font-semibold">Attachments</span>
                    {!!card.attachments?.length && (
                      <span className="text-xs text-white/50">{card.attachments.length}</span>
                    )}
                  </div>
                  {expandedSections.attachments ? <FiChevronDown /> : <FiChevronRight />}
                </button>

                <AnimatePresence>
                  {expandedSections.attachments && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 pt-1 border-t border-white/10"
                    >
                      <div className="rounded-lg border-2 border-dashed border-white/15 p-6 text-center mb-4">
                        <FiUpload className="mx-auto opacity-60 mb-2" size={24} />
                        <p className="text-sm text-white/60 mb-2">
                          Drag & drop files here or
                        </p>
                        <button
                          onClick={handleBrowseFiles}
                          className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm text-neutral-900 font-medium"
                        >
                          Browse Files
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFilesSelected}
                        />
                      </div>

                      <div className="space-y-2">
                        {card.attachments?.map((att, idx) => (
                          <div
                            key={`${att.name}-${idx}`}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded bg-blue-500/20 ring-1 ring-blue-500/30 flex items-center justify-center">
                                <FiPaperclip className="text-blue-300" size={16} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{att.name}</p>
                                <p className="text-[11px] text-white/50">
                                  Uploaded {att.uploadDate}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {att.url && (
                                <a
                                  href={att.url}
                                  download={att.name}
                                  className="p-2 rounded hover:bg-white/10"
                                  title="Download"
                                >
                                  <FiDownload size={16} />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                        {!card.attachments?.length && (
                          <p className="text-sm text-white/40">No attachments yet.</p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-white/10 bg-neutral-900/80 sticky bottom-0">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/50">
                <span>Created {cardAgeDays} day{cardAgeDays === 1 ? "" : "s"} ago</span>
                <span className="mx-2">•</span>
                <span>Last updated {card.updatedAt ? new Date(card.updatedAt).toLocaleString() : "—"}</span>
              </div>

              <div className="flex items-center gap-2">
                {isEditing && (
                  <>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditData(card); // revert
                      }}
                      className="px-3 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm text-neutral-900 font-medium"
                      title="Ctrl/Cmd + S"
                    >
                      Save Changes
                    </button>
                  </>
                )}
                <button
                  onClick={handleDeleteCard}
                  className="px-3 py-2 rounded-lg bg-red-500/90 hover:bg-red-500 text-sm text-neutral-900 font-medium"
                >
                  Delete Task
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default CardDetailModal;
