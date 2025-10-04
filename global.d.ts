declare namespace Vimeo {
    class Player {
      constructor(element: HTMLElement | string, options?: any);
      play(): Promise<void>;
      pause(): Promise<void>;
      destroy(): void;
      getPaused(): Promise<boolean>;
      on(event: string, callback: (data: any) => void): void;
      off(event: string, callback?: (data: any) => void): void;
    }
  }
  
  interface Window {
    Vimeo: typeof Vimeo;
  }