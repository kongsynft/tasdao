import React, { useEffect, useRef, ReactNode } from "react";

type ScrollToBottomProps = {
  children: ReactNode;
};

const ScrollToBottom: React.FC<ScrollToBottomProps> = ({ children }) => {
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [children]);

  return (
    <div>
      {children}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ScrollToBottom;
