import { create } from 'zustand';

interface UIState {
  isChatPanelOpen: boolean;
  isTransferDialogOpen: boolean;
  isInviteDialogOpen: boolean;
  isSidebarOpen: boolean;

  toggleChatPanel: () => void;
  setChatPanelOpen: (open: boolean) => void;
  setTransferDialogOpen: (open: boolean) => void;
  setInviteDialogOpen: (open: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>(set => ({
  isChatPanelOpen: true,
  isTransferDialogOpen: false,
  isInviteDialogOpen: false,
  isSidebarOpen: false,

  setSidebarOpen: isSidebarOpen => set({ isSidebarOpen }),
  setChatPanelOpen: isChatPanelOpen => set({ isChatPanelOpen }),
  setInviteDialogOpen: isInviteDialogOpen => set({ isInviteDialogOpen }),
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),

  setTransferDialogOpen: isTransferDialogOpen => {
    return set({ isTransferDialogOpen });
  },

  toggleChatPanel: () => {
    return set(state => ({ isChatPanelOpen: !state.isChatPanelOpen }));
  },
}));
