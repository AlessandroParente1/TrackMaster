import { useState, useEffect } from "react";
import useAuthStore from "./useAuth";

//checks the user permissions
export const usePermissions = (permissionCheck) => {
    //initialization
    const [permissionsList, setPermissionsList] = useState([]);
    const useAuth = useAuthStore();

    useEffect(() => {
        const user = useAuth.userProfile;//fetches the user profile

        //updates permissionsList with the permissions associated with the user's role,
        //found in user.roleId.permissions
        setPermissionsList(user?.roleId.permissions);
    }, []//it will be executed only once since the array is empty
    );

    //permissionCheck is a function passed as a parameter to usePermissions. It checks specific permissions using permissionsList.
    //permissionCheck(permissionsList) evaluates and returns true or false based on the requested permissions check.
    return permissionCheck(permissionsList);
};