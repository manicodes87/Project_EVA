import { registerReadChats, registerSaveChats } from "./chat-bridge";
import { registerEvaAnswer, registerEvaWake } from "./eva-bridge";

export function registerIpcMainHandlers() {
  registerEvaWake();
  registerReadChats();
  registerSaveChats();
  registerEvaAnswer();
}
