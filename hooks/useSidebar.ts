import { useState } from "react";

const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return {
    isOpen,
    isCollapsed,
    toggleOpen,
    toggleCollapsed,
  };
};

export default useSidebar;
