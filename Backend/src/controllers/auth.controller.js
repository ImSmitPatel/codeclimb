export const register = async (req, res) => {
    res.send("Register a new user");
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