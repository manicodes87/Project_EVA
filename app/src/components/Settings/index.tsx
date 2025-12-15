import React, { useEffect, useState } from "react";
import AppManager from "../AppEntry";
import ModelDirectories from "../ModelDirectories";

const loadSettings = async () => {
  return await window.eva.loadSettings();
};

export default function Settings() {
  const [settings, setSettings] = useState();

  useEffect(() => {
    loadSettings().then((item) => {
      setSettings(item);
    });
  }, []);

  return (
    <div className="p-5 w-[90%] h-[90%] overflow-y-scroll">
      <AppManager settings={settings} />
      <ModelDirectories settings={settings} />
    </div>
  );
}
