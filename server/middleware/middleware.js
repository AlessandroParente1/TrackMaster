import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from '../models/user.model.js';
import { getUserRole } from "../util/utils.js";

//is intended to protect routes from unauthorized access.
// It is used to ensure that only authenticated users can access certain resources
// (such as routes involving users, roles, projects, tickets, etc.)
export const authMiddleware = async (req, res, next) => {
    //extracts the token from the x-access-token header of the incoming http request
    const token = req.headers['x-access-token'];

    //This token was previously sent by the client and contains information about the authenticated user

    //the token expiration is checked in the auth.controller.js file in the login function
    if (token) {
        //If a token is present, it is verified using jsonwebtoken's verify method
        jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
            if (error) {
                return res.status(500).json({ error });
            }

            //Check if the user exists
            //If the token is valid, it is decoded. The decoded part of the token contains information about the user, including his id.
            // The function then searches for a user in the database with the id obtained from the token.
            User.findOne({ _id: decoded.id }).then((user) => {
                if (user) {
                    //If the user is found, the user data is added to the req object,
                    // allowing subsequent middleware and controllers to access this information.
                    req.user = user.toJSON();
                    return next();
                }
            }).catch((error) => {
                return res.status(403).json({ message: "User not found" });
            });

        });
    }
    else {
        //If the token is not present, the user is not authenticated
        console.log("authMiddleware issue");
        return res.sendStatus(403);
    }
};


export const handleError = async (error, req, res, next) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: error.message
    });
};


export const routeNotFound = async (req, res) => {
    console.log("Route not found");
    res.status(404).json({ message: "Something went wrong" });
};


export const validateResource = (resourceSchema) => {
    return (req, res, next) => {
        resourceSchema.validate(req.body)
            .then((valid) => {
                next();
            })
            .catch((err) => {
                res.status(400).json({ message: err.errors[0] });
            });
    };
};

export const validateParamId = (paramId) => {
    return (req, res, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params[paramId])) {
            return res.status(404).json({ message: `Invalid ${paramId}` });
        }

        next();
    };
};

export const checkUserPermissions = (objectName, permissionCheck) => async (req, res, next) => {
    //permissionCheck Is a callback function that checks whether the user's permissions include the necessary ones.
    const roleId = req.user.roleId;
    const roleObject = await getUserRole(roleId);

    //Calls the permissionCheck function with the role's permissions in roleObject
    // If this function returns true, it means the user has the necessary permissions.
    const isPermitted = permissionCheck(roleObject.permissions);

    if (isPermitted) {
        next();
    }
    else {
        return res.status(403).json({ message: `Not permitted to create/modify ${objectName}` });
    }
}

