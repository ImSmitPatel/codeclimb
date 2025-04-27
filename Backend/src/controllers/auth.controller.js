import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const {email, name, password} = req.body;

    try {
        const existingUser = await db.User.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.User.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: UserRole.USER
            }
        })

        const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, {expiresIn: "7d"})

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                image: newUser.image
            }
        })
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            success: false,
            message: "Error creating user"
        });
    }
};

export const login = async (req, res) => {
    res.send("Login a user");
};

export const logout = async (req, res) => {
    res.send("Logout a user");
};

export const me = async (req, res) => {
    res.send("Get current user");
};