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

// Function to check if the user is authorized based on the stored access token
const isAuthorized = () => {
    const authStore = useAuthStore.getState(); // Access the auth store state

    const token = authStore.accessToken;

    if (authStore.accessToken === null || authStore.userProfile === null) {
        authStore.clear(); // Clear the store if no access token or user profile exists
        return false;
    }

    if (token) {
        const decodeToken = decode(token);

        if (decodeToken.exp * 1000 < new Date().getTime()) {
            authStore.clear(); // Clear the store if the token has expired
            return false;
        } else {
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
