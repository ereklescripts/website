// ============================================
// ROBLOX DASHBOARD API - HARDCODED API KEY
// ============================================

// ✅ YOUR API KEY IS RIGHT HERE
const VALID_API_KEY = "3de12e6b-682d-469d-9b9a-1195cd5d761e";

// Simple in-memory cache
let profileCache = null;

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // ==========================================
    // GET - Return profile (no API key needed)
    // ==========================================
    if (req.method === 'GET') {
        if (profileCache) {
            return res.json(profileCache);
        }

        return res.json({
            username: 'Guest',
            userId: 0,
            displayName: 'Guest',
            avatar: 'https://www.roblox.com/headshot-thumbnail/image?userId=0&width=420&height=420&format=png'
        });
    }

    // ==========================================
    // POST - Update profile (REQUIRES API KEY)
    // ==========================================
    if (req.method === 'POST') {
        // ✅ CHECK API KEY - HARDCODED
        const apiKey = req.headers['x-api-key'];

        if (!apiKey || apiKey !== VALID_API_KEY) {
            return res.status(401).json({ 
                error: 'Invalid or missing API key',
                message: 'Please provide a valid x-api-key header'
            });
        }

        try {
            const { username, userId, displayName, avatar } = req.body || {};

            if (!username || !userId) {
                return res.status(400).json({ 
                    error: 'Missing username or userId',
                    received: req.body 
                });
            }

            const profileData = {
                username: String(username),
                userId: Number(userId),
                displayName: displayName || username,
                avatar: avatar || `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=420&height=420&format=png`,
                updatedAt: new Date().toISOString()
            };

            // Store in memory
            profileCache = profileData;

            console.log('✅ Profile updated:', profileData.username);
            
            return res.json({
                success: true,
                profile: profileData,
                message: 'Profile updated successfully'
            });

        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
