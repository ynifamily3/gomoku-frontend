import dayjs from "dayjs";
import { Fragment, useEffect, useReducer, useRef } from "react";
import { DeepReadonly } from "ts-essentials";
import io from "socket.io-client";
import { getUUID } from "../util/uuid";
import { getNickname, setNickname } from "../util/nickname";

interface ChattingUser {
  userId: string;
  nickname: string;
}

type ChattingContent =
  | {
      type: "text"; // 일반적인 채팅 말풍선
      user: ChattingUser;
      content: string;
      date: dayjs.Dayjs;
    }
  | {
      type: "date"; // 날짜 변동시 날짜변경선을 안내해 준다.
      date: dayjs.Dayjs;
    };

const todayMessage: DeepReadonly<ChattingContent> = {
  type: "date",
  date: dayjs(),
};

interface ChattingState {
  user: ChattingUser; // -> 본인 정보 (추후에 이 정보는 필요없어진다.)
  channel: string; // 채팅하고 있는 곳 (채널)
  contents: ChattingContent[]; // 채팅 컨텍스트
}

type ChattingAction = {
  type: "ADD_CONTENT";
  payload: ChattingContent;
};

const initialState: ChattingState = {
  user: {
    userId: getUUID(),
    nickname: getNickname(),
  },
  channel: "",
  contents: [todayMessage],
};

const reducer = (state: ChattingState, action: ChattingAction) => {
  switch (action.type) {
    case "ADD_CONTENT":
      const contents = [...state.contents, action.payload].slice(-100); // 최근 100건의 대화만 살림
      return {
        ...state,
        contents,
      };
    default:
      return state;
  }
};

const Chatting = () => {
  const socketRef = useRef<any>();
  const [state, dispatch] = useReducer<typeof reducer>(reducer, {
    ...initialState,
  });

  const nicknameInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    nicknameInputRef.current!.value = getNickname();
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }
    e.preventDefault();
    const value_ = e.currentTarget.value.trim();
    if (value_.length === 0) {
      e.currentTarget.value = "";
      return;
    }
    const value = value_.replaceAll("  ", " \u00a0");
    if (nicknameInputRef.current!.value.length !== 0) {
      setNickname(nicknameInputRef.current!.value);
    } else {
      setNickname("손님");
      nicknameInputRef.current!.value = "손님";
    }
    dispatch({
      type: "ADD_CONTENT",
      payload: {
        user: { ...state.user, nickname: nicknameInputRef.current!.value },
        content: value,
        date: dayjs(),
        type: "text",
      },
    });
    e.currentTarget.value = "";
    if (!socketRef.current) return;
    socketRef.current.emit("msg", value);
  };

  useEffect(() => {
    const socket = io("http://localhost:4000");
    socketRef.current = socket; // emit
    socket.on("reply", (msg: ChattingContent) => {
      dispatch({
        type: "ADD_CONTENT",
        payload: msg,
      });
    });
    return () => {
      console.log("연결 종료");
      socket.close();
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "320px" }}>
      <div
        style={{
          height: "640px",
          border: "2px solid gray",
          boxSizing: "border-box",
          overflowY: "scroll",
        }}
      >
        <div
          className="ballon"
          style={{ display: "flex", padding: ".5em", flexDirection: "column" }}
        >
          {state.contents.map((content, i) => {
            if (content.type === "text") {
              return (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <div
                    className="tag"
                    style={{
                      backgroundColor: "aliceblue",
                      color: "black",
                      borderRadius: ".5em",
                      padding: "3px",
                      height: "fit-content",
                    }}
                  >
                    {content.user.nickname}
                  </div>
                  <div
                    className="content-box"
                    style={{ padding: "3px", flex: 1, wordBreak: "break-all" }}
                  >
                    {content.content}
                  </div>
                </div>
              );
            } else if (content.type === "date") {
              return (
                <Fragment key={i}>
                  <div
                    className="date"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    {content.date.format("YYYY년 M월 D일")}
                  </div>
                </Fragment>
              );
            } else {
              return <Fragment></Fragment>;
            }
          })}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          boxSizing: "border-box",
          marginTop: ".3em",
          gap: ".3em",
          width: "100%",
        }}
      >
        <input
          type="text"
          style={{ margin: 0, width: "30px" }}
          ref={nicknameInputRef}
        />
        <input
          type="text"
          style={{ flex: 1, margin: 0 }}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default Chatting;
