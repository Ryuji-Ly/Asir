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

export const InputField = styled.input`
    padding: 14px 16px;
    box-sizing: border-box;
    font-size: 16px;
    color: #ffffff;
    font-family: DM Sans;
    background-color: #252525a4;
    border-radius: 10px;
    border: 1px solid #3f3f3f;
    outline: none;
    width: 100%;
    &:focus {
        outline: 2px solid #ffffff5a;
    }
`;
// background-color: #3d3d3d;

export const Button = styled.button`
    padding: 10px 24px;
    border-radius: 5px;
    outline: none;
    border: none;
    font-size: 16px;
    color: #fff;
    font-family: DM Sans;
    background-color: #006ed3;
    cursor: pointer;
`;

export const Page = styled.div`
    padding: 35px;
`;

export const SelectMenu = styled.select`
    padding: 12px 16px;
    box-sizing: border-box;
    margin: 10px 0;
    width: 100%;
    font-family: DM Sans;
    font-size: 18px;
    background-color: inherit;
    color: #fff;
    appearance: none;
    border: 1px solid #3f3f3f;
    border-radius: 5px;
    & > option {
        background-color: #252525;
    }
    &.multipleselect {
        & > option {
            background-color: inherit;
        }
    }
`;
