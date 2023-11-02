import { Button, Container, Flex, InputField, Title } from "../../utils/styles";

export const EconomyPage = () => {
    return (
        <div style={{ padding: "30px 0" }}>
            <Title style={{ textAlign: "center" }}>Economy</Title>
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Currency Name</Title>
                <form>
                    <div>
                        <label htmlFor="welcome">Current Currency Name</label>
                    </div>
                    <InputField style={{ margin: "10px 0" }} />
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
                <Title>Update Currency gained by Activity</Title>
                <form>
                    <div>
                        <label htmlFor="welcome">Current Currency gained</label>
                    </div>
                    <InputField type="number" min={0} style={{ margin: "10px 0" }} />
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
                <Title>Update Daily Minimum & Maximum</Title>
                <form>
                    <div>
                        <label htmlFor="welcome">Current Daily Minimum</label>
                    </div>
                    <InputField type="number" min={1} style={{ margin: "10px 0" }} />
                    <div>
                        <label htmlFor="welcome">Current Daily Maximum</label>
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
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Custom Role Limit</Title>
                <form>
                    <div>
                        <label htmlFor="welcome">Current Custom Role Limit</label>
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
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Multiplier Limit</Title>
                <form>
                    <div>
                        <label htmlFor="welcome">Current Multiplier Limit</label>
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
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Default Shop Costs</Title>
                <form>
                    <div>
                        <label htmlFor="welcome">Current Multiplier Cost</label>
                    </div>
                    <InputField type="number" min={1} style={{ margin: "10px 0" }} />
                    <div>
                        <label htmlFor="welcome">Current Custome Role Cost</label>
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
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Group Costs</Title>
                <form>
                    <div>
                        <label htmlFor="welcome">Current Group Create Cost</label>
                    </div>
                    <InputField type="number" min={10} style={{ margin: "10px 0" }} />
                    <div>
                        <label htmlFor="welcome">Current Group Multiplier Base Cost</label>
                    </div>
                    <InputField type="number" min={10} style={{ margin: "10px 0" }} />
                    <div>
                        <label htmlFor="welcome">Current Group Expand Base Cost</label>
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
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Minigame Rewards</Title>
                <form>
                    <div>
                        <label htmlFor="welcome">Current Minigame Rewards</label>
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
        </div>
    );
};
