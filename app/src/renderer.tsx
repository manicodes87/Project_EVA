import { createRoot } from "react-dom/client";
import React, { useEffect } from "react";

export default function App() {
  useEffect(() => {
    window.eva.onWake(() => {
      console.log("EVA woke me up!");
    });
  });

  return <h1>Hello world!</h1>;
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
