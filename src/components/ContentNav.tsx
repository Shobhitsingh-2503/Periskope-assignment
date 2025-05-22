import React from "react";

import { HiMiniFolderArrowDown } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";
import { IoFilter } from "react-icons/io5";
import { ImCross } from "react-icons/im";
import Contact from "./Contact";

const ContentNav = () => {
  return (
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
  );
};

export default ContentNav;
