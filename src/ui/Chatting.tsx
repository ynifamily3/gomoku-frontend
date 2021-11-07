import dayjs from "dayjs";
import { Fragment, useReducer } from "react";
import { DeepReadonly } from "ts-essentials";

const now = dayjs();

interface ChattingUser {
  userId: number;
  nickname: string;
}

type ChattingContent =
  | {
      type: "text";
      user: ChattingUser;
      content: string;
      date: dayjs.Dayjs;
    }
  | {
      type: "date";
      date: dayjs.Dayjs;
    };

const todayMessage: DeepReadonly<ChattingContent> = {
  type: "date",
  date: now,
};

interface ChattingState {
  user: ChattingUser; // me
  contents: ChattingContent[];
}

type ChattingAction =
  | {
      type: "say";
      payload: { content: ChattingContent; user: ChattingUser };
    }
  | { type: "date"; payload: { content: ChattingContent } };

const initialState: ChattingState = {
  user: {
    userId: 1,
    nickname: "미엘",
  },
  contents: [todayMessage],
};

const reducer = (state: ChattingState, action: ChattingAction) => {
  switch (action.type) {
    case "say":
    case "date":
      const contents = [...state.contents, action.payload.content].slice(-100); // 최근 100건의 대화만 살림
      return {
        ...state,
        contents,
      };
    default:
      return state;
  }
};

const Chatting = () => {
  const [state, dispatch] = useReducer<typeof reducer>(reducer, initialState);

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
    dispatch({
      type: "say",
      payload: {
        user: state.user,
        content: {
          type: "text",
          content: value,
          user: state.user, // 본인이 말하는 경우
          date: dayjs(),
        },
      },
    });
    e.currentTarget.value = "";
  };
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
      <div style={{ display: "flex", boxSizing: "border-box" }}>
        <input
          type="text"
          style={{ flex: 1, margin: 0 }}
          onKeyPress={handleKeyPress}
        />
        {/* <button style={{ margin: 0 }} onClick={{}}>전송</button> */}
      </div>
    </div>
  );
};

export default Chatting;
