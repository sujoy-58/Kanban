"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCheck,
  FiClock,
  FiActivity,
  FiFileText,
  FiTrendingUp,
  FiUsers,
  FiPlus,
  FiSettings,
  FiSearch,
} from "react-icons/fi";
import { Line, Pie, Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
// import { motion, AnimatePresence } from "framer-motion";

const MySpace = ({ tasks = [] }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [stngOpen, setStngOpen] = useState(false);

  // const [isOpen, setIsOpen] = useState(false);
  // const buttonRef = useRef();

  // // Collapse on click outside
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (buttonRef.current && !buttonRef.current.contains(event.target)) {
  //       setIsOpen(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  // Cumulative report state
  const [report, setReport] = useState({
    totalTasks: 0,
    completedTasks: 0,
    activeProjects: 3, // dummy
    activeUsers: 5, // dummy
    completionPercent: 0,
  });

  useEffect(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.column === "done").length;
    setReport({
      totalTasks: total,
      completedTasks: completed,
      activeProjects: 3, // replace dynamically later
      activeUsers: 5, // replace dynamically later
      completionPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    });
  }, [tasks]);

  // --- Dummy Chart Data (replace later) ---
  const trendData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Tasks Completed",
        data: [3, 5, 2, 6, 4, 7, 5], // dummy values
        fill: true,
        backgroundColor: "rgba(34,197,94,0.2)",
        borderColor: "rgba(34,197,94,0.7)",
        tension: 0.4,
      },
    ],
  };
  const trendOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#e5e7eb" } },
      y: {
        grid: { color: "rgba(255,255,255,0.1)" },
        ticks: { color: "#e5e7eb" },
      },
    },
  };

  const columnData = {
    labels: ["Backlog", "TODO", "Doing", "Done"],
    datasets: [
      {
        data: [5, 8, 4, 6], // dummy values
        backgroundColor: ["#9CA3AF", "#FACC15", "#3B82F6", "#10B981"],
      },
    ],
  };

  const priorityData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Priority Distribution",
        data: [4, 6, 5], // dummy values
        backgroundColor: ["#22C55E", "#FACC15", "#EF4444"],
      },
    ],
  };

  const projectData = {
    labels: ["Project A", "Project B", "Project C"],
    datasets: [
      {
        label: "Tasks per Project",
        data: [12, 8, 15], // dummy values
        backgroundColor: ["#3B82F6", "#FACC15", "#10B981"],
      },
    ],
  };

  return (
    <motion.div
      className="min-h-[80vh] w-full p-4 text-neutral-50 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* --- Top Utility Bar --- */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-white/90">My Space</h2>
        <div className="flex items-center gap-3">
          {/* SEARCH BUTTON */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ width: "40px" }}
            animate={{ width: searchOpen ? "180px" : "40px" }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <AnimatePresence mode="wait">
              {!searchOpen ? (
                // CLOSED STATE BUTTON
                <motion.button
                  key="searchButton"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setSearchOpen(true)}
                  className="flex justify-center items-center rounded-full p-2 bg-white/10 border border-white/20 backdrop-blur-md text-white/80 hover:bg-white/20 transition w-[40px] h-[40px] relative"
                  title="Search" // tooltip on hover
                >
                  <FiSearch size={18} />
                </motion.button>
              ) : (
                // OPEN STATE INPUT
                <motion.input
                  key="searchInput"
                  type="text"
                  autoFocus
                  placeholder="Search..."
                  initial={{ opacity: 0, width: 40 }}
                  animate={{ opacity: 1, width: 180 }}
                  exit={{ opacity: 0, width: 40 }}
                  transition={{ duration: 0.3 }}
                  className="pl-6 pr-3 py-1 h-[40px] text-sm bg-white/10 border border-white/20 backdrop-blur-md text-white/90 rounded-full outline-none w-full"
                  onBlur={() => setSearchOpen(false)}
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Add BUTTON */}

          <motion.button
            onClick={() => alert("Add Workspace?")} // to be implemented
            className=" w-24 flex items-center text-sm gap-1 px-3 py-2 h-[40px] bg-white/10 border border-white/20 backdrop-blur-md text-white/80 hover:bg-white/20 rounded-full outline-none"
            whileHover={{ scale: 1.1 }}
          >
            <FiPlus size={18} /> Add Task
          </motion.button>

          {/* SETTINGS BUTTON */}

          <motion.button
            onClick={() => alert("open settings")} // to be implemented
            className=" w-24 flex items-center text-sm gap-1 px-3 py-2 h-[40px] bg-white/10 border border-white/20 backdrop-blur-md text-white/80 hover:bg-white/20 rounded-full outline-none"
            whileHover={{ scale: 1.1 }}
          >
            <FiSettings size={18} /> Settings
          </motion.button>

        </div>
      </div>

      {/* --- Cumulative Report Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Tasks"
          value={report.totalTasks}
          icon={<FiFileText />}
          color="text-white/80"
        />
        <StatCard
          title="Completed Tasks"
          value={report.completedTasks}
          icon={<FiCheck />}
          color="text-emerald-400"
        />
        <StatCard
          title="Active Projects"
          value={report.activeProjects}
          icon={<FiActivity />}
          color="text-blue-400"
        />
        <StatCard
          title="Active Users"
          value={report.activeUsers}
          icon={<FiUsers />}
          color="text-yellow-400"
        />
      </div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
        <motion.div
          layout
          className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 shadow-xl hover:scale-[1.02] transition"
        >
          <h3 className="text-white/80 font-semibold mb-2">
            Weekly Completion Trend
          </h3>
          <Line data={trendData} options={trendOptions} />
        </motion.div>

        <motion.div
          layout
          className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 shadow-xl hover:scale-[1.02] transition"
        >
          <h3 className="text-white/80 font-semibold mb-2">
            Task Column Distribution
          </h3>
          <Pie data={columnData} />
        </motion.div>

        <motion.div
          layout
          className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 shadow-xl hover:scale-[1.02] transition"
        >
          <h3 className="text-white/80 font-semibold mb-2">
            Priority Distribution
          </h3>
          <Bar
            data={priorityData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </motion.div>

        <motion.div
          layout
          className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 shadow-xl hover:scale-[1.02] transition"
        >
          <h3 className="text-white/80 font-semibold mb-2">
            Tasks per Project
          </h3>
          <Bar
            data={projectData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </motion.div>
      </div>

      {/* --- Recent Activity / Task Overview --- */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.slice(-6).map((task) => (
          <motion.div
            key={task.id}
            layout
            whileHover={{ scale: 1.02 }}
            className="rounded-2xl border border-white/20 bg-white/10 p-4 shadow-md backdrop-blur-md hover:bg-white/20 transition cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-2">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    task.priority === "Low"
                      ? "bg-green-500/20 text-green-400"
                      : task.priority === "Medium"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {task.priority}
                </span>
                {task.type && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                    {task.type}
                  </span>
                )}
              </div>
              <span className="text-xs text-white/60">{task.date}</span>
            </div>
            <h4 className="text-white font-semibold text-sm truncate">
              {task.title}
            </h4>
            {task.description && (
              <p className="text-xs text-white/60 mt-1 truncate">
                {task.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
              <FiFileText /> {task.comments?.length || 0} Comments
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// --- Card Components ---
const StatCard = ({ title, value, icon, color }) => (
  <motion.div
    layout
    whileHover={{ scale: 1.02 }}
    className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 shadow-xl flex items-center gap-4 transition cursor-pointer"
  >
    <div className={`text-2xl ${color}`}>{icon}</div>
    <div>
      <p className="text-xs text-white/60">{title}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </motion.div>
);

export default MySpace;
