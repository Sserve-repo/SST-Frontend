import { create } from "zustand";

interface SidebarToggle {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useSidebarToggle = create<SidebarToggle>((set) => ({
  isCollapsed: false,
  toggleSidebar: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
}));
