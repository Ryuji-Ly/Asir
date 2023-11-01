import { createContext } from "react";

export const GuildContext = createContext({
    guildId: "",
    updateGuildId: () => {},
});
