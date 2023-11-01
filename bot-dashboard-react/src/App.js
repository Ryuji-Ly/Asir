import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/homepage";
import { MenuPage } from "./pages/menu";
import { CategoryPage } from "./pages/category";
import { ChannelPage } from "./pages/configPages/channels";
import { LogPage } from "./pages/configPages/logs";
import { LevelPage } from "./pages/configPages/levels";
import { EconomyPage } from "./pages/configPages/economy";
import { GuildContext } from "./utils/contexts/guildContext";

function App() {
    const [guildId, setGuildId] = useState("");
    const updateGuildId = (guildId) => setGuildId(guildId);
    return (
        <GuildContext.Provider value={{ guildId, updateGuildId }}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                {/* <Route path="/dashboard" element={<HomePage />} /> */}
                <Route path="/categories" element={<CategoryPage />} />
                <Route path="/server/update-channels" element={<ChannelPage />} />
                <Route path="/server/update-logs" element={<LogPage />} />
                <Route path="/server/update-levels" element={<LevelPage />} />
                <Route path="/server/update-economy" element={<EconomyPage />} />
            </Routes>
        </GuildContext.Provider>
    );
}

export default App;
