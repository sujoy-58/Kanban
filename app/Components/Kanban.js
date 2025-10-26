"use client";

import React, { useState } from "react";
import {
  FiPlus,
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
  // FiFileSpreadsheet,
  // FiFilePdf,
} from "react-icons/fi";
import { motion } from "framer-motion";


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
  return (
    <motion.div className="min-h-[80vh] w-full text-neutral-50 overflow-hidden relative">
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
    </motion.div>
  );
};

const Board = ({ todoTitle, backLog, progress, completed, searchQuery, filterPriority, filterType, cards, setCards }) => {
  return (
    <div className="flex min-h-[70vh] w-full gap-4 overflow-x-auto md:overflow-x-visible flex-nowrap md:flex-wrap relative mx-4">
      <Column
        title={backLog}
        column="backlog"
        headingColor="text-neutral-500"
        cards={cards}
        setCards={setCards}
        searchQuery={searchQuery}
        filterPriority={filterPriority}
        filterType={filterType}
      />

      <Column
        title={todoTitle}
        column="todo"
        headingColor="text-yellow-400"
        cards={cards}
        setCards={setCards}
        searchQuery={searchQuery}
        filterPriority={filterPriority}
        filterType={filterType}
      />

      <Column
        title={progress}
        column="doing"
        headingColor="text-blue-400"
        cards={cards}
        setCards={setCards}
        searchQuery={searchQuery}
        filterPriority={filterPriority}
        filterType={filterType}
      />

      <Column
        title={completed}
        column="done"
        headingColor="text-emerald-400"
        cards={cards}
        setCards={setCards}
        searchQuery={searchQuery}
        filterPriority={filterPriority}
        filterType={filterType}
      />
    </div>
  );
};
const Column = ({ title, headingColor, cards, column, setCards, searchQuery, filterPriority, filterType }) => {
  const [active, setActive] = useState(false);

  // Filter cards based on search and filter criteria
  const filteredCards = cards.filter(card => {
    // Column filter
    if (card.column !== column) return false;

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        card.title?.toLowerCase().includes(searchLower) ||
        card.description?.toLowerCase().includes(searchLower) ||
        card.type?.toLowerCase().includes(searchLower) ||
        card.priority?.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Priority filter
    if (filterPriority !== "All" && card.priority !== filterPriority) {
      return false;
    }

    // Type filter
    if (filterType !== "All" && card.type !== filterType) {
      return false;
    }

    return true;
  });

  const handleDragStart = (e, card) =>
    e.dataTransfer.setData("cardId", card.id);
  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");
    setActive(false);
    clearHighlights();
    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    const before = element.dataset.before || "-1";
    if (before !== cardId) {
      let copy = [...cards];
      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };
      copy = copy.filter((c) => c.id !== cardId);
      const insertAtIndex = copy.findIndex((el) => el.id === before);
      if (before === "-1") copy.push(cardToTransfer);
      else if (insertAtIndex !== -1)
        copy.splice(insertAtIndex, 0, cardToTransfer);
      setCards(copy);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };
  const clearHighlights = (els) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => (i.style.opacity = "0"));
  };
  const highlightIndicator = (e) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };
  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;
    return indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        return offset < 0 && offset > closest.offset
          ? { offset, element: child }
          : closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );
  };
  const getIndicators = () =>
    Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };
  return (
    <div className="w-[23%] flex-shrink-0 md:flex-shrink">
      <div className="mb-4 flex items-center justify-between">
        <h3 className={`text-xl font-semibold ${headingColor}`}>{title}</h3>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full space-y-1 rounded-2xl p-2 pt-4 transition-colors ${
          active ? "bg-white/10" : "bg-white/5"

        } backdrop-blur-md bg-white/10 border border-white/20 shadow-xl`}
      >
        {filteredCards.map((c) => (
          <Card
            key={c.id}
            {...c}
            handleDragStart={handleDragStart}
            setCards={setCards}
            searchQuery={searchQuery}
          />
        ))}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

// =================== FULLY FUNCTIONAL CARD =================//
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
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);

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

  const [isTypingCustom, setIsTypingCustom] = useState(false);
  const [newType, setNewType] = useState("");

  // Highlight search matches
  const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-400/30 text-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  // 🗑️ Delete card (with confirmation)
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      setCards((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // 💬 Add a comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, comments: [...(c.comments || []), newComment.trim()] }
          : c
      )
    );
    setNewComment("");
  };

  // ❌ Delete a comment
  const handleDeleteComment = (index) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, comments: c.comments.filter((_, i) => i !== index) }
          : c
      )
    );
  };

  // 🔗 Add a link
  const handleAddLink = () => {
    if (!newLink.trim()) return;
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, links: [...(c.links || []), newLink.trim()] } : c
      )
    );
    setNewLink("");
  };

  // ❌ Delete a link
  const handleDeleteLink = (index) => {
    setCards((prev) =>
      prev.map((c) =>

        c.id === id ? { ...c, links: c.links.filter((_, i) => i !== index) } : c
      )
    );
  };

  // 📋 Copy link
  const handleCopy = (link) => {
    navigator.clipboard.writeText(link);
    alert("Link copied!");
  };

  // ✏️ Save edits
  const handleSaveEdit = () => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...editData } : c))
    );
    setEditing(false);
  };

  // 📎 Get file type icon
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const iconMap = {
      // Images
      'jpg': FiImage, 'jpeg': FiImage, 'png': FiImage, 'gif': FiImage, 'svg': FiImage, 'webp': FiImage,
      // Documents
      'pdf': FiFileText, 'doc': FiFileText, 'docx': FiFileText, 'txt': FiFileText, 'rtf': FiFileText,
      // Spreadsheets
      // 'xls': FiFileSpreadsheet, 'xlsx': FiFileSpreadsheet, 'csv': FiFileSpreadsheet,
      // Code
      'js': FiCode, 'jsx': FiCode, 'ts': FiCode, 'tsx': FiCode, 'html': FiCode, 'css': FiCode, 'py': FiCode, 'java': FiCode, 'cpp': FiCode, 'c': FiCode,
      // Media
      'mp4': FiVideo, 'avi': FiVideo, 'mov': FiVideo, 'wmv': FiVideo, 'flv': FiVideo,
      'mp3': FiMusic, 'wav': FiMusic, 'flac': FiMusic, 'aac': FiMusic,
      // Archives
      'zip': FiArchive, 'rar': FiArchive, '7z': FiArchive, 'tar': FiArchive, 'gz': FiArchive,
    };
    return iconMap[extension] || FiFile;
  };

  // 📎 Handle file upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const newAttachments = files.map(file => ({
      id: Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString().split('T')[0],
      comments: [],
      file: file, // Store file object for download
    }));

    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, attachments: [...(c.attachments || []), ...newAttachments] }
          : c
      )
    );
  };

  // 📎 Handle drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    const newAttachments = files.map(file => ({
      id: Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date().toISOString().split('T')[0],
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

  // 📎 Delete attachment
  const handleDeleteAttachment = (attachmentId) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, attachments: c.attachments.filter(att => att.id !== attachmentId) }
          : c
      )
    );
  };

  // 📎 Add attachment comment
  const handleAddAttachmentComment = (attachmentId, comment) => {
    if (!comment.trim()) return;
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              attachments: c.attachments.map(att =>
                att.id === attachmentId
                  ? { ...att, comments: [...att.comments, comment.trim()] }
                  : att
              )
            }
          : c
      )
    );
  };

  // 📎 Delete attachment comment
  const handleDeleteAttachmentComment = (attachmentId, commentIndex) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              attachments: c.attachments.map(att =>
                att.id === attachmentId
                  ? { ...att, comments: att.comments.filter((_, i) => i !== commentIndex) }
                  : att
              )
            }
          : c
      )
    );
  };

  // 📎 Download attachment
  const handleDownloadAttachment = (attachment) => {
    const url = URL.createObjectURL(attachment.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = attachment.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 📎 Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  return (
    <>

      {" "}
      <DropIndicator beforeId={id} column={column} />{" "}
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { id, title, column })}
        className="cursor-grab rounded-xl border border-white/10 bg-white/10 p-4 shadow-md backdrop-blur-md hover:bg-white/20 active:cursor-grabbing relative"
      >
        {/* HEADER */}

        <div className="flex items-center justify-between mb-2">
          {" "}
          <div className="flex gap-2">

            {" "}
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                priority === "Low"
                  ? "bg-green-500/20 text-green-400"
                  : priority === "Medium"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >

              {" "}
              {priority}{" "}
            </span>{" "}
            {type && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">

                {" "}
                {type}{" "}
              </span>

            )}{" "}
          </div>{" "}
          <div className="flex items-center gap-2 text-white/60">
            {" "}
            <button
              onClick={() => setEditing(!editing)}
              className="hover:text-white transition-colors"
            >
              {" "}
              <FiEdit2 />{" "}
            </button>{" "}
            <button
              onClick={handleDelete}
              className="hover:text-red-400 transition-colors"
            >
              {" "}
              <FiTrash />{" "}
            </button>{" "}
          </div>{" "}
        </div>
        {/* MAIN BODY */}
        {editing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              className="w-full bg-white/10 p-1 rounded text-white text-base"
            />
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              className="w-full bg-white/10 p-1 rounded text-white text-sm"
            />{" "}
            <div className="flex gap-2 items-start">
              {" "}
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="flex-none bg-violet-500/20 text-white text-sm rounded-md p-2 border border-violet-500 focus:outline-none"
              >
                {" "}
                <option className="text-black">Low</option>{" "}
                <option className="text-black">Medium</option>{" "}
                <option className="text-black">High</option>{" "}
              </select>
              {/* Type selection with "Type custom" option */}
              <div className="flex flex-col gap-2 w-full">
                {" "}
                {!isTypingCustom ? (
                  <select
                    value={
                      [
                        "Front-End",
                        "UI/UX",
                        "Daily Routine",
                        "Backend",
                        "Research",
                      ].includes(type)
                        ? type
                        : type || ""
                    }
                    onChange={(e) => {
                      if (e.target.value === "__custom__") {
                        setIsTypingCustom(true);
                        setType("");
                        // start empty for custom input
                      } else {
                        setType(e.target.value);
                      }
                    }}
                    className="bg-violet-500/20 text-white text-sm rounded-md p-2 border border-violet-500 focus:outline-none"
                  >
                    {" "}
                    <option className="text-black" value="Front-End">
                      {" "}
                      Front-End{" "}
                    </option>{" "}
                    <option className="text-black" value="UI/UX">
                      {" "}
                      UI/UX{" "}
                    </option>{" "}
                    <option className="text-black" value="Daily Routine">
                      {" "}
                      Daily Routine{" "}
                    </option>{" "}
                    <option className="text-black" value="Backend">
                      {" "}
                      Backend{" "}
                    </option>{" "}
                    <option className="text-black" value="Research">
                      {" "}
                      Research{" "}
                    </option>{" "}
                    {/* Custom option */}{" "}
                    {type &&
                      ![
                        "Front-End",
                        "UI/UX",
                        "Daily Routine",
                        "Backend",
                        "Research",
                      ].includes(type) && (
                        <option className="text-black" value={type}>
                          {" "}
                          {type}{" "}
                        </option>
                      )}{" "}
                    <option className="text-black" value="__custom__">
                      {" "}
                      Custom…{" "}
                    </option>{" "}
                  </select>
                ) : (
                  <div className="flex flex-col gap-2 w-full">
                    {" "}
                    <input
                      type="text"
                      placeholder="Enter your own type..."
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full text-sm p-2 bg-neutral-800 text-white rounded-md border border-white/20 focus:outline-none focus:ring-1 focus:ring-violet-400"
                    />{" "}
                    <div className="flex gap-2">
                      {" "}
                      <button
                        type="button"
                        onClick={() => setIsTypingCustom(false)}
                        className="px-2 py-1 text-xs rounded bg-red-400 text-white hover:bg-red-500 transition"
                      >
                        {" "}
                        Cancel{" "}
                      </button>{" "}
                      <button
                        type="button"
                        onClick={() => setIsTypingCustom(false)}
                        className="px-2 py-1 text-xs rounded bg-white text-black hover:bg-neutral-200 transition"
                      >
                        {" "}
                        Done{" "}
                      </button>{" "}
                    </div>{" "}
          </div>

                )}{" "}
              </div>{" "}
            </div>{" "}
            <div className="flex gap-2">
              {" "}
              <input
                type="date"
                value={editData.date}
                onChange={(e) =>
                  setEditData({ ...editData, date: e.target.value })
                }
                className="bg-white/10 border border-white/20 text-white text-xs rounded-md p-1"
              />{" "}
              <input
                type="date"
                value={editData.deadline}
                onChange={(e) =>
                  setEditData({ ...editData, deadline: e.target.value })
                }
                className="bg-white/10 border border-white/20 text-white text-xs rounded-md p-1"
              />{" "}
            </div>{" "}
          <button

              onClick={handleSaveEdit}
              className="bg-white text-black rounded px-2 py-1 text-xs"
          >

              {" "}
              Save{" "}
            </button>{" "}
        </div>

        ) : (
          <>
            {" "}
            <h4 className="text-white text-sm font-semibold">{highlightText(title, searchQuery)}</h4>
            {description && (
              <p className="text-xs text-white/60 mt-1">{highlightText(description, searchQuery)}</p>
            )}
            <div className="mt-3 text-xs text-white/60">
              {" "}
              <p>
                {" "}
                Creation: <span className="text-white/80">{date}</span>{" "}
              </p>{" "}
              {deadline && (
                <p>
                  {" "}
                  Deadline: <span className="text-red-300">
                    {deadline}
                  </span>{" "}
                </p>
              )}{" "}
            </div>{" "}
          </>
        )}{" "}
        {/* FOOTER */}{" "}
        <div className="mt-3 flex justify-between items-center">
          {" "}
          <div className="flex -space-x-2">
            {" "}
            {assignees.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="assignee"
                className="w-5 h-5 rounded-full border border-white/20"
              />
            ))}{" "}
          </div>{" "}
          <div className="flex items-center gap-3 text-xs text-white/60">
            {" "}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1 hover:text-white"
          >

              {" "}
              <FiMessageSquare /> {comments?.length || 0}{" "}
            </button>{" "}
           <button
             onClick={() => setShowLinks(!showLinks)}
             className="flex items-center gap-1 hover:text-white"
           >
               {" "}
               <FiLink /> {links?.length || 0}{" "}
             </button>
             <button
               onClick={() => setShowAttachments(!showAttachments)}
               className="flex items-center gap-1 hover:text-white"
             >
               {" "}
               <FiPaperclip /> {attachments?.length || 0}{" "}
             </button>{" "}
           </div>{" "}
        </div>{" "}
        {/* 💬 COMMENTS POPUP */}{" "}
        {showComments && (
          <div className="mt-3 border border-white/20 rounded-md bg-white/10 p-2 text-xs">

            {" "}
            <p className="text-white/70 font-semibold mb-2">Comments</p>{" "}
            <div className="space-y-1 max-h-24 overflow-y-auto">

              {" "}
              {comments?.length ? (
                comments.map((c, i) => (
                  <div
                    key={i}

                    className="flex justify-between items-center bg-white/5 rounded px-2 py-1"
                  >

                    {" "}
                    <p className="text-white/80">{c}</p>{" "}
                    <button
                      onClick={() => handleDeleteComment(i)}

                      className="text-white/40 hover:text-red-400 text-xs"
                    >

                      {" "}
                      <FiX />{" "}
                    </button>{" "}
                  </div>
                ))
              ) : (
                <p className="text-white/40">No comments yet.</p>

              )}{" "}
            </div>{" "}
            <div className="flex mt-2 gap-2">

              {" "}
              <input
                type="text"
                placeholder="Add comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 rounded bg-white/5 text-white text-xs p-1 focus:outline-none"

              />{" "}
              <button
                onClick={handleAddComment}
                className="bg-white text-black px-2 py-1 rounded text-xs"
              >

                {" "}
                Add{" "}
              </button>{" "}
            </div>{" "}
            </div>

        )}{" "}
        {/* 🔗 LINKS POPUP */}{" "}
        {showLinks && (
          <div className="mt-3 border border-white/20 rounded-md bg-white/10 p-2 text-xs">

            {" "}
            <p className="text-white/70 font-semibold mb-2">Links</p>{" "}
            <div className="space-y-1 max-h-24 overflow-y-auto">

              {" "}
              {links?.length ? (
                links.map((l, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-white/5 rounded px-2 py-1"
                  >

                    {" "}
                    <a
                      href={l}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-300 truncate w-[70%]"
                    >

                      {" "}
                      {l}{" "}
                    </a>{" "}
                    <div className="flex gap-2">

                      {" "}
                      <button
                        onClick={() => handleCopy(l)}

                        className="text-white/50 hover:text-white"
                      >

                        {" "}
                        <FiCopy />{" "}
                      </button>{" "}
                      <button
                        onClick={() => handleDeleteLink(i)}

                        className="text-white/40 hover:text-red-400 text-xs"
                      >
                        {" "}
                        <FiX />{" "}
                      </button>{" "}
                    </div>{" "}
                  </div>
                ))
              ) : (
                <p className="text-white/40">No links added.</p>

              )}{" "}
            </div>{" "}
            <div className="flex mt-2 gap-2">

              {" "}
              <input

                type="url"
                placeholder="Add link..."
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                className="flex-1 rounded bg-white/5 text-white text-xs p-1 focus:outline-none"

              />{" "}
              <button
                onClick={handleAddLink}
                className="bg-white text-black px-2 py-1 rounded text-xs"
              >

                {" "}
                Add{" "}
              </button>{" "}
            </div>{" "}
            </div>
        )}

        {/* 📎 ATTACHMENTS POPUP */}
        {showAttachments && (
          <div className="mt-3 border border-white/20 rounded-md bg-white/10 p-2 text-xs">
            <p className="text-white/70 font-semibold mb-2">Attachments</p>
            
            {/* File Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-white/20 rounded-lg p-4 mb-3 hover:border-white/40 transition-colors"
            >
              <div className="text-center">
                <FiPaperclip className="mx-auto text-2xl text-white/60 mb-2" />
                <p className="text-white/60 text-xs mb-2">Drag & drop files here or</p>
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
                          <p className="text-white/80 truncate text-xs">{attachment.name}</p>
                          <p className="text-white/40 text-xs">
                            {formatFileSize(attachment.size)} • {attachment.uploadDate}
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
                <p className="text-white/40 text-center py-2">No attachments yet.</p>
              )}
            </div>

            {/* Attachment Comments */}
            {attachments?.length > 0 && (
              <div className="mt-3 border-t border-white/10 pt-2">
                <p className="text-white/60 text-xs mb-2">File Comments</p>
                {attachments.map((attachment) => (
                  <div key={attachment.id} className="mb-2">
                    <p className="text-white/70 text-xs font-medium mb-1">{attachment.name}</p>
                    <div className="space-y-1">
                      {attachment.comments?.map((comment, commentIndex) => (
                        <div key={commentIndex} className="flex justify-between items-center bg-white/5 rounded px-2 py-1">
                          <p className="text-white/80 text-xs">{comment}</p>
                          <button
                            onClick={() => handleDeleteAttachmentComment(attachment.id, commentIndex)}
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
                            if (e.key === 'Enter') {
                              handleAddAttachmentComment(attachment.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input = e.target.previousElementSibling;
                            handleAddAttachmentComment(attachment.id, input.value);
                            input.value = '';
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
      </motion.div>{" "}
    </>
  );
};
// ============================================================
const DropIndicator = ({ beforeId, column }) => (
  <div
    data-before={beforeId || "-1"}
    data-column={column}
    className="my-0.5 h-1 w-full rounded bg-violet-400 opacity-0 transition-opacity duration-300"
  />
);

// ============================================================
const AddCard = ({ column, setCards }) => {
  const [text, setText] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Low");
  const [type, setType] = useState("Front-End");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [deadline, setDeadline] = useState("");
  const [adding, setAdding] = useState(false);
  // inside AddCard
  const [isTypingCustom, setIsTypingCustom] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const newCard = {
      id: Math.random().toString(),
      column,
      title: text.trim(),
      description: desc,
      priority,
      type,
      date,
      deadline,
      comments: [],
      links: [],
      attachments: [],
      assignees: [],
    };
    setCards((prev) => [...prev, newCard]);
    setText("");
    setDesc("");
    setDeadline("");
    setAdding(false);
  };
  return adding ? (
    <motion.form layout onSubmit={handleSubmit} className="space-y-2">
      {" "}
            <input

        onChange={(e) => setText(e.target.value)}
        value={text}
        placeholder="Task title..."
        className="w-full rounded-md border border-violet-500 bg-violet-500/20 p-2 text-sm text-white placeholder-violet-200 focus:outline-none"
      />{" "}
            <textarea

        onChange={(e) => setDesc(e.target.value)}
        value={desc}
        placeholder="Description..."
        className="w-full rounded-md border border-violet-500 bg-violet-500/20 p-2 text-sm text-white placeholder-violet-200 focus:outline-none"
      />{" "}
      <div className="flex gap-2 items-start">
        {" "}
              <select

          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="flex-none bg-violet-500/20 text-white text-sm rounded-md p-2 border border-violet-500 focus:outline-none"
        >
          {" "}
          <option className="text-black">Low</option>{" "}
          <option className="text-black">Medium</option>{" "}
          <option className="text-black">High</option>{" "}
              </select>

        {/* Type selection with "Type custom" option */}
        <div className="flex flex-col gap-2 w-full">
          {!isTypingCustom ? (
              <select

              value={
                [
                  "Front-End",
                  "UI/UX",
                  "Daily Routine",
                  "Backend",
                  "Research",
                ].includes(type)
                  ? type
                  : type || ""
              }
              onChange={(e) => {
                if (e.target.value === "__custom__") {
                  setIsTypingCustom(true);
                  setType("");
                  // start empty for custom input
                } else {
                  setType(e.target.value);
                }
              }}
              className="bg-violet-500/20 text-white text-sm rounded-md p-2 border border-violet-500 focus:outline-none"
            >
              {" "}
              <option className="text-black" value="Front-End">
                {" "}
                Front-End{" "}
              </option>{" "}
              <option className="text-black" value="UI/UX">
                {" "}
                UI/UX{" "}
              </option>{" "}
              <option className="text-black" value="Daily Routine">
                {" "}
                Daily Routine{" "}
              </option>{" "}
              <option className="text-black" value="Backend">
                {" "}
                Backend{" "}
              </option>{" "}
              <option className="text-black" value="Research">
                {" "}
                Research{" "}
              </option>{" "}
              {/* Custom option */}{" "}
              {type &&
                ![
                  "Front-End",
                  "UI/UX",
                  "Daily Routine",
                  "Backend",
                  "Research",
                ].includes(type) && (
                  <option className="text-black" value={type}>
                    {" "}
                    {type}{" "}
                  </option>
                )}{" "}
              <option className="text-black" value="__custom__">
                {" "}
                Custom…{" "}
              </option>{" "}
              </select>

          ) : (
            <div className="flex flex-col gap-2 w-full">
              {" "}
              <input
                type="text"
                placeholder="Enter your own type..."
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-sm p-2 bg-neutral-800 text-white rounded-md border border-white/20 focus:outline-none focus:ring-1 focus:ring-violet-400"
              />{" "}
              <div className="flex gap-2">
                {" "}
                <button
                  type="button"
                  onClick={() => setIsTypingCustom(false)}
                  className="px-2 py-1 text-xs rounded bg-red-400 text-white hover:bg-red-500 transition"
                >
                  {" "}
                  Cancel{" "}
                </button>{" "}
                <button
                  type="button"
                  onClick={() => setIsTypingCustom(false)}
                  className="px-2 py-1 text-xs rounded bg-white text-black hover:bg-neutral-200 transition"
                >
                  {" "}
                  Done{" "}
                </button>{" "}
              </div>{" "}
            </div>

          )}{" "}
        </div>{" "}
      </div>{" "}
      <div className="flex gap-2">
        {" "}
              <input
                type="date"

          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-violet-500/20 text-white text-sm rounded-md p-2 border border-violet-500 flex-1"
        />{" "}
              <input
                type="date"

          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="bg-violet-500/20 text-white text-sm rounded-md p-2 border border-violet-500 flex-1"
        />{" "}
      </div>{" "}
      <div className="flex items-center justify-end gap-2">
        {" "}
              <button

          onClick={() => setAdding(false)}
          className="text-xs text-white/60 hover:text-white"
              >

          {" "}
          Cancel{" "}
        </button>{" "}
              <button

          type="submit"
          className="flex items-center gap-2 rounded bg-white px-3 py-1.5 text-xs text-black hover:bg-neutral-300 transition"
        >
          {" "}
          Add <FiPlus />{" "}
        </button>{" "}
      </div>{" "}
    </motion.form>
  ) : (
    <motion.button
      layout
      onClick={() => setAdding(true)}
      className="flex w-full items-center gap-2 px-2 py-1.5 text-xs text-white/60 hover:text-white"
    >
      {" "}
      <FiPlus /> Add card{" "}
    </motion.button>
  );
};
export { Kanban };
export default Kanban;
