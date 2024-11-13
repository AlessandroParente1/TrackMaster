import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import TicketType from "../models/ticketType.model.js";
import mongoose from "mongoose";
import { DBTicketType, DBRole, DBUsers } from "../seed/seedData.js";
import bcrypt from 'bcrypt';

//getHashedPassword is used to hash the passwords of all users present in DBUsers in parallel and returns an array of these hashed passwords.
const getHashedPassword = async () => {
    //hashedPasswordPromises is an array of promises
    const hashedPasswordPromises = DBUsers.map(user => bcrypt.hash(user.password, +process.env.PASSWORD_SALT_ROUNDS));//using + i convert process.env.PASSWORD_SALT from a string to a number
    //Salt rounds are the number of iterations used to generate the hash

    return Promise.all(hashedPasswordPromises);
};

//Creates and saves users in the database using information from DBUsers
//The passwords of these users are the hashed ones obtained from getHashedPassword.
//Each created user also has a roleId field that points to one of the created role IDs.
const seedUsers = async (role, hashedPasswords) => {
    const usersPromises = DBUsers.map((user, index) => {
        return User.create({ ...user, password: hashedPasswords[index], roleId: role[index]._id });
    });

    return usersPromises;
};

//Executes the initial population of the database, inserting the example data (seed data).
const populate = async () => {
    try {
        //Create ticket types and roles using DBTicketType and DBRole sample data
        await Promise.all([//executed in parallel thanks to Promises
            TicketType.create(DBTicketType),
            Role.create(DBRole)
        ]).then(async ([_, role]) => {
            //Gets the hashed passwords of all users by calling getHashedPassword
            const hashedPasswords = await getHashedPassword();
            //Passes the roles and hashed passwords to seedUsers, which creates users with the specified data.
            await seedUsers(role, hashedPasswords);
        });

    } catch (error) {
        throw error;
    }
};

export const seedDatabase = async () => {
    try {
        if (mongoose.connection?.readyState === 1) {
            console.log('❌ Clearing database...');
            await mongoose.connection.dropDatabase();
        }

        console.log('🌱 Seeding database...');
        await populate();
        console.log('✅ Seeding successful');

    } catch (error) {
        return console.log(error);
    }
};