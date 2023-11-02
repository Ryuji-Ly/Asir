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
import { AppBar } from "./components/appbar";

function App() {
    const [guildId, setGuildId] = useState("");
    const updateGuildId = (guildId) => setGuildId(guildId);
    return (
        <GuildContext.Provider value={{ guildId, updateGuildId }}>
            <Routes>
                <Route path="/dashboard/*" element={<AppBar />} />
            </Routes>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                {/* <Route path="/dashboard" element={<HomePage />} /> */}
                <Route path="/dashboard/categories" element={<CategoryPage />} />
                <Route path="/dashboard/channels" element={<ChannelPage />} />
                <Route path="/dashboard/logs" element={<LogPage />} />
                <Route path="/dashboard/levels" element={<LevelPage />} />
                <Route path="/dashboard/economy" element={<EconomyPage />} />
            </Routes>
        </GuildContext.Provider>
    );
}

export default App;
