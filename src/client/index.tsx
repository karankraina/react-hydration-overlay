import React from 'react';
import ReactDOM from 'react-dom/client';
import { isClient } from './utils';

import { Overlay } from './overlay';

const HYDRATION_ERROR_MIN = /Minified React error #(418|422|423|419)/gi;
const HYDRATION_ERROR_DEV = /(Hydration|hydrating)/gi;

const querySelector = '$$overlayQuerySelector$$';

if (isClient()) {
  if (!window.executed) {
    window.executed = true;
    if (document.readyState === 'complete') {
      startObserver()
    } else {
      window.addEventListener('DOMContentLoaded', startObserver);
    }
    window.onerror = errorHandler;
  }
}

function startObserver() {
  const serverRenderNode = document.querySelector(querySelector);

  const serverRender = serverRenderNode?.innerHTML;
  window.serverRender = serverRender;
}

function errorHandler(error: unknown) {
  const isHydrationError =
    HYDRATION_ERROR_MIN.test(`${error}`) ||
    HYDRATION_ERROR_DEV.test(`${error}`);

  if (isHydrationError) {
    console.log('[Overlay] : Hydration Error', error);
    const clientRenderNode = document.querySelector(querySelector);

    const clientRender = clientRenderNode?.innerHTML;
    window.clientRender = clientRender;

    const containerId = 'react-hydration-overlay';

    const overlayContainer = document.createElement('div');

    overlayContainer.id = containerId;

    document.body.appendChild(overlayContainer);

    const app = document.getElementById(containerId);

    if (!app) {
      console.error('Could not find container element in DOM.');
    } else {
      const root = ReactDOM.createRoot(app);

      const jsx = (
        <Overlay
          clientRender={window.clientRender}
          serverRender={window.serverRender}
        />
      );

      root.render(jsx);
    }
  }
}
