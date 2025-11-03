const DropIndicator = ({ beforeId, column }) => (
  <div
    data-before={beforeId || "-1"}
    data-column={column}
    className="my-0.5 h-1 w-full rounded bg-violet-400 opacity-0 transition-opacity duration-300"
  />
);

export default DropIndicator;