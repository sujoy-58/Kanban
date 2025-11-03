import React, { useState } from "react";
import Card from "./Card";
import AddCard from "./AddCard";
import DropIndicator from "./DropIndicator";



const Column = ({
  title,
  headingColor,
  cards,
  column,
  setCards,
  searchQuery,
  filterPriority,
  filterType,
  isDefaultColumn = false,
}) => {
  const [active, setActive] = useState(false);

  // Filter cards based on search and filter criteria
  const filteredCards = cards.filter((card) => {
    if (card.column !== column) return false;

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        card.title?.toLowerCase().includes(searchLower) ||
        card.description?.toLowerCase().includes(searchLower) ||
        card.type?.toLowerCase().includes(searchLower) ||
        card.priority?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    if (filterPriority !== "All" && card.priority !== filterPriority) {
      return false;
    }

    if (filterType !== "All" && card.type !== filterType) {
      return false;
    }

    return true;
  });

  const handleDragStart = (e, card) =>
    e.dataTransfer.setData("cardId", card.id);
  
  const handleDragEnd = (e) => {
    const cardId = e.dataTransfer.getData("cardId");
    setActive(false);
    clearHighlights();
    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);
    const before = element.dataset.before || "-1";
    if (before !== cardId) {
      let copy = [...cards];
      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };
      copy = copy.filter((c) => c.id !== cardId);
      const insertAtIndex = copy.findIndex((el) => el.id === before);
      if (before === "-1") copy.push(cardToTransfer);
      else if (insertAtIndex !== -1)
        copy.splice(insertAtIndex, 0, cardToTransfer);
      setCards(copy);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => (i.style.opacity = "0"));
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;
    return indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        return offset < 0 && offset > closest.offset
          ? { offset, element: child }
          : closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );
  };

  const getIndicators = () =>
    Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  
  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  return (
    <div className="w-[23%] flex-shrink-0 md:flex-shrink">
      <div className="mb-4 flex items-center justify-between">
        <h3 className={`text-xl font-semibold ${headingColor}`}>
          {title}
          {isDefaultColumn && (
            <span className="text-xs text-white/40 ml-2">(Default)</span>
          )}
        </h3>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full space-y-1 rounded-2xl p-2 pt-4 transition-colors ${
          active ? "bg-white/10" : "bg-white/5"
        } backdrop-blur-md bg-white/10 border border-white/20 shadow-xl`}
      >
        {filteredCards.map((c) => (
          <Card
            key={c.id}
            {...c}
            handleDragStart={handleDragStart}
            setCards={setCards}
            searchQuery={searchQuery}
          />
        ))}
        <DropIndicator beforeId={null} column={column} />
        <AddCard 
          column={column} 
          setCards={setCards} 
          isDefaultColumn={isDefaultColumn}
        />
      </div>
    </div>
  );
};

export default Column;