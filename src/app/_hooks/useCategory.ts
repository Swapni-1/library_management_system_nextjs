import { create } from "zustand";

interface Category{
    name : string;
    setName : (newName : string) => void;
}

export const useCategoryStore = create<Category>((set) => ({
    name : "",
    setName : (newName) => set({name : newName})
}))