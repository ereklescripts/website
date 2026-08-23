const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ============================================
// DATA STORAGE
// ============================================
let profile = null;
let players = new Map();
let crashLog = [];
let startTime = Date.now();

// ============================================
// PROFILE ENDPOINTS
// ============================================
app.post("/profile", (req, res) => {
    const { username, userId, displayName, avatar } = req.body;

    if (!username || !userId) {
        return res.status(400).json({ error: "username and userId are required" });
    }

    profile = {
        username,
        userId,
        displayName: displayName || username,
        avatar: avatar || null,
        updatedAt: new Date().toISOString()
    };

    console.log(`✅ Profile: ${profile.username} (${profile.userId})`);
    res.json({ success: true, profile });
});

app.get("/profile", (req, res) => {
    res.json(profile);
});

// ============================================
// PLAYER LIST ENDPOINTS
// ============================================
app.post("/players/bulk", (req, res) => {
    const playerList = req.body;

    if (!Array.isArray(playerList)) {
        return res.status(400).json({ error: "Expected array of players" });
    }

    for (const p of playerList) {
        players.set(String(p.userId), {
            userId: p.userId,
            username: p.username,
            displayName: p.displayName || p.username,
            avatar: p.avatar || null,
            lastSeen: new Date().toISOString()
        });
    }

    console.log(`👥 Player list updated: ${players.size} total players`);
    res.json({ success: true, count: players.size });
});

app.get("/players", (req, res) => {
    res.json([...players.values()]);
});

app.delete("/players/:userId", (req, res) => {
    players.delete(req.params.userId);
    res.json({ success: true });
});

// ============================================
// CRASH LOG ENDPOINTS
// ============================================
app.post("/crash", (req, res) => {
    const { target, intensity } = req.body;
    
    const logEntry = {
        target: target || "ALL",
        intensity: intensity || 5,
        timestamp: new Date().toISOString()
    };
    
    crashLog.push(logEntry);
    console.log(`💀 CRASH: ${logEntry.target} (intensity: ${logEntry.intensity})`);
    res.json({ success: true, log: logEntry });
});

app.get("/crash/log", (req, res) => {
    res.json(crashLog);
});

// ============================================
// HEALTH CHECK
// ============================================
app.get("/health", (req, res) => {
    res.json({
        status: "online",
        uptime: Math.floor((Date.now() - startTime) / 1000),
        players: players.size,
        crashes: crashLog.length
    });
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, "127.0.0.1", () => {
    console.log("=".repeat(50));
    console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
    console.log("📋 Endpoints:");
    console.log("   POST /profile        - Send profile data");
    console.log("   POST /players/bulk   - Update multiple players");
    console.log("   POST /crash          - Log crash event");
    console.log("   GET  /profile        - Get profile data");
    console.log("   GET  /players        - Get all players");
    console.log("   GET  /crash/log      - Get crash history");
    console.log("   GET  /health         - Server status");
    console.log("=".repeat(50));
    console.log("📁 Open http://127.0.0.1:3000 in your browser");
    console.log("💡 Run injector.lua in Roblox");
    console.log("=".repeat(50));
});