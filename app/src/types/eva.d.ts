import { ChatInterface } from "./types";

declare global {
  interface Window {
    eva: {
      onWake: (cb: () => void) => void;
      readChats: () => Promise<ChatInterface>;
      saveChats: (sender: string, message: string) => void;
    };
  }
}
export {};
