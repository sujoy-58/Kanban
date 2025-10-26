"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FiStar,
  FiMoreHorizontal,
  FiEdit2,
  FiImage,
  FiCheck,
  FiX,
  FiSearch,
  FiFilter,
  FiGrid,
  FiCalendar,
} from "react-icons/fi";
import { CiCalendar, CiAlignTop, CiSearch } from "react-icons/ci";
import { IoFilterOutline, IoCalendarOutline } from "react-icons/io5";
import Breadcrump from "./Breadcrump";
import { useProject } from "@/app/context/ProjectContext";

const HeaderSection = ({
  searchQuery = "",
  setSearchQuery,
  filterPriority = "All",
  setFilterPriority,
  filterType = "All",
  setFilterType,
}) => {
  const [activeTab, setActiveTab] = useState("kanban");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", description: "" });
  const [showCoverOptions, setShowCoverOptions] = useState(false);

  const {
    getCurrentProject,
    toggleFavorite,
    updateProject,
    setSelectedProject,
    getBreadcrumb,
    navigateToPage,
  } = useProject();

  const currentProject = getCurrentProject();
  const breadcrumb = getBreadcrumb();
  const coverOptionsRef = useRef(null);

  // Check if we're in a project context (not in main menu sections)
  const isInProjectContext = breadcrumb.project !== null;

  // Close cover options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        coverOptionsRef.current &&
        !coverOptionsRef.current.contains(event.target)
      ) {
        setShowCoverOptions(false);
      }
    };

    if (showCoverOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCoverOptions]);

  const handleEditStart = () => {
    setEditData({
      name: currentProject.name,
      description: currentProject.description,
    });
    setIsEditing(true);
  };

  const handleEditSave = () => {
    updateProject(currentProject.id, {
      name: editData.name,
      description: editData.description,
    });
    setSelectedProject(editData.name);
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditData({ name: "", description: "" });
  };

  const handleCoverChange = (color) => {
    updateProject(currentProject.id, { coverColor: color });
    setShowCoverOptions(false);
  };

  const coverColors = [
    { name: "Sky Blue", value: "from-sky-400/40 to-blue-600/20" },
    { name: "Pink Purple", value: "from-pink-400/40 to-purple-600/20" },
    { name: "Emerald", value: "from-green-400/40 to-emerald-600/20" },
    { name: "Orange Red", value: "from-orange-400/40 to-red-600/20" },
    { name: "Indigo Violet", value: "from-indigo-400/40 to-violet-600/20" },
    { name: "Teal Cyan", value: "from-teal-400/40 to-cyan-600/20" },
  ];

  return (
    <div className="w-[98%] flex flex-col gap-4 mb-4 ml-3">
      {/* Breadcrumb */}
      <Breadcrump /> 

      {/* Cover Section - Only show in project context */}
      {isInProjectContext && (
        <div
          className={`relative bg-gradient-to-r ${currentProject.coverColor} rounded-xl px-3 sm:px-4 py-8 sm:py-12 `}
        >
          {/* Cover Change Button */}
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
            <div className="relative">
              <button
                onClick={() => setShowCoverOptions(!showCoverOptions)}
                className="bg-white/20 backdrop-blur-md p-1.5 sm:p-2 rounded-lg border border-white/30 text-white hover:bg-white/30 transition"
              >
                <FiImage />
              </button>

              {showCoverOptions && (
                <div
                  ref={coverOptionsRef}
                  className="absolute top-10 sm:top-12 right-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-2 sm:p-3 shadow-xl z-50 min-w-[160px] sm:min-w-[200px]"
                >
                  <h4 className="text-white text-xs sm:text-sm font-semibold mb-2">
                    Choose Cover
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {coverColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleCoverChange(color.value)}
                        className={`p-1.5 sm:p-2 rounded-lg text-[10px] sm:text-xs text-white bg-gradient-to-r ${color.value} hover:scale-105 transition`}
                      >
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Edit Button */}
          <div className="absolute top-3 sm:top-4 right-14 sm:right-16">
            <button
              onClick={handleEditStart}
              className="bg-white/20 backdrop-blur-md p-1.5 sm:p-2 rounded-lg border border-white/30 text-white hover:bg-white/30 transition-all"
            >
              <FiEdit2 />
            </button>
          </div>

          <div className="absolute top-3 sm:top-4 right-24 sm:right-28">
            <button
              onClick={() => toggleFavorite(currentProject.id)}
              className={`text-base ${
                currentProject.isFavorite ? "text-yellow-400" : "text-white/70"
              } hover:text-yellow-300  bg-white/20 backdrop-blur-md p-1.5 sm:p-2 rounded-lg border border-white/30 text-white hover:bg-white/30 transition-all`}
            >
              <FiStar />
            </button>
          </div>

          {/* Project Title and Description */}
          {isEditing ? (
            <div className="space-y-2 sm:space-y-3 mt-4">
              <input
                type="text"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-lg px-3 sm:px-4 py-2 text-white text-2xl sm:text-4xl font-bold placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                placeholder="Project Name"
              />
              <textarea
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                className="w-full bg-white/20 backdrop-blur-md border border-white/30 rounded-lg px-3 sm:px-4 py-2 text-white/80 text-xs sm:text-sm placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none"
                placeholder="Project Description"
                rows={2}
              />
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={handleEditSave}
                  className="bg-white text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-white/90 transition flex items-center gap-1 sm:gap-2"
                >
                  <FiCheck /> Save
                </button>
                <button
                  onClick={handleEditCancel}
                  className="bg-white/20 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-white/30 transition flex items-center gap-1 sm:gap-2"
                >
                  <FiX /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl sm:text-4xl font-bold text-white">
                {currentProject.name}
              </h1>
              <p className="text-white/80 mt-1 text-xs sm:text-sm">
                {currentProject.description}
              </p>
            </>
          )}
        </div>
      )}

      {/* Tabs - Only show in project context */}
      {isInProjectContext && (
        <div className="flex items-center justify-between px-3 sm:px-4 border-b border-white/10 py-2">
          {/* Left side - Tabs */}
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-hide">
            <button
              className={`pb-2 transition text-xs sm:text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
                activeTab === "kanban"
                  ? "text-white border-b-2 border-white"
                  : "text-white/60 hover:text-white"
              }`}
              onClick={() => {
                setActiveTab("kanban");
                navigateToPage("Kanban");
              }}
            >
              <CiAlignTop className="text-base" />
              <span>Kanban</span>
            </button>
            <button
              className={`pb-2 transition text-xs sm:text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
                activeTab === "calendar"
                  ? "text-white border-b-2 border-white"
                  : "text-white/60 hover:text-white"
              }`}
              onClick={() => {
                setActiveTab("calendar");
                navigateToPage("Calendar");
              }}
            >
              <IoCalendarOutline className="text-base" />
              <span>Calendar</span>
            </button>
          </div>

          {/* Right side - Search and Filter Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Input */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 text-base z-10" />
              <input
                type="text"
                placeholder="Search cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-36 sm:w-44 bg-white/5 backdrop-blur-md border border-white/20 rounded-lg pl-9 pr-3 py-2 text-white text-xs sm:text-xs placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all"
              />
            </div>

            {/* Filter Section */}
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2">
              <FiFilter className="text-white/60 text-sm" />
              <div className="flex items-center gap-2">
                {/* Priority Filter */}
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
                >
                  <option value="All" className="text-black">
                    All Priority
                  </option>
                  <option value="Low" className="text-black">
                    Low
                  </option>
                  <option value="Medium" className="text-black">
                    Medium
                  </option>
                  <option value="High" className="text-black">
                    High
                  </option>
                </select>

                <div className="w-px h-4 bg-white/20"></div>

                {/* Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-transparent text-white text-xs focus:outline-none cursor-pointer"
                >
                  <option value="All" className="text-black">
                    All Types
                  </option>
                  <option value="Front-End" className="text-black">
                    Front-End
                  </option>
                  <option value="UI/UX" className="text-black">
                    UI/UX
                  </option>
                  <option value="Backend" className="text-black">
                    Backend
                  </option>
                  <option value="Daily Routine" className="text-black">
                    Daily
                  </option>
                  <option value="Research" className="text-black">
                    Research
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderSection;
