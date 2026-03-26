// ============================================================
//  components/ToolStrip/ToolStrip.tsx
// ============================================================

import React from "react";
import { useToolStore, TOOL_DEFINITIONS } from "@/stores/useToolStore";
import { ToolId } from "@/types";

// Minimal SVG icons keyed by icon string in ToolDefinition
const ICONS: Record<string, React.ReactNode> = {
  cursor: (
    <svg viewBox="0 0 16 16" fill="currentColor">
      <path d="M3 1l10 6.5-4.5 1.5L7 13 3 1z" />
    </svg>
  ),
  hand: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 2v7M5.5 4v5M3 6v3a5 5 0 0010 0V6M10.5 4v5" strokeLinecap="round" />
    </svg>
  ),
  zoom: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="7" cy="7" r="4.5" />
      <path d="M10.5 10.5L14 14" strokeLinecap="round" />
    </svg>
  ),
  crop: (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 1v10h10M1 4h10v10" strokeLinecap="round" />
    </svg>
  ),
};

function ToolButton({ id, label, shortcut, icon, active, onClick }: {
  id: ToolId;
  label: string;
  shortcut: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`tool-btn ${active ? "tool-btn--active" : ""}`}
      onClick={onClick}
      title={`${label} (${shortcut})`}
      aria-label={label}
      aria-pressed={active}
    >
      <span className="tool-btn__icon">{ICONS[icon]}</span>
    </button>
  );
}

export function ToolStrip() {
  const { activeTool, setActiveTool } = useToolStore();

  return (
    <div className="toolstrip">
      {TOOL_DEFINITIONS.map((tool) => (
        <ToolButton
          key={tool.id}
          {...tool}
          active={activeTool === tool.id}
          onClick={() => setActiveTool(tool.id)}
        />
      ))}
    </div>
  );
}
