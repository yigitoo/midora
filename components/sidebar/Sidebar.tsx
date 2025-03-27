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
  DollarSign
} from "lucide-react";
import { URL_MAP } from "@/lib/urls";
import { motion } from "framer-motion";
import { Separator } from "../ui/separator";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "larg-screen-only 2xl:flex fixed left-0 top-24 h-[calc(100vh-6rem)] bg-secondary transition-all duration-300 ease-in-out z-30",
        isOpen ? (isCollapsed ? "w-20" : "w-50") : "w-0",
        "border-r shadow-md"
      )}
      style={{
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      }}
    >
      <nav className={cn(cn("p-4 space-y-2", isOpen ? "" : "hidden"))}>
        <Button
          variant="ghost"
          size="icon"
          className="mx-0 hover:bg-primary hover:text-secondary rounded-md justify-start w-full px-4"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronRight
            className={cn(
              "h-6 w-6 transition-transform",
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

        <Separator className="my-4 h-1 rounded-lg bg-primary"/>

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
        <SidebarItem
          href={URL_MAP.stockViewPage}
          icon={DollarSign}
          text="Hisse Görüntüle"
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
        className="overflow-hidden relative mt-2"
        style={{ width: "100%" }}
        whileHover={{ scale: 1.05 }}
      >
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start hover:bg-primary hover:text-secondary",
            "px-4"
          )}
        >
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
