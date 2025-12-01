declare global {
  interface Window {
    eva: {
      onWake: (cb: () => void) => void;
      invoke: (channel: string, data?: any) => Promise<any>;
    };
  }
}
export {};
