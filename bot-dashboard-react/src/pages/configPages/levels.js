import { Title, Container, InputField, Button, Flex, Page } from "../../utils/styles";

export const LevelPage = () => (
    <Page>
        <Title style={{ textAlign: "center" }}>Levels</Title>
        <Container style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}>
            <Title>Update Base Experience Requirement</Title>
            <form>
                <div>
                    <label htmlFor="xprequirement">Current Base Experience Requirement</label>
                </div>
                <InputField type="number" min={10} style={{ margin: "10px 0" }} />
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
            <Title>Update Experience gained by Activity</Title>
            <form>
                <div>
                    <label htmlFor="xpmingain">Current Minimum Experience gained</label>
                </div>
                <InputField type="number" min={1} style={{ margin: "10px 0" }} />
                <div>
                    <label htmlFor="xpmaxgain">Current Maximum Experience gained</label>
                </div>
                <InputField type="number" min={1} style={{ margin: "10px 0" }} />
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
            <Title>Update Group Channel Bonus Experience Multiplier</Title>
            <form>
                <div>
                    <label htmlFor="groupchannelxpmultiplier">
                        Current Group Channel Bonus Experience Multiplier
                    </label>
                </div>
                <InputField type="number" min={1} style={{ margin: "10px 0" }} />
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
