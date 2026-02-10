import { create } from 'zustand';

interface UIState {
  // Modal states
  isBookingModalOpen: boolean;
  isRoomModalOpen: boolean;
  isUserModalOpen: boolean;

  // Sidebar states
  isSidebarOpen: boolean;

  // Loading states
  isLoading: boolean;

  // Actions
  openBookingModal: () => void;
  closeBookingModal: () => void;
  openRoomModal: () => void;
  closeRoomModal: () => void;
  openUserModal: () => void;
  closeUserModal: () => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isBookingModalOpen: false,
  isRoomModalOpen: false,
  isUserModalOpen: false,
  isSidebarOpen: false,
  isLoading: false,

  openBookingModal: () => set({ isBookingModalOpen: true }),
  closeBookingModal: () => set({ isBookingModalOpen: false }),
  openRoomModal: () => set({ isRoomModalOpen: true }),
  closeRoomModal: () => set({ isRoomModalOpen: false }),
  openUserModal: () => set({ isUserModalOpen: true }),
  closeUserModal: () => set({ isUserModalOpen: false }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open: boolean) => set({ isSidebarOpen: open }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));
