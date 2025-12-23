import { create } from "zustand";

interface SideBar{
    selectedName : string;
    setSelectedName : (newSelectedName : string) => void;
}

export const useSidebarStore = create<SideBar>((set) => ({
    selectedName : "",
    setSelectedName : (newSelectedName) => set({selectedName : newSelectedName})
}))