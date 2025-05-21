import type { Message } from "@/context/ChatContext";
import { format } from "date-fns";
import { BiCheckDouble } from "react-icons/bi";

interface ChatMessageProps {
  message: Message;
  isCurrentUser: boolean;
}

const ChatMessage = ({ message, isCurrentUser }: ChatMessageProps) => {
  return (
    <div
      className={`flex ${
        !isCurrentUser ? "justify-start" : "justify-end"
      } mb-2`}
    >
      {!isCurrentUser && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white mr-2 overflow-hidden">
          {message.sender_name.charAt(0)}
        </div>
      )}
      <div className="w-[30%]">
        <div
          className={`p-3 rounded-lg ${
            isCurrentUser ? "bg-[#E8F5E9] text-black" : "bg-white text-black"
          }`}
        >
          <div className="flex flex-row justify-between">
            <div className="text-xs text-[#6caf85] font-bold mb-1">
              {message.sender_name}
            </div>
            <div className="text-xs text-[#5a6473] mb-1">+91 9634846837</div>
          </div>
          {message.content}
          <div className="text-xs text-gray-500 text-right mt-1 flex flex-row items-center justify-end">
            {format(new Date(message.created_at), "HH:mm")}
            {isCurrentUser && message.read && (
              <span className="ml-1 text-[blue] text-sm">
                <BiCheckDouble />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
