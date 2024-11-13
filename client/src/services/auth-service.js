import decode from 'jwt-decode';
import useAuthStore from "@/hooks/useAuth.js";

// Function to initiate login request

const login = (data) => {
    return {
        url: "/auth/login",
        method: "post",
        data
    };
};


const isAuthorized = () => {
    const authStore = useAuthStore.getState(); //qui gli importa solo lo stato in cui si trova l'utente

    const token = authStore.accessToken;

    if (token === null || authStore.userProfile === null) {//
        authStore.clear();
        return false;
    }

    if (token) {
        const decodeToken = decode(token);

        if (decodeToken.exp * 1000 < new Date().getTime()) {
            authStore.clear();
            return false;
        }
        else {
            return true;
        }
    }

    return false;
};

const AuthService = {
    login,
    isAuthorized
};

export default AuthService;