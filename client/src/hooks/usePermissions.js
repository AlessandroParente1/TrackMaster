import { useState, useEffect } from "react";
import AuthService from "../services/auth-service";
import useAuthStore from "./useAuth";

// Custom hook to check user permissions
export const usePermissions = (permissionCheck) => {
    const [permissionsList, setPermissionsList] = useState([]);
    const useAuth = useAuthStore();

    useEffect(() => {
        const user = useAuth.userProfile;
        setPermissionsList(user?.roleId.permissions); // Set permissions list from user profile
    }, []);

    return permissionCheck(permissionsList); // Check if user has the required permission
};
