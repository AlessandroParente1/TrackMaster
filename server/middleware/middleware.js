import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from '../models/user.model.js';
import { getUserRole } from "../util/utils.js";

//This middleware function is responsible for authenticating the user based on a JWT (JSON Web Token) provided in the request headers.
export const authMiddleware = async (req, res, next) => {
    const token = req.headers['x-access-token'];  // Extracts the JWT from the 'x-access-token' header.
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {  // Verifies the token using the secret key.
            if (error) {
                return res.status(500).json({ error });  // Returns an error if token verification fails.
            }
            //Check if the user exists
            User.findOne({ _id: decoded.id }).then((user) => {  // Finds the user in the database based on the decoded token's ID.
                if (user) {
                    req.user = user.toJSON();  // Attaches the user's information to the request object.
                    return next();  // Proceeds to the next middleware or route handler.
                }
            }).catch(() => {
                return res.status(403).json({ message: "User not found" });  // Returns an error if the user is not found.
            });

        });
    }
    else {
        console.log("authMiddleware issue");
        return res.sendStatus(403);  // Returns a 403 status if no token is provided.
    }
};


//This function handles errors that occur during the request-response cycle.
export const handleError = async (error, req, res) => {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;  // Determines the appropriate status code for the response.
    res.status(statusCode);
    res.json({
        message: error.message  // Sends the error message in the response body.
    });
};


//This function handles requests to routes that are not defined.
export const routeNotFound = async (req, res) => {
    console.log("Route not found");
    res.status(404).json({ message: "Something went wrong" });  // Sends a 404 status with a generic error message.
};


//This middleware function validates the request body against a provided schema.
export const validateResource = (resourceSchema) => {
    return (req, res, next) => {
        resourceSchema.validate(req.body)  // Validates the request body using the provided schema.
          .then(() => {
              next();  // Proceeds to the next middleware or route handler if validation succeeds.
          })
          .catch((err) => {
              res.status(400).json({ message: err.errors[0] });  // Sends a 400 status with the validation error message.
          });
    };
};

//This middleware function checks if a route parameter is a valid MongoDB ObjectId.
export const validateParamId = (paramId) => {
    return (req, res, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params[paramId])) {  // Checks if the parameter is a valid ObjectId.
            return res.status(404).json({ message: `Invalid ${paramId}` });  // Sends a 404 status if the ID is invalid.
        }

        next();  // Proceeds to the next middleware or route handler.
    };
};

//This middleware function checks if the user has the necessary permissions to perform an action on a specific object
export const checkUserPermissions = (objectName, permissionCheck) => async (req, res, next) => {
    const roleId = req.user.roleId;  // Retrieves the user's role ID.
    const roleObject = await getUserRole(roleId);  // Fetches the role object based on the role ID.

    const isPermitted = permissionCheck(roleObject.permissions);  // Checks if the user has the required permissions.

    if (isPermitted) {
        next();  // Proceeds to the next middleware or route handler if the user has the required permissions.
    }
    else {
        return res.status(403).json({ message: `Not permitted to create/modify ${objectName}` });  // Sends a 403 status if the user lacks the required permissions.
    }
};


