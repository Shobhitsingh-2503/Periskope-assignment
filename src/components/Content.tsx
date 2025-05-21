"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import RightBar from "./RightBar";
import { HiMiniFolderArrowDown } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";
import { IoFilter } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import { BiSolidSend } from "react-icons/bi";
import { FaPaperclip } from "react-icons/fa";
import { CiFaceSmile } from "react-icons/ci";
import { MdOutlineAccessTime } from "react-icons/md";
import { LuTimerReset } from "react-icons/lu";
import { HiOutlineSparkles } from "react-icons/hi";
import { IoDocumentText } from "react-icons/io5";
import { FaMicrophone } from "react-icons/fa";
import { LuChevronsUpDown } from "react-icons/lu";
import icon from "../images/logo.png";
import Contact from "./Contact";
import ChatMessage from "./ChatMessage";
import ChatHeader from "./ChatHeader";
import { useChat } from "@/context/ChatContext";

const Content = () => {
  const { currentMessages, currentUser, sendMessage, currentConversation } =
    useChat();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() && currentConversation) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  return (
    <div className="flex flex-row h-screen">
      <div className="w-[97%] flex flex-row">
        <div className="flex flex-col w-[26%] border-r-1 border-[#F1F0E9]">
          <div
            id="content-nav"
            className="flex flex-row items-center justify-between p-2 border-b-1 border-[#F1F0E9]"
          >
            <div className="flex flex-row gap-2">
              <div className="text-[#6caf85] text-sm flex flex-row gap-1 items-center">
                <HiMiniFolderArrowDown />
                Custom filter
              </div>
              <div className="p-1 border-1 border-[#5a6473] rounded-md text-xs">
                Save
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="flex flex-row gap-1 items-center text-sm border-1 border-[#5a6473] rounded-md text-xs p-1">
                <CiSearch />
                Search
              </div>
              <div className="relative text-[#6caf85] flex flex-row gap-1 items-center text-sm border-1 border-[#5a6473] rounded-md text-xs p-1 font-bold">
                <IoFilter />
                filtered
                <button className="absolute -top-2 -right-2 text-[7px] bg-[#6caf85] text-white rounded-full p-1">
                  <ImCross />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <Contact />
          </div>
        </div>

        {/* Messaging area */}
        <div className="relative w-[74%] bg-[url(../images/background.png)] bg-no-repeat bg-cover">
          <ChatHeader />

          <div className="p-4 overflow-y-auto h-[calc(100vh-140px)] no-scrollbar">
            {currentConversation ? (
              currentMessages.length > 0 ? (
                currentMessages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    isCurrentUser={message.sender_id === currentUser.id}
                  />
                ))
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
            <div ref={messagesEndRef} className="h-10" />
          </div>

          <div className="absolute bottom-10 w-full bg-[#ffffff] flex flex-row items-center border-none">
            <input
              type="text"
              className="w-[96%] p-2 border-none focus:outline-none"
              placeholder={
                currentConversation
                  ? "Message..."
                  : "Select a chat to send a message"
              }
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={!currentConversation}
            />
            <BiSolidSend
              className={`text-xl ${
                currentConversation && newMessage.trim()
                  ? "text-[#6caf85] hover:cursor-pointer"
                  : "text-gray-400"
              }`}
              onClick={
                currentConversation && newMessage.trim()
                  ? handleSendMessage
                  : undefined
              }
            />
          </div>
          <div className="absolute bottom-0 w-full flex flex-row items-center justify-between bg-[#ffffff] p-1">
            <div className="flex flex-row items-center justify-between p-1 w-1/4">
              <div
                className={`cursor-pointer ${
                  !currentConversation && "text-gray-400"
                }`}
              >
                <FaPaperclip />
              </div>
              <div
                className={`cursor-pointer ${
                  !currentConversation && "text-gray-400"
                }`}
              >
                <CiFaceSmile />
              </div>
              <div
                className={`cursor-pointer ${
                  !currentConversation && "text-gray-400"
                }`}
              >
                <MdOutlineAccessTime />
              </div>
              <div
                className={`cursor-pointer ${
                  !currentConversation && "text-gray-400"
                }`}
              >
                <LuTimerReset />
              </div>
              <div
                className={`cursor-pointer ${
                  !currentConversation && "text-gray-400"
                }`}
              >
                <HiOutlineSparkles />
              </div>
              <div
                className={`cursor-pointer ${
                  !currentConversation && "text-gray-400"
                }`}
              >
                <IoDocumentText />
              </div>
              <div
                className={`cursor-pointer ${
                  !currentConversation && "text-gray-400"
                }`}
              >
                <FaMicrophone />
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 border-1 border-[#5a6473] rounded-md p-1 text-xs justify-between w-[20%]">
              <div className="flex flex-row items-center gap-2">
                <img
                  src={icon.src || "/placeholder.svg"}
                  className="w-[25px]"
                  alt="Periskope logo"
                />
                Periskope
              </div>
              <div>
                <LuChevronsUpDown />
              </div>
            </div>
          </div>
        </div>
      </div>
      <RightBar />
    </div>
  );
};

export default Content;
