"use client";

import { useChat } from "@/context/ChatContext";
import {
  isToday,
  isYesterday,
  isTomorrow,
  format,
  formatDistanceToNow,
} from "date-fns";
import { FaPhoneAlt } from "react-icons/fa";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  if (isToday(date)) {
    return formatDistanceToNow(date, { addSuffix: true });
  }

  if (isYesterday(date)) {
    return "Yesterday";
  }

  if (isTomorrow(date)) {
    return "Tomorrow";
  }

  return format(date, "dd-MM-yyyy");
};

const Contact = () => {
  const { conversations, currentConversation, setCurrentConversation } =
    useChat();

  return (
    <div className="flex flex-col overflow-y-scroll no-scrollbar">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          className={`flex flex-row items-center p-1 border-b-1 border-[#F1F0E9] hover:bg-[#F9F9F7] cursor-pointer ${
            currentConversation === conversation.id ? "bg-[#F9F9F7]" : ""
          }`}
          onClick={() => {
            setCurrentConversation(conversation.id);
          }}
        >
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white mr-3">
            {conversation.name.charAt(0)}
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex flex-row justify-between items-center">
              <div className="font-medium text-sm">{conversation.name}</div>
              <div className="flex flex-row gap-2 mt-1">
                {conversation.type && (
                  <div
                    className={`text-xs px-2 py-0.5 rounded-md ${
                      conversation.type === "demo"
                        ? "bg-[#FFF3E0] text-[#FF9800]"
                        : "bg-[#E8F5E9] text-[#4CAF50]"
                    }`}
                  >
                    {conversation.type}
                  </div>
                )}
                {conversation.tags &&
                  conversation.tags.map((tag, index) => (
                    <div
                      key={index}
                      className={`text-xs px-2 py-0.5 rounded-md bg-[#E8F5E9] text-[#4CAF50]`}
                    >
                      {tag}
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex flex-row justify-between items-center p-0.5">
              <div className="text-sm text-gray-500 truncate w-48">
                {conversation.participants[0]}: {conversation.last_message}
              </div>
              {conversation.unread_count > 0 && (
                <div className="bg-[#6caf85] text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px]">
                  {conversation.unread_count}
                </div>
              )}
              <div>
                <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-white mr-3 text-[9px]">
                  {conversation.name.charAt(0)}
                </div>
              </div>
            </div>
            <div className="flex flex-row justify-between items-center ">
              <div className="text-[9px] text-gray-400 bg-gray-200 p-0.5 rounded-md flex flex-row gap-2 items-center">
                <FaPhoneAlt /> +91 99718 44008 +1
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(conversation.last_message_time)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Contact;
