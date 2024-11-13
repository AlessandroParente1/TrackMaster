import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

//Is a Zustand store to manage authentication, able to update and maintain the state in sessionStorage until the session is closed.
const useAuthStore = create(persist //used persist to save the state in sessionStorage (the user is still logged in even if the page is reloaded)
(
    //create is a Zustand function that allows you to configure the initial state and the actions to change it

    (set, _) => ({
        accessToken: null,//initial value
        userProfile: null,//initial value

        //accepts a userProfile object and updates the state with the new user profile.
        setUserProfile: (userProfile) => set((state) => ({ ...state, userProfile })),
        //takes an accessToken value and updates the state with the new access token.
        setAccessToken: (accessToken) => set((state) => ({ ...state, accessToken })),
        //resets the state to null for accessToken and userProfile, essentially "logging out" the user.
        clear: () => set(() => ({ accessToken: null, userProfile: null }))
    }),
    {
        name: 'auth', //storage name
        storage: createJSONStorage(() => sessionStorage), //the state gets memorized in the sessionStorage of the browser
    }
));

export default useAuthStore;
