"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Home,
  Users,
  FileText,
  Info,
  Settings,
} from "lucide-react";
import { URL_MAP } from "@/lib/urls";
import { motion } from "framer-motion";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "fixed left-0 top-24 h-[calc(100vh-6rem)] bg-secondary transition-all duration-300 ease-in-out z-30",
        isOpen ? (isCollapsed ? "w-20" : "w-64") : "w-0"
      )}
    >
      <nav className={cn("p-4 space-y-2", isOpen ? "" : "hidden")}>
        <Button
          variant="ghost"
          size="icon"
          className="mx-0 hover:bg-primary hover:text-secondary rounded-md justify-start w-full px-4"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronRight
            className={cn(
              "h-4 w-4 transition-transform",
              isCollapsed ? "" : "rotate-180"
            )}
          />
                   {!isCollapsed && (
            <motion.span
              className="p-2"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, x: -5, transition: { duration: 0.3 } }}
            >
              Yan Menü
            </motion.span>
          )}
        </Button>
        <hr />
        <SidebarItem
          href={URL_MAP.homePage}
          icon={Home}
          text="Ana Sayfa"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          href={URL_MAP.forumPage}
          icon={FileText}
          text="Forum"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          href={URL_MAP.portfoliosPage}
          icon={Users}
          text="Portföyler"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          href={URL_MAP.aboutPage}
          icon={Info}
          text="Hakkımızda"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          href={URL_MAP.profilePage}
          icon={Settings}
          text="Profil"
          isCollapsed={isCollapsed}
        />
      </nav>
    </div>
  );
};

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  text: string;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  href,
  icon: Icon,
  text,
  isCollapsed,
}) => {

  return (
    <Link href={href}>
      <motion.div
        className="overflow-hidden relative"
        style={{ width: "100%" }}
        whileHover={{ scale: 1.05 }}
      >
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start hover:bg-primary hover:text-secondary",
            "px-4"
          )}>
          <Icon className="h-5 w-5" />
          {!isCollapsed && (
            <motion.span
              className="p-2"
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, x: -5, transition: { duration: 0.3 } }}
            >
              {text}
            </motion.span>
          )}
        </Button>

      </motion.div>
    </Link>
  );
};

export default Sidebar;
