import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFolder, FiPlus, FiSettings, FiX, FiCheck } from "react-icons/fi";

const WorkspaceManager = ({ activeWorkspace, setActiveWorkspace }) => {
  const [showWorkspaces, setShowWorkspaces] = useState(false);
  const [workspaces, setWorkspaces] = useState([
    { id: 'default', name: 'Default Workspace', color: 'bg-blue-500' },
    { id: 'work', name: 'Work Projects', color: 'bg-green-500' },
    { id: 'personal', name: 'Personal Tasks', color: 'bg-purple-500' },
  ]);

  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Load workspaces from localStorage on mount
  useEffect(() => {
    const savedWorkspaces = localStorage.getItem('kanban-workspaces');
    if (savedWorkspaces) {
      setWorkspaces(JSON.parse(savedWorkspaces));
    }
  }, []);

  // Save workspaces to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('kanban-workspaces', JSON.stringify(workspaces));
  }, [workspaces]);

  // Load active workspace from localStorage
  useEffect(() => {
    const savedActive = localStorage.getItem('kanban-active-workspace');
    if (savedActive && workspaces.some(w => w.id === savedActive)) {
      setActiveWorkspace(savedActive);
    }
  }, [workspaces, setActiveWorkspace]);

  // Save active workspace to localStorage
  useEffect(() => {
    localStorage.setItem('kanban-active-workspace', activeWorkspace);
  }, [activeWorkspace]);

  const addWorkspace = () => {
    if (!newWorkspaceName.trim()) return;
    
    const newWorkspace = {
      id: `workspace-${Date.now()}`,
      name: newWorkspaceName.trim(),
      color: 'bg-gray-500'
    };
    
    setWorkspaces(prev => [...prev, newWorkspace]);
    setNewWorkspaceName('');
    setIsCreating(false);
    setActiveWorkspace(newWorkspace.id);
  };

  const deleteWorkspace = (workspaceId, e) => {
    e.stopPropagation();
    if (workspaceId === 'default' || workspaceId === 'work' || workspaceId === 'personal') {
      alert('Default workspaces cannot be deleted.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this workspace?')) {
      setWorkspaces(prev => prev.filter(w => w.id !== workspaceId));
      if (activeWorkspace === workspaceId) {
        setActiveWorkspace('default');
      }
    }
  };

  const getCurrentWorkspace = () => {
    return workspaces.find(w => w.id === activeWorkspace) || workspaces[0];
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowWorkspaces(!showWorkspaces)}
        className="flex items-center gap-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors group"
      >
        <div className={`w-3 h-3 rounded-full ${getCurrentWorkspace().color} group-hover:scale-110 transition-transform`}></div>
        <span className="max-w-32 truncate text-sm">
          {getCurrentWorkspace().name}
        </span>
        <motion.div
          animate={{ rotate: showWorkspaces ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/60"
        >
          ▼
        </motion.div>
      </button>

      <AnimatePresence>
        {showWorkspaces && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-30" 
              onClick={() => setShowWorkspaces(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full right-0 mt-2 w-80 bg-gray-800 border border-white/10 rounded-lg shadow-xl z-40"
            >
 

              {/* Workspace List */}
              <div className="max-h-60 overflow-y-auto">
                {workspaces.map(workspace => (
                  <button
                    key={workspace.id}
                    onClick={() => {
                      setActiveWorkspace(workspace.id);
                      setShowWorkspaces(false);
                    }}
                    className={`w-full p-3 flex items-center gap-3 text-left transition-colors group ${
                      activeWorkspace === workspace.id 
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'hover:bg-white/5 text-white/80'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${workspace.color}`}></div>
                    <span className="flex-1 truncate text-sm">{workspace.name}</span>
                    
                    {activeWorkspace === workspace.id ? (
                      <FiCheck className="text-blue-400 flex-shrink-0" size={14} />
                    ) : (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(workspace.id === 'default' || workspace.id === 'work' || workspace.id === 'personal') ? (
                          <span className="text-xs text-white/30 px-1.5 py-0.5 bg-white/5 rounded">Default</span>
                        ) : (
                          <button
                            onClick={(e) => deleteWorkspace(workspace.id, e)}
                            className="p-1 hover:bg-red-500/20 rounded text-white/40 hover:text-red-400 transition-colors"
                            title="Delete workspace"
                          >
                            <FiX size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Add Workspace */}
              <div className="p-3 border-t border-white/10">
                {isCreating ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Enter workspace name..."
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addWorkspace()}
                      className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-blue-400"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={addWorkspace}
                        disabled={!newWorkspaceName.trim()}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed text-white px-3 py-2 rounded text-sm transition-colors"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => {
                          setIsCreating(false);
                          setNewWorkspaceName('');
                        }}
                        className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsCreating(true)}
                    className="w-full flex items-center gap-2 justify-center p-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded text-sm transition-colors"
                  >
                    <FiPlus size={14} />
                    Create New Workspace
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkspaceManager;