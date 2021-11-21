const getNickname = () => {
  const _nickname = localStorage.getItem("gomoku-nickname") || "손님";
  localStorage.setItem("gomoku-nickname", _nickname);
  return _nickname;
};

const setNickname = (nickname: string) => {
  localStorage.setItem("gomoku-nickname", nickname);
};

export { getNickname, setNickname };
