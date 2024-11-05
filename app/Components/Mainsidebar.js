"use client";

import React, { useState } from "react";
import Link from 'next/link';
import {
  FiBarChart,
  FiChevronDown,
  FiChevronsRight,
  FiDollarSign,
  FiHome,
  FiMonitor,
  FiShoppingCart,
  FiTag,
  FiUsers,
} from "react-icons/fi";
import { LuListTodo,LuContact } from "react-icons/lu";
import { BsBookmarkStar } from "react-icons/bs";
import { PiTargetLight } from "react-icons/pi";
import { motion } from "framer-motion";
import Kanban from "./Kanban";

//the main function
export const Mainsidebar = () => {
  return (
    <div className="flex bg-neutral-900">
      <Sidebar />
      {/* <ExampleContent /> */}
    </div>
  );
};

//the sicdbar that contains in main function
const Sidebar = () => {
  // const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Daily Plan");

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r border-neutral-500 bg-neutral-900 "
      style={{
        width: "225px",
      }}
    >
      <TitleSection />

      <div className="space-y-1">
        <Option
        
          Icon={LuListTodo}
          title="Daily Plan"
          selected={selected}
          setSelected={setSelected}
          link="/Daily"
        />
        <Option
        
          Icon={BsBookmarkStar}
          title="Important"
          selected={selected}
          setSelected={setSelected}
          link="/Important"
        />
        <Option
          Icon={PiTargetLight}
          title="Long Term"
          selected={selected}
          setSelected={setSelected}
          link="/Longterm"
        />
        <div className="w-full h-auto grid place-items-center">
          <div className="h-60 w-5/6 border border-white p-2 mt-8 mb-3 rounded-md">
            {" "}
            this is the video section{" "}
          </div>
        </div>

        <Option
          Icon={LuContact}
          title="Contact Us"
          selected={selected}
          setSelected={setSelected}
          link="/Drd"
        />
        {/* <Option
          Icon={FiTag}
          title="Tags"
          selected={selected}
          setSelected={setSelected}
          open={open}
        /> */}
        {/* <Option
          Icon={FiBarChart}
          title="Analytics"
          selected={selected}
          setSelected={setSelected}
          open={open}
        /> */}
        {/* <Option
          Icon={FiUsers}
          title="Members"
          selected={selected}
          setSelected={setSelected}
          open={open}
        /> */}
      </div>

      {/* <ToggleClose open={open} setOpen={setOpen} /> */}
    </motion.nav>
  );
};

const Option = ({ Icon, title, selected, setSelected,link }) => {
  return (
    <Link href={link}>
    <motion.button
      layout
      onClick={() => setSelected(title)}
      className={`relative flex h-9 w-11/12 justify-start items-center rounded-md mt-1 ${
        selected === title
          ? "bg-neutral-700 text-neutral-50 hover:border hover:border-neutral-100"
          : "text-neutral-50 hover:bg-transparent hover:border hover:border-neutral-500"
      }`}
    >
      <motion.div
        layout
        className="grid h-full w-10 place-content-center text-lg"
      >
        <Icon />
      </motion.div>

      <span className="text-sm font-medium">{title}</span>
    </motion.button>
    </Link>
  );
  
};

// main Profile section for me

const TitleSection = ({ open }) => {
  return (
    <div className="mb-3 border-b border-neutral-500 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-neutral-600">
        <div className="flex items-center gap-2">
          <Logo />
          {open && (
            <div
            // layout
            // initial={{ opacity: 0, y: 12 }}
            // animate={{ opacity: 1, y: 0 }}
            // transition={{ delay: 0.125 }}
            >
              <span className="block text-sm font-light">CustomName</span>
              {/* <span className="block text-xs text-slate-500">P</span> */}
            </div>
          )}
        </div>
        {/* {open && <FiChevronDown className="mr-2" />} */}
      </div>
    </div>
  );
};

const Logo = () => {
  // Temp logo from https://logoipsum.com/
  return (
    <motion.div
      layout
      className="grid size-10 shrink-0 place-content-center rounded-md bg-indigo-600"
    >
      <svg
        width="24"
        height="auto"
        viewBox="0 0 50 39"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="fill-slate-50"
      >
        <path
          d="M16.4992 2H37.5808L22.0816 24.9729H1L16.4992 2Z"
          stopColor="#000000"
        ></path>
        <path
          d="M17.4224 27.102L11.4192 36H33.5008L49 13.0271H32.7024L23.2064 27.102H17.4224Z"
          stopColor="#000000"
        ></path>
      </svg>
    </motion.div>
  );
};

// const ToggleClose = ({ open, setOpen }) => {
//   return (
//     <motion.button
//       layout
//       onClick={() => setOpen((pv) => !pv)}
//       className="absolute bottom-0 left-0 right-0 border-t border-neutral-500 transition-colors hover:bg-neutral-700"
//     >
//       <div className="flex items-center p-2">
//         <motion.div
//           layout
//           className="grid size-10 place-content-center text-lg"
//         >
//           <FiChevronsRight
//             className={`transition-transform ${open && "rotate-180"}`}
//           />
//         </motion.div>
//         {open && (
//           <motion.span
//             layout
//             initial={{ opacity: 0, y: 12 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.125 }}
//             className="text-xs font-medium"
//           >
//             Hide
//           </motion.span>
//         )}
//       </div>
//     </motion.button>
//   );
// };
const ExampleContent = () => <div><Kanban /></div>

export default Mainsidebar;
