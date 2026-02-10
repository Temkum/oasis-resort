import { create } from 'zustand';

interface Booking {
  id: string;
  guest: string;
  room: string;
  checkIn: string;
  checkOut: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface BookingState {
  selectedBookings: string[];
  bookingFilters: {
    status?: string;
    dateRange?: { start: string; end: string };
    roomType?: string;
  };
  currentBooking: Booking | null;

  // Actions
  selectBooking: (id: string) => void;
  deselectBooking: (id: string) => void;
  clearSelection: () => void;
  setBookingFilters: (filters: Partial<BookingState['bookingFilters']>) => void;
  setCurrentBooking: (booking: Booking | null) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedBookings: [],
  bookingFilters: {},
  currentBooking: null,

  selectBooking: (id) =>
    set((state) => ({
      selectedBookings: [...state.selectedBookings, id],
    })),

  deselectBooking: (id) =>
    set((state) => ({
      selectedBookings: state.selectedBookings.filter((bid) => bid !== id),
    })),

  clearSelection: () => set({ selectedBookings: [] }),

  setBookingFilters: (filters) =>
    set((state) => ({
      bookingFilters: { ...state.bookingFilters, ...filters },
    })),

  setCurrentBooking: (booking) => set({ currentBooking: booking }),
}));
