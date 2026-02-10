import { create } from 'zustand';

interface Room {
  id: string;
  room_number: string;
  type: string;
  capacity: number;
  price_per_night: number;
  amenities: string[];
  images: string[];
  description: string | null;
  status: 'available' | 'maintenance' | 'booked';
  created_at: string;
  updated_at: string;
}

interface RoomState {
  selectedRooms: string[];
  currentRoom: Room | null;
  isAddRoomModalOpen: boolean;
  isEditRoomModalOpen: boolean;

  // Actions
  selectRoom: (id: string) => void;
  deselectRoom: (id: string) => void;
  clearSelection: () => void;
  setCurrentRoom: (room: Room | null) => void;
  openAddRoomModal: () => void;
  closeAddRoomModal: () => void;
  openEditRoomModal: (room: Room) => void;
  closeEditRoomModal: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  selectedRooms: [],
  currentRoom: null,
  isAddRoomModalOpen: false,
  isEditRoomModalOpen: false,

  selectRoom: (id) =>
    set((state) => ({
      selectedRooms: [...state.selectedRooms, id],
    })),

  deselectRoom: (id) =>
    set((state) => ({
      selectedRooms: state.selectedRooms.filter((rid) => rid !== id),
    })),

  clearSelection: () => set({ selectedRooms: [] }),

  setCurrentRoom: (room) => set({ currentRoom: room }),

  openAddRoomModal: () => set({ isAddRoomModalOpen: true }),
  closeAddRoomModal: () => set({ isAddRoomModalOpen: false }),
  openEditRoomModal: (room) =>
    set({ currentRoom: room, isEditRoomModalOpen: true }),
  closeEditRoomModal: () =>
    set({ currentRoom: null, isEditRoomModalOpen: false }),
}));
