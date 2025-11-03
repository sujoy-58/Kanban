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
  FiAlertCircle,
  FiFilter,
  FiBell,
  FiBarChart2,
  FiCalendar,
  FiZap,
  FiCloud,
  FiDownload,
  FiPlay,
  FiPause,
  FiStopCircle,
  FiCpu,
  FiRepeat,
  FiInfo,
} from "react-icons/fi";
import { Line, Pie, Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

/**
 * MySpace Dashboard
 *
 * - TOP UTILITY BAR: KEPT EXACTLY as user provided (no changes).
 * - Below: upgraded UI, modern charts tuned to theme, merged Integrations + AI,
 *   added Time Tracker, richer cards, many TODO comments for backend wiring.
 *
 * NOTE:
 * - Replace dummy arrays/values with real API responses.
 * - Chart gradient scripts are implemented using scriptable options (Chart.js).
 */

const MySpace = ({ tasks = [] }) => {
  // --- keep top utility bar behaviour state untouched ---
  const [searchOpen, setSearchOpen] = useState(false);

  // --- Dummy / placeholder user + date (replace with real auth data) ---
  const username = "Sujoy"; // TODO: Replace with logged-in user's name from auth token
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  // --- SUMMARY (placeholder) ---
  const summary = {
    total: 28,
    completed: 17,
    pending: 9,
    overdue: 2,
    // TODO: Populate these values from backend / aggregated endpoint
  };

  // --- Performance (line) data (scriptable gradient background) ---
  // Using Chart.js scriptable options so gradient matches canvas size automatically.
  const performanceData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Tasks Completed",
        data: [4, 6, 3, 7, 5, 8, 6], // TODO: replace with real weekly data
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        // borderColor styled below as static fallback; gradient set via borderColor scriptable if needed
        borderColor: "rgba(16,185,129,0.95)",
        // fill is scriptable to draw gradient
        fill: true,
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(16,185,129,0.15)";
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.bottom,
            0,
            chartArea.top
          );
          gradient.addColorStop(0, "rgba(16,185,129,0.04)");
          gradient.addColorStop(0.5, "rgba(16,185,129,0.10)");
          gradient.addColorStop(1, "rgba(16,185,129,0.16)");
          return gradient;
        },
        // subtle shadow via dataset meta (not all Chart.js setups support shadows; we keep borderGlow via thicker border)
      },
    ],
  };

  const performanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0b1220",
        titleColor: "#fff",
        bodyColor: "#ddd",
        // TODO: style tooltip further if using global theme
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#c7ccd1" },
      },
      y: {
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "#c7ccd1", beginAtZero: true },
      },
    },
    elements: {
      line: {
        borderJoinStyle: "round",
        borderCapStyle: "round",
      },
      point: {
        backgroundColor: "#0b1220",
        borderWidth: 2,
        borderColor: "rgba(16,185,129,1)",
      },
    },
  };

  // --- Pie (workload) with darker legend + inner cutout look ---
  const pieData = {
    labels: ["Alpha", "Beta", "Gamma"],
    datasets: [
      {
        data: [40, 30, 30], // TODO: replace with real per-project distribution
        backgroundColor: ["#3B82F6", "#FACC15", "#10B981"],
        hoverOffset: 6,
      },
    ],
  };
  const pieOptions = {
    plugins: { legend: { position: "bottom", labels: { color: "#c7ccd1" } } },
    cutout: "45%",
  };

  // --- Bar (team performance) with soft rounded bars ---
  const barData = {
    labels: ["John", "Anya", "Ravi", "Lara"],
    datasets: [
      {
        label: "Tasks",
        data: [15, 21, 17, 19],
        borderRadius: 8,
        barThickness: 18,
        backgroundColor: ["#22C55E", "#F97316", "#3B82F6", "#EAB308"],
      },
    ],
  };
  const barOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#c7ccd1" } },
      y: {
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "#c7ccd1", beginAtZero: true },
      },
    },
  };

  // --- Time Tracker: simulated session + weekly data placeholder ---
  // Live session timer (simulate or integrate with actual time-tracking API)
  const [isTracking, setIsTracking] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0); // seconds in current session
  const [weekTimeData, setWeekTimeData] = useState([
    50, 120, 80, 95, 130, 40, 75,
  ]); // minutes per day (dummy)

  useEffect(() => {
    let timer = null;
    if (isTracking) {
      timer = setInterval(() => {
        setSessionSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTracking]);

  // Format hh:mm:ss for session display
  const formatHMS = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };

  // Weekly time bar chart (minutes)
  const timeBarData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: weekTimeData,
        borderRadius: 6,
        backgroundColor: (ctx) => {
          // subtle gradient per bar — scriptable
          const chart = ctx.chart;
          const { ctx: c } = chart;
          const gradient = c.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(59,130,246,0.9)");
          gradient.addColorStop(1, "rgba(16,185,129,0.6)");
          return gradient;
        },
      },
    ],
  };
  const timeBarOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#c7ccd1" } },
      y: {
        grid: { color: "rgba(255,255,255,0.06)" },
        ticks: { color: "#c7ccd1", beginAtZero: true },
      },
    },
  };

  // --- UI: Integration + AI features combined panel data (dummy) ---
  const integrations = [
    { name: "Slack", connected: true, icon: <FiCloud /> },
    { name: "Google Drive", connected: true, icon: <FiCloud /> },
    { name: "GitHub", connected: false, icon: <FiCloud /> },
    { name: "Notion", connected: false, icon: <FiCloud /> },
  ];
  const aiFeatures = [
    {
      name: "Smart Task Suggestions",
      desc: "Suggests next tasks based on history",
      enabled: true,
      icon: <FiCpu />,
    },
    {
      name: "Auto-Prioritization",
      desc: "Automatically reprioritizes tasks using urgency & impact",
      enabled: false,
      icon: <FiRepeat />,
    },
    {
      name: "AI Summary",
      desc: "Generate weekly summary & action items",
      enabled: true,
      icon: <FiBarChart2 />,
    },
  ];

  return (
    <motion.div
      className="min-h-[80vh] w-full p-4 text-neutral-50 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* ------------------ LEVEL 2 ------------------ */}
      {/* --- Top Utility Bar (KEEPING ORIGINAL) --- */}
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
                <motion.button
                  key="searchButton"
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setSearchOpen(true)}
                  className="flex justify-center items-center rounded-full p-2 bg-white/10 border border-white/20 backdrop-blur-md text-white/80 hover:bg-white/20 transition w-[40px] h-[40px]"
                  title="Search"
                >
                  <FiSearch size={18} />
                </motion.button>
              ) : (
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

          <motion.button
            onClick={() => alert("Add Task")}
            className=" w-28 flex items-center text-sm gap-1 px-3  h-[40px] bg-white/10 border border-white/20 backdrop-blur-md text-white/80 hover:bg-white/20 rounded-full outline-none"
            whileHover={{ scale: 1.1 }}
          >
            <FiPlus size={18} /> Add Task
          </motion.button>

          <motion.button
            onClick={() => alert("Open Settings")}
            className=" w-24 flex items-center text-sm gap-1 px-3 h-[40px] bg-white/10 border border-white/20 backdrop-blur-md text-white/80 hover:bg-white/20 rounded-full outline-none"
            whileHover={{ scale: 1.1 }}
          >
            <FiSettings size={18} /> Settings
          </motion.button>
        </div>
      </div>
      {/* ------------------ Welcome / Overview (with richer info + icon) ------------------ */}
      <div className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2">
          <h3 className="text-xl font-semibold text-white/90 flex items-center gap-3">
            Welcome back, {username} 👋
            <span className="text-xs text-white/60 ml-2">— {today}</span>
          </h3>
          <p className="text-sm mt-2 text-white/70">
            You have <span className="text-emerald-400 font-semibold">6</span>{" "}
            tasks due today.
            <span className="ml-3 text-xs text-white/50">
              Tip: Try the AI Smart Task Suggestions below to auto-fill daily
              focus.
            </span>
            {/* TODO: Replace '6' with actual due-today count from backend */}
          </p>
        </div>

        {/* Quick summary card with progress sparkline + small info */}
        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-white/60">Overall Completion</p>
              <p className="text-lg font-semibold">
                {summary.completed}/{summary.total}{" "}
                <span className="text-sm text-white/60">tasks</span>
              </p>
            </div>
            <div className="text-3xl text-emerald-400">
              <FiTrendingUp />
            </div>
          </div>
          <div className="mt-3">
            {/* small visual bar to indicate completion percent */}
            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
              <div
                className="h-2 bg-emerald-400"
                style={{
                  width: `${Math.round(
                    (summary.completed / Math.max(1, summary.total)) * 100
                  )}%`,
                }}
              />
            </div>
            <p className="text-xs text-white/60 mt-2">
              Completion rate — progress toward monthly goals
            </p>
          </div>
        </div>
      </div>
      {/* ------------------ Task Summary Cards (richer) ------------------ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          icon={<FiFileText />}
          title="Total Tasks"
          value={summary.total}
          color="text-blue-400"
          info="All tasks across projects"
        />
        <SummaryCard
          icon={<FiCheck />}
          title="Completed"
          value={summary.completed}
          color="text-emerald-400"
          info="Tasks completed this month"
          delta="+12%"
        />
        <SummaryCard
          icon={<FiClock />}
          title="Pending"
          value={summary.pending}
          color="text-yellow-400"
          info="Open tasks in backlog"
        />
        <SummaryCard
          icon={<FiAlertCircle />}
          title="Overdue"
          value={summary.overdue}
          color="text-red-400"
          info="Past due tasks needing attention"
          critical
        />
      </div>
      {/* ------------------ Performance Chart (styled) ------------------ */}
      <motion.div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 shadow-md mb-8">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-white/90">
              Performance Overview
            </h3>
            <p className="text-xs text-white/60">
              Tasks completed over the last 7 days
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs bg-white/10 border border-white/20 px-3 py-1 rounded-full">
              Weekly
            </button>
            <button className="text-xs bg-white/10 border border-white/20 px-3 py-1 rounded-full">
              Monthly
            </button>
          </div>
        </div>
        <div className="h-56">
          <Line data={performanceData} options={performanceOptions} />
        </div>
        {/* TODO: connect to analytics API and replace performanceData */}
      </motion.div>
      {/* ------------------ Ongoing Projects (richer cards) ------------------ */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-white/90 mb-3">
          Ongoing Projects
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: "Project Alpha",
              progress: 72,
              members: ["SJ", "AM", "RV"],
              due: "Nov 20",
            },
            {
              name: "Project Beta",
              progress: 45,
              members: ["LK", "NR"],
              due: "Dec 2",
            },
            {
              name: "Project Gamma",
              progress: 11,
              members: ["MK"],
              due: "Jan 10",
            },
          ].map((p, i) => (
            <ProjectCard key={i} {...p} />
          ))}
        </div>
      </div>
      {/* ------------------ Recent Tasks Table (extra columns + icons) ------------------ */}
      <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 mb-10">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-white/90">Recent Tasks</h3>
          <div className="text-xs text-white/60">
            Showing last 4 tasks •{" "}
            <span className="underline cursor-pointer text-white/80">
              View all
            </span>
          </div>
        </div>
        <table className="w-full text-sm text-left text-white/80">
          <thead>
            <tr className="text-white/60 border-b border-white/10">
              <th className="py-2">Task</th>
              <th>Assignee</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((id) => (
              <tr
                key={id}
                className="border-b border-white/10 hover:bg-white/10 transition"
              >
                <td className="py-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" /> Task
                  #{id} — Feature work
                </td>
                <td>User {id}</td>
                <td>
                  {id % 2 === 0 ? (
                    <span className="text-emerald-400">Done</span>
                  ) : (
                    <span className="text-yellow-400">In progress</span>
                  )}
                </td>
                <td>
                  {id % 3 === 0 ? (
                    <span className="text-red-400">High</span>
                  ) : (
                    <span className="text-white/70">Medium</span>
                  )}
                </td>
                <td>Nov {10 + id}</td>
                <td className="text-right">
                  <button className="text-xs bg-white/10 px-2 py-1 rounded-full border border-white/10">
                    Open
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* TODO: Replace static rows with tasks slice from backend */}
      </div>
      {/* ------------------ Calendar (mini) + Time Tracker (new) side-by-side ------------------ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
        {/* Mini Calendar */}
        <motion.div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-white/90 flex items-center gap-2">
              <FiCalendar /> Calendar
            </h3>
            <span className="text-xs text-white/60">Upcoming Deadlines</span>
          </div>
          <div className="text-center text-white/70 text-sm py-6">
            📅 November 2025 — (Calendar integration coming soon)
          </div>
          {/* TODO: Replace with full interactive calendar (react-day-picker / fullcalendar) */}
        </motion.div>

        {/* Time Tracker (spans 2 columns on desktop) */}
        <motion.div className="lg:col-span-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-semibold text-white/90 flex items-center gap-2">
                Time Tracker
              </h3>
              <p className="text-xs text-white/60">
                Track active session time & weekly report
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (!isTracking) {
                    setIsTracking(true);
                    // TODO: Trigger backend start-session API call here
                  } else {
                    setIsTracking(false);
                    // TODO: Trigger backend stop-session API call and persist sessionSeconds
                  }
                }}
                className="flex  items-center gap-1 px-3 py-2 rounded-full bg-white/10 border border-white/20 text-sm"
              >
                {isTracking ? (
                  <>
                    <FiPause size={18} /> Pause
                  </>
                ) : (
                  <>
                    <FiPlay size={18} /> Start
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setIsTracking(false);
                  setSessionSeconds(0);
                  // TODO: Optionally clear session on backend or mark cancelled
                }}
                className=" flex items-center gap-1 px-3 py-2 rounded-full bg-white/10 border border-white/20 text-sm"
              >
                <FiStopCircle /> Reset
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs text-white/60">Current session</p>
                <p className="text-5xl font-mono font-semibold mt-2">
                  {formatHMS(sessionSeconds)}
                </p>
                <p className="text-xs text-white/50 mt-2">
                  Active while you work on tasks. Integrate with desktop timer
                  for continuous tracking.
                </p>
                <div className="mt-7 flex gap-2">
                  <button
                    onClick={() => {
                      // TODO: Export session or push to backend
                      alert("Export Session (TODO)");
                    }}
                    className=" flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs"
                  >
                    <FiDownload /> Export
                  </button>
                  <button
                    onClick={() => {
                      // TODO: attach session to active task
                      alert("Attach to Task (TODO)");
                    }}
                    className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs"
                  >
                    Attach to Task
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <div className="rounded-2xl bg-white/5 p-3 h-full">
                <p className="text-xs text-white/60 mb-2">
                  Weekly Time (minutes)
                </p>
                <div className="h-32">
                  <Bar data={timeBarData} options={timeBarOptions} />
                </div>
                <p className="text-xs text-white/50 mt-2">
                  Total this week:
                  <span className="text-emerald-400 font-semibold">
                    {weekTimeData.reduce((a, b) => a + b, 0)} min
                  </span>
                </p>
                {/* TODO: hook weekly time data to analytics/time-tracking service */}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      {/* ------------------ LEVEL 3:  Progress & Focus Timeline ------------------ */}
      {/* <h2 className="text-xl font-semibold mb-4 text-white/90">
        Progress & Focus Timeline
      </h2> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Weekly Progress Timeline */}
        <div
          className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4"

        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-white/90">
                Weekly Progress Timeline
              </h3>
              <p className="text-xs text-white/60">Your task flow this week</p>
            </div>
            <div className="text-xs text-white/60">Updated daily</div>
          </div>
          <div className="relative h-48 overflow-y-auto pr-2 custom-scrollbar">
            {/* Timeline */}
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-400/80 via-blue-400/60 to-transparent"></div>
            <div className="space-y-5 pl-6">
              <div className="relative">
                <span className="absolute -left-3 top-1 w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>
                <p className="text-sm text-white/80 font-medium">
                  Completed{" "}
                  <span className="text-emerald-400">“UI Polish”</span>
                </p>
                <p className="text-xs text-white/60">
                  Tuesday • 3h focused work
                </p>
              </div>
              <div className="relative">
                <span className="absolute -left-3 top-1 w-2.5 h-2.5 bg-blue-400 rounded-full"></span>
                <p className="text-sm text-white/80 font-medium">
                  Working on
                  <span className="text-blue-400">“Task Sorting System”</span>
                </p>
                <p className="text-xs text-white/60">
                  Ongoing • Estimated 2h left
                </p>
              </div>
              <div className="relative">
                <span className="absolute -left-3 top-1 w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
                <p className="text-sm text-white/80 font-medium">
                  Next up:
                  <span className="text-yellow-400">“Quick Add Modal”</span>
                </p>
                <p className="text-xs text-white/60">Planned for Friday</p>
              </div>
              <div className="relative">
                <span className="absolute -left-3 top-1 w-2.5 h-2.5 bg-white/30 rounded-full"></span>
                <p className="text-sm text-white/80 font-medium">
                  Upcoming idea:
                  <span className="text-white/70">“Keyboard Shortcuts”</span>
                </p>
                <p className="text-xs text-white/60">
                  In backlog • not started
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Focus Streak & Next Focus */}
        <div
          className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-white/90">
                Focus Streak & Next Focus
              </h3>
              <p className="text-xs text-white/60">
                Your consistency and upcoming goals
              </p>
            </div>
            <span className="relative flex items-center gap-1 text-xs text-white/60">
              Live
              <span className="w-1 h-1 bg-red-400 rounded-full animate-pulse"></span>
            </span>
          </div>
          {/* Focus Streak */}
          <div className="mb-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/80">Current Streak</p>
              <span className="text-sm text-emerald-400 font-semibold">
                7 days 🔥
              </span>
            </div>
            <div className="mt-2 h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-7/12 bg-gradient-to-r from-emerald-400 via-blue-400 to-yellow-400 rounded-full"></div>
            </div>
            <p className="text-xs text-white/60 mt-1">
              Keep it up — consistency builds momentum.
            </p>
          </div>
          {/* Next Focus */}
          <div>
            <p className="text-sm text-white/80 mb-2">Next Focus Area</p>
            <div className="p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
              <p className="text-sm text-white/70">
                🎯 Improve Kanban drag performance
              </p>
              <p className="text-xs text-white/60 mt-1">
                Set a 2-hour focused block tomorrow morning
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* ------------------ LEVEL 4 & 5: Integrated Smart / AI & Integrations (merged) ------------------ */}
      <h2 className="text-xl font-semibold mb-4 text-white/90">
        Integrations & Smart Tools
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Integrations list */}
        <div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white/90">Connected Apps</h3>
            <p className="text-xs text-white/60">Sync & manage</p>
          </div>
          <div className="flex flex-col gap-3">
            {integrations.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-white/5 flex items-center justify-center text-white/80">
                    {it.icon}
                  </div>
                  <div>
                    <p className="text-sm text-white/90">{it.name}</p>
                    <p className="text-xs text-white/60">
                      {it.connected ? "Connected" : "Not connected"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-xs text-white/60 px-3 py-1 border border-white/10 rounded-full">
                    Settings
                  </button>
                  <button
                    className={`text-xs px-3 py-1 rounded-full ${
                      it.connected
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/20"
                        : "bg-white/10 border border-white/20 text-white/80"
                    }`}
                  >
                    {it.connected ? "Manage" : "Connect"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/50 mt-3">
            {/*TODO: Implement OAuth flows and webhook toggles per integration*/}
          </p>
        </div>

        {/* AI Features panel */}
        <div className="lg:col-span-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-white/90">AI Tools</h3>
              <p className="text-xs text-white/60">
                Smart automations to boost productivity
              </p>
            </div>
            <div className="text-xs text-white/60">Beta</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            {aiFeatures.map((f, i) => (
              <div
                key={i}
                className="rounded-lg p-3 bg-white/5 border border-white/10"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{f.icon}</div>
                    <div>
                      <p className="text-sm font-semibold text-white/90">
                        {f.name}
                      </p>
                      <p className="text-xs text-white/60">{f.desc}</p>
                    </div>
                  </div>
                  <div>
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={f.enabled}
                        readOnly
                        // TODO: wire toggle action to backend toggles endpoint
                        className="form-checkbox h-4 w-4 text-emerald-400 bg-transparent"
                      />
                    </label>
                  </div>
                </div>
                <p className="text-xs text-white/50 mt-2">
                  {/*TODO: Add per-feature settings and permission checks*/}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-2">
            <button className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm">
              Run Smart Suggestion
            </button>
            <button className="px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 text-sm">
              Apply Auto-Prioritization
            </button>
            <button className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm">
              View AI Logs
            </button>
          </div>

          <p className="text-xs text-white/50 mt-3">
            {/*TODO: Add AI request rate limits, privacy/legal notes, and server-side prompts storage*/}
          </p>
        </div>
      </div>
      {/* ------------------ Export / Reports area (compact) ------------------ */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-4 py-2 text-sm bg-white/10 border border-white/20 rounded-full text-white/80"
          onClick={() => {
            // TODO: replace this alert with real export call (generate CSV & download)
            alert("Export CSV (TODO)");
          }}
        >
          Export CSV
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-4 py-2 text-sm bg-white/10 border border-white/20 rounded-full text-white/80"
          onClick={() => {
            // TODO: enqueue weekly report generation (background job) & notify user
            alert("Generate Weekly Report (TODO)");
          }}
        >
          Generate Weekly Report
        </motion.button>

        <div className="text-xs text-white/60 ml-2">
          • Reports are generated server-side. Integrate with scheduled jobs
          (cron) and S3/Drive export storage.
        </div>
      </div>

    </motion.div>
  );
};

/* ----------------- Helper Components ----------------- */

/**
 * SummaryCard
 * - icon: react node
 * - title, value: strings / numbers
 * - color: tailwind color class for icon
 * - info: short helper text
 * - delta: optional percent change string
 * - critical: boolean to highlight
 */
const SummaryCard = ({
  icon,
  title,
  value,
  color = "text-white",
  info = "",
  delta = "",
  critical = false,
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 flex flex-col justify-between shadow-md ${
      critical ? "ring-1 ring-red-500/20" : ""
    }`}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className={`text-2xl ${color}`}>{icon}</div>
        <div>
          <p className="text-xs text-white/60">{title}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </div>
      {delta && (
        <p className="text-sm text-emerald-400 font-semibold">{delta}</p>
      )}
    </div>

    <div className="mt-3 text-xs text-white/50">{info}</div>
    {/* TODO: add small sparkline indicating trend in future (can use lightweight sparkline lib or mini Chart.js canvas) */}
  </motion.div>
);

/**
 * ProjectCard
 * props: name, progress (0-100), members (array), due (string)
 * - shows progress bar, avatars placeholder, due date
 */
const ProjectCard = ({
  name = "Project",
  progress = 20,
  members = [],
  due = "TBD",
}) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-4 shadow-md"
  >
    <div className="flex items-center justify-between mb-2">
      <h4 className="font-semibold text-white/90">{name}</h4>
      <div className="text-xs text-white/60">{due}</div>
    </div>
    <div className="w-full bg-white/10 rounded-full h-2 mb-3 overflow-hidden">
      <div className="h-2 bg-emerald-400" style={{ width: `${progress}%` }} />
    </div>
    <div className="flex items-center justify-between text-xs text-white/60">
      <div className="flex items-center -space-x-2">
        {/* TODO: replace initials with real avatars */}
        {members.map((m, i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-xs text-white/90 border border-white/10"
          >
            {m}
          </div>
        ))}
      </div>
      <div className="text-xs">{progress}%</div>
    </div>
    <p className="text-xs text-white/50 mt-3">
      {/*TODO: Link project card to detailed project view*/}
    </p>
  </motion.div>
);

export default MySpace;
