import styled from "styled-components";

export const MainButton = styled.div`
    display: flex;
    width: 350px;
    justify-content: space-between;
    align-items: center;
    background-color: #2121217d;
    padding: 4px 50px;
    box-sizing: border-box;
    border-radius: 10px;
    border: 1px solid #58585863;
    margin: 10px 0;
    box-shadow: 0px 1px 7px 0px #000000;
`;

export const OptionButton = styled(MainButton)`
    padding: 18px 28px;
    width: 100%;
    background-color: #272727;
    margin: 10px 0;
    box-shadow: 0px 1px 5px 0px #00000018;
`;

export const HomePageStyle = styled.div`
    height: 100%;
    padding: 100px 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

export const GuildMenuItemStyle = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 20px;
    background-color: #202020;
    border-radius: 10px;
    border: 1px solid #ffffff2f;
    margin: 8px 0;
`;

export const Container = styled.div`
    width: 1200px;
    margin: 0 auto;
`;

export const AppBarStyle = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px 35px;
    box-sizing: border-box;
    background-color: #a059a71f;
    border: 1px solid #000;
    border-bottom: 1px solid #c9c9c921;
`;

export const Title = styled.p`
    font-size: 22px;
    margin-top: 5px;
`;

export const Flex = styled.div`
    display: flex;
`;

export const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    column-gap: 5px;
`;
