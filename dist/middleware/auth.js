"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))) {
        res.status(401).json({ error: "Missing authentication token" });
        return;
    }
    const token = authHeader.split(" ")[1];
    if (token !== process.env.API_TOKEN) {
        res.status(401).json({ error: "Invalid authentication token" });
        return;
    }
    next();
};
exports.authenticateToken = authenticateToken;
