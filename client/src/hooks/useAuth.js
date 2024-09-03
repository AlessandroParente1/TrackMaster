import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Zustand store to manage authentication state
const useAuthStore = create(persist(
    (set, _) => ({
        accessToken: null,
        userProfile: null,
        setUserProfile: (userProfile) => set((state) => ({ ...state, userProfile })),
        setAccessToken: (accessToken) => set((state) => ({ ...state, accessToken })),
        clear: () => set(() => ({ accessToken: null, userProfile: null }))
    }),
    {
        name: 'auth', // Name for the storage key
        storage: createJSONStorage(() => sessionStorage), // Use session storage
    }
));

export default useAuthStore;
