"use client";
import React from "react";
import { TbLayoutSidebarRightExpandFilled } from "react-icons/tb";
import { FiRefreshCw } from "react-icons/fi";
import { RiEditLine } from "react-icons/ri";
import { CiMenuFries } from "react-icons/ci";
import { RiListCheck2 } from "react-icons/ri";
import { FaHubspot } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { CiAt } from "react-icons/ci";
import { RiListSettingsFill } from "react-icons/ri";
import { RiFolderImageFill } from "react-icons/ri";

const RightBar = () => {
  return (
    <div
      className="flex flex-col justify-evenly items-center text-[23px] border-l border-[#F1F0E9] h-3/4 p-1 text-[#aaafb9]"
      id="left-bar"
    >
      <div className="flex flex-row justify-center">
        <TbLayoutSidebarRightExpandFilled />
      </div>
      <div>
        <FiRefreshCw />
      </div>
      <div>
        <RiEditLine />
      </div>
      <div>
        <CiMenuFries />
      </div>
      <div>
        <RiListCheck2 />
      </div>
      <div>
        <FaHubspot />
      </div>
      <div>
        <FaUsers />
      </div>
      <div>
        <CiAt />
      </div>
      <div>
        <RiFolderImageFill />
      </div>
      <div>
        <RiListSettingsFill />
      </div>
    </div>
  );
};

export default RightBar;
