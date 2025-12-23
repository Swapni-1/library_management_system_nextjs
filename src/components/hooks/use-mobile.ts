import { create } from "zustand";

interface MobileState {
  isMobile: boolean; // Tracks if the user is on a mobile device
  setIsMobile: (value: boolean) => void; // Updates the mobile state
}

const useIsMobile = create<MobileState>((set) => ({
  isMobile: false, // Default value
  setIsMobile: (value: boolean) => set({ isMobile: value }), // Update the state
}));

export default useIsMobile;
