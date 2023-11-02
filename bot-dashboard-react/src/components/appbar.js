import { AppBarStyle } from "../utils/styles";
import LOGO from "../__mocks__/MafuyuUnamused.png";

export const AppBar = () => {
    return (
        <AppBarStyle>
            <h1 style={{ fontWeight: "normal", fontSize: "20px" }}>Configuring</h1>
            <img src={LOGO} height={55} width={55} style={{ borderRadius: "50%" }} alt="logo" />
        </AppBarStyle>
    );
};
