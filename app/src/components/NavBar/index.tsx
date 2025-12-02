import React, { useRef, useState } from "react";
import ButtonBorderRight from "../../ui/buttons/BorderRight";
import { ChevronRight, Home, MessageCircle, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  {
    text: "Home",
    icon: <Home size={20} />,
    path: "/",
  },
  {
    text: "Chat",
    icon: <MessageCircle size={20} />,
    path: "/chat",
  },
  {
    text: "Settings",
    icon: <Settings size={20} />,
    path: "/settings",
  },
];

function NavItem({ text, icon }: { text: string; icon: React.ReactNode }) {
  return (
    <>
      <span className="mr-2 m-1">{icon}</span>
      <span>{text}</span>
    </>
  );
}

export default function NavBar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      className={`bg-(--background-darker-color) p-5 relative`}
      animate={{
        width: collapsed ? 80 : 300,
      }}
      layout
    >
      <motion.div
        className="bg-(--secondary-color) w-full relative rounded-2xl flex items-center cursor-pointer"
        onClick={() => setCollapsed(!collapsed)}
      >
        <motion.span
          className="p-2"
          animate={{ rotate: collapsed ? 180 : 0 }}
          style={{ originX: 0.5, originY: 0.5, display: "inline-block" }}
        >
          <ChevronRight size={24} />
        </motion.span>
      </motion.div>
      <ul className="mt-10">
        {navItems.map((item) => (
          <motion.li
            className={`relative p-1 rounded-[10px] cursor-pointer m-3 outline-none  ${location.pathname === item.path ? "bg-(--secondary-color)" : "bg-(--background-color)"}`}
            animate={{
              visibility: collapsed ? "hidden" : "visible",
              opacity: collapsed ? 0 : 1,
              scaleX: collapsed ? 0 : 1,
              scaleY: collapsed ? 0 : 1,
            }}
          >
            <Link to={item.path}>
              <ButtonBorderRight child={<NavItem icon={item.icon} text={item.text} />} />
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
