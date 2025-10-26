"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiBell,
  FiCalendar,
  FiSettings,
  FiPlus,
  FiChevronDown,
  FiChevronUp,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiChevronLeft,
  FiStar,
  FiFolder,
  FiGrid,
  FiTrash2,
} from "react-icons/fi";
import { SlSettings, SlQuestion } from "react-icons/sl";
import { MdOutlineTaskAlt } from "react-icons/md";
import { mainMenuConfig } from "../config/menuConfig";
import { useProject } from "../context/ProjectContext";

const Mainsidebar = () => {
  const {
    selectedProject,
    setSelectedProject,
    isSidebarOpen,
    setIsSidebarOpen,
    projects,
    toggleFavorite,
    getCurrentProject,
    navigateToSection,
    navigateToPage,
    deleteProject,
  } = useProject();

  const [showPages, setShowPages] = useState(true);
  const [showFavorites, setShowFavorites] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const mainMenu = mainMenuConfig.map((item) => ({
    ...item,
    icon:
      item.name === "My Space" ? (
        <FiGrid />
      ) : item.name === "Notification" ? (
        <FiBell />
      ) : item.name === "Calendar" ? (
        <FiCalendar />
      ) : item.name === "Settings" ? (
        <SlSettings />
      ) : item.name === "Support" ? (
        <SlQuestion />
      ) : (
        <SlQuestion />
      ),
  }));

  const favoriteProjects = projects.filter((project) => project.isFavorite);

  return (
    <>
      {/* Invisible scrollbar utility */}
      <style>{`
        .no-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>

      <motion.aside
        layout
        animate={{ width: isExpanded ? 220 : 64 }}
        transition={{ type: "spring", stiffness: 180, damping: 24 }}
        className="fixed top-0 left-0 h-full z-40 bg-white/10 backdrop-blur-xl border-r border-white/20 shadow-xl flex flex-col overflow-hidden cursor-pointer"
        onClick={(e) => {
          // Only toggle if the empty space of the sidebar is clicked
          if (e.target === e.currentTarget) {
            setIsExpanded(!isExpanded);
          }
        }}
      >
        {/* 🧭 Make entire sidebar scrollable with invisible scrollbar */}
        <div>
          {/* ================= HEADER ================= */}
          <div
            className={`flex items-center ${
              isExpanded ? "justify-between" : "justify-center"
            } p-3 border-b border-white/10`}
          >
            <AnimatePresence>
              {!isExpanded && (
                <div className="h-8 w-8 rounded-lg border border-white/50 bg-transparent flex items-center justify-center text-white font-bold">
                  <MdOutlineTaskAlt />
                </div>
              )}
              {isExpanded && (
                <motion.div
                  key="sidebar-header"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="flex items-center gap-2"
                >
                  {/* <div className="h-8 w-8 rounded-lg border border-white/50 bg-transparent flex items-center justify-center text-white font-bold">
                    Qd
                  </div> */}
                  <div>
                    <h2 className="text-white/80 font-semibold text-lg">
                      QUICK.DO
                    </h2>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ================= MAIN MENU ================= */}
          <div
            className={`flex-1 ${isExpanded ? "p-4" : "p-2"} ${
              isExpanded ? "space-y-2" : "space-y-1"
            }`}
          >
            {/* MAIN MENU */}
            <div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.h3
                    key="main-menu-title"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="text-[12px] text-white/60 mb-2 font-medium"
                  >
                    MAIN MENU
                  </motion.h3>
                )}
              </AnimatePresence>

              <div className="space-y-0">
                {mainMenu.map((item) => (
                  <div
                    key={item.name}
                    className="relative group"
                    title={item.name}
                  >
                    <button
                      className={`w-full flex items-center ${
                        isExpanded
                          ? "gap-2 px-3 py-2"
                          : "justify-center px-2 py-3"
                      } hover:bg-white/10 rounded-lg cursor-pointer transition text-white/80 hover:text-white duration-200`}
                      onClick={() => {
                        navigateToSection(item.section);
                        navigateToPage(item.page);
                      }}
                    >
                      <span className="text-lg">{item.icon}</span>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="flex items-center justify-between w-full"
                          >
                            <span className="text-sm">{item.name}</span>
                            {item.badge && (
                              <span className="text-[10px] bg-violet-500 text-white px-2 py-[2px] rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div
              className={`${
                isExpanded ? "mx-4 mt-4" : "mx-2 mt-2 mb-2"
              } border-t border-white/10`}
            />

            {/* ================= FAVORITES ================= */}
            {favoriteProjects.length > 0 && (
              <div className={`${isExpanded ? "mt-6" : "mt-2"}`}>
                <div
                  className={`flex items-center ${
                    isExpanded ? "gap-3" : "justify-center"
                  } cursor-pointer mb-2`}
                  onClick={() => {
                    setShowFavorites(!showFavorites);
                    navigateToSection("Favorites");
                  }}
                >
                  {!isExpanded && (
                    <FiStar className="text-yellow-400 text-lg" />
                  )}
                  {isExpanded && (
                    <motion.div
                      key="favorites-title"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="flex items-center justify-between w-full"
                    >
                      <h3 className="text-[12px] text-white/60 font-medium">
                        FAVORITES
                      </h3>
                      {showFavorites ? (
                        <FiChevronUp className="text-white/60" />
                      ) : (
                        <FiChevronDown className="text-white/60" />
                      )}
                    </motion.div>
                  )}
                </div>

                <AnimatePresence>
                  {showFavorites && isExpanded && (
                    <motion.div
                      key="favorites-list"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="flex flex-col gap-1 overflow-y-auto max-h-28 no-scrollbar"
                    >
                      {favoriteProjects.map((project) => {
                        const isActive = selectedProject === project.name;
                        return (
                          <div
                            key={project.id}
                            onClick={() => {
                              setSelectedProject(project.name);
                              navigateToSection("My Projects");
                            }}
                            className={`flex items-center justify-between group px-2 py-2 rounded-md cursor-pointer transition ${
                              isActive
                                ? "bg-white text-black/80 font-semibold"
                                : "text-white/80 hover:bg-white/10"
                            } duration-200`}
                          >
                            {/* 🔧 Reserve space for delete button */}
                            <div className="flex items-center gap-3 flex-1 min-w-0 pr-5">
                              <div className="h-6 min-w-6 border border-white/50 rounded-lg flex items-center justify-center text-xs font-bold text-white">
                                ⭐
                              </div>
                              <span className="text-sm truncate">
                                {project.name}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteProject(project.id);
                              }}
                              className={`opacity-0 group-hover:opacity-100 ${
                                isActive
                                  ? "text-black/50 hover:text-red-600"
                                  : "text-white/60 hover:text-red-400"
                              } transition shrink-0`}
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Divider */}
            <div
              className={`${
                isExpanded ? "mx-4 mt-4" : "mx-2"
              } border-t border-white/10`}
            />

            {/* ================= MY PROJECTS ================= */}
            <div className={`${isExpanded ? "mt-6" : "mt-2"}`}>
              <div
                className={`flex items-center ${
                  isExpanded ? "gap-3" : "justify-center"
                } cursor-pointer mb-2`}
                onClick={() => {
                  setShowPages(!showPages);
                  navigateToSection("My Projects");
                }}
              >
                {!isExpanded && <FiFolder className="text-blue-400 text-lg" />}
                {isExpanded && (
                  <motion.div
                    key="projects-title"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex items-center justify-between w-full"
                  >
                    <h3 className="text-[12px] text-white/60 font-medium">
                      MY PROJECTS
                    </h3>
                    {showPages ? (
                      <FiChevronUp className="text-white/60" />
                    ) : (
                      <FiChevronDown className="text-white/60" />
                    )}
                  </motion.div>
                )}
              </div>

              <AnimatePresence>
                {showPages && isExpanded && (
                  <motion.div
                    key="projects-list"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex flex-col gap-1 overflow-y-auto max-h-28 no-scrollbar"
                  >
                    {projects.map((project) => {
                      const isActive = selectedProject === project.name;
                      const projectColors = {
                        1: "bg-blue-500",
                        2: "bg-pink-500",
                        3: "bg-green-500",
                      };

                      return (
                        <div
                          key={project.id}
                          onClick={() => {
                            setSelectedProject(project.name);
                            navigateToSection("My Projects");
                          }}
                          className={`flex items-center justify-between group px-2 py-2 rounded-md cursor-pointer transition ${
                            isActive
                              ? "bg-white text-black/80 font-semibold"
                              : "text-white/80 hover:bg-white/10"
                          } duration-200`}
                        >
                          {/* 🔧 Reserve right padding so delete button never overlaps */}
                          <div className="flex items-center gap-3 flex-1 min-w-0 pr-5">
                            <div
                              className={`h-6 min-w-6 ${
                                projectColors[project.id] || "bg-gray-500"
                              } rounded-lg flex items-center justify-center text-xs font-bold text-white`}
                            >
                              {project.name.charAt(0)}
                            </div>
                            <span className="text-sm truncate">
                              {project.name}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteProject(project.id);
                            }}
                            className={`opacity-0 group-hover:opacity-100 ${
                              isActive
                                ? "text-black/50 hover:text-red-600"
                                : "text-white/60 hover:text-red-400"
                            } transition shrink-0`}
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Add new project */}
              <div
                className={`mt-2 flex items-center ${
                  isExpanded ? "gap-3 px-3 py-2" : "justify-center px-2 py-3"
                } text-white/70 hover:bg-white/10 rounded-lg cursor-pointer transition duration-200`}
              >
                <FiPlus className="text-lg" />
                {isExpanded && (
                  <motion.span
                    key="create-new"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="text-sm"
                  >
                    Create New
                  </motion.span>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* ================= FOOTER ================= */}
        <div
          className={`flex items-center ${
            isExpanded ? "justify-between" : "justify-center"
          } p-2 border-t border-white/10 mt-auto`} // <-- added mt-auto
        >
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                key="sidebar-header"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="flex items-center gap-2"
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <h2 className="text-white font-semibold text-sm">
                    Manageko.
                  </h2>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-transparent  p-2 rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? <FiChevronLeft /> : <FiChevronRight />}
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};

export default Mainsidebar;
