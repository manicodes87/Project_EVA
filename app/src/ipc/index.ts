import { registerReadChats, registerSaveChats } from "./chat-bridge";
import { registerEvaBridge } from "./eva-bridge";

export function registerIpcMainHandlers() {
  registerEvaBridge();
  registerReadChats();
  registerSaveChats();
}
