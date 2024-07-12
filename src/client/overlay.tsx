import React, { useState } from 'react';
import beautify from 'js-beautify';
import './styles.css';
import { DiffEditor } from '@monaco-editor/react';

interface OverlayProps {
  clientRender?: Window['clientRender'];
  serverRender?: Window['serverRender'];
}

export function Overlay({ clientRender, serverRender }: OverlayProps) {
  const formattedClientRender = beautify.html(clientRender ?? '', {
    indent_size: 2,
  });

  const formattedServerRender = beautify.html(serverRender ?? '', {
    indent_size: 2,
  });

  const [isOverlayVisible, setOverlayVisibility] = useState(true);

  const closeOverlay = () => {
    setOverlayVisibility(false);
  };

  return isOverlayVisible ? (
    <div className="rho-overlay">
      <div style={{ position: 'relative' }}>
        <button onClick={closeOverlay} className="rho-close-btn">
          X
        </button>
      </div>

      <DiffEditor
        height="90vh"
        language="html"
        originalLanguage="html"
        modifiedLanguage="html"
        original={formattedServerRender}
        modified={formattedClientRender}
      />
    </div>
  ) : null;
}
