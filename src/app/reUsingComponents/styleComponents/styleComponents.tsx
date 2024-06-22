import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { SwiperSlide } from 'swiper/react';
import { LoadingI } from '~/assets/Icons/Icons';
import { Label } from '~/Pages/social_network/components/Header/layout/Home/Layout/FormUpNews/styleFormUpNews';
import { Span } from './styleDefault';
import ReactQuill from 'react-quill';
export const ReactQuillF = styled(ReactQuill)`
    ${(props: { css?: string }) => props.css}
`;

export const Peye = styled.p<{ top: string; right?: string }>`
    width: 30px;
    height: 30px;
    display: flex;
    right: ${(props) => props.right || '10px'};
    top: ${(props) => props.top};
    font-size: 20px;
    color: #aeaeae;
    align-items: center;
    justify-content: center;
    position: absolute;
    background-color: transparent;
    cursor: pointer;
`;
export const Htitle = styled.h3`
    margin-bottom: 20px;
    color: #fff;
    position: relative;
`;

const Div = styled.div<{ css?: string; bgFirst?: string; bgSecond?: string }>`
    width: 100px;
    height: 35px;
    margin: 28px auto 8px;
    padding: 3px;
    border-radius: 5px;
    border-radius: 5px;
    overflow: hidden;
    color: #ddd8d8;
    position: relative;
    ${(props) => props.css}
    &::before {
        width: 53px;
        height: 84px;
        display: block;
        content: '';
        position: absolute;
        right: 50%;
        bottom: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-image: ${(props) => props.bgFirst || 'linear-gradient(270deg, transparent, #fcfcfc4d, #fdfcfc)'};
        transform-origin: top left;
        animation: rotate 3s linear infinite;
        border-top-right-radius: 100%;
    }
    &::after {
        width: 53px;
        height: 84px;
        display: block;
        content: '';
        position: absolute;
        right: 50%;
        bottom: 50%;
        transform: translate(-50%, -50%);
        background-image: ${(props) => props.bgSecond || 'linear-gradient(90deg, transparent, #fcfcfc4d, #fdfcfc)'};
        transform-origin: bottom right;
        animation: rotate 3s linear infinite;
        border-bottom-left-radius: 100%;
    }
    @keyframes rotate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`;
// transparent, #ff37374d, #ff3737;
const Button = styled.button`
    width: 96%;
    height: 93%;
    background: #202124;
    position: absolute;
    top: 50%;
    bottom: 50%;
    right: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 5;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--color-light);
`;
export const ButtonAnimationSurround: React.FC<{
    title: string;
    bgImg?: string;
    bgSecond?: string;
    css?: string;
    loading?: boolean;
    submit?: boolean;
    onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}> = ({ title, bgImg, bgSecond, css, onClick, submit = true, loading }) => {
    return (
        <>
            <Div bgFirst={bgImg} bgSecond={bgSecond} css={css} onClick={onClick}>
                <Button type={submit ? 'submit' : 'button'}>
                    {loading ? (
                        <>
                            {title}
                            <Span
                                css={`
                                    opacity: 0;
                                    animation: bg-color-animation 0.9s infinite;
                                    @keyframes bg-color-animation {
                                        0% {
                                            opacity: 0.1;
                                        }
                                        100% {
                                            opacity: 1;
                                        }
                                    }
                                `}
                            >
                                .
                            </Span>{' '}
                            <Span
                                css={`
                                    opacity: 0;
                                    animation: bg-color-animation 0.6s infinite;
                                    @keyframes bg-color-animation {
                                        0% {
                                            opacity: 0.1;
                                        }
                                        100% {
                                            opacity: 1;
                                        }
                                    }
                                `}
                            >
                                .
                            </Span>{' '}
                            <Span
                                css={`
                                    opacity: 0;
                                    animation: bg-color-animation 0.3s infinite;
                                    @keyframes bg-color-animation {
                                        0% {
                                            opacity: 0.1;
                                        }
                                        100% {
                                            opacity: 1;
                                        }
                                    }
                                `}
                            >
                                .
                            </Span>
                        </>
                    ) : (
                        title
                    )}
                </Button>
            </Div>
        </>
    );
};
export const DivNone = styled.div<{ width?: string; css?: string }>`
    width: ${(props) => props.width};
    ${(props) => props.css}
`;
interface PropsHname {
    size?: string;
    css?: string;
}
export const Hname = styled.h3<PropsHname>`
    width: 98%;
    height: fit-content;
    font-size: ${(props: { size?: string }) => props.size ?? '1.4rem'};
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
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
    bg?: string;
    index?: number;
    size?: string;
    translateT?: string;
}
export const DivImgLink = styled(Link)`
    width: 100%;
    height: 100%;
    ${(props: { css?: string }) => props.css};
`;
export const DivImgS = styled.div`
    width: 100%;
    height: 100%;
    ${(props: { css?: string }) => props.css};
`;
export const DivFlexPosition = styled.div<PropsDivFlexPosition>`
    width: ${(props) => props.width || 'auto'};
    display: ${(props) => props.display || 'flex'};
    flex-wrap: ${(props) => props.wrap || 'none'};
    justify-content: ${(props) => props.justify || 'center'};
    align-items: ${(props) => props.align || 'center'};
    position: ${(props) => props.position || 'absolute'};
    left: ${(props) => props.left};
    right: ${(props) => props.right};
    top: ${(props) => props.top};
    bottom: ${(props) => props.bottom};
    font-size: ${(props) => props.size || '20px'};
    translate: ${(props) => props.translateT};
    z-index: ${(props) => props.index || 1};
    ${(props) => props.css}
    @media (min-width: 768px) {
        cursor: var(--pointer);
    }
    &:hover {
        transition: all 0.1s linear;
        background-color: ${(props) => props.bg || 'transparent'};
    }
`;
export const DivLoading = styled.div`
    color: #fff;
    width: 98%;
    margin: 30px auto;
    font-size: 25px;
    display: flex;
    justify-content: center;
    animation: loading 1.5s linear infinite;
    ${(props: { css?: string }) => props.css};

    @keyframes loading {
        100% {
            transform: rotate(360deg);
        }
    }
`;
export const CallName = (gender: number) => {
    return gender === 0 ? 'Him' : gender === 1 ? 'Her' : 'Cuy';
};
const DivV = styled.div`
    width: 100%;
    height: 100%;
    label {
        width: 100%;
        height: 100%;
    }
`;
export const UpLoadForm: React.FC<{
    id: string;
    colorText: string;
    children: React.ReactNode;
    submit: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ id, colorText, children, submit }) => {
    return (
        <>
            <DivV>
                <input id={id} type="file" name="file[]" hidden multiple onChange={submit} />
                <Label htmlFor={id} color={colorText}>
                    {children}
                </Label>
            </DivV>
        </>
    );
};
export const SwiperSlideF = styled(SwiperSlide)`
    ${(props: { css?: string }) => props.css}
`;
