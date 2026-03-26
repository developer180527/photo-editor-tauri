// ============================================================
//  components/MenuBar/MenuBar.tsx
// ============================================================

import React, { useState, useRef, useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useFileOps } from "@/hooks/useFileOps";
import { useHistoryStore } from "@/stores/useHistoryStore";
import { useCanvasStore } from "@/stores/useCanvasStore";

// Discriminated union — separator items don't need label/action
type MenuItem =
  | { separator: true }
  | {
      separator?: false;
      label: string;
      shortcut?: string;
      action?: () => void;
      disabled?: boolean;
    };

interface Menu {
  label: string;
  items: MenuItem[];
}

function MenuDropdown({ items, onClose }: { items: MenuItem[]; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div className="menu-dropdown" ref={ref}>
      {items.map((item, i) =>
        item.separator ? (
          <div key={i} className="menu-separator" />
        ) : (
          <button
            key={i}
            className="menu-item"
            disabled={item.disabled}
            onClick={() => {
              item.action?.();
              onClose();
            }}
          >
            <span>{item.label}</span>
            {item.shortcut && <span className="menu-shortcut">{item.shortcut}</span>}
          </button>
        )
      )}
    </div>
  );
}

export function MenuBar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { openImage } = useFileOps();
  const { undo, redo, canUndo, canRedo } = useHistoryStore();
  const { zoomIn, zoomOut, resetView } = useCanvasStore();

  // Native window drag — only fires when clicking the bare nav background
  const handleNavMouseDown = async (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button, .menubar-menu-wrapper, span")) return;
    await getCurrentWindow().startDragging();
  };

  const menus: Menu[] = [
    {
      label: "File",
      items: [
        { label: "Open Image…", shortcut: "⌘O", action: openImage },
        { separator: true },
        { label: "Close", shortcut: "⌘W", action: () => window.close() },
      ],
    },
    {
      label: "Edit",
      items: [
        { label: "Undo", shortcut: "⌘Z", action: undo, disabled: !canUndo() },
        { label: "Redo", shortcut: "⌘⇧Z", action: redo, disabled: !canRedo() },
      ],
    },
    {
      label: "View",
      items: [
        { label: "Zoom In",    shortcut: "⌘+", action: zoomIn },
        { label: "Zoom Out",   shortcut: "⌘-", action: zoomOut },
        { label: "Fit to Window", shortcut: "⌘0", action: resetView },
      ],
    },
  ];

  return (
    <nav className="menubar-nav" onMouseDown={handleNavMouseDown}>
      <span className="menubar-logo">Pix</span>
      <div className="menubar-items">
        {menus.map((menu) => (
          <div key={menu.label} className="menubar-menu-wrapper">
            <button
              className={`menubar-menu-btn ${openMenu === menu.label ? "active" : ""}`}
              onClick={() => setOpenMenu(openMenu === menu.label ? null : menu.label)}
              onMouseEnter={() => openMenu && setOpenMenu(menu.label)}
            >
              {menu.label}
            </button>
            {openMenu === menu.label && (
              <MenuDropdown items={menu.items} onClose={() => setOpenMenu(null)} />
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}