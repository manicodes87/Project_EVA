import React from "react";
import BasicInput from "../../ui/inputs/BasicInput";

const loadChats = async () => {
  const chats = await window.eva.readChats();
  console.log(chats);

  window.eva.saveChats("User", "DAMN");
};

export default function Chat() {
  loadChats();
  return (
    <div className="p-5 flex w-[90%] h-[90%] bg-(--background-color) rounded-2xl flex-col">
      <div className="flex-1"></div>

      <div>
        <BasicInput />
      </div>
    </div>
  );
}
