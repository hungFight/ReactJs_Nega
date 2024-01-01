import React, { useEffect, useRef } from 'react';
import { CheckI } from '~/assets/Icons/Icons';
import Player from '~/reUsingComponents/Videos/Player';
import { Div, Img } from '~/reUsingComponents/styleComponents/styleDefault';
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

    const handleMouseDown = (e: any) => {
        coordinate.current = e.clientX || e?.changedTouches[0]?.clientX;
    };
    const handleMove = (e: any) => {
        if (coordinate.current !== null) {
            if (coordS.current >= 175 || coordS.current <= -175) {
                e.currentTarget.style.backgroundColor = '#4d1c1c';
            } else {
                e.currentTarget.style.backgroundColor = '#19191aa6';
            }
            coordS.current = (e.clientX || e?.changedTouches[0]?.clientX) - coordinate.current;
            e.currentTarget.style.left = `${(e.clientX || e?.changedTouches[0]?.clientX) - coordinate.current}px`;
        }
    };
    const handleMouseUp = async (e: any) => {
        console.log('Up');
        coordinate.current = null;
        const las = e.currentTarget.getAttribute('class');
        if (coordS.current >= 175 || coordS.current <= -175) {
            setUploadPre((pre) => pre.filter((r) => r.id !== f.id));
            coordS.current = 0;
        }
        e.currentTarget.style.backgroundColor = '';
        e.currentTarget.style.left = '0px';
    };
    return (
        <Div
            width="100%"
            wrap="wrap"
            className={`removeFileEditPost_${f.id}`}
            onTouchMove={handleMove}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            css={`
                position: relative;
                border: 2px solid #484848;
                border-radius: 5px;
                margin-bottom: 10px;
                background-color: #232323;
                max-height: fit-content;
            `}
        >
            <Div
                width="100%"
                css={`
                    height: 55px;
                    background-color: #202020;
                    margin-bottom: 49%;
                `}
            >
                <Textarea placeholder="Content" bg="#faebd700" color={colorText} css="border: 0; height: 98%;" />
            </Div>
            <Div
                width="100%"
                css="height: 193px; overflow: hidden; z-index: 5; position: absolute; bottom: 0; left-0; border-radius: 5px;"
            >
                {' '}
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
                    <Img src={f?.link} id="baby" alt={f?.link} css="object-fit: contain;" />
                ) : f?.type.includes('video') ? (
                    <Player src={f?.link} step={step} />
                ) : (
                    ''
                )}
            </Div>
        </Div>
    );
};

export default AllFIlesEdited;
