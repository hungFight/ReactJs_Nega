import React, { useEffect, useRef } from 'react';
import { LinkProps } from 'react-router-dom';
import { StyledComponent } from 'styled-components';
import { BackI, DotI, HeartMI, ShareI } from '~/assets/Icons/Icons';
import Player from '~/reUsingComponents/Videos/Player';
import { DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, Img, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { PropsDataFileUpload } from '../../FormUpNews';

const Resize: React.FC<{
    f: PropsDataFileUpload;
    step: number;
    showComment: number[];
    index: number;
    setShowComment: (value: React.SetStateAction<number[]>) => void;
    link?: boolean;
    arr: PropsDataFileUpload[];
}> = ({ f, step, setShowComment, showComment, index, link, arr }) => {
    // not done
    return (
        <Div
            width="100%"
            css={`
                height: 100%;
                position: relative;
                justify-content: center;
                cursor: var(--pointer);
            `}
            onClick={() => {
                if (link) {
                }
            }}
        >
            {f?.type === 'image' ? (
                <Img
                    src={f?.pre || `${process.env.REACT_APP_SERVER_FILE_GET_IMG_V1}/${f?.link}`}
                    id="baby"
                    alt={f?.link}
                    css={`
                        ${step === 1 ? 'object-fit: contain; @media(min-width: 400px){object-fit: cover;}' : ''}
                    `}
                />
            ) : f?.type.includes('video') ? (
                <Player src={f?.link || f.pre} step={step} />
            ) : (
                ''
            )}
            {step === 1 && (
                <>
                    <Div
                        css={`
                            height: 100px;
                            flex-direction: column;
                            align-items: center;
                            justify-content: space-evenly;
                            position: absolute;
                            right: 10px;
                            bottom: 12%;
                            font-size: 25px;
                            color: #d9d9d9;
                            background-color: #474747a8;
                            padding: 5px;
                            border-radius: 5px;
                            .M.coment {
                            }
                        `}
                    >
                        <Div>
                            <HeartMI />
                        </Div>
                        <Div
                            width="fit-content"
                            css={`
                                margin-top: 2px;
                                height: fit-content;
                                border-radius: 50%;
                                border: 1px solid #dedede;
                                font-size: 20px;
                            `}
                            onClick={() => setShowComment([...showComment, index])}
                        >
                            <DotI />
                        </Div>
                        <Div>
                            <ShareI />
                        </Div>
                    </Div>
                    {showComment.includes(index) && (
                        <Div
                            className="comment"
                            wrap="wrap"
                            css={`
                                width: 100%;
                                height: 100%;
                                position: absolute;
                                bottom: 0px;
                                background-color: aliceblue;
                            `}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Div
                                width="100%"
                                css="height: 30px; align-items: center; justify-content: center;  background-color: #9a9a9a; "
                            >
                                <DivPos
                                    size="25px"
                                    top="3px"
                                    left="4px"
                                    onClick={() => setShowComment(() => showComment.filter((c) => c !== index))}
                                >
                                    <BackI />
                                </DivPos>
                                <P z="1.5rem" css="">
                                    Comment
                                </P>
                            </Div>
                            <Div></Div>
                        </Div>
                    )}
                </>
            )}
        </Div>
    );
};

export default Resize;
