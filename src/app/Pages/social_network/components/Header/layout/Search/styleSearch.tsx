import styled from 'styled-components';

export const DivSearch = styled.div`
    width: 85%;
    height: 39px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    z-index: 10;
    position: relative;
`;
export const Input = styled.input`
    width: 100%;
    padding: 10px 30px 10px 10px;
    border: 0;
    background: transparent;
    background-color: #292a2d;
    transition: var(--transition-03s);
    color: ${(props) => props.color};
    height: 100%;
`;
export const DivResults = styled.div`
    width: 100%;
    height: 100%;
    top: 45px;
    left: 0px;
    position: fixed;
    background: ${(props: { bg: string }) => props.bg};
    transition: var(--transition-03s);
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    z-index: 9999;
    box-shadow: 0 0 5px #0a0a0a;
    @media (min-width: 360px) {
        position: absolute;
        width: 360px;
        height: 610px;
        top: 45px;
        left: -81px;
    }
`;
