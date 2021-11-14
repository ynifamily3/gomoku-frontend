import { v4 as uuidv4 } from "uuid";

const getUUID = () => {
  const _uuid = localStorage.getItem("gomoku-uuid") || uuidv4();
  localStorage.setItem("gomoku-uuid", _uuid);
  return _uuid;
};

export { getUUID };
