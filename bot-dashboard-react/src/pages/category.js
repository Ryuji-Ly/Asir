import { useContext } from "react";
import { GuildContext } from "../utils/contexts/guildContext";
import { Container, Flex, Grid, OptionButton, Title } from "../utils/styles";
import {
    IoSettingsOutline,
    IoConstructOutline,
    IoLogoUsd,
    IoStatsChartOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export const CategoryPage = () => {
    const { guildId } = useContext(GuildContext);
    const navigate = useNavigate();
    return (
        <div style={{ padding: "30px 0" }}>
            <Container>
                <div
                    onClick={() => navigate("../dashboard/channels")}
                    style={{ borderTop: "1px solid #ffffff1b", marginTop: "10px" }}
                >
                    <Flex style={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Title>Channel Configurations</Title>
                        <IoSettingsOutline size={40} />
                    </Flex>
                    <Grid>
                        <OptionButton>Welcome Channel</OptionButton>
                        <OptionButton>Introductions Channel</OptionButton>
                        <OptionButton>Tickets Channel</OptionButton>
                        <OptionButton>Level Channel</OptionButton>
                        <OptionButton>Message Reports Channel</OptionButton>
                        <OptionButton>Moderation Logs Channel</OptionButton>
                        <OptionButton>Member Logs Channel</OptionButton>
                        <OptionButton>Message Logs Channel</OptionButton>
                        <OptionButton>Voice Logs Channel</OptionButton>
                        <OptionButton>Suggestion Channels</OptionButton>
                        <OptionButton>Minigame Channels</OptionButton>
                        <OptionButton>Blacklisted Channels</OptionButton>
                    </Grid>
                </div>
                <div
                    onClick={() => navigate("../dashboard/logs")}
                    style={{ borderTop: "1px solid #ffffff1b", marginTop: "10px" }}
                >
                    <Flex style={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Title>Bot Logs Configurations</Title>
                        <IoConstructOutline size={40} />
                    </Flex>
                    <Grid>
                        <OptionButton>Moderation Logs</OptionButton>
                        <OptionButton>Member Logs</OptionButton>
                        <OptionButton>Message Logs</OptionButton>
                        <OptionButton>Voice Logs</OptionButton>
                    </Grid>
                </div>
                <div
                    onClick={() => navigate("../dashboard/economy")}
                    style={{ borderTop: "1px solid #ffffff1b", marginTop: "10px" }}
                >
                    <Flex style={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Title>Economy Configurations</Title>
                        <IoLogoUsd size={40} />
                    </Flex>
                    <Grid>
                        <OptionButton>Currency Name</OptionButton>
                        <OptionButton>Currency gained by Activity</OptionButton>
                        <OptionButton>Daily Minimum & Maximum</OptionButton>
                        <OptionButton>Custom Role Limit</OptionButton>
                        <OptionButton>Multiplier Limits</OptionButton>
                        <OptionButton>Group Costs</OptionButton>
                        <OptionButton>Minigame rewards</OptionButton>
                    </Grid>
                </div>
                <div
                    onClick={() => navigate("../dashboard/levels")}
                    style={{ borderTop: "1px solid #ffffff1b", marginTop: "10px" }}
                >
                    <Flex style={{ alignItems: "center", justifyContent: "space-between" }}>
                        <Title>Level Configurations</Title>
                        <IoStatsChartOutline size={40} />
                    </Flex>
                    <Grid>
                        <OptionButton>Base Experience Requirement</OptionButton>
                        <OptionButton>Experience gained by Activity</OptionButton>
                        <OptionButton>Group Channel Bonus Multiplier</OptionButton>
                    </Grid>
                </div>
            </Container>
        </div>
    );
};
