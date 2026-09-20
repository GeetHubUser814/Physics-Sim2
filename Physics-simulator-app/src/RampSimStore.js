import {create} from 'zustand';

export const useRampStore = create((set) => ({
    rampSim: {
        angle: 30,
        length: 600,
        vI: 45,
        friction: 0,
        topBottom: true,
    },

    setStoreRampSim: (newRampSim) => set(() => ({rampSim: newRampSim})),

    updateProjectileSim: (fieldName, value) =>
        set((state) => ({
            rampSim: {
                ...state.rampSim,
                [fieldName]: value
            }
        })),

        logout: () => set({
            rampSim: {
                angle: 30,
                length: 600,
                vI: 45,
                friction: 0,
                topBottom: true,
            }
        })

}));