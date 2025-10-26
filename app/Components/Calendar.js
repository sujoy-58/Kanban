"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Calendar = ({ searchQuery, filterPriority, filterType, cards = [], setCards }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Filter cards based on search and filter criteria
  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          card.title?.toLowerCase().includes(searchLower) ||
          card.description?.toLowerCase().includes(searchLower) ||
          card.type?.toLowerCase().includes(searchLower) ||
          card.priority?.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Priority filter
      if (filterPriority !== "All" && card.priority !== filterPriority) {
        return false;
      }

      // Type filter
      if (filterType !== "All" && card.type !== filterType) {
        return false;
      }

      // Only show cards with deadlines
      return card.deadline;
    });
  }, [cards, searchQuery, filterPriority, filterType]);

  // Get cards with deadlines for calendar display
  const cardsWithDeadlines = filteredCards.filter(card => card.deadline);

  // Calendar navigation
  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  // Get calendar data
  const getCalendarData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return { days, year, month };
  };

  const { days, year, month } = getCalendarData();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Get cards for a specific date
  const getCardsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return cardsWithDeadlines.filter(card => card.deadline === dateStr);
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is in current month
  const isCurrentMonth = (date) => {
    return date.getMonth() === month;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="min-h-[80vh] w-full text-neutral-50 overflow-hidden relative"
    >
      <div className="mx-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <FiCalendar className="text-2xl text-blue-400" />
            <h2 className="text-2xl font-bold">Calendar View</h2>
            <span className="text-white/60 text-sm">
              {cardsWithDeadlines.length} tasks with deadlines
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FiChevronLeft className="text-white/70" />
            </button>
            <h3 className="text-lg font-semibold min-w-[200px] text-center">
              {monthNames[month]} {year}
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FiChevronRight className="text-white/70" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-white/60 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayCards = getCardsForDate(day);
              const isCurrentDay = isToday(day);
              const isCurrentMonthDay = isCurrentMonth(day);
              
              return (
                <motion.div
                  key={index}
                  className={`
                    min-h-[100px] p-2 rounded-lg border transition-all
                    ${isCurrentMonthDay 
                      ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                      : 'bg-white/2 border-white/5 text-white/40'
                    }
                    ${isCurrentDay ? 'ring-2 ring-blue-400 bg-blue-500/20' : ''}
                  `}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Date Number */}
                  <div className={`
                    text-sm font-semibold mb-2
                    ${isCurrentDay ? 'text-blue-300' : isCurrentMonthDay ? 'text-white' : 'text-white/40'}
                  `}>
                    {day.getDate()}
                  </div>

                  {/* Cards for this date */}
                  <div className="space-y-1">
                    {dayCards.slice(0, 3).map((card, cardIndex) => (
                      <motion.div
                        key={card.id}
                        className={`
                          text-xs p-1.5 rounded border-l-2 cursor-pointer
                          ${card.priority === 'High' ? 'border-red-400 bg-red-500/20 text-red-200' :
                            card.priority === 'Medium' ? 'border-yellow-400 bg-yellow-500/20 text-yellow-200' :
                            'border-green-400 bg-green-500/20 text-green-200'
                          }
                          hover:bg-white/20 transition-colors
                        `}
                        whileHover={{ scale: 1.05 }}
                        title={`${card.title} - ${card.priority} Priority`}
                      >
                        <div className="font-medium truncate">{card.title}</div>
                        {card.type && (
                          <div className="text-xs opacity-70 truncate">{card.type}</div>
                        )}
                      </motion.div>
                    ))}
                    
                    {/* Show more indicator if there are more than 3 cards */}
                    {dayCards.length > 3 && (
                      <div className="text-xs text-white/50 text-center py-1">
                        +{dayCards.length - 3} more
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span className="text-white/70">High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
            <span className="text-white/70">Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span className="text-white/70">Low Priority</span>
          </div>
        </div>

        {/* No deadlines message */}
        {cardsWithDeadlines.length === 0 && (
          <div className="text-center py-12">
            <FiClock className="text-4xl text-white/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white/60 mb-2">No tasks with deadlines</h3>
            <p className="text-white/50">
              Add deadlines to your tasks to see them on the calendar
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Calendar;
