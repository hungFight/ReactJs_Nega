import React, { useEffect, useRef, useState } from 'react';
import { CheckI } from '~/assets/Icons/Icons';
import Player from '~/reUsingComponents/Videos/Player';
import { Div, H3, Img } from '~/reUsingComponents/styleComponents/styleDefault';
import { PropsDataFileUpload } from '../FormUpNews';
import { Textarea } from '../styleFormUpNews';

const AllFIlesEdited: React.FC<{
    f: PropsDataFileUpload;
    chosen: number[];
    coordS: React.MutableRefObject<number>;
    step: number;
    file: PropsDataFileUpload[];
    index: number;
    colorText: string;
    setUploadPre: React.Dispatch<React.SetStateAction<PropsDataFileUpload[]>>;
}> = ({ file, chosen, f, step, coordS, index, colorText, setUploadPre }) => {
    const coordinate = useRef<number | null>(null);
    const startPoint = useRef({ x: 0, y: 0 });
    const handleMouseDown = (e: any) => {
        startPoint.current = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        if (window.innerWidth < 800) coordinate.current = e.clientX || e?.changedTouches[0]?.clientX;
    };
    const handleMove = (e: any) => {
        const currentPoint = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
        const deltaX = currentPoint.x - startPoint.current.x;
        const deltaY = currentPoint.y - startPoint.current.y;
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (window.innerWidth < 800) {
                if (coordinate.current !== null) {
                    if (coordS.current >= 175 || coordS.current <= -175) {
                        e.currentTarget.style.backgroundColor = '#4d1c1c';
                    } else {
                        e.currentTarget.style.backgroundColor = '#19191aa6';
                    }
                    coordS.current = (e.clientX || e?.changedTouches[0]?.clientX) - coordinate.current;
                    e.currentTarget.style.left = `${(e.clientX || e?.changedTouches[0]?.clientX) - coordinate.current}px`;
                }
            }
        }
    };
    const handleMouseUp = async (e: any) => {
        if (window.innerWidth < 800) {
            coordinate.current = null;
            if (coordS.current >= 175 || coordS.current <= -175) {
                setUploadPre((pre) => pre.filter((r) => r.id_sort !== f.id_sort));
                coordS.current = 0;
            }
            e.currentTarget.style.backgroundColor = '';
            e.currentTarget.style.left = '0px';
        }
    };
    console.log(file);
    const [decoration, setDecoration] = useState<boolean>(false);

    if (!decoration)
        return (
            <Div
                width="100%"
                wrap="wrap"
                className={`removeFileEditPost_${f.id_sort}`}
                onTouchMove={handleMove}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
                css={`
                    margin: 2.5px;
                    position: relative;
                    border: 2px solid #2b5a57;
                    border-radius: 5px;
                    height: fit-content;
                    margin-bottom: 10px;
                    background-color: #232323;
                    max-height: fit-content;
                    @media (min-width: 400px) {
                        width: 400px;
                    }
                    @media (min-width: 800px) {
                        margin: 5px;
                        left: 0 !important;
                    }
                `}
            >
                <Div
                    width="100%"
                    css={`
                        height: 55px;
                        border-radius: 5px;
                        background-color: #1b1b1b;
                    `}
                >
                    <Textarea
                        placeholder="Content"
                        bg="#faebd700"
                        value={f?.title}
                        color={colorText}
                        css="border: 0; height: 98%; font-size: 1.3rem;"
                        onChange={(e) => {
                            setUploadPre((pre) =>
                                pre.map((p) => {
                                    if (p.id_sort === f.id_sort) p.title = e.target.value;
                                    return p;
                                }),
                            );
                        }}
                    />
                </Div>
                <Div width="100%" css="height: 193px; overflow: hidden; border-radius: 5px;">
                    <Div width="100%" display="block" css="z-index: 1;height: 100%; position: relative;">
                        <Div css="position: absolute; top: 4px; right: 4px; z-index: 6;">
                            {/* <Div
                                css="cursor: var(--pointer); font-size: 1.3rem; background-color: #085290; border-radius: 5px; padding: 4px 10px; margin: 0 2px;"
                                onClick={() => setDecoration(true)}
                            >
                                Chỉnh sửa
                            </Div> */}
                            <Div
                                css="cursor: var(--pointer); font-size: 1.3rem; background-color: #934346; border-radius: 5px; padding: 4px 10px; margin: 0 2px;"
                                onClick={() => setUploadPre((pre) => pre.filter((r) => r.id_sort !== f.id_sort))}
                            >
                                Xoá
                            </Div>
                        </Div>
                        <Img
                            src={f?.link}
                            id="baby"
                            alt={f?.link}
                            css={`
                                z-index: -1;
                                position: absolute;
                                top: 0;
                                left: 0;
                                filter: blur(12px);
                                object-fit: cover;
                            `}
                        />
                        {f?.type.includes('image') ? (
                            <Img src={f?.link || f.pre} id="baby" alt={f?.title || f?.link} css="object-fit: contain;" />
                        ) : f?.type.includes('video') ? (
                            <Player src={f?.link || f.pre} step={step} />
                        ) : (
                            ''
                        )}
                    </Div>{' '}
                </Div>
            </Div>
        );
    return (
        <Div width="100%" display="block" css="position: fixed; top: 0; left: 0; height: 100%; z-index: 2; background-color: #1a1a1a;">
            <Div onClick={() => setDecoration(false)}>exit</Div>
            <Div css="height: 65%;">
                {f?.type.includes('image') ? (
                    <Img src={f?.link || f.pre} id="baby" alt={f?.title || f?.link} css="object-fit: contain;" />
                ) : f?.type.includes('video') ? (
                    <Player src={f?.link || f.pre} step={step} />
                ) : (
                    ''
                )}
            </Div>
            <Div>operator</Div>
        </Div>
    );
};

export default AllFIlesEdited;
