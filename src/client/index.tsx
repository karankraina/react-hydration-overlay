import React from 'react';
import ReactDOM from 'react-dom/client';
import { isClient } from './utils';

import { Overlay } from './overlay';

const HYDRATION_ERROR_MIN = /Minified React error #(418|422|423|419)/gi;
const HYDRATION_ERROR_DEV = /(Hydration|hydrating)/gi;

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

if (isClient()) {
  if (!window.executed) {
    window.executed = true;
    window.addEventListener('DOMContentLoaded', startObserver);
    window.onerror = errorHandler;
    console.log('I am running on client');
  }
}

function startObserver() {
  const serverRenderNode = document.querySelector('div#app');

  const serverRender = serverRenderNode?.innerHTML;
  window.serverRender = serverRender;
}

function errorHandler(error: unknown) {
  console.log('in error handelr', { error });
  const isHydrationError =
    HYDRATION_ERROR_MIN.test(`${error}`) ||
    HYDRATION_ERROR_DEV.test(`${error}`);
  if (isHydrationError) {
    console.log('[Overlay] : Hydration Error', error);
    const clientRenderNode = document.querySelector('div#app');

    const clientRender = clientRenderNode?.innerHTML;
    window.clientRender = clientRender;
  }
}

const containerId = 'react-hydration-overlay';

const overlayContainer = document.createElement('div');

overlayContainer.id = containerId;

document.body.appendChild(overlayContainer);

const app = document.getElementById(containerId);

if (!app) {
  console.error('Could not find container element in DOM.');
} else {
  const root = ReactDOM.createRoot(app);

  const jsx = <Overlay />;

  root.render(jsx);
}
