import styled from 'styled-components';
export const DivLanguage = styled.div`
    position: absolute;
    right: 18px;
    top: 22px;
`;
export const DivForm = styled.div`
    width: 100%;
    padding: 15px;
    display: flex;
    margin: auto;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex-wrap: wrap;
    position: relative;
    box-shadow: 0 0 20px #0a0a0a;
    background-image: linear-gradient(64deg, #40c6ff0a, #de888821);
    @media (min-width: 400px) {
        width: 400px;
    }
`;
export const Perror = styled.p`
    font-size: 14px;
    color: rgb(248 49 49 / 82%);
    text-shadow: 0px 0px 0px #cdcdcd;
`;
export const A = styled.a`
    color: ${(props) => props.color};
    font-size: 12px;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;
export const DivRegister = styled.div`
    color: #fff;
    position: absolute;
    bottom: 31px;
    left: 32px;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
    @media (max-width: 400px) {
        font-size: 12px;
    }
`;

export const DivAccount = styled.div`
    position: relative;
`;
