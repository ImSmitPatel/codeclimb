import { db } from "../libs/db.js";

const getAllPlaylists = async (req, res) => {
    try {
        const playlists = await db.Playlist.findMany({
            where: {
                userId: req.user.id
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        })

        res.status(200).json({
            success: true,
            message: "Playlists fetched successfully",
            count: playlists.length,
            playlists: playlists
        });

    } catch (error) {
        console.error("Error fetching playlists:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching playlists"
        });
    }
};

const getPlaylistById = async (req, res) => {
    const {playlistId} = req.params;

    try {
        const playlist = await db.Playlist.findUnique({
            where: {
                id: playlistId
            },
            include: {
                problems: {
                    include: {
                        problem: true
                    }
                }
            }
        });

        if (!playlist) {
            return res.status(404).json({
                success: false,
                message: "Playlist not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Playlist fetched successfully",
            playlistId: playlistId,
            playlist: playlist
        });

    } catch (error) {
        console.error(`Error fetching playlist id #${playlistId}:`, error);
        res.status(500).json({
            success: false,
            message: "Error fetching playlist"
        });
    }
};

const createPlaylist = async (req, res) => {
    try {
        const { title, description } = req.body;

        const userId = req.user.id;

        const playlist = await db.Playlist.create({
            data: {
                title,
                description,
                userId
            }
        });

        res.status(201).json({
            success: true,
            message: "Playlist created successfully",
            playlist
        });

    } catch (error) {
        console.error("Error creating playlist:", error);
        res.status(500).json({
            success: false,
            message: "Error creating playlist"
        });
    }
};

const updatePlaylistById = async (req, res) => {
    const {playlistId} = req.params;

    if (!req.body) console.log("No request body");

    const { title, description } = req.body;

    try {

        const playlist = await db.Playlist.update({
            where: {
                id: playlistId
            },
            data: {
                title,
                description
            }
        });

        res.status(200).json({
            success: true,
            message: "Playlist updated successfully",
            playlistId: playlistId,
            playlist: playlist
        });

    } catch (error) {
        console.error(`Error updating playlist id #${playlistId}:`, error);
        res.status(500).json({
            success: false,
            message: "Error updating playlist"
        });
    }
};

const addProblemToPlaylist = async (req, res) => {
    const {playlistId} = req.params;
    
    if (!req.body) console.log("No request body");

    const {problemIds} = req.body;

    try {

        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing problemIds"
            });
        }

        //create records for each problem in problemIds

        const problemInPlaylist = await db.ProblemInPlaylist.createMany({
            data: problemIds.map((problemId) => ({
                playlistId,
                problemId
            }))
        });

        res.status(201).json({
            success: true,
            message: "Problem added to playlist successfully",
            playlistId: playlistId,
            problems_added : problemInPlaylist.count
        });

    } catch (error) {
        console.error(`Error adding problem to playlist id #${playlistId}:`, error);
        res.status(500).json({
            success: false,
            message: "Error adding problem to playlist"
        });
    }
};

const deletePlaylistById = async (req, res) => {
    const {playlistId} = req.params;

    try {
        const playlist = await db.Playlist.delete({
            where: {
                id: playlistId
            }
        });

        res.status(200).json({
            success: true,
            message: "Playlist deleted successfully",
            playlistId: playlistId
        });

    } catch (error) {
        console.error(`Error deleting playlist id #${playlistId}:`, error);
        res.status(500).json({
            success: false,
            message: "Error deleting playlist"
        });
    }
};

const deleteProblemFromPlaylist = async (req, res) => {
    const {playlistId} = req.params;
    

    try {

        const {problemIds} = req.body;

        if (!Array.isArray(problemIds) || problemIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid or missing problemIds"
            });
        }

        const deletedProblemInPlaylist = await db.problemInPlaylist.deleteMany({
            where: {
                playlistId,
                problemId: {
                    in: problemIds
                }
            }
        });

        res.status(200).json({
            success: true,
            message: "Problem deleted from playlist successfully",
            playlistId: playlistId
        })
    } catch (error) {
        console.error(`Error deleting problem from playlist id #${playlistId}:`, error);
        res.status(500).json({
            success: false,
            message: "Error deleting problem from playlist"
        });
    }
};

export {
    getAllPlaylists,
    getPlaylistById,
    createPlaylist,
    updatePlaylistById,
    addProblemToPlaylist,
    deletePlaylistById,
    deleteProblemFromPlaylist
};