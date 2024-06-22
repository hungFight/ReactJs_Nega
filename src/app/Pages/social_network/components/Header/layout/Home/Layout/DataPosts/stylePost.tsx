import styled from 'styled-components';

export const DivNews = styled.div`
    height: 600px;
    margin: 20px;
    border-radius: 5px;
    background-color: rgb(26 27 30);
`;
export const DivFill = styled.div`
    width: 100%;
    ${(props: { css?: string }) => props.css}
`;
