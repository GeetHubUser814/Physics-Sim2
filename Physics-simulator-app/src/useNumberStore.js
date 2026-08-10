import {create} from "zustand";

export const useNumberStore = create((set) => ({
    numberArray: [],
    setNumbers: (newNumbers) => set({numberArray: newNumbers}),
}));
