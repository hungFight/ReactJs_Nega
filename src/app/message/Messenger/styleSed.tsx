import styled from 'styled-components';

export const DivIconSend = styled.div`
    display: flex;
    padding: 2px;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    color: var(--color-icon);
    position: relative;
    cursor: var(--pointer);
    &:hover {
        background-color: #3c4043;
    }
`;
export const DivSend = styled.div`
    width: 100%;
    height: 100%;
    flex-direction: column;
    position: fixed;
    background-color: #202124;
    right: 0px;
    z-index: 101;
    top: 0px;
    transition: var(--transition-03s);
    box-shadow: 0 0 10px #424242;
    padding: 5px;
    @media (min-width: 500px) {
        width: 430px;
    }
`;
export const DivResults = styled.div`
    width: 100%;
    height: 94%;
    overflow-y: overlay;
    @media (max-width: 768px) {
        &::-webkit-scrollbar {
            width: 0px;
        }
    }
`;
export const DivConversation = styled.div<{ css?: string; height?: string }>`
    width: 100%;
    height: ${(props) => props.height || '100%'};
    border: 1px solid #1b1a1a;
    border-radius: 5px;
    background-color: #202124;
    z-index: 8888;
    min-width: 100%;
    height: 100%;
    ${(props) => props.css}
    .chatBar {
        height: 100%;
        overflow-y: overlay;
    }
    * {
        font-family: ZenKaku, sans-serif;
    }
    @media (min-width: 500px) {
        width: 450px;
        min-width: 450px;
    }
    @media (min-width: 768px) {
        width: 360px;
        min-width: 360px;
        height: 530px;
    }
`;
export const DivResultsConversation = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    padding: 10px;
    padding-bottom: 43px !important;
    background-color: transparent;
    color: ${(props) => props.color};
`;
