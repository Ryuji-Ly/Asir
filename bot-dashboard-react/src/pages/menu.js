import { useNavigate } from "react-router-dom";
import { mockGuilds } from "../__mocks__/guilds";
import { useContext } from "react";
import { GuildContext } from "../utils/contexts/guildContext";
import { Container, GuildMenuItemStyle } from "../utils/styles";

export const MenuPage = () => {
    const navigate = useNavigate();
    const { updateGuildId } = useContext(GuildContext);
    const handleClick = (guildId) => {
        updateGuildId(guildId);
        navigate("/dashboard/categories");
    };
    return (
        <div style={{ padding: "80px 0" }}>
            <Container>
                <h2 style={{ fontWeight: "300" }}>Select a Server</h2>
                <div>
                    {mockGuilds.map((guild) => (
                        <div onClick={() => handleClick(guild.id)}>
                            <GuildMenuItemStyle>
                                <img
                                    src={guild.icon}
                                    alt={guild.name}
                                    width={40}
                                    height={40}
                                    style={{ borderRadius: "50%" }}
                                ></img>
                                <p>{guild.name}</p>
                            </GuildMenuItemStyle>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
};
