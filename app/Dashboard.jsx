"use client";

import React, { useState } from "react";
import Mainsidebar from "./Components/Mainsidebar";
import HeaderSection from "./Components/HeaderSection";
import Kanban from "./Components/Kanban";
import Calendar from "./Components/Calendar";
import { useProject } from "./context/ProjectContext";
import MySpace from "./Components/MySpace/page";

const Dashboard = () => {
  const { 
    currentSection, 
    currentPage, 
    selectedProject, 
    getCurrentProjectData, 
    updateProjectCards,
    updateColumnTitles,
    isClient
  } = useProject();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Get project-specific data
  // TODO: When implementing backend, replace with API calls:
  // const [columnTitles, setColumnTitles] = useState({});
  // const [cards, setCards] = useState([]);
  // const [loading, setLoading] = useState(true);
  //
  // useEffect(() => {
  //   const loadProjectData = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch(`/api/projects/${selectedProject}/kanban-data`);
  //       const data = await response.json();
  //       setColumnTitles(data.columnTitles || defaultColumnTitles);
  //       setCards(data.cards || []);
  //     } catch (error) {
  //       console.error('Error loading project data:', error);
  //       setColumnTitles(defaultColumnTitles);
  //       setCards([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   loadProjectData();
  // }, [selectedProject]);
  
  // Initialize with default values to prevent hydration issues
  const [columnTitles, setColumnTitles] = useState({});
  const [cards, setCards] = useState([]);
  
  // Load project data when client-side and project changes
  React.useEffect(() => {
    if (isClient) {
      const projectData = getCurrentProjectData();
      setColumnTitles(projectData.columnTitles);
      setCards(projectData.cards);
    }
  }, [isClient, selectedProject, getCurrentProjectData]);

  // Sync cards with ProjectContext when they change
  const handleCardsChange = (newCards) => {
    setCards(newCards);
    updateProjectCards(selectedProject, newCards);
  };

  // Sync column titles with ProjectContext when they change
  const handleColumnTitlesChange = (newColumnTitles) => {
    setColumnTitles(newColumnTitles);
    updateColumnTitles(selectedProject, newColumnTitles);
  };

  // Shared state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ⛓️ Detect if this is a system-level section (no HeaderSection)
  const isSystemPage = [
    "My Space",
    "Notifications",
    "Settings",
    "Support",
    "Calendar",
  ].includes(currentSection);

  // 🧩 Content Renderer
  const renderContent = () => {
    // ===== System Pages (replace with actual components later) =====
    if (currentSection === "My Space") {
      return (
        <MySpace />
      );
    }

    if (currentSection === "Notifications") {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-white/70">
          <h2 className="text-3xl font-semibold mb-2">Notifications</h2>
          <p className="text-base text-white/60">
            Notification center coming soon...
          </p>
        </div>
      );
    }

    if (currentSection === "Settings") {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-white/70">
          <h2 className="text-3xl font-semibold mb-2">Settings</h2>
          <p className="text-base text-white/60">Settings page coming soon...</p>
        </div>
      );
    }

    if (currentSection === "Support") {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-white/70">
          <h2 className="text-3xl font-semibold mb-2">Help & Support</h2>
          <p className="text-base text-white/60">
            Help & Support center coming soon...
          </p>
        </div>
      );
    }

    if (currentSection === "Calendar") {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-white/70">
          <h2 className="text-3xl font-semibold mb-2">Calendar</h2>
          <p className="text-base text-white/60">Calendar view coming soon...</p>
        </div>
      );
    }

    // ===== Project Pages (with HeaderSection visible) =====
    if (currentSection === "My Projects") {
      if (currentPage === "Kanban") {
        return (
          <Kanban
            searchQuery={debouncedSearchQuery}
            filterPriority={filterPriority}
            filterType={filterType}
            cards={cards}
            setCards={handleCardsChange}
            columnTitles={columnTitles}
            setColumnTitles={handleColumnTitlesChange}
          />
        );
      }
      if (currentPage === "Calendar") {
        return (
          <Calendar
            searchQuery={debouncedSearchQuery}
            filterPriority={filterPriority}
            filterType={filterType}
            cards={cards}
            setCards={handleCardsChange}
          />
        );
      }
    }

    // ===== Default fallback =====
    return (
      <Kanban
        searchQuery={debouncedSearchQuery}
        filterPriority={filterPriority}
        filterType={filterType}
        cards={cards}
        setCards={handleCardsChange}

      />
    );
  };

  // ===== Layout =====
  return (
    <div className="flex bg-[#0f0f0f] text-white min-h-screen overflow-hidden">
      <Mainsidebar onExpansionChange={setIsSidebarExpanded} />

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarExpanded ? "ml-64" : "ml-16"
        }`}
      >
        {/* 🧭 HeaderSection only for project pages */}
        {!isSystemPage && (
          <HeaderSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            filterType={filterType}
            setFilterType={setFilterType}
          />
        )}

        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
