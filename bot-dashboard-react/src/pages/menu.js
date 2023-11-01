import { useNavigate } from "react-router-dom";
import { mockGuilds } from "../__mocks__/guilds";
import { useContext } from "react";
import { GuildContext } from "../utils/contexts/guildContext";

export const MenuPage = () => {
    const navigate = useNavigate();
    const { updateGuildId } = useContext(GuildContext);
    return (
        <div>
            <ul>
                {mockGuilds.map((guild) => (
                    <li
                        onClick={() => {
                            updateGuildId(guild.id);
                            navigate("/categories");
                        }}
                    >
                        {guild.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};
