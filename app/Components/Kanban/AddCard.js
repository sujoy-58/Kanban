import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";

const AddCard = ({ column, setCards, isDefaultColumn = false }) => {
  const [text, setText] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Low");
  const [type, setType] = useState("Front-End");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [deadline, setDeadline] = useState("");
  const [adding, setAdding] = useState(false);
  const [isTypingCustom, setIsTypingCustom] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    const newCard = {
      id: Math.random().toString(),
      column: isDefaultColumn ? column : "todo", // Always create in todo if not default column
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
      timer: {
        isRunning: false,
        startTime: null,
        totalTime: 0,
      },
      checklists: [],
      createdAt: new Date().toISOString(),
    };
    
    setCards((prev) => [...prev, newCard]);
    setText("");
    setDesc("");
    setDeadline("");
    setAdding(false);
  };

  return adding ? (
    <motion.form layout onSubmit={handleSubmit} className="space-y-2">
      <input
        onChange={(e) => setText(e.target.value)}
        value={text}
        placeholder="Task title..."
        className="w-full rounded-md border border-violet-500 bg-violet-500/20 p-2 text-sm text-white placeholder-violet-200 focus:outline-none"
      />
      <textarea
        onChange={(e) => setDesc(e.target.value)}
        value={desc}
        placeholder="Description..."
        className="w-full rounded-md border border-violet-500 bg-violet-500/20 p-2 text-sm text-white placeholder-violet-200 focus:outline-none"
      />
      <div className="flex gap-2 items-start">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="flex-none bg-violet-500/20 text-white text-sm rounded-md p-2 border border-violet-500 focus:outline-none"
        >
          <option className="text-black">Low</option>
          <option className="text-black">Medium</option>
          <option className="text-black">High</option>
        </select>

        <div className="flex flex-col gap-2 w-full">
          {!isTypingCustom ? (
            <select
              value={type}
              onChange={(e) => {
                if (e.target.value === "__custom__") {
                  setIsTypingCustom(true);
                  setType("");
                } else {
                  setType(e.target.value);
                }
              }}
              className="bg-violet-500/20 text-white text-sm rounded-md p-2 border border-violet-500 focus:outline-none"
            >
              <option className="text-black" value="Front-End">Front-End</option>
              <option className="text-black" value="UI/UX">UI/UX</option>
              <option className="text-black" value="Daily Routine">Daily Routine</option>
              <option className="text-black" value="Backend">Backend</option>
              <option className="text-black" value="Research">Research</option>
              <option className="text-black" value="__custom__">Custom…</option>
            </select>
          ) : (
            <div className="flex flex-col gap-2 w-full">
              <input
                type="text"
                placeholder="Enter your own type..."
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-sm p-2 bg-neutral-800 text-white rounded-md border border-white/20 focus:outline-none focus:ring-1 focus:ring-violet-400"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsTypingCustom(false)}
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
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-violet-500/20 text-white text-sm rounded-md p-2 border border-violet-500 flex-1"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="bg-violet-500/20 text-white text-sm rounded-md p-2 border border-violet-500 flex-1"
        />
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setAdding(false)}
          className="text-xs text-white/60 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-2 rounded bg-white px-3 py-1.5 text-xs text-black hover:bg-neutral-300 transition"
        >
          Add <FiPlus />
        </button>
      </div>
    </motion.form>
  ) : (
    <motion.button
      layout
      onClick={() => setAdding(true)}
      className="flex w-full items-center gap-2 px-2 py-1.5 text-xs text-white/60 hover:text-white"
    >
      <FiPlus /> Add card
    </motion.button>
  );
};

export default AddCard;