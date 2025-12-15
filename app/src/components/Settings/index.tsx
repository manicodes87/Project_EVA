import React, { useEffect, useState } from "react";
import AppManager from "../AppEntry";

const loadSettings = async () => {
  return await window.eva.loadSettings();
};

export default function Settings() {
  const [apps, setApps] = useState();

  useEffect(() => {
    loadSettings().then((item) => {
      setApps(item);
    });
  }, []);

  return (
    <div className="p-5 w-[90%]">
      <AppManager appsList={apps} />
    </div>
  );
}
