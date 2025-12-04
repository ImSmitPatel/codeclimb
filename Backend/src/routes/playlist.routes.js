import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { addProblemToPlaylist, createPlaylist, deletePlaylistById, deleteProblemFromPlaylist, getAllPlaylists, getPlaylistById, updatePlaylistById } from '../controllers/playlist.controller.js';

const playlistRoutes = express.Router();

/**
 * @swagger
 * tags:
 *   name: Playlists
 *   description: API for managing playlists
 *
 */


/**
 * @swagger
 * /api/v1/playlists/get-all-playlists:
 *   get:
 *     summary: Get all playlists of authenticated user
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Playlists fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 playlists:
 *                   type: array
 *                   items:
 *       500:
 *         description: Server error
 */
playlistRoutes.get("/get-all-playlists", authMiddleware, getAllPlaylists);

/**
 * @swagger
 * /api/v1/playlists/get-playlist/{playlistId}:
 *   get:
 *     summary: Get playlist by ID
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: Playlist ID
 *     responses:
 *       200:
 *         description: Playlist fetched successfully
 *       404:
 *         description: Playlist not found
 *       500:
 *         description: Server error
 */
playlistRoutes.get("/get-playlist/:playlistId", authMiddleware, getPlaylistById);

/**
 * @swagger
 * /api/v1/playlists/create-playlist:
 *   post:
 *     summary: Create a new playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *     responses:
 *       201:
 *         description: Playlist created successfully
 *       500:
 *         description: Server error
 */
playlistRoutes.post("/create-playlist", authMiddleware, createPlaylist);

/**
 * @swagger
 * /api/v1/playlists/update-playlist/{playlistId}:
 *   put:
 *     summary: Update playlist by ID
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: Playlist ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *     responses:
 *       200:
 *         description: Playlist updated successfully
 *       500:
 *         description: Server error
 */
playlistRoutes.put("/update-playlist/:playlistId", authMiddleware, updatePlaylistById);

/**
 * @swagger
 * /api/v1/playlists/{playlistId}/add-problem:
 *   post:
 *     summary: Add problems to a playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: Playlist ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *     responses:
 *       201:
 *         description: Problems added successfully
 *       400:
 *         description: Invalid or missing problemIds
 *       500:
 *         description: Server error
 */
playlistRoutes.post("/:playlistId/add-problem", authMiddleware, addProblemToPlaylist);

/**
 * @swagger
 * /api/v1/playlists/delete-playlist/{playlistId}:
 *   delete:
 *     summary: Delete playlist by ID
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: Playlist ID
 *     responses:
 *       200:
 *         description: Playlist deleted successfully
 *       500:
 *         description: Server error
 */
playlistRoutes.delete("/delete-playlist/:playlistId", authMiddleware, deletePlaylistById);

/**
 * @swagger
 * /api/v1/playlists/{playlistId}/delete-problem:
 *   delete:
 *     summary: Delete problems from playlist
 *     tags: [Playlists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: Playlist ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *     responses:
 *       200:
 *         description: Problems deleted successfully
 *       400:
 *         description: Invalid or missing problemIds
 *       500:
 *         description: Server error
 */
playlistRoutes.delete("/:playlistId/delete-problem", authMiddleware, deleteProblemFromPlaylist);

export default playlistRoutes;