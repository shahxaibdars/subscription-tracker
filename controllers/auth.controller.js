import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

export const signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error("User already exists with this email");
            error.statusCode = 409;
            throw error;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUsers = await User.create([{
            name,
            email,
            password: hashedPassword
        }]);

        const token = jwt.sign(
            { userId: newUsers[0]._id }, JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).send({
            success: true,
            message: "User signed up successfully",
            data: {
                token,
                user: newUsers[0]
            }
        });
    } catch (error) {
        next(error);
    }

}

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error("User not found with this email");
            error.statusCode = 401;
            throw error;
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            const error = new Error("Invalid password");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            { userId: user._id }, JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).send({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user
            }
        });
    } catch (error) {
        next(error);
    }
}

export const signOut = async (req, res, next) => {}