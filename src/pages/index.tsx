import { useNavigate } from "react-router-dom";

function IndexPage() {
  const navigate = useNavigate();
  return (
    <div>
      <h1>gomoku</h1>
      <button
        onClick={() => {
          navigate("/game/1");
        }}
      >
        입장하기 - 1서버
      </button>
      <button
        onClick={() => {
          navigate("/game/2");
        }}
      >
        입장하기 - 2서버
      </button>
    </div>
  );
}

export default IndexPage;
