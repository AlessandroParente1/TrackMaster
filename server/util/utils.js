import mongoose from "mongoose";
import Role from "../models/role.model.js";
import * as Constants from './constants.js';

export const getUserRole = async (roleId) => {

    try {
        const role = await Role.findOne({ _id: roleId });

        if (!role)
            throw "Role not found";

        return role;
    } catch (error) {
        console.error(error);
    }
};


export const canPerformAction = async (permissionCheck, user) => {
    const roleId = user.roleId;
    const roleObject = await getUserRole(roleId);

    return permissionCheck(roleObject.permissions);
};

export const validateObjectId = (id, message, res) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(403).json({ message });
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
