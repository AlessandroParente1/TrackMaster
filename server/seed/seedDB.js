import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import TicketType from "../models/ticketType.model.js";
import mongoose from "mongoose";
import { DBTicketType, DBRole, DBUsers } from "./seedData.js";
import bcrypt from 'bcrypt';
import { MONGO_DB_CONNECTION } from "../config/config.js";

const getHashedPassword = async () => {
    const hasedPasswordPromises = DBUsers.map(user => bcrypt.hash(user.password, +process.env.PASSWORD_SALT));

    return Promise.all(hasedPasswordPromises);
};

const seedUsers = async (role, hashedPasswords) => {
    const usersPromises = DBUsers.map((user, index) => {
        return User.create({ ...user, password: hashedPasswords[index], roleId: role[index]._id });
    });

    return usersPromises;
};

const populate = async () => {
    try {
        await Promise.all([
            TicketType.create(DBTicketType),
            Role.create(DBRole)
        ]).then(async ([_, role]) => {
            const hashedPasswords = await getHashedPassword();
            await seedUsers(role, hashedPasswords);
        });

    } catch (error) {
        console.log(error);
        throw error;
    }
};
// Function to seed the database
const seedDatabase = async () => {
    try {
        // Check if not connected to the database, then connect
        if (mongoose.connection?.readyState === 0) {
            await mongoose.connect(MONGO_DB_CONNECTION);
        }

        // If connected, clear the existing database
        if (mongoose.connection?.readyState === 1) {
            console.log('❌ Clearing database...');
            mongoose.connection.dropDatabase(); // Clears all data from the database
        }
        else {
            return console.log("Unable to connect to DB");
        }

        console.log('🌱 Seeding database...');

        // Populate the database with seed data
        await populate();

        // Delay to ensure data is populated before closing connection
        setTimeout(() => {
            console.log('✅ Seeding successful');
            mongoose.connection.close(); // Close the database connection
        }, 5000);
    } catch (error) {
        return console.log(error); // Handle any errors that occur during the seeding process
    }
};


await seedDatabase();