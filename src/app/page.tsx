"use client";
import SideBar from "@/components/SideBar";
import NavBar from "@/components/NavBar";
import Content from "@/components/Content";

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-row">
      <SideBar />
      <div id="nav + content" className="flex flex-col w-screen">
        <NavBar />
        <Content />
      </div>
    </div>
  );
}
