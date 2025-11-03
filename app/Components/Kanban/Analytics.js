import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { FiX, FiTrendingUp, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const Analytics = ({ onClose, cards }) => {
  const analytics = useMemo(() => {
    if (!cards.length) return null;

    const totalTasks = cards.length;
    const completedTasks = cards.filter(card => card.column === 'done').length;
    const inProgressTasks = cards.filter(card => card.column === 'doing').length;
    const backlogTasks = cards.filter(card => card.column === 'backlog').length;
    
    // Priority distribution
    const priorityCounts = cards.reduce((acc, card) => {
      acc[card.priority] = (acc[card.priority] || 0) + 1;
      return acc;
    }, {});

    // Type distribution
    const typeCounts = cards.reduce((acc, card) => {
      acc[card.type] = (acc[card.type] || 0) + 1;
      return acc;
    }, {});

    // Cycle time (simplified)
    const completedCards = cards.filter(card => card.column === 'done');
    const avgCycleTime = completedCards.length > 0 
      ? completedCards.reduce((sum, card) => {
          const created = new Date(card.createdAt || card.date);
          const now = new Date();
          return sum + (now - created) / (1000 * 60 * 60 * 24); // days
        }, 0) / completedCards.length
      : 0;

    // Overdue tasks
    const today = new Date().toISOString().split('T')[0];
    const overdueTasks = cards.filter(card => 
      card.deadline && card.deadline < today && card.column !== 'done'
    ).length;

    // Time tracking
    const totalTimeTracked = cards.reduce((sum, card) => 
      sum + (card.timer?.totalTime || 0), 0
    );

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      backlogTasks,
      completionRate: (completedTasks / totalTasks) * 100,
      priorityCounts,
      typeCounts,
      avgCycleTime: avgCycleTime.toFixed(1),
      overdueTasks,
      totalTimeTracked
    };
  }, [cards]);

  if (!analytics) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center text-white/60">
            No data available for analytics
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <FiTrendingUp className="text-2xl text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Task Analytics</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-2"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-white/60 text-sm">Total Tasks</span>
              </div>
              <div className="text-2xl font-bold text-white">{analytics.totalTasks}</div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-white/60 text-sm">Completed</span>
              </div>
              <div className="text-2xl font-bold text-white">{analytics.completedTasks}</div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <FiClock className="text-yellow-400" />
                <span className="text-white/60 text-sm">In Progress</span>
              </div>
              <div className="text-2xl font-bold text-white">{analytics.inProgressTasks}</div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <FiAlertCircle className="text-red-400" />
                <span className="text-white/60 text-sm">Overdue</span>
              </div>
              <div className="text-2xl font-bold text-white">{analytics.overdueTasks}</div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Completion Rate */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">Completion Rate</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/10 rounded-full h-3">
                  <div 
                    className="bg-green-400 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${analytics.completionRate}%` }}
                  ></div>
                </div>
                <span className="text-white font-bold">{analytics.completionRate.toFixed(1)}%</span>
              </div>
            </div>

            {/* Time Tracked */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">Total Time Tracked</h3>
              <div className="flex items-center gap-3">
                <FiClock className="text-blue-400" />
                <span className="text-white font-bold text-xl">
                  {formatTime(analytics.totalTimeTracked)}
                </span>
              </div>
            </div>
          </div>

          {/* Distribution Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Priority Distribution */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-4">Priority Distribution</h3>
              <div className="space-y-3">
                {Object.entries(analytics.priorityCounts).map(([priority, count]) => (
                  <div key={priority} className="flex items-center justify-between">
                    <span className="text-white/80 capitalize">{priority}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-white/10 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            priority === 'High' ? 'bg-red-400' :
                            priority === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'
                          }`}
                          style={{ width: `${(count / analytics.totalTasks) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white/60 text-sm w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Type Distribution */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-4">Type Distribution</h3>
              <div className="space-y-3">
                {Object.entries(analytics.typeCounts).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-white/80">{type}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-20 bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-blue-400 h-2 rounded-full"
                          style={{ width: `${(count / analytics.totalTasks) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-white/60 text-sm w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-white/60 text-sm">Avg Cycle Time</div>
                <div className="text-white font-bold">{analytics.avgCycleTime} days</div>
              </div>
              <div>
                <div className="text-white/60 text-sm">Backlog Size</div>
                <div className="text-white font-bold">{analytics.backlogTasks} tasks</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;