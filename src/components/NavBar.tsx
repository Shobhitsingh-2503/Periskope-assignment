import React from "react";
import { TbRefreshDot } from "react-icons/tb";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { GoDotFill } from "react-icons/go";
import { MdOutlineInstallDesktop } from "react-icons/md";
import { IoNotificationsOffSharp } from "react-icons/io5";
import { BsChatDotsFill } from "react-icons/bs";
import { MdFormatListBulleted } from "react-icons/md";

const NavBar = () => {
  return (
    <div
      className="flex flex-row h-15 items-center justify-between p-2 border-b-1 border-[#F1F0E9] "
      id="nav"
    >
      <div>
        <div className="flex flex-row gap-2 items-center text-[#5a6473] ">
          <BsChatDotsFill /> chats
        </div>
      </div>
      <div className="flex flex-row w-[37%] items-center justify-evenly">
        <div className="flex flex-row items-center gap-2 border-1 border-[#5a6473] rounded-md p-1 text-sm ">
          <TbRefreshDot /> Refresh
        </div>
        <div className="flex flex-row items-center gap-2 border-1 border-[#5a6473] rounded-md p-1 text-sm ">
          <IoIosHelpCircleOutline /> Help
        </div>
        <div className="flex flex-row items-center gap-2 border-1 border-[#5a6473] rounded-md p-1 text-sm ">
          <GoDotFill className="text-[yellow] text-xl" /> 5/6 phones
        </div>
        <div className="flex flex-row items-center gap-2 border-1 border-[#5a6473] rounded-md p-2 ">
          <MdOutlineInstallDesktop />
        </div>
        <div className="flex flex-row items-center gap-2 border-1 border-[#5a6473] rounded-md p-2 ">
          <IoNotificationsOffSharp />
        </div>
        <div className="flex flex-row items-center gap-1 border-1 border-[#5a6473] rounded-md p-2 ">
          <div className="text-xs">✨</div>
          <MdFormatListBulleted />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
