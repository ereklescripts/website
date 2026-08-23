--[[
    ROBLOX INJECTOR - WITH API KEY
    Just change the API_KEY and you're good to go!
]]

local Players = game:GetService("Players")
local HttpService = game:GetService("HttpService")
local player = Players.LocalPlayer

-- ==========================================
-- ⚠️ ONLY CHANGE THESE TWO VARIABLES
-- ==========================================
local API_URL = "https://imsotuffmiguelsolarereklitoyezibven.vercel.app/api/profile"
local API_KEY = "your-secret-key-here"  -- <-- CHANGE THIS!

-- ==========================================
-- HTTP REQUEST WRAPPER
-- ==========================================
local function sendRequest(url, method, data)
    local jsonData = HttpService:JSONEncode(data)
    
    local success, response = pcall(function()
        -- Synapse X
        if syn and syn.request then
            return syn.request({
                Url = url,
                Method = method,
                Headers = {
                    ["Content-Type"] = "application/json",
                    ["x-api-key"] = API_KEY
                },
                Body = jsonData
            })
        -- Krnl / Other executors
        elseif request then
            return request({
                Url = url,
                Method = method,
                Headers = {
                    ["Content-Type"] = "application/json",
                    ["x-api-key"] = API_KEY
                },
                Body = jsonData
            })
        -- Script-Ware
        elseif http_request then
            return http_request({
                Url = url,
                Method = method,
                Headers = {
                    ["Content-Type"] = "application/json",
                    ["x-api-key"] = API_KEY
                },
                Body = jsonData
            })
        -- Roblox Studio fallback
        else
            return HttpService:RequestAsync({
                Url = url,
                Method = method,
                Headers = {
                    ["Content-Type"] = "application/json",
                    ["x-api-key"] = API_KEY
                },
                Body = jsonData
            })
        end
    end)
    
    return success, response
end

-- ==========================================
-- SEND PROFILE
-- ==========================================
local function sendProfile()
    if not player then 
        warn("❌ No player found")
        return false 
    end
    
    local data = {
        username = player.Name,
        userId = player.UserId,
        displayName = player.DisplayName,
        avatar = string.format(
            "https://www.roblox.com/headshot-thumbnail/image?userId=%d&width=420&height=420&format=png",
            player.UserId
        )
    }
    
    print("📤 Sending profile with API key...")
    local success, response = sendRequest(API_URL, "POST", data)
    
    if success then
        print("✅ Profile sent successfully!")
        print("👤 Username: " .. player.Name)
        print("🆔 User ID: " .. player.UserId)
        print("🌐 Dashboard: https://imsotuffmiguelsolarereklitoyezibven.vercel.app")
        return true
    else
        warn("❌ Failed to send profile!")
        warn("Error: " .. tostring(response))
        print("💡 Make sure API_KEY matches the one on Vercel")
        return false
    end
end

-- ==========================================
-- EXECUTE
-- ==========================================
print("=" .. string.rep("=", 50))
print("🎮 ROBLOX INJECTOR - API KEY VERSION")
print("📡 URL: " .. API_URL)
print("🔑 API Key: " .. string.rep("*", #API_KEY))
print("=" .. string.rep("=", 50))

sendProfile()

-- ==========================================
-- KEYBIND: F5 to refresh
-- ==========================================
game:GetService("UserInputService").InputBegan:Connect(function(input, processed)
    if processed then return end
    if input.KeyCode == Enum.KeyCode.F5 then
        sendProfile()
        print("🔄 Data refreshed!")
    end
end)

-- ==========================================
-- EXPOSE FUNCTION
-- ==========================================
_G.sendProfile = sendProfile

print("=" .. string.rep("=", 50))
print("✅ Script loaded!")
print("💡 Commands: sendProfile()")
print("⌨️ Press F5 in-game to refresh")
print("=" .. string.rep("=", 50))