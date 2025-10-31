import Navbar from "@/modules/home/ui/components/navbar";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar/>
    {/* <div className="absolute inset-0 -z-10 h-full w-full bg-background dark:bg-[radial-gradient(#dadde2_1px,transparent_1px)] [background-size:16px_16px]" /> */}
      <div className="flex flex-1 flex-col px-4 pb-4">
        {children}
      </div>
    </main>
  );
};

export default Layout;
