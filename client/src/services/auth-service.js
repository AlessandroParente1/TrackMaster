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

//Checks whether the user is authorized
const isAuthorized = () => {
    //Here it only cares about the state in which the user is found right now
    const authStore = useAuthStore.getState();

    const token = authStore.accessToken;

    //If the user's token or profile is absent,
    // the authentication state is cleared by calling authStore.clear()
    // and the function returns false
    if (token === null || authStore.userProfile === null) {//
        authStore.clear();
        return false;
    }

    if (token) {

        //Decodes the token
        const decodeToken = decode(token);

        //Check if the token has expired by comparing the expiration time (exp) with the current timestamp.
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