import { createRoot } from "react-dom/client";
import React from "react";
import "./index.css";
import NavBar from "./components/NavBar";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Settings from "./components/Settings";
import Chat from "./components/Chat";
import Home from "./components/Home";
import { AnimatePresence, motion } from "framer-motion";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              className="h-full w-full flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <Home />
            </motion.div>
          }
        />
        <Route
          path="/chat"
          element={
            <motion.div
              className="h-full w-full flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <Chat />
            </motion.div>
          }
        />
        <Route
          path="/settings"
          element={
            <motion.div
              className="h-full w-full flex justify-center items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <Settings />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div id="app" className="flex h-screen w-screen overflow-hidden shadow-lg">
        <NavBar />
        <div className="flex-1 bg-(--background-lighter-color) ml-px relative">
          <AnimatedRoutes />
        </div>
      </div>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
