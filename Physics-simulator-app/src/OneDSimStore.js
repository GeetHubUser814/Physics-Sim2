import {create} from 'zustand';

export const useOneDStore = create((set) => ({
    oneDSim: {
        velocity: 10,
        acceleration: 5,
        accelDirection: false,
        time: 10,
    },

    setStoreOneDSim: (newOneDSim) => set(() => ({oneDSim: newOneDSim})),

    updateOneDSim: (fieldName, value) =>
        set((state) => ({
            oneDSim: {
                ...state.oneDSim,
                [fieldName]: value
            }
        })),

        logout: () => set({
            oneDSim: {
                velocity: 1,
                acceleration: 5,
                accelDirection: false,
                time: 10,
            }
        })

}));