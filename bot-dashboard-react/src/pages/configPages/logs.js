import { Title, Container, InputField, Flex, Button, Page } from "../../utils/styles";

export const LogPage = () => (
    <Page>
        <Title style={{ textAlign: "center" }}>Logs</Title>
        <Container style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}>
            <Title>Update Moderation Logs</Title>
            <form>
                <label>Current Moderation Logs</label>
                <div style={{ display: "grid" }}>
                    <label>
                        <InputField type="checkbox" style={{ margin: "10px 5px", width: "auto" }} />
                        Bans
                    </label>
                    <label>
                        <InputField type="checkbox" style={{ margin: "10px 5px", width: "auto" }} />
                        Kicks
                    </label>
                    <label>
                        <InputField type="checkbox" style={{ margin: "10px 5px", width: "auto" }} />
                        Timeouts
                    </label>
                    <label>
                        <InputField type="checkbox" style={{ margin: "10px 5px", width: "auto" }} />
                        Warnings
                    </label>

                    <label>
                        <InputField type="checkbox" style={{ margin: "10px 5px", width: "auto" }} />
                        Unbans
                    </label>
                    <label>
                        <InputField type="checkbox" style={{ margin: "10px 5px", width: "auto" }} />
                        Remove Timeouts
                    </label>
                </div>
                <Flex style={{ justifyContent: "flex-end" }}>
                    <Button
                        style={{ backgroundColor: "#3d3d3d", marginRight: "8px" }}
                        type="button"
                    >
                        Reset
                    </Button>
                    <Button>Save</Button>
                </Flex>
            </form>
        </Container>
        <Container style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}>
            <Title>Update Member Logs</Title>
            <form>
                <label>Current Member Logs</label>
                <div style={{ display: "grid" }}>
                    <label>
                        <InputField type="checkbox" style={{ margin: "10px 5px", width: "auto" }} />
                        Role Updates
                    </label>

                    <label>
                        <InputField type="checkbox" style={{ margin: "10px 5px", width: "auto" }} />
                        Name Changes
                    </label>

                    <label>
                        <InputField type="checkbox" style={{ margin: "10px 5px", width: "auto" }} />
                        Avatar Changes
                    </label>

                    <label>
                        <InputField type="checkbox" style={{ margin: "10px 5px", width: "auto" }} />
                        Member Join
                    </label>

                    <label>
                        <InputField type="checkbox" style={{ margin: "10px 5px", width: "auto" }} />
                        Member Leave
                    </label>
                </div>
                <Flex style={{ justifyContent: "flex-end" }}>
                    <Button
                        style={{ backgroundColor: "#3d3d3d", marginRight: "8px" }}
                        type="button"
                    >
                        Reset
                    </Button>
                    <Button>Save</Button>
                </Flex>
            </form>
        </Container>
        <Container style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}>
            <Title>Update Message Logs</Title>
            <form>
                <label>Current Message Logs</label>
                <div style={{ display: "grid" }}>
                    <label>
                        <InputField type="checkbox" style={{ margin: "10px 5px", width: "auto" }} />
                        Deleted Messages
                    </label>

                    <label>
                        <InputField type="checkbox" style={{ margin: "10px 5px", width: "auto" }} />
                        Edited Messages
                    </label>

                    <label>
                        <InputField type="checkbox" style={{ margin: "10px 5px", width: "auto" }} />
                        Purged Messages
                    </label>
                </div>
                <Flex style={{ justifyContent: "flex-end" }}>
                    <Button
                        style={{ backgroundColor: "#3d3d3d", marginRight: "8px" }}
                        type="button"
                    >
                        Reset
                    </Button>
                    <Button>Save</Button>
                </Flex>
            </form>
        </Container>
        <Container style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}>
            <Title>Update Voice Logs</Title>
            <form>
                <label>Current Voice Logs</label>
                <div style={{ display: "grid" }}>
                    <label>
                        <InputField type="checkbox" style={{ margin: "10px 5px", width: "auto" }} />
                        Join Voice Channel
                    </label>

                    <label>
                        <InputField type="checkbox" style={{ margin: "10px 5px", width: "auto" }} />
                        Move between Voice Channels
                    </label>

                    <label>
                        <InputField type="checkbox" style={{ margin: "10px 5px", width: "auto" }} />
                        Leave Voice Channel
                    </label>
                </div>
                <Flex style={{ justifyContent: "flex-end" }}>
                    <Button
                        style={{ backgroundColor: "#3d3d3d", marginRight: "8px" }}
                        type="button"
                    >
                        Reset
                    </Button>
                    <Button>Save</Button>
                </Flex>
            </form>
        </Container>
    </Page>
);
