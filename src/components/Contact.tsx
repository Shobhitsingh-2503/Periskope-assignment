import React from "react";

import { RxAvatar } from "react-icons/rx";

const Contact = () => {
  return (
    <div className="flex flex-row items-center gap-2 border-b border-[#F1F0E9] p-1">
      <div>
        <RxAvatar className="text-[40px]" />
      </div>
      <div className="text-sm">
        <div className="font-bold">Name</div>
        <div className="text-[#5a6473]">last message</div>
        <div className="p-1 bg-[#d0dddd] text-[#5a6473] rounded-md text-[8px]">
          +91-9756081825
        </div>
      </div>
    </div>
  );
};

export default Contact;
