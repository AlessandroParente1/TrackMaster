import mongoose from "mongoose";
import Role from "../models/role.model.js";
import * as Constants from './constants.js';

export const getUserRole = async (roleId) => {
    try {
        const role = await Role.findOne({ _id: roleId });  // Queries the database to find a role document by its `_id`.

        if (!role)  // If no role is found, an error is thrown.
            throw "Role not found";

        return role;  // If a role is found, it is returned.
    } catch (error) {
        console.error(error);  // If an error occurs (e.g., role not found), it is logged to the console.
    }
};



export const canPerformAction = async (permissionCheck, user) => {
    const roleId = user.roleId;  // Retrieves the `roleId` from the `user` object.
    const roleObject = await getUserRole(roleId);  // Calls `getUserRole` to get the role object based on `roleId`.

    return permissionCheck(roleObject.permissions);  // Checks if the role's permissions include the required permission using the provided `permissionCheck` function.
};


export const validateObjectId = (id, message, res) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {  // Checks if the `id` is a valid MongoDB ObjectId.
        return res.status(403).json({ message });  // If not valid, it sends a 403 status code with the provided `message`.
    }
};




const canManageTickets = (permissionsList) => permissionsList.includes(Constants.MANAGE_TICKET);
// Returns true if `permissionsList` includes the `MANAGE_TICKET` permission from the constants.
const canManageProjects = (permissionsList) => permissionsList.includes(Constants.MANAGE_PROJECT);
// Returns true if `permissionsList` includes the `MANAGE_PROJECT` permission from the constants.
const canManageAdminPage = (permissionsList) => permissionsList.includes(Constants.MANAGE_ADMIN_PAGE);
// Returns true if `permissionsList` includes the `MANAGE_ADMIN_PAGE` permission from the constants.

export const Permissions = {
    canManageTickets,
    canManageProjects,
    canManageAdminPage
};
// This exports the permission check functions as part of a `Permissions` object.
