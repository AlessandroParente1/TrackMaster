import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        //performs a database query using Mongoose:
        //findOne looks in the User collection for a document where the email field matches the provided email,
        //.populate("roleId") replaces the roleId field in the User document with the full document it references in the Role collection
        //Instead of returning just the ID of the role, populate fetches and includes the full role document,
        // making it easier to access detailed information about the user’s role.
        const existingUser = await User.findOne({ email }).populate("roleId");

        if (!existingUser) {
            return res.status(400).json({ message: "Please provide a valid email address and password" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Please provide a valid email address and password" });
        }

        //generates a signed JWT as an access token for the user. The token contains the user’s ID, which can be used to identify the user in subsequent requests
        //{ id: existingUser._id } is the payload, process.env.SECRET_KEY is the secret key used to sign the token, and { expiresIn: process.env.JWT_TOKEN_EXPIRATION } is the expiration time of the token
        const accessToken = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY, { expiresIn: process.env.JWT_TOKEN_EXPIRATION });
        //The jwt.sign method returns a string, which is the signed JWT containing the encoded payload. This string is stored in accessToken and can be sent to the user for later authentication.

        return res.status(200).json({
            userProfile: {
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email,
                _id: existingUser._id,
                roleId: existingUser.roleId,
            },
            accessToken
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server issue" });
    }
};

