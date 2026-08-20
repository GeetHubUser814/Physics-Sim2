import {create} from 'zustand';

export const useProjectileStore = create((set) => ({
    projectileSim: {
        elevation: 400,
        velocity: 10,
        launchAngle: 45,
        gravAcceleration: 9.8,
    },

    setStoreProjectileSim: (newProjectileSim) => set(() => ({projectileSim: newProjectileSim})),

    updateProjectileSim: (fieldName, value) =>
        set((state) => ({
            projectileSim: {
                ...state.projectileSim,
                [fieldName]: value
            }
        })),

        logout: () => set({
            projectileSim: {
                elevation: 20,
                velocity: 10,
                mass: 1,
                launchAngle: 45,
                gravAcceleration: 9.8,
            }
        })

}));