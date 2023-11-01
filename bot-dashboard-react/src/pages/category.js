import { useContext } from "react";
import { GuildContext } from "../utils/contexts/guildContext";

export const CategoryPage = () => {
    const { guildId } = useContext(GuildContext);
    return <div>Categories {guildId}</div>;
};
