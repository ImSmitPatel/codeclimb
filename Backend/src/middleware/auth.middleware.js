import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - No token provided"
            });
        }

        let decodedToken;

        try {
            decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Invalid token"
            });
        }

        const user = await db.user.findUnique({
            where: {
                id: decodedToken.id
            }, select: {
                id: true,
                image: true,
                name: true,
                email: true,
                role: true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        req.user = user;
        next()

    } catch (error) {
        console.error("Error authenticating user:", error);
        res.status(500).json({
            success: false,
            message: "Error authenticating user"
        });
    }
}

const checkAdmin = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await db.user.findUnique({
            where: {
                id: userId
            }, select: {
                role: true
            }
        })

        if(!user || user.role !== UserRole.ADMIN){
            return res.status(403).json({
                success: false,
                message: "Forbidden Access - Admins Only"
            })
        }

        next();
    } catch (error) {
        console.error("Error checking admin role:", error);
        return res.status(500).json({
            success: false,
            error: error
        })
    }
}

export { authMiddleware, checkAdmin }