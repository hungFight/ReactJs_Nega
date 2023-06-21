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
    flex-direction: column;
    height: 100%;
    position: fixed;
    background-color: #202124;
    width: 320px;
    right: 0px;
    z-index: 101;
    top: 0px;
    transition: var(--transition-03s);
    box-shadow: 0 0 10px;
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
export const DivConversation = styled.div`
    width: 100%;
    height: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    background-color: #212020;
    z-index: 1;
`;
export const DivResultsConversation = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    padding: 10px;
    color: ${(props) => props.color};
`;
