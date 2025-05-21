"use client";

import { useChat } from "@/hooks/useChat";
import { CiSearch } from "react-icons/ci";
import { HiSparkles } from "react-icons/hi";

type Avatar = {
  initials?: string;
  online: boolean;
};

type Props = {
  avatars: Avatar[];
  maxVisible?: number;
};

const ChatHeader = () => {
  const avatars = [
    { initials: "S", online: false },
    { initials: "H", online: true },
    { initials: "R", online: true },
    { initials: "N", online: true },
    { initials: "P", online: true },
    { initials: "A", online: false },
    { initials: "B", online: false },
  ];

  const maxVisible = 5;
  const visibleAvatars = avatars.slice(0, maxVisible);
  const remaining = avatars.length - maxVisible;

  const { conversations, currentConversation } = useChat();
  const currentChat = conversations.find((c) => c.id === currentConversation);

  return (
    <div className="p-0.5 bg-[#ffffff] border-b-1 border-[#F1F0E9] flex items-center flex-row justify-between">
      <div className="flex flex-row items-center">
        {/* <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white mr-3"> */}
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white mr-3 overflow-hidden">
          {currentChat?.name.charAt(0)}
        </div>
        <div className="flex flex-col flex-1">
          <div className="font-medium">{currentChat?.name}</div>
          <div className="text-xs text-gray-500 flex items-center">
            {currentChat?.participants?.map((participant, index) => (
              <span key={participant}>
                {index > 0 && ", "}
                {participant}
              </span>
            ))}
            {currentChat?.participants?.length === 0 && "No participants"}
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center w-1/4 justify-evenly">
        <div className="flex items-center">
          {visibleAvatars.map((avatar, idx) => (
            <div
              key={idx}
              className="relative w-8 h-8 rounded-full border-2 border-white -ml-3 first:ml-0 bg-gray-200 "
            >
              <div className="w-full h-full flex items-center justify-center text-sm font-bold text-white bg-gray-300 rounded-full">
                {avatar.initials}
              </div>

              {avatar.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full z-10" />
              )}
            </div>
          ))}

          {remaining > 0 && (
            <div className="w-10 h-10 rounded-full bg-gray-100 text-sm flex items-center justify-center -ml-3 border-2 border-white font-semibold text-gray-600">
              +{remaining}
            </div>
          )}
        </div>
        <div>
          <HiSparkles />
        </div>
        <div className="font-bold">
          <CiSearch />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
