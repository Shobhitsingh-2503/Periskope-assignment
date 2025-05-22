"use client";
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
import { useChat } from "@/context/ChatContext";
import React, { useState, useRef, useEffect } from "react";

const InputArea = () => {
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
  return (
    <div>
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
  );
};

export default InputArea;
