// src/store/bookingStore.js
import { create } from "zustand";

const useBookingStore = create((set, get) => ({
  // Holds the user’s search criteria
  searchCriteria: {
    fromStop: "",
    toStop: "",
    shift: "",
    day: "",
  },

  // Shuttle search results (from your API)
  shuttleResults: [],

  // The shuttle the user selects to book
  selectedShuttle: null,

  /**
   * Update any fields in searchCriteria by merging partial changes
   * e.g. setSearchCriteria({ fromStop: 'PariChowk' })
   */
  setSearchCriteria: (newValues) =>
    set((state) => ({
      searchCriteria: { ...state.searchCriteria, ...newValues },
    })),

  setShuttleResults: (results) => set({ shuttleResults: results }),
  setSelectedShuttle: (shuttle) => set({ selectedShuttle: shuttle }),
}));

export default useBookingStore;
