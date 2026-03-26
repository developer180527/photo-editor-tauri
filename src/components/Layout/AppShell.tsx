// ============================================================
//  components/Layout/AppShell.tsx
//  Pure layout component. Zero logic, zero store access.
//  Changing the layout means editing only this file.
// ============================================================

import React from "react";

interface AppShellProps {
  menuBar: React.ReactNode;
  toolStrip: React.ReactNode;
  canvas: React.ReactNode;
  propertiesPanel: React.ReactNode;
  layersPanel: React.ReactNode;
  statusBar: React.ReactNode;
}

export function AppShell({
  menuBar,
  toolStrip,
  canvas,
  propertiesPanel,
  layersPanel,
  statusBar,
}: AppShellProps) {
  return (
    <div className="app-shell">
      {/* Top menu bar — data-tauri-drag-region enables native OS window drag */}
      <header className="app-menubar" data-tauri-drag-region>
        {menuBar}
      </header>

      {/* Main work area */}
      <div className="app-body">
        {/* Left: tool strip */}
        <aside className="app-toolstrip">{toolStrip}</aside>

        {/* Center: canvas */}
        <main className="app-canvas">{canvas}</main>

        {/* Right: panels */}
        <aside className="app-panels">
          <div className="app-properties">{propertiesPanel}</div>
          <div className="app-layers">{layersPanel}</div>
        </aside>
      </div>

      {/* Bottom status bar */}
      <footer className="app-statusbar">{statusBar}</footer>
    </div>
  );
}