import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch, FiX, FiPlus, FiTrash2, FiArchive, FiClock, FiFilter,
  FiBarChart2, FiSettings, FiUser, FiCalendar, FiList
} from "react-icons/fi";

const CommandPalette = ({ onClose, cards, setCards, activeWorkspace }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCommands, setFilteredCommands] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // ✅ These commands now only serve as UI entries (shortcuts + descriptions)
  const commands = [
    {
      category: "Tasks",
      items: [
        {
          id: 'add-todo',
          title: 'Add New Task',
          description: 'Create a new task in TODO column',
          icon: FiPlus,
          shortcut: 'A',
          action: () => {
            const newCard = {
              id: `card-${Date.now()}`,
              column: 'todo',
              title: 'New Task',
              description: '',
              priority: 'Medium',
              type: 'Front-End',
              date: new Date().toISOString().split('T')[0],
              deadline: '',
              comments: [],
              links: [],
              attachments: [],
              assignees: [],
              timer: { isRunning: false, startTime: null, totalTime: 0 },
              checklists: [],
              createdAt: new Date().toISOString(),
            };
            setCards(prev => [...prev, newCard]);
            onClose();
          }
        },
        {
          id: 'add-backlog',
          title: 'Add to Backlog',
          description: 'Create a new task in Backlog',
          icon: FiList,
          shortcut: 'B',
          action: () => {
            const newCard = {
              id: `card-${Date.now()}`,
              column: 'backlog',
              title: 'Backlog Task',
              description: '',
              priority: 'Low',
              type: 'Research',
              date: new Date().toISOString().split('T')[0],
              deadline: '',
              comments: [],
              links: [],
              attachments: [],
              assignees: [],
              timer: { isRunning: false, startTime: null, totalTime: 0 },
              checklists: [],
              createdAt: new Date().toISOString(),
            };
            setCards(prev => [...prev, newCard]);
            onClose();
          }
        },
      ]
    },
    {
      category: "Actions",
      items: [
        {
          id: 'clear-completed',
          title: 'Clear Completed Tasks',
          description: 'Remove all tasks from Done column',
          icon: FiTrash2,
          shortcut: 'X',
          action: () => {
            if (window.confirm('Are you sure you want to clear all completed tasks?')) {
              setCards(prev => prev.filter(card => card.column !== 'done'));
            }
            onClose();
          }
        },
        {
          id: 'archive-old',
          title: 'Archive Old Tasks',
          description: 'Move tasks older than 30 days to archive',
          icon: FiArchive,
          shortcut: 'O',
          action: () => {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const oldTasks = cards.filter(card => 
              new Date(card.createdAt) < thirtyDaysAgo && card.column === 'done'
            );
            
            if (oldTasks.length === 0) {
              alert('No old tasks found to archive.');
            } else {
              setCards(prev => prev.map(card => {
                if (new Date(card.createdAt) < thirtyDaysAgo && card.column === 'done') {
                  return { ...card, column: 'backlog' };
                }
                return card;
              }));
              alert(`Archived ${oldTasks.length} old tasks.`);
            }
            onClose();
          }
        },
        {
          id: 'move-overdue',
          title: 'Move Overdue Tasks',
          description: 'Move overdue tasks to backlog',
          icon: FiCalendar,
          shortcut: 'M',
          action: () => {
            const today = new Date().toISOString().split('T')[0];
            const overdueTasks = cards.filter(card => 
              card.deadline && card.deadline < today && card.column !== 'backlog' && card.column !== 'done'
            );
            
            if (overdueTasks.length === 0) {
              alert('No overdue tasks found.');
            } else {
              setCards(prev => prev.map(card => {
                if (card.deadline && card.deadline < today && card.column !== 'backlog' && card.column !== 'done') {
                  return { ...card, column: 'backlog' };
                }
                return card;
              }));
              alert(`Moved ${overdueTasks.length} overdue tasks to backlog.`);
            }
            onClose();
          }
        },
      ]
    },
    {
      category: "Workspace",
      items: [
        {
          id: 'current-workspace',
          title: 'Current Workspace',
          description: `Active: ${activeWorkspace}`,
          icon: FiUser,
          shortcut: 'W',
          action: () => {
            alert(`Current workspace: ${activeWorkspace}`);
            onClose();
          }
        },
        {
          id: 'workspace-stats',
          title: 'Workspace Statistics',
          description: 'Show current workspace analytics',
          icon: FiBarChart2,
          shortcut: 'S',
          action: () => {
            const workspaceCards = cards;
            const stats = {
              total: workspaceCards.length,
              todo: workspaceCards.filter(c => c.column === 'todo').length,
              progress: workspaceCards.filter(c => c.column === 'doing').length,
              done: workspaceCards.filter(c => c.column === 'done').length,
              backlog: workspaceCards.filter(c => c.column === 'backlog').length,
            };
            
            alert(`Workspace Stats:\nTotal: ${stats.total}\nTODO: ${stats.todo}\nProgress: ${stats.progress}\nDone: ${stats.done}\nBacklog: ${stats.backlog}`);
            onClose();
          }
        },
      ]
    },
    {
      category: "Quick Actions",
      items: [
        {
          id: 'start-pomodoro',
          title: 'Start Pomodoro Timer',
          description: 'Start a 25-minute focus session',
          icon: FiClock,
          shortcut: 'P',
          action: () => {
            alert('Starting 25-minute Pomodoro session! 🍅');
            onClose();
          }
        },
        {
          id: 'filter-high-priority',
          title: 'Filter High Priority',
          description: 'Show only high priority tasks',
          icon: FiFilter,
          shortcut: 'H',
          action: () => {
            alert('Filtering high priority tasks...');
            onClose();
          }
        },
      ]
    }
  ];

  // Flatten + filter commands
  const allCommands = commands.flatMap(group =>
    group.items.map(item => ({ ...item, category: group.category }))
  );

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = allCommands.filter(cmd =>
        cmd.title.toLowerCase().includes(query) ||
        cmd.description.toLowerCase().includes(query) ||
        cmd.category.toLowerCase().includes(query)
      );
      setFilteredCommands(filtered);
    } else {
      setFilteredCommands(allCommands);
    }
    setSelectedIndex(0);
  }, [searchQuery]);

  // Keyboard nav (only for palette)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement === inputRef.current && e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        return;
      }

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(prev => prev < filteredCommands.length - 1 ? prev + 1 : 0);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : filteredCommands.length - 1);
          break;
        case "Enter":
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filteredCommands, selectedIndex]);

  // Group filtered results
  const groupedCommands = commands.map(group => ({
    ...group,
    items: group.items.filter(item => filteredCommands.some(cmd => cmd.id === item.id))
  })).filter(group => group.items.length > 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: -20 }}
          className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 border border-white/10 max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <FiSearch className="text-white/60 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
              autoFocus
            />
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white p-1 transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Commands List */}
          <div className="flex-1 overflow-y-auto">
            {groupedCommands.map((group, groupIndex) => (
              <div key={group.category} className="border-b border-white/5 last:border-b-0">
                <div className="px-4 py-2">
                  <span className="text-xs font-medium text-white/40 uppercase tracking-wider">
                    {group.category}
                  </span>
                </div>
                {group.items.map((command, itemIndex) => {
                  const Icon = command.icon;
                  const flatIndex = groupedCommands
                    .slice(0, groupIndex)
                    .reduce((acc, g) => acc + g.items.length, 0) + itemIndex;
                  const isSelected = flatIndex === selectedIndex;

                  return (
                    <motion.button
                      key={command.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: flatIndex * 0.02 }}
                      onClick={command.action}
                      className={`w-full p-3 flex items-center gap-3 transition-colors text-left group ${
                        isSelected
                          ? "bg-blue-500/20 border-blue-500/30"
                          : "hover:bg-white/5"
                      }`}
                      onMouseEnter={() => setSelectedIndex(flatIndex)}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${
                        isSelected
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-white/10 text-white/80 group-hover:bg-white/15"
                      }`}>
                        <Icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-medium text-sm truncate">
                          {command.title}
                        </div>
                        <div className="text-white/60 text-xs truncate">
                          {command.description}
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded transition-colors ${
                        isSelected
                          ? "bg-blue-500 text-white"
                          : "bg-white/10 text-white/40 group-hover:bg-white/15"
                      }`}>
                        {command.shortcut}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ))}

            {filteredCommands.length === 0 && (
              <div className="p-8 text-center text-white/60">
                <FiSearch className="mx-auto mb-2 text-2xl opacity-40" />
                <div>No commands found for `{searchQuery}`</div>
                <div className="text-xs mt-1">Try different keywords</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/10">
            <div className="flex justify-between items-center text-xs text-white/40">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">↵</kbd> Select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">A,B,X...</kbd> Shortcuts
                </span>
              </div>
              <div className="text-white/30">
                {filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CommandPalette;
