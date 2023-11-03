import { Button, Container, Flex, Page, SelectMenu, Title } from "../../utils/styles";

export const ChannelPage = () => {
    return (
        <Page>
            <Title style={{ textAlign: "center" }}>Channels</Title>
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Welcome Channel</Title>
                <form>
                    <div>
                        <label htmlFor="welcomec">Current Welcome Channel</label>
                    </div>
                    <SelectMenu>
                        <option disabled selected>
                            You do not have a Welcome Channel configured
                        </option>
                        <option>Random option 1</option>
                        <option>Random option 2</option>
                    </SelectMenu>
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
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Introductions Channel</Title>
                <form>
                    <div>
                        <label htmlFor="introductionc">Current Introductions Channel</label>
                    </div>
                    <SelectMenu>
                        <option disabled selected>
                            You do not have an Introductions Channel configured
                        </option>
                        <option>Random option 1</option>
                        <option>Random option 2</option>
                    </SelectMenu>
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
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Tickets Channel</Title>
                <form>
                    <div>
                        <label htmlFor="ticketsc">Current Tickets Channel</label>
                    </div>
                    <SelectMenu>
                        <option disabled selected>
                            You do not have a Tickets Channel configured
                        </option>
                        <option>Random option 1</option>
                        <option>Random option 2</option>
                    </SelectMenu>
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
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Level Channel</Title>
                <form>
                    <div>
                        <label htmlFor="levelc">Current Level Channel</label>
                    </div>
                    <SelectMenu>
                        <option disabled selected>
                            You do not have a Level Channel configured
                        </option>
                        <option>Random option 1</option>
                        <option>Random option 2</option>
                    </SelectMenu>
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
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Message Reports Channel</Title>
                <form>
                    <div>
                        <label htmlFor="msgreportc">Current Message Reports Channel</label>
                    </div>
                    <SelectMenu>
                        <option disabled selected>
                            You do not have a Message Reports Channel configured
                        </option>
                        <option>Random option 1</option>
                        <option>Random option 2</option>
                    </SelectMenu>
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
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Moderation Logs Channel</Title>
                <form>
                    <div>
                        <label htmlFor="modlogsc">Current Moderation Logs Channel</label>
                    </div>
                    <SelectMenu>
                        <option disabled selected>
                            You do not have a Moderation Logs Channel configured
                        </option>
                        <option>Random option 1</option>
                        <option>Random option 2</option>
                    </SelectMenu>
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
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Member Logs Channel</Title>
                <form>
                    <div>
                        <label htmlFor="memberlogsc">Current Member Logs Channel</label>
                    </div>
                    <SelectMenu>
                        <option disabled selected>
                            You do not have a Member Logs Channel configured
                        </option>
                        <option>Random option 1</option>
                        <option>Random option 2</option>
                    </SelectMenu>
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
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Message Logs Channel</Title>
                <form>
                    <div>
                        <label htmlFor="msglogsc">Current Message Logs Channel</label>
                    </div>
                    <SelectMenu>
                        <option disabled selected>
                            You do not have a Message Logs Channel configured
                        </option>
                        <option>Random option 1</option>
                        <option>Random option 2</option>
                    </SelectMenu>
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
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Voice Logs Channel</Title>
                <form>
                    <div>
                        <label htmlFor="vc">Current Voice Logs Channel</label>
                    </div>
                    <SelectMenu>
                        <option disabled selected>
                            You do not have a Voice Logs Channel configured
                        </option>
                        <option>Random option 1</option>
                        <option>Random option 2</option>
                    </SelectMenu>
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
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Suggestion Channels</Title>
                <form>
                    <div>
                        <label htmlFor="suggestc">Current Suggestion Channels</label>
                    </div>
                    <SelectMenu multiple className="multipleselect">
                        <option disabled>ctrl click to select multiple</option>
                        <option>Random option 1</option>
                        <option>Random option 2</option>
                    </SelectMenu>
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
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Minigame Channels</Title>
                <form>
                    <div>
                        <label htmlFor="minigamec">Current Minigame Channels</label>
                    </div>
                    <SelectMenu multiple className="multipleselect">
                        <option disabled>ctrl click to select multiple</option>
                        <option>Random option 1</option>
                        <option>Random option 2</option>
                    </SelectMenu>
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
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Blacklisted Channels</Title>
                <form>
                    <div>
                        <label htmlFor="suggestc">Current Blacklisted Channels</label>
                    </div>
                    <SelectMenu multiple className="multipleselect">
                        <option disabled>ctrl click to select multiple</option>
                        <option>Random option 1</option>
                        <option>Random option 2</option>
                    </SelectMenu>
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
};
