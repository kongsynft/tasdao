"use client";

import React, { useState, useRef, useEffect } from "react";
import MessageInput from "@/components/tas-gpt/MessageInput";
import MessageList from "@/components/tas-gpt/MessageList";
import ScrollToBottom from "@/components/tas-gpt/ScrollToBottom";
import Welcome from "@/components/tas-gpt/Welcome";

const ChatInterface = () => {
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "ai" }[]
  >([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (currentMessage.trim() !== "") {
      const userMessage = currentMessage;
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: userMessage, sender: "user" },
      ]);
      setCurrentMessage("");
      setAiResponse("");

      const response = await fetch("/api/gpt-3-turbo/message", {
        method: "POST",
        body: JSON.stringify({ content: userMessage }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok || !response.body) {
        alert("Error sending message");
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessageInProgress = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { text: aiMessageInProgress, sender: "ai" },
          ]);
          setAiResponse("");
          break;
        }

        const textChunk = decoder.decode(value);
        aiMessageInProgress += textChunk;
        setAiResponse(aiMessageInProgress);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentMessage(e.target.value);
  };

  const handleKeyDownCapture = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen items-center">
      <div className="flex-grow overflow-auto w-[50rem] mt-10 mb-4">
        <ScrollToBottom>
          <Welcome />
          <MessageList messages={messages} aiResponse={aiResponse} />
        </ScrollToBottom>
      </div>
      <div className="relative mb-10 sm:w-full md:w-[45rem]">
        <MessageInput
          currentMessage={currentMessage}
          onInputChange={handleInputChange}
          onKeyDownCapture={handleKeyDownCapture}
          onSubmit={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
