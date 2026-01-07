import { create } from "zustand";

export const useUtilStore = create((set) => ({
    sideBar: false,
    setSideBar: (value) => {
        set({ sideBar: value });
    },
}));
