import React, { useEffect, useRef, useState } from 'react';
import { LinkProps } from 'react-router-dom';
import { StyledComponent } from 'styled-components';
import { BackI, DotI, HeartMI, ShareI } from '~/assets/Icons/Icons';
import Player from '~/reUsingComponents/Videos/Player';
import { DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, Img, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { PropsDataFileUpload } from '../../FormUpNews';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const Resize: React.FC<{
    f: PropsDataFileUpload;
    step: number;
    showComment: number[];
    index: number;
    setShowComment: (value: React.SetStateAction<number[]>) => void;
    link?: boolean;
    arr: PropsDataFileUpload[];
    setUploadPre?: React.Dispatch<React.SetStateAction<PropsDataFileUpload[]>>;
}> = ({ f, step, setShowComment, showComment, index, link, arr, setUploadPre }) => {
    console.log('imggg');
    const [loading, setLoading] = useState<boolean>(true);
    const handleLoadMetaData = (e: React.SyntheticEvent<HTMLImageElement, Event>, _id?: string) => {
        const imgElement: any = e.target; // Access the target image element
        if (setUploadPre) {
            setUploadPre((pre) => {
                pre.map((r) => {
                    if (r._id === _id) {
                        r.width = imgElement.width + 'px';
                        r.height = imgElement.height + 'px';
                    }
                    return r;
                });
                return pre;
            });
        }
        setLoading(false);
    };
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
                <>
                    <Img
                        src={f?.pre || f?.link}
                        id="baby"
                        alt={f?.link}
                        onLoad={(e) => handleLoadMetaData(e, f?._id)}
                        css={`
                            ${step === 1 ? 'object-fit: contain; @media(min-width: 400px){object-fit: cover;}' : ''}
                        `}
                    />
                    {loading && (
                        <SkeletonTheme baseColor="#414141" highlightColor="#7c7c7c" width={f?.width} height={f?.height}>
                            <Skeleton height="350px" width="100%" count={1} duration={1} />
                        </SkeletonTheme>
                    )}
                </>
            ) : f?.type.includes('video') ? (
                <Player src={f?.pre || f?.link || ''} step={step} />
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
                            <Div width="100%" css="height: 30px; align-items: center; justify-content: center;  background-color: #9a9a9a; ">
                                <DivPos size="25px" top="3px" left="4px" onClick={() => setShowComment(() => showComment.filter((c) => c !== index))}>
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
