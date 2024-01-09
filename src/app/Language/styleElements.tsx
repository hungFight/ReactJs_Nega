import styled from 'styled-components';
export const Parent = styled.div`
    position: relative;
`;
export const StyleLanguage = styled.div`
    width: 50px;
    color: white;
    cursor: pointer;
`;
export const MenuLanguage = styled.div`
    width: 150px;
    display: flex;
    padding: 10px 0;
    flex-wrap: wrap;
    position: absolute;
    padding: 5px;
    box-shadow: 0 0 3px #333;
    right: -4px;
    top: 28px;
    cursor: pointer;
    background-color: #242323;
    border-radius: 5px;
    z-index: 1;
`;
export const OptionLanguage = styled.button`
    width: 100%;
    background-color: transparent;
    color: white;
    padding: 10px;
    cursor: pointer;
    &:hover {
        background-color: #787777;
    }
`;
