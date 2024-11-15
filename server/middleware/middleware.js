import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from '../models/user.model.js';
import { getUserRole } from "../util/utils.js";

export const authMiddleware = async (req, res, next) => {
    //extracts the token from the x-access-token header of the incoming request
    const token = req.headers['x-access-token'];

    //the token expiration is checked in the auth.controller.js file in the login function

    if (token) {
        //If a token is present, it is verified using jsonwebtoken's verify method
        jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
            if (error) {
                return res.status(500).json({ error });
            }

            //Check if the user exists
            User.findOne({ _id: decoded.id }).then((user) => {
                if (user) {//If the user is found, the user data is added to the req object,
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
    const roleId = req.user.roleId;
    const roleObject = await getUserRole(roleId);

    const isPermitted = permissionCheck(roleObject.permissions);

    if (isPermitted) {
        next();
    }
    else {
        return res.status(403).json({ message: `Not permitted to create/modify ${objectName}` });
    }
}

