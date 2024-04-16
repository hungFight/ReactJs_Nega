import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// wait
export const Links = styled(Link)`
    width: 70px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #aeaeae;
    position: relative;
    &:hover {
        border-bottom: 3px solid #3e75bc;
        @media (min-width: 768px) {
            border-bottom: 8px solid #3e75bc;
        }
    }
`;
export const A = styled.a<{ size?: string; css?: string }>`
    font-size: ${(props) => props.size};
    ${(props) => props.css}
`;
export const Smooth = styled(Link)<{ size?: string; css?: string }>`
    font-size: ${(props) => props.size};
    ${(props) => props.css}
`;
interface PropsInput {
    width?: string;
    padding?: string;
    border?: string;
    radius?: string;
    margin?: string;
    background?: string;
    borderColor?: string;
}
export const Input = styled.input<PropsInput>`
    width: ${(props) => props.width || '100%'};
    padding: ${(props) => props.padding || '10px 44px 10px 10px'};
    border: ${(props) => props.border || '1px solid rgb(104 104 104)'};
    border-radius: ${(props) => props.radius || '5px'};
    margin: ${(props) => props.margin || '10px 0'};
    background-color: ${(props) => props.background || '#202124'};
    color: ${(props) => props.color};
    border-color: ${(props) => props.borderColor};
`;
export const Span = styled.span`
    display: flex;
    ${(props: { css?: string }) => props.css}
`;

interface Propss {
    size?: string;
    css?: string;
    repP?: string;
    padding?: string;
    bg?: string;
}
export const Button = styled.button<Propss>`
    display: flex;
    padding: ${(props) => props.padding || '5px 10px'};
    background-color: ${(props) => props.bg || 'transparent'};
    color: ${(props) => props.color};
    cursor: var(--pointer);
    border-radius: 5px;
    font-size: ${(props) => props.size || '1.6rem'};
    font-weight: bold;
    ${(props) => props.css}
`;
interface PropsButtons {
    text: { css: string; text: string | ReactElement; tx?: string; onClick?: (args?: any) => void }[];
}
export const Buttons: React.FC<PropsButtons | any> = ({ text }) => {
    return text.map((vl: { css: string; text: string; tx: string; onClick?: (args: any) => void }) => (
        <Button key={vl.text + vl.tx} css={vl.css} onClick={vl.onClick}>
            {vl.text}
            {vl.tx}
        </Button>
    ));
};
interface PropsImg {
    radius?: string;
    css?: string;
}
export const Img = styled.img<PropsImg>`
    border-radius: ${(props) => props.radius || '0'};
    ${(props) => props.css}
`;
interface PropsP {
    z?: string;
    align?: string;
    css?: string;
}
export const P = styled.p<PropsP>`
    color: ${(props) => props.color};
    font-size: ${(props) => props.z};
    text-align: ${(props) => props.align};
    ${(props) => props.css}
`;
export const H3 = styled.h3`
    color: ${(props) => props.color};
    ${(props: { css?: string }) => props.css}
`;
interface PropsDiv {
    wrap?: string;
    css?: string;
    width?: string;
    height?: string;
    display?: string;
}
interface PropsDivFlex {
    wrap?: string;
    height?: string;
    css?: string;
    width?: string;
    align?: string;
    justify?: string;
    display?: string;
}
type PropsDivNone = PropsDiv &
    PropsDivFlex & {
        size?: string;
        border?: string;
        margin?: string;
    };
export const Div = styled.div<PropsDiv>`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    display: ${(props) => props.display || 'flex'};
    flex-wrap: ${(props) => props.wrap};
    ${(props) => props.css}
`;
export const DivNone = styled.div<PropsDivNone>`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    display: ${(props) => props.display};
    flex-wrap: ${(props) => props.wrap};
    justify-content: ${(props) => props.justify};
    align-items: ${(props) => props.align};
    margin: ${(props) => props.margin};
    size: ${(props) => props.size};
    border: ${(props) => props.border};
    ${(props) => props.css};
`;
export const DivFill = styled.div<PropsDiv>`
    width: 100%;
    ${(props) => props.css}
`;
export const Strong = styled.strong`
    ${(props: { css?: string }) => props.css}
`;
export const Ol = styled.ol`
    ${(props: { css?: string }) => props.css}
`;
export const Li = styled.li`
    ${(props: { css?: string }) => props.css}
`;
export const DivFlex = styled.div<PropsDivFlex>`
    width: ${(props) => props.width || '100%'};
    height: ${(props) => props.height || '100%'};
    display: ${(props) => props.display || 'flex'};
    flex-wrap: ${(props) => props.wrap || 'none'};
    justify-content: ${(props) => props.justify || 'center'};
    align-items: ${(props) => props.align || 'center'};
    ${(props) => props.css}
`;
interface PropsDivFlexPosition {
    wrap?: string;
    css?: string;
    width?: string;
    align?: string;
    justify?: string;
    display?: string;
    position?: string;
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
}
export const DivFlexPosition = styled.div<PropsDivFlexPosition>`
    width: ${(props) => props.width || '100%'};
    display: ${(props) => props.display || 'flex'};
    flex-wrap: ${(props) => props.wrap || 'none'};
    justify-content: ${(props) => props.justify || 'center'};
    align-items: ${(props) => props.align || 'center'};
    position: ${(props) => props.position || ''};
    left: ${(props) => props.left || ''};
    right: ${(props) => props.right || ''};
    top: ${(props) => props.top || ''};
    bottom: ${(props) => props.bottom || ''};
    ${(props) => props.css}
`;
interface PorpsTextarea {
    bg?: string;
    font?: string;
    BoBg?: string;
    wrap?: string;
    css?: string;
    width?: string;
    align?: string;
    justify?: string;
    display?: string;
    height?: string;
    size?: string;
    border?: string;
    padding?: string;
    radius?: string;
}

export const Textarea = styled.textarea<PorpsTextarea>`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    display: ${(props) => props.display};
    flex-wrap: ${(props) => props.wrap};
    justify-content: ${(props) => props.justify};
    align-items: ${(props) => props.align};
    font-size: ${(props) => props.size};
    border: ${(props) => props.border};
    ${(props) => props.css};
    padding: ${(props) => props.padding};
    resize: none;
    color: ${(props) => props.color};
    border: ${(props) => props.border};
    border-radius: ${(props) => props.radius};
    outline: none;
    background-color: ${(props) => props.bg};
    font-family: '${(props) => props.font}', sans-serif;
    ${(props) => props.css}
    &::placeholder {
        color: ${(props) => props.color};
    }
    @media (min-width: 768px) {
        font-size: 1.4rem;
    }
`;
