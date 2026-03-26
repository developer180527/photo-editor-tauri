// ============================================================
//  App.tsx  –  Root component.
//  Wires layout slots to feature components.
//  All feature composition happens here — AppShell stays dumb.
// ============================================================

import React from "react";
import { AppShell } from "@/components/Layout/AppShell";
import { MenuBar } from "@/components/MenuBar/MenuBar";
import { ToolStrip } from "@/components/ToolStrip/ToolStrip";
import { Canvas } from "@/components/Canvas/Canvas";
import { PropertiesPanel } from "@/components/PropertiesPanel/PropertiesPanel";
import { LayersPanel } from "@/components/LayersPanel/LayersPanel";
import { StatusBar } from "@/components/Layout/StatusBar";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

function AppController() {
  // Global keyboard shortcuts — mounted once at app root
  useKeyboardShortcuts();
  return null;
}

export default function App() {
  return (
    <>
      <AppController />
      <AppShell
        menuBar={<MenuBar />}
        toolStrip={<ToolStrip />}
        canvas={<Canvas />}
        propertiesPanel={<PropertiesPanel />}
        layersPanel={<LayersPanel />}
        statusBar={<StatusBar />}
      />
    </>
  );
}
