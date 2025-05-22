"use client";
import { TbMessageCirclePlus } from "react-icons/tb";

export default function NewChatButton() {
  return (
    <>
      <div className="w-10 h-10 rounded-full bg-[#6CAF85] text-[white] flex items-center justify-center font-bold text-xl">
        <TbMessageCirclePlus />
      </div>
    </>
  );
}
