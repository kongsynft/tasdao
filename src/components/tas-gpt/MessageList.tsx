import React from "react";
import MessageItem from "./MessageItem";

type MessageListProps = {
  messages: { text: string; sender: "user" | "ai" }[];
  aiResponse: string;
};

const MessageList: React.FC<MessageListProps> = ({ messages, aiResponse }) => {
  return (
    <div>
      {messages.map((message, index) => (
        <MessageItem
          key={index}
          message={message.text}
          isAi={message.sender === "ai"}
        />
      ))}
      {aiResponse && (
        <MessageItem key="aiResponse" message={aiResponse} isAi={true} />
      )}
    </div>
  );
};

export default MessageList;
