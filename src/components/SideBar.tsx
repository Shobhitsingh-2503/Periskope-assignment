"use client";
import React from "react";
import { IoMdHome } from "react-icons/io";
import { BsChatDotsFill } from "react-icons/bs";
import { IoTicket } from "react-icons/io5";
import { GoGraph } from "react-icons/go";
import { MdFormatListBulleted } from "react-icons/md";
import { HiSpeakerphone } from "react-icons/hi";
import { IoIosGitNetwork } from "react-icons/io";
import { RiContactsBookFill } from "react-icons/ri";
import { RiFolderImageFill } from "react-icons/ri";
import { MdOutlineChecklist } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { TbStarsFilled } from "react-icons/tb";
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import logo from "../images/logo.png";

const SideBar = () => {
  return (
    <div
      id="side-bar"
      className="flex flex-col justify-between h-screen w-10 items-center text-[20px] border-r-1 border-[#F1F0E9]"
    >
      <div className="h-[70%] flex flex-col justify-evenly p-1 text-[#5a6473]">
        <div className="mb-2">
          <img src={logo.src} className="w-[50px]" />
        </div>
        <div className="flex flex-row justify-center rounded-sm p-2 hover:cursor-pointer hover:bg-[#ffffff]">
          <IoMdHome />
        </div>
        <div className="text-[#6caf85] flex flex-row justify-center rounded-sm bg[#dddddd] p-2 hover:cursor-pointer">
          <BsChatDotsFill />
        </div>
        <div className="flex flex-row justify-center rounded-sm p-2 hover:cursor-pointer hover:bg-[#ffffff]">
          <IoTicket />
        </div>
        <div className="flex flex-row justify-center rounded-sm p-2 hover:cursor-pointer hover:bg-[#ffffff]">
          <GoGraph />
        </div>
        <div className="flex flex-row justify-center rounded-sm p-2 hover:cursor-pointer hover:bg-[#ffffff]">
          <MdFormatListBulleted />
        </div>
        <div className="flex flex-row justify-center rounded-sm p-2 hover:cursor-pointer hover:bg-[#ffffff]">
          <HiSpeakerphone />
        </div>
        <div className="flex flex-row justify-center rounded-sm p-2 hover:cursor-pointer hover:bg-[#ffffff]">
          <IoIosGitNetwork className="rotate-180" />
          {/* <span className="text-[10px]">✨</span> */}
        </div>
        <div className="flex flex-row justify-center rounded-sm p-2 hover:cursor-pointer hover:bg-[#ffffff]">
          <RiContactsBookFill />
        </div>
        <div className="flex flex-row justify-center rounded-sm p-2 hover:cursor-pointer hover:bg-[#ffffff]">
          <RiFolderImageFill />
        </div>
        <div className="flex flex-row justify-center rounded-sm p-2 hover:cursor-pointer hover:bg-[#ffffff]">
          <MdOutlineChecklist />
        </div>
        <div className="flex flex-row justify-center rounded-sm p-2 hover:cursor-pointer hover:bg-[#ffffff]">
          <IoMdSettings />
        </div>
      </div>
      <div
        id="bottom"
        className="p-1 h-1/8 text-[#5a6473] flex flex-col items-center justify-between"
      >
        <div className="flex flex-row justify-center rounded-sm p-1 hover:cursor-pointer hover:bg-[#ffffff]">
          <TbStarsFilled />
        </div>
        <div className="flex flex-row justify-center rounded-sm p-1 hover:cursor-pointer hover:bg-[#ffffff]">
          <TbLayoutSidebarLeftExpandFilled />
        </div>
      </div>
    </div>
  );
};

export default SideBar;
