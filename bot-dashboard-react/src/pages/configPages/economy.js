import { Button, Container, Flex, InputField, Page, Title } from "../../utils/styles";

export const EconomyPage = () => {
    return (
        <Page>
            <Title style={{ textAlign: "center" }}>Economy</Title>
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Currency Name</Title>
                <form>
                    <div>
                        <label htmlFor="currencyname">Current Currency Name</label>
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
                        <label htmlFor="currencygain">Current Currency gained</label>
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
                        <label htmlFor="dailymin">Current Daily Minimum</label>
                    </div>
                    <InputField type="number" min={1} style={{ margin: "10px 0" }} />
                    <div>
                        <label htmlFor="dailymax">Current Daily Maximum</label>
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
                        <label htmlFor="customrolelimit">Current Custom Role Limit</label>
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
                        <label htmlFor="multiplierlimit">Current Multiplier Limit</label>
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
                        <label htmlFor="multipliercost">Current Multiplier Cost</label>
                    </div>
                    <InputField type="number" min={1} style={{ margin: "10px 0" }} />
                    <div>
                        <label htmlFor="customrolecost">Current Custome Role Cost</label>
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
                        <label htmlFor="groupcost">Current Group Create Cost</label>
                    </div>
                    <InputField type="number" min={10} style={{ margin: "10px 0" }} />
                    <div>
                        <label htmlFor="groupmultipliercost">
                            Current Group Multiplier Base Cost
                        </label>
                    </div>
                    <InputField type="number" min={10} style={{ margin: "10px 0" }} />
                    <div>
                        <label htmlFor="groupexpandcost">Current Group Expand Base Cost</label>
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
                        <label htmlFor="defaultminigamereward">
                            Current Default Minigame Rewards
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
};
