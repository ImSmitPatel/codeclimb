import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { addProblemToPlaylist, createPlaylist, deletePlaylistById, deleteProblemFromPlaylist, getAllPlaylists, getPlaylistById, updatePlaylistById } from '../controllers/playlist.controller.js';

const playlistRoutes = express.Router();

playlistRoutes.get("/get-all-playlists", authMiddleware, getAllPlaylists);
playlistRoutes.get("/get-playlist/:playlistId", authMiddleware, getPlaylistById);
playlistRoutes.post("/create-playlist", authMiddleware, createPlaylist);
playlistRoutes.put("/update-playlist/:playlistId", authMiddleware, updatePlaylistById);
playlistRoutes.post("/:playlistId/add-problem/:problemId", authMiddleware, addProblemToPlaylist);
playlistRoutes.delete("/delete-playlist/:playlistId", authMiddleware, deletePlaylistById);
playlistRoutes.delete("/:playlistId/delete-problem/:problemId", authMiddleware, deleteProblemFromPlaylist);

export default playlistRoutes;