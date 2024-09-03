import mongoose from "mongoose";
import Role from "../models/role.model.js";
import * as Constants from './constants.js';

//This function retrieves a user's role from the database based on their roleId. It queries the Role collection and returns the role object if found. If the role is not found, it throws an error.
export const getUserRole = async (roleId) => {
    try {
        const role = await Role.findOne({ _id: roleId });  // Finds the role in the Role collection by the roleId.
        if (!role)
            throw "Role not found";  // Throws an error if the role is not found.
        return role;  // Returns the role object.
    } catch (error) {
        console.error(error);  // Logs any error that occurs during the process.
    }
};


//This function checks whether a user has permission to perform a specific action. It retrieves the user's role using getUserRole and then checks if the required permission exists in the user's role permissions.
export const canPerformAction = async (permissionCheck, user) => {
    const roleId = user.roleId;  // Extracts the roleId from the user object.
    const roleObject = await getUserRole(roleId);  // Retrieves the role object using getUserRole.

    return permissionCheck(roleObject.permissions);  // Checks if the required permission exists in the role's permissions.
};

//This function validates whether a provided id is a valid MongoDB ObjectId. If it is not valid, it sends a response with a 403 status and an error message
export const validateObjectId = (id, message, res) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {  // Checks if the id is a valid MongoDB ObjectId.
        return res.status(403).json({ message });  // Sends a 403 response with the provided message if the id is invalid.
    }
};


//These functions check whether a user's role has specific permissions. They determine if the permissions list for a role includes the specific permission constant defined in Constants.js.
const canManageTickets = (permissionsList) => permissionsList.includes(Constants.MANAGE_TICKET);  // Checks if the role's permissions include MANAGE_TICKET.
const canManageProjects = (permissionsList) => permissionsList.includes(Constants.MANAGE_PROJECT);  // Checks if the role's permissions include MANAGE_PROJECT.
const canManageAdminPage = (permissionsList) => permissionsList.includes(Constants.MANAGE_ADMIN_PAGE);  // Checks if the role's permissions include MANAGE_ADMIN_PAGE.

//This object groups the permission check functions together, making them accessible from a single Permissions export. This allows for easy access to these functions throughout the application.
export const Permissions = {
    canManageTickets,  // Export the canManageTickets function.
    canManageProjects,  // Export the canManageProjects function.
    canManageAdminPage  // Export the canManageAdminPage function.
};
