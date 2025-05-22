"use client";

import React, { useRef, useEffect } from "react";
import RightBar from "./RightBar";
import ChatMessage from "./ChatMessage";
import ChatHeader from "./ChatHeader";
import { useChat } from "@/context/ChatContext";
import ContentNav from "./ContentNav";
import InputArea from "./InputArea";

const Content = () => {
  const { currentMessages, currentUser, currentConversation } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const formatDateDivider = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="flex flex-row h-screen">
      <div className="w-[97%] flex flex-row">
        <ContentNav />
        <div className="relative w-[74%] bg-[url(../images/background.png)] bg-no-repeat bg-cover">
          <ChatHeader />

          {/* Messaging area */}

          <div className="p-4 overflow-y-auto h-[calc(100vh-140px)] no-scrollbar">
            {currentConversation ? (
              currentMessages.length > 0 ? (
                currentMessages.map((message, index) => {
                  const showDateDivider =
                    index === 0 ||
                    new Date(
                      currentMessages[index].created_at
                    ).toDateString() !==
                      new Date(
                        currentMessages[index - 1].created_at
                      ).toDateString();

                  return (
                    <React.Fragment key={`${message.id}-${index}`}>
                      {showDateDivider && (
                        <div className="text-center my-4">
                          <span className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full">
                            {formatDateDivider(message.created_at)}
                          </span>
                        </div>
                      )}
                      <ChatMessage
                        message={message}
                        isCurrentUser={message.sender_id === currentUser.id}
                      />
                    </React.Fragment>
                  );
                })
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No messages in this conversation yet.
                </div>
              )
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation to start chatting.
              </div>
            )}
            <div ref={messagesEndRef} className="h-8" />
          </div>

          {/* Input area */}

          <InputArea />
        </div>
      </div>
      <RightBar />
    </div>
  );
};

export default Content;
