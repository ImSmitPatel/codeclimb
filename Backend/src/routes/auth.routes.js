import express from "express";
import { getme, login, logout, register } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const authRoutes = express.Router();

authRoutes.get("/", (req, res) => {
    res.send("Hello Welcome to Codeclimb©️🔥");
});

authRoutes.post("/register", register);

authRoutes.post("/login", login);

authRoutes.post("/logout", authMiddleware, logout);

authRoutes.get("/me", authMiddleware, getme);


export default authRoutes;