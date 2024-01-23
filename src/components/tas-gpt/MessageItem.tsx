import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { IoIosChatboxes } from "react-icons/io";
import Image from "next/image";
import bonaventureGreen from "@/images/Bonaventure_Green.png";

type MessageItemProps = {
  message: string;
  isAi: boolean;
};

const MessageItem: React.FC<MessageItemProps> = ({ message, isAi }) => {
  const marginClass = isAi ? "mb-[-55px]" : "mb-[-25px]";

  return (
    <div className="break-words prose dark:prose-invert">
      <div className={`flex items-center ${marginClass}`}>
        {isAi ? (
          <div className="flex-shrink-0 mr-5">
            <Image
              src={bonaventureGreen}
              className="rounded-xl"
              alt="iconAI"
              width={32}
              height={32}
            />
          </div>
        ) : (
          <IoIosChatboxes className="flex-shrink-0 text-xl mr-5" size={32} />
        )}
        <span className="flex-grow font-bold text-lg">
          {isAi ? "TAS-GPT" : "You"}
        </span>
      </div>
      <div className="flex mt-0">
        <div className="flex-shrink-0 w-[32px] mr-5" />
        <Markdown
          remarkPlugins={[remarkGfm]}
          className="flex-grow"
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              return match ? (
                <SyntaxHighlighter
                  PreTag="div"
                  language={match[1]}
                  style={dark}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code {...props} className={className}>
                  {children}
                </code>
              );
            },
          }}
        >
          {message}
        </Markdown>
      </div>
    </div>
  );
};

export default MessageItem;
