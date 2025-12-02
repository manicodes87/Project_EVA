import React from "react";
import { motion } from "motion/react";

export default function BasicInput() {
  return (
    <motion.textarea
      className="w-full resize-none border-(--background-darker-color) text-sm bg-(--background-darker-color) rounded-md p-2 outline-none transition duration-100 focus:border-(--accent-color)"
      placeholder="Type here"
    ></motion.textarea>
  );
}
