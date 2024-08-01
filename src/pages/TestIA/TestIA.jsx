import { createRef, useEffect, useState } from "react";
import {
  ChatItem,
  MessageBox,
  MeetingMessage,
  Button,
  Avatar,
  Input,
} from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import Spinner from "../../components/Loading/Spinner";
import { v4 } from "uuid";
import logo from "../../logo.svg";
import { useCreateChatThread } from "../../hooks/chatThread";

const TestIA = () => {
  const chatId = v4();

  const inputReferance = createRef();

  const [refresh, setRefresh] = useState(false);

  const [messages, setMessages] = useState([
    /* {
      owner: "Osmani",
      content: "Hola Bot",
      date: new Date(),
      id: v4(),
      responses: [],
      likes: 3,
      isAbotMessage: false,
    }, */
  ]);

  const [userMessage, setUserMessage] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

  const { mutate, isPending: isLoading } = useCreateChatThread();

  useEffect(() => {}, [refresh]);

  useEffect(() => {
    messages.forEach((message) => {
      console.log("Message: " + message);
    });
  }, []);

  const handleUserMessage = () => {
    setMessages([
      ...messages,
      {
        owner: "Osmani",
        content: userMessage,
        date: new Date(),
        id: v4(),
        responses: [],
        likes: 0,
        isAbotMessage: false,
      },
    ]);
    setRefresh(!refresh);
    mutate(
      { content: userMessage },
      {
        onSuccess: ({ createThread: text }) => {
          setMessages([
            ...messages,
            {
              owner: "Bot",
              content: text,
              date: new Date(),
              id: v4(),
              responses: [],
              likes: 0,
              isAbotMessage: true,
            },
          ]);
        },
      }
    );
    setUserMessage("");
    setRefresh(!refresh);
  };

  return (
    <div className="flex flex-col items-center w-full h-full p-8">
      <div className="flex flex-col w-2/3 h-full overflow-hidden border shadow-xl rounded-xl">
        <header className="flex items-center justify-between p-4 text-white bg-gray-800 rounded-t-xl">
          <h1 className="text-lg font-semibold">Chat App</h1>
          <Button text="Sign Out" />
        </header>
        <main className="relative flex flex-col h-full p-4 space-y-4 overflow-y-auto">
          {isLoading && (
            <div className="carga">
              <Spinner tip="Wait a few seconds, the bot is responding... " />
            </div>
          )}
          {messages.map((message, i) => (
            <MessageBox
              styles={{
                minHeight: "30px",
              }}
              key={i}
              position={message.isAbotMessage ? "left" : "right"}
              type={"text"}
              date={message.date}
              title={`${message.owner} Said`}
              text={message.content}
              data={{
                uri: "https://facebook.github.io/react/img/logo.svg",
                status: {
                  click: false,
                  loading: 0,
                },
              }}
            />
          ))}
        </main>
        <footer className="flex items-center justify-between p-4 border-t">
          <Input
            onChange={(e) => setUserMessage(e.target.value)}
            // multiline={true}
            referance={inputReferance}
            className="flex w-1/12"
            placeholder="Type your message here."
            value={userMessage}
          />
          <Button
            className="w-2/12"
            text="Send message"
            onClick={() => handleUserMessage()}
          />
        </footer>
      </div>
    </div>
  );
};

export default TestIA;
