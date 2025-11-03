import React from "react";
import Column from "./Column";

const Board = ({
  todoTitle,
  backLog,
  progress,
  completed,
  searchQuery,
  filterPriority,
  filterType,
  cards,
  setCards,
}) => {
  return (
    <div className="flex min-h-[70vh] w-full gap-4 overflow-x-auto md:overflow-x-visible flex-nowrap md:flex-wrap relative mx-4">
      <Column
        title={backLog}
        column="backlog"
        headingColor="text-neutral-500"
        cards={cards}
        setCards={setCards}
        searchQuery={searchQuery}
        filterPriority={filterPriority}
        filterType={filterType}
      />

      <Column
        title={todoTitle}
        column="todo"
        headingColor="text-yellow-400"
        cards={cards}
        setCards={setCards}
        searchQuery={searchQuery}
        filterPriority={filterPriority}
        filterType={filterType}
        isDefaultColumn={true}
      />

      <Column
        title={progress}
        column="doing"
        headingColor="text-blue-400"
        cards={cards}
        setCards={setCards}
        searchQuery={searchQuery}
        filterPriority={filterPriority}
        filterType={filterType}
      />

      <Column
        title={completed}
        column="done"
        headingColor="text-emerald-400"
        cards={cards}
        setCards={setCards}
        searchQuery={searchQuery}
        filterPriority={filterPriority}
        filterType={filterType}
      />
    </div>
  );
};

export default Board;