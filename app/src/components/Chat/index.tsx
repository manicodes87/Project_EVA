import React, { useEffect, useRef, useState } from "react";
import BasicInput from "../../ui/inputs/BasicInput";
import { AnimatePresence, animate } from "motion/react";
import { ChatInterface, SenderEnum } from "../../types/types";
import ChatBubble from "../../ui/chatBubble";

export default function Chat() {
  const [chats, setChats] = useState<ChatInterface | null>(null);
  const [input, setInput] = useState<string | null>(null);
  const scrollRef = useRef(null);

  const loadChats = async () => {
    const chats = await window.eva.readChats();

    setChats(chats);
  };

  const sendMessage = async () => {
    const data = await window.eva.saveChats(SenderEnum.USER, input);
    if (data.message === 200) loadChats();
  };

  // Load chat and assign eva reponse callback
  useEffect(() => {
    loadChats();
    window.eva.onMessageReady(() => loadChats());
  }, []);

  // Animate smooth scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    animate(el.scrollTop, el.scrollHeight, {
      duration: 0.4,
      ease: "easeIn",
      onUpdate: (value) => (el.scrollTop = value),
    });
  }, [chats]);

  return (
    <div className="p-5 flex w-[90%] h-[90%] bg-(--background-color) rounded-2xl flex-col">
      <div className="flex-1 overflow-y-scroll scrollbar-hide" ref={scrollRef}>
        <AnimatePresence>
          {chats ? (
            chats.chats.map((items) => (
              <div
                key={items.id}
                className={`flex m-3 ${items.sender == SenderEnum.USER ? "justify-end" : "justify-start"}`}
              >
                <ChatBubble sender={items.sender} text={items.message} />
              </div>
            ))
          ) : (
            <h1>Loading...</h1>
          )}
        </AnimatePresence>
      </div>

      <div>
        <BasicInput
          onChangeCallback={(value) => setInput(value)}
          onEnterCallback={sendMessage}
        />
      </div>
    </div>
  );
}
