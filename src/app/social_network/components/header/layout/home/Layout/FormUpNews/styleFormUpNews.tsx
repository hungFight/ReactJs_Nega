import styled from 'styled-components';

export const Form = styled.form`
    position: relative;
`;
interface PropsDivfrom {
    top: string;
    position?: string;
}
export const DivForm = styled.div<PropsDivfrom>`
    width: 300px;
    margin-top: 30px;
    border-radius: 5px;
    transition: var(--transition-03s);
    top: ${(props) => props.top};
    position: ${(props) => props.position};
    @media (min-width: 600px) {
        width: 555px;
    }
`;
export const DivUpNews = styled.div`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 5px;
    align-items: center;
    justify-content: center;
`;

export const Input = styled.input`
    width: 350px;
    padding: 11px 11px 11px 20px;
    color: #d5cdcd;
    border: 0;
    background-color: rgb(52, 52, 52);
    border-radius: 50px;
`;
export const DivOptions = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    height: 50px;
    align-items: center;
    justify-content: space-evenly;
    position: relative;
`;
export const DivUpImage = styled.div`
    display: flex;
    font-size: 25px;
    cursor: var(--pointer);
`;
export const DivSignature = styled.div`
    display: flex;
    align-items: center;
    font-size: 3rem;
    cursor: var(--pointer);
`;
export const Label = styled.label`
    color: ${(props) => props.color};
    display: flex;
    cursor: pointer;
`;
interface PropsDivItems {
    position?: string;
}
export const DivItems = styled.div<PropsDivItems>`
    cursor: pointer;
    font-size: 2rem;
    display: flex;
    margin: 0 5px;
    color: ${(props) => props.color};
    position: ${(props) => props.position};
    @media (min-width: 375px) {
        font-size: 2.6rem;
    }
`;
export const DivDataFake = styled.div`
    width: 100%;
    margin: 5px;
    display: flex;
    flex-wrap: wrap;
`;
interface PorpsTextarea {
    bg: string;
    font?: string;
}

export const Textarea = styled.textarea<PorpsTextarea>`
    width: 100%;
    height: 110px;
    display: block;
    font-size: 1.6rem;
    font-family: inherit;
    padding: 10px 37px 10px 10px;
    margin-bottom: 10px;
    overflow: hidden;
    resize: none;
    border: 1px solid transparent;
    border-radius: 5px;
    outline: none;
    color: ${(props) => props.color};
    background-color: ${(props: { bg: string }) => props.bg};
    font-family: ${(props) => props.font}, sans-serif;
    &::placeholder {
        color: white;
    }
`;
interface PropsDivImage {
    src: string;
    border: string;
}
export const DivImage = styled.div<PropsDivImage>`
    width: 100%;
    height: 100%;
    background-image: url(${(props) => props.src});
    background-repeat: no-repeat;
    background-size: cover;
    background-position-x: center;
    background-position-y: center;
    border: ${(props) => props.border};
    border-radius: 5px;
`;
export const DivWrapButton = styled.div`
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 10px 0;
`;
