import { useSidebar } from "@/context/SidebarContext";
import React from "react";

const Backdrop: React.FC = () => {
  const { isMobileOpen, toggleSidebar, isExpanded } = useSidebar();

  if (!isExpanded) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-gray-900/30 lg:ml-[290px] lg:mt-[78px]"
      onClick={toggleSidebar}
    />
  );
};

export default Backdrop;
