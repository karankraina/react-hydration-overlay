declare global {
  interface Window {
    // Add any additional properties you might need here
    executed: boolean;
    serverRender?: string;
    clientRender?: string;
    hydrateLog: () => void;
  }

  interface Global extends Window {
    // Merge Window properties into globalThis
  }

  let globalThis: Global;

  let executed: boolean | undefined;
}

export {};
