"use client";

import React, { createContext, useContext, useState } from "react";
// import { mainMenu } from "../Components/Mainsidebar";
import { mainMenuConfig } from "../config/menuConfig";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState("Craftboard Project");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [currentSection, setCurrentSection] = useState("Workspace");
  const [currentPage, setCurrentPage] = useState("Kanban");

  // Default column structure
  const defaultColumnTitles = {
    backlog: "Backlog",
    todo: "TODO",
    doing: "In Progress",
    done: "Completed",
  };

  // Dummy projects for now (replace with backend fetch later)
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Craftboard Project",
      description: "Streamline Operations with Dynamic Dashboard Solutions",
      isFavorite: false,
      coverColor: "from-sky-400/60 to-blue-600/40",
    },
    {
      id: 2,
      name: "Marketing Dashboard",
      description: "Track and analyze marketing performance",
      isFavorite: false,
      coverColor: "from-pink-400/60 to-purple-600/40",
    },
    {
      id: 3,
      name: "Finance Flow",
      description: "Manage financial operations efficiently",
      isFavorite: false,
      coverColor: "from-green-400/60 to-emerald-600/40",
    },
  ]);

  const toggleFavorite = (projectId) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? { ...project, isFavorite: !project.isFavorite }
          : project
      )
    );
  };

  const updateProject = (projectId, updates) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId ? { ...project, ...updates } : project
      )
    );
  };

  const getCurrentProject = () =>
    projects.find((p) => p.name === selectedProject) || projects[0];

  const navigateToSection = (section) => setCurrentSection(section);
  const navigateToPage = (page) => setCurrentPage(page);

  // Generate breadcrumb based on current path

const systemSections = mainMenuConfig.map(item => item.section.toLowerCase());

const getBreadcrumb = (pathname) => {
  if (!pathname) return [];

  const segments = pathname.split("/").filter(Boolean);
  const currentProjectObj = projects.find((p) => p.name === selectedProject);

  let breadcrumbs = [];

  // ===== System Pages =====
  if (segments.length > 0 && systemSections.includes(segments[0])) {
    let pathAccumulator = "";
    breadcrumbs = segments.map((seg, idx) => {
      pathAccumulator += `/${seg}`;
      return {
        label: seg
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()), // Capitalize nicely
        path: pathAccumulator,
        clickable: idx !== segments.length - 1, // all clickable except last
      };
    });
  } 
  // ===== Project Pages =====
  else if (currentProjectObj) {
    const sectionLabel = currentProjectObj.isFavorite ? "Favourite" : "Workspace";

    let pathAccumulator = "";
    breadcrumbs = [
      {
        label: sectionLabel,
        path: `/${segments[0]}`,
        clickable: true, // only section clickable
      },
      {
        label: selectedProject,
        path: `/${segments[0]}/${selectedProject}`,
        clickable: false, // project name unclicable
      },
      ...segments.slice(1).map((seg) => {
        pathAccumulator += `/${seg}`;
        return {
          label: seg
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          path: `/${segments[0]}/${selectedProject}${pathAccumulator}`,
          clickable: false, // page name unclicable
        };
      }),
    ];
  } 
  // ===== Fallback =====
  else {
    let pathAccumulator = "";
    breadcrumbs = segments.map((seg, idx) => {
      pathAccumulator += `/${seg}`;
      return {
        label: seg
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        path: pathAccumulator,
        clickable: idx !== segments.length - 1,
      };
    });
  }

  return breadcrumbs;
};




  // Placeholder Kanban data — backend will handle later
  const getProjectData = () => ({
    columnTitles: { ...defaultColumnTitles },
    cards: [],
  });

  const updateProjectData = () => {};
  const updateColumnTitles = () => {};
  const updateProjectCards = () => {};

  const getCurrentProjectData = () => getProjectData(selectedProject);

  return (
    <ProjectContext.Provider
      value={{
        selectedProject,
        setSelectedProject,
        isSidebarOpen,
        setIsSidebarOpen,
        favorites,
        projects,
        toggleFavorite,
        updateProject,
        getCurrentProject,
        currentSection,
        currentPage,
        navigateToSection,
        navigateToPage,
        getBreadcrumb,
        getProjectData,
        updateProjectData,
        updateColumnTitles,
        updateProjectCards,
        getCurrentProjectData,
        defaultColumnTitles,
        isClient: true,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
