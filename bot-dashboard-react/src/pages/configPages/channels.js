import { Button, Container, Flex, InputField, Title } from "../../utils/styles";

export const ChannelPage = () => {
    return (
        <div style={{ padding: "30px 0" }}>
            <Title style={{ textAlign: "center" }}>Channels</Title>
            <Container
                style={{ width: "800px", marginTop: "10px", borderTop: "1px solid #ffffff1a" }}
            >
                <Title>Update Welcome Channel</Title>
                <form>
                    <div>
                        <label htmlFor="welcome">Current Welcome Channel</label>
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
        </div>
    );
};
