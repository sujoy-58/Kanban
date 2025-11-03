import React, { useState, useEffect } from "react";
import {
  FiTrash,
  FiLink,
  FiCopy,
  FiMessageSquare,
  FiEdit2,
  FiX,
  FiPaperclip,
  FiDownload,
  FiFile,
  FiImage,
  FiFileText,
  FiVideo,
  FiMusic,
  FiArchive,
  FiCode,
  FiCheckSquare,
  FiClock,
  FiPlay,
  FiPause,
  FiSquare,
} from "react-icons/fi";
import { motion } from "framer-motion";
import Timer from "./Timer";
import CardDetailModal from "./components/CardDetails/CardDetailModal";

const Card = ({
  id,
  title,
  description,
  priority,
  type,
  date,
  deadline,
  comments = [],
  links = [],
  attachments = [],
  assignees = [],
  column,
  handleDragStart,
  setCards,
  searchQuery = "",
  timer = { isRunning: false, startTime: null, totalTime: 0 },
  checklists = [],
  createdAt,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [showChecklists, setShowChecklists] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    title,
    description,
    priority,
    type,
    date,
    deadline,
  });
  const [newComment, setNewComment] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [isTypingCustom, setIsTypingCustom] = useState("");
  const [newType, setNewType] = useState("");

  // Timer state for real-time updates
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState(timer?.totalTime || 0);

  // Initialize timeSpent from timer prop
  useEffect(() => {
    setTimeSpent(timer?.totalTime || 0);
  }, [timer]);

  // Timer effect - runs every second when timer is active
  useEffect(() => {
    let interval;

    if (isTimerActive) {
      interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
        // Update the card with new time every second
        setCards((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  timer: {
                    ...c.timer,
                    totalTime: timeSpent + 1,
                    isRunning: true,
                  },
                }
              : c
          )
        );
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeSpent, id, setCards]);

  // Start/stop timer function
  const toggleTimer = () => {
    if (isTimerActive) {
      // Stop timer
      setIsTimerActive(false);
      setCards((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                timer: {
                  ...c.timer,
                  isRunning: false,
                  totalTime: timeSpent,
                },
              }
            : c
        )
      );
    } else {
      // Start timer
      setIsTimerActive(true);
      setCards((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                timer: {
                  ...c.timer,
                  isRunning: true,
                  startTime: Date.now(),
                },
              }
            : c
        )
      );
    }
  };

  const handleCardClick = (e) => {
    if (
      e.target.closest("button") ||
      e.target.closest("input") ||
      e.target.closest("textarea") ||
      e.target.closest("[data-no-modal]") ||
      e.target.closest(".interactive-element")
    ) {
      return;
    }
    setShowDetailModal(true);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setEditing(!editing);
    if (!editing) {
      setEditData({
        title,
        description,
        priority,
        type,
        date,
        deadline,
      });
    }
  };

  // Auto-advance when all checklists are complete
  useEffect(() => {
    if (
      checklists.length > 0 &&
      checklists.every((item) => item.checked) &&
      column !== "done"
    ) {
      setCards((prev) =>
        prev.map((card) =>
          card.id === id ? { ...card, column: "done" } : card
        )
      );
    }
  }, [checklists, column, id, setCards]);

  const highlightText = (text, query) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-400/30 text-yellow-200 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this card?")) {
      setCards((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              comments: [
                ...(c.comments || []),
                {
                  id: Math.random().toString(),
                  text: newComment.trim(),
                  timestamp: new Date().toISOString(),
                  author: "You",
                },
              ],
            }
          : c
      )
    );
    setNewComment("");
  };

  const handleDeleteComment = (commentId) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              comments: (c.comments || []).filter(
                (comment) => comment.id !== commentId
              ),
            }
          : c
      )
    );
  };

  const handleAddLink = () => {
    if (!newLink.trim()) return;
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, links: [...(c.links || []), newLink.trim()] } : c
      )
    );
    setNewLink("");
  };

  const handleDeleteLink = (index) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, links: c.links.filter((_, i) => i !== index) } : c
      )
    );
  };

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link);
    alert("Link copied!");
  };

  const handleSaveEdit = (e) => {
    if (e) e.stopPropagation();
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...editData } : c))
    );
    setEditing(false);
  };

  const handleCancelEdit = (e) => {
    if (e) e.stopPropagation();
    setEditing(false);
    setEditData({
      title,
      description,
      priority,
      type,
      date,
      deadline,
    });
  };

  const handleAddChecklistItem = () => {
    if (!newChecklistItem.trim()) return;
    const newItem = {
      id: Math.random().toString(),
      text: newChecklistItem.trim(),
      checked: false,
    };
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, checklists: [...(c.checklists || []), newItem] }
          : c
      )
    );
    setNewChecklistItem("");
  };

  const handleToggleChecklistItem = (itemId) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              checklists: (c.checklists || []).map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : c
      )
    );
  };

  const handleDeleteChecklistItem = (itemId) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              checklists: (c.checklists || []).filter(
                (item) => item.id !== itemId
              ),
            }
          : c
      )
    );
  };

  const handleTimerUpdate = (newTimerState) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, timer: newTimerState } : c))
    );
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    const iconMap = {
      jpg: FiImage,
      jpeg: FiImage,
      png: FiImage,
      gif: FiImage,
      svg: FiImage,
      webp: FiImage,
      pdf: FiFileText,
      doc: FiFileText,
      docx: FiFileText,
      txt: FiFileText,
      rtf: FiFileText,
      js: FiCode,
      jsx: FiCode,
      ts: FiCode,
      tsx: FiCode,
      html: FiCode,
      css: FiCode,
      py: FiCode,
      java: FiCode,
      cpp: FiCode,
      c: FiCode,
      mp4: FiVideo,
      avi: FiVideo,
      mov: FiVideo,
      wmv: FiVideo,
      flv: FiVideo,
      mp3: FiMusic,
      wav: FiMusic,
      flac: FiMusic,
      aac: FiMusic,
      zip: FiArchive,
      rar: FiArchive,
      "7z": FiArchive,
      tar: FiArchive,
      gz: FiArchive,
    };
    return iconMap[extension] || FiFile;
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    const newAttachments = files.map((file) => ({
      id: Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString().split("T")[0],
      comments: [],
      file: file,
    }));
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, attachments: [...(c.attachments || []), ...newAttachments] }
          : c
      )
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    const newAttachments = files.map((file) => ({
      id: Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString().split("T")[0],
      comments: [],
      file: file,
    }));
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, attachments: [...(c.attachments || []), ...newAttachments] }
          : c
      )
    );
  };

  const handleDeleteAttachment = (attachmentId) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              attachments: c.attachments.filter(
                (att) => att.id !== attachmentId
              ),
            }
          : c
      )
    );
  };

  const handleAddAttachmentComment = (attachmentId, comment) => {
    if (!comment.trim()) return;
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              attachments: c.attachments.map((att) =>
                att.id === attachmentId
                  ? { ...att, comments: [...att.comments, comment.trim()] }
                  : att
              ),
            }
          : c
      )
    );
  };

  const handleDeleteAttachmentComment = (attachmentId, commentIndex) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              attachments: c.attachments.map((att) =>
                att.id === attachmentId
                  ? {
                      ...att,
                      comments: att.comments.filter(
                        (_, i) => i !== commentIndex
                      ),
                    }
                  : att
              ),
            }
          : c
      )
    );
  };

  const handleDownloadAttachment = (attachment) => {
    const url = URL.createObjectURL(attachment.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = attachment.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const checklistProgress =
    checklists.length > 0
      ? (checklists.filter((item) => item.checked).length / checklists.length) *
        100
      : 0;

  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { id, title, column })}
        onClick={handleCardClick}
        className="cursor-pointer rounded-xl border border-white/10 bg-white/10 p-4 shadow-md backdrop-blur-md hover:bg-white/20 active:cursor-grabbing relative"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-2">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                priority === "Low"
                  ? "bg-green-500/20 text-green-400"
                  : priority === "Medium"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {priority}
            </span>
            {type && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                {type}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-white/60">
            <button
              onClick={() => setShowTimer(!showTimer)}
              className="hover:text-white transition-colors interactive-element"
              title="Timer"
              data-no-modal
            >
              <FiClock />
            </button>
            <button
              onClick={handleEditClick}
              className="hover:text-white transition-colors interactive-element"
              data-no-modal
            >
              <FiEdit2 />
            </button>
            <button
              onClick={handleDelete}
              className="hover:text-red-400 transition-colors interactive-element"
              data-no-modal
            >
              <FiTrash />
            </button>
          </div>
        </div>

        {/* TIMER DISPLAY */}
        <div
          className="mb-2 flex items-center justify-between text-xs"
          data-no-modal
        >
          <span className="text-white/60">Time spent:</span>
          <div className="flex items-center gap-2">
            <span className="text-white/80 font-mono">
              {formatTime(timeSpent)}
            </span>
          </div>
        </div>

        {/* CHECKLIST PROGRESS */}
        {checklists.length > 0 && (
          <div className="mb-2" data-no-modal>
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>Checklist</span>
              <span>
                {checklists.filter((item) => item.checked).length}/
                {checklists.length}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5">
              <div
                className="bg-green-400 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${checklistProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* MAIN BODY */}
        {editing ? (
          <div
            className="space-y-2"
            data-no-modal
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="w-full bg-white/10 p-2 rounded text-white text-base border border-white/20 focus:outline-none focus:border-blue-500"
              placeholder="Enter title..."
            />
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              className="w-full bg-white/10 p-2 rounded text-white text-sm border border-white/20 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Enter description..."
              rows="3"
            />
            <div className="flex gap-2 items-start">
              <select
                value={editData.priority}
                onChange={(e) =>
                  setEditData({ ...editData, priority: e.target.value })
                }
                className="flex-none bg-white/20 text-sm rounded-md p-2 border border-white/50 focus:outline-none"
              >
                <option className="text-black" value="Low">
                  Low
                </option>
                <option className="text-black" value="Medium">
                  Medium
                </option>
                <option className="text-black" value="High">
                  High
                </option>
              </select>

              <div className="flex flex-col gap-2 w-full">
                {!isTypingCustom ? (
                  <select
                    value={editData.type}
                    onChange={(e) => {
                      if (e.target.value === "__custom__") {
                        setIsTypingCustom(true);
                        setEditData({ ...editData, type: "" });
                      } else {
                        setEditData({ ...editData, type: e.target.value });
                      }
                    }}
                    className="bg-white/20 text-sm rounded-md p-2 border border-white/50 focus:outline-none"
                  >
                    <option className="text-black" value="Front-End">
                      Front-End
                    </option>
                    <option className="text-black" value="UI/UX">
                      UI/UX
                    </option>
                    <option className="text-black" value="Daily Routine">
                      Daily Routine
                    </option>
                    <option className="text-black" value="Backend">
                      Backend
                    </option>
                    <option className="text-black" value="Research">
                      Research
                    </option>

                    {/* ✅ dynamically show custom value */}
                    {editData.type &&
                      ![
                        "Front-End",
                        "UI/UX",
                        "Daily Routine",
                        "Backend",
                        "Research",
                      ].includes(editData.type) && (
                        <option className="text-black" value={editData.type}>
                          {editData.type}
                        </option>
                      )}

                    <option className="text-black" value="__custom__">
                      Custom…
                    </option>
                  </select>
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    <input
                      type="text"
                      placeholder="Enter your own type..."
                      value={editData.type}
                      onChange={(e) =>
                        setEditData({ ...editData, type: e.target.value })
                      }
                      className="w-full text-sm p-2 bg-neutral-800 text-white rounded-md border border-white/20 focus:outline-none focus:ring-1"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsTypingCustom(false);
                          setEditData({ ...editData, type: "Front-End" }); // optional: revert to default
                        }}
                        className="px-2 py-1 text-xs rounded bg-red-400 text-white hover:bg-red-500 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsTypingCustom(false)}
                        className="px-2 py-1 text-xs rounded bg-white text-black hover:bg-neutral-200 transition"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={editData.date}
                onChange={(e) =>
                  setEditData({ ...editData, date: e.target.value })
                }
                className="bg-white/10 border border-white/20 text-white text-xs rounded-md p-2 focus:outline-none focus:border-blue-500"
              />
              <input
                type="date"
                value={editData.deadline}
                onChange={(e) =>
                  setEditData({ ...editData, deadline: e.target.value })
                }
                className="bg-white/10 border border-white/20 text-white text-xs rounded-md p-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="bg-green-500 hover:bg-green-600 text-white rounded px-3 py-1 text-xs transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-500 hover:bg-gray-600 text-white rounded px-3 py-1 text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h4 className="text-white text-sm font-semibold">
              {highlightText(title, searchQuery)}
            </h4>
            {description && (
              <p className="text-xs text-white/60 mt-1">
                {highlightText(description, searchQuery)}
              </p>
            )}
            <div className="mt-3 text-xs text-white/60">
              <p>
                Creation: <span className="text-white/80">{date}</span>
              </p>
              {deadline && (
                <p>
                  Deadline: <span className="text-red-300">{deadline}</span>
                </p>
              )}
            </div>
          </>
        )}

        {/* FOOTER */}
        <div className="mt-3 flex justify-between items-center">
          <div className="flex -space-x-2">
            {assignees.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="assignee"
                className="w-5 h-5 rounded-full border border-white/20"
              />
            ))}
          </div>
          <div className="flex items-center gap-3 text-xs text-white/60">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowChecklists(!showChecklists);
              }}
              className="flex items-center gap-1 hover:text-white interactive-element"
              data-no-modal
            >
              <FiCheckSquare /> {checklists?.length || 0}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(!showComments);
              }}
              className="flex items-center gap-1 hover:text-white interactive-element"
              data-no-modal
            >
              <FiMessageSquare /> {comments?.length || 0}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowLinks(!showLinks);
              }}
              className="flex items-center gap-1 hover:text-white interactive-element"
              data-no-modal
            >
              <FiLink /> {links?.length || 0}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAttachments(!showAttachments);
              }}
              className="flex items-center gap-1 hover:text-white interactive-element"
              data-no-modal
            >
              <FiPaperclip /> {attachments?.length || 0}
            </button>
          </div>
        </div>

        {/* ⏰ TIMER POPUP */}
        {showTimer && (
          <div
            className="mt-3 border border-white/20 rounded-md bg-white/10 p-3 text-xs"
            data-no-modal
            onClick={(e) => e.stopPropagation()}
          >
            <Timer
              timer={timer}
              onTimerUpdate={handleTimerUpdate}
              taskId={id}
            />
          </div>
        )}

        {/* ✅ CHECKLISTS POPUP */}
        {showChecklists && (
          <div
            className="mt-3 border border-white/20 rounded-md bg-white/10 p-2 text-xs"
            data-no-modal
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white/70 font-semibold mb-2">Checklist</p>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {checklists?.length ? (
                checklists.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-white/5 rounded px-2 py-1"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => handleToggleChecklistItem(item.id)}
                        className="rounded border-white/20 bg-white/10"
                      />
                      <span
                        className={
                          item.checked
                            ? "line-through text-white/40"
                            : "text-white/80"
                        }
                      >
                        {item.text}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteChecklistItem(item.id)}
                      className="text-white/40 hover:text-red-400 text-xs"
                    >
                      <FiX />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-white/40">No checklist items yet.</p>
              )}
            </div>
            <div className="flex mt-2 gap-2">
              <input
                type="text"
                placeholder="Add checklist item..."
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                className="flex-1 rounded bg-white/5 text-white text-xs p-1 focus:outline-none"
              />
              <button
                onClick={handleAddChecklistItem}
                className="bg-white text-black px-2 py-1 rounded text-xs"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* 💬 COMMENTS POPUP */}
        {showComments && (
          <div
            className="mt-3 border border-white/20 rounded-md bg-white/10 p-2 text-xs"
            data-no-modal
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white/70 font-semibold mb-2">Comments</p>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {comments?.length ? (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex justify-between items-center bg-white/5 rounded px-2 py-1"
                  >
                    <div className="flex-1">
                      <p className="text-white/80 text-xs">{comment.text}</p>
                      <p className="text-white/40 text-xs">
                        {comment.author} •{" "}
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-white/40 hover:text-red-400 text-xs"
                    >
                      <FiX />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-white/40">No comments yet.</p>
              )}
            </div>
            <div className="flex mt-2 gap-2">
              <input
                type="text"
                placeholder="Add comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 rounded bg-white/5 text-white text-xs p-1 focus:outline-none"
              />
              <button
                onClick={handleAddComment}
                className="bg-white text-black px-2 py-1 rounded text-xs"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* 🔗 LINKS POPUP */}
        {showLinks && (
          <div
            className="mt-3 border border-white/20 rounded-md bg-white/10 p-2 text-xs"
            data-no-modal
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white/70 font-semibold mb-2">Links</p>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {links?.length ? (
                links.map((l, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-white/5 rounded px-2 py-1"
                  >
                    <a
                      href={l}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-300 truncate w-[70%]"
                    >
                      {l}
                    </a>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(l)}
                        className="text-white/50 hover:text-white"
                      >
                        <FiCopy />
                      </button>
                      <button
                        onClick={() => handleDeleteLink(i)}
                        className="text-white/40 hover:text-red-400 text-xs"
                      >
                        <FiX />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white/40">No links added.</p>
              )}
            </div>
            <div className="flex mt-2 gap-2">
              <input
                type="url"
                placeholder="Add link..."
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="flex-1 rounded bg-white/5 text-white text-xs p-1 focus:outline-none"
              />
              <button
                onClick={handleAddLink}
                className="bg-white text-black px-2 py-1 rounded text-xs"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* 📎 ATTACHMENTS POPUP */}
        {showAttachments && (
          <div
            className="mt-3 border border-white/20 rounded-md bg-white/10 p-2 text-xs"
            data-no-modal
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-white/70 font-semibold mb-2">Attachments</p>

            {/* File Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-white/20 rounded-lg p-4 mb-3 hover:border-white/40 transition-colors"
            >
              <div className="text-center">
                <FiPaperclip className="mx-auto text-2xl text-white/60 mb-2" />
                <p className="text-white/60 text-xs mb-2">
                  Drag & drop files here or
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id={`file-upload-${id}`}
                />
                <label
                  htmlFor={`file-upload-${id}`}
                  className="bg-white/20 text-white px-3 py-1 rounded cursor-pointer hover:bg-white/30 transition-colors"
                >
                  Choose Files
                </label>
              </div>
            </div>

            {/* Attachments List */}
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {attachments?.length ? (
                attachments.map((attachment) => {
                  const FileIcon = getFileIcon(attachment.name);
                  return (
                    <div
                      key={attachment.id}
                      className="flex items-center justify-between bg-white/5 rounded px-2 py-2"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileIcon className="text-white/60 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-white/80 truncate text-xs">
                            {attachment.name}
                          </p>
                          <p className="text-white/40 text-xs">
                            {formatFileSize(attachment.size)} •{" "}
                            {new Date(attachment.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDownloadAttachment(attachment)}
                          className="text-white/50 hover:text-white p-1"
                          title="Download"
                        >
                          <FiDownload />
                        </button>
                        <button
                          onClick={() => handleDeleteAttachment(attachment.id)}
                          className="text-white/40 hover:text-red-400 p-1"
                          title="Delete"
                        >
                          <FiX />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-white/40 text-center py-2">
                  No attachments yet.
                </p>
              )}
            </div>

            {/* Attachment Comments */}
            {attachments?.length > 0 && (
              <div className="mt-3 border-t border-white/10 pt-2">
                <p className="text-white/60 text-xs mb-2">File Comments</p>
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="mb-2">
                    <p className="text-white/70 text-xs font-medium mb-1">
                      {attachment.name}
                    </p>
                    <div className="space-y-1">
                      {attachment.comments?.map((comment, commentIndex) => (
                        <div
                          key={commentIndex}
                          className="flex justify-between items-center bg-white/5 rounded px-2 py-1"
                        >
                          <p className="text-white/80 text-xs">{comment}</p>
                          <button
                            onClick={() =>
                              handleDeleteAttachmentComment(
                                attachment.id,
                                commentIndex
                              )
                            }
                            className="text-white/40 hover:text-red-400 text-xs"
                          >
                            <FiX />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-1">
                        <input
                          type="text"
                          placeholder="Add comment..."
                          className="flex-1 rounded bg-white/5 text-white text-xs p-1 focus:outline-none"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleAddAttachmentComment(
                                attachment.id,
                                e.target.value
                              );
                              e.target.value = "";
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = e.target.previousElementSibling;
                            handleAddAttachmentComment(
                              attachment.id,
                              input.value
                            );
                            input.value = "";
                          }}
                          className="bg-white/20 text-white px-2 py-1 rounded text-xs hover:bg-white/30"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* CARD DETAIL MODAL */}
      {showDetailModal && (
        <CardDetailModal
          card={{
            id,
            title,
            description,
            priority,
            type,
            date,
            deadline,
            comments,
            links,
            attachments,
            assignees,
            column,
            timer: { ...timer, totalTime: timeSpent },
            checklists,
            createdAt,
          }}
          onClose={() => setShowDetailModal(false)}
          setCards={setCards}
          formatTime={formatTime}
        />
      )}
    </>
  );
};

const DropIndicator = ({ beforeId, column }) => (
  <div
    data-before={beforeId || "-1"}
    data-column={column}
    className="my-0.5 h-1 w-full rounded bg-violet-400 opacity-0 transition-opacity duration-300"
  />
);

export default Card;
