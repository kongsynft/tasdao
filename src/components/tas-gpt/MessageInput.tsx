import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PaperPlaneIcon } from "@radix-ui/react-icons";

type MessageInputProps = {
  currentMessage: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDownCapture: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
};

const MessageInput: React.FC<MessageInputProps> = ({
  currentMessage,
  onInputChange,
  onKeyDownCapture,
  onSubmit,
}) => {
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="flex w-full items-center space-x-2">
          <Textarea
            className="flex-1 pr-12 hover:ring-1 hover:ring-ring"
            value={currentMessage}
            onChange={onInputChange}
            onKeyDownCapture={onKeyDownCapture}
            placeholder="Message TAS-GPT..."
          />
          <Button size="icon" type="submit" className="absolute right-2">
            <PaperPlaneIcon className="h-4 w-4" />
          </Button>
        </div>
      </form>
      <p className="py-2 text-xs flex justify-center text-muted-foreground">
        Disclaimer: Conversations are AI-generated and for entertainment
        purposes only.
      </p>
    </div>
  );
};

export default MessageInput;
