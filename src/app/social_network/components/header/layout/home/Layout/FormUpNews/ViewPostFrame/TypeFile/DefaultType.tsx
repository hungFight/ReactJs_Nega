import { Div, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { useState, useEffect } from 'react';
import { BanI, ColorsI } from '~/assets/Icons/Icons';
import LogicType from './logicType';
import FullScreenSildes from './FullScreenSildes/FullScreenSildes';
import Resize from './Resize';
import { Link } from 'react-router-dom';
import { PropsDataFileUpload } from '../../FormUpNews';
import { DivFlexPosition } from '~/reUsingComponents/styleComponents/styleComponents';

const DefaultType: React.FC<{
    file: PropsDataFileUpload[];
    colorText: string;
    step: number;
    bg: string;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    setBg?: React.Dispatch<React.SetStateAction<string>>;
    link?: boolean;
    setUploadPre?: React.Dispatch<React.SetStateAction<PropsDataFileUpload[]>>;
    _id?: string;
}> = ({ file, colorText, step, setStep, setBg, bg, link, setUploadPre, _id }) => {
    const { moreFile, cc, handleStep, setMoreFile, ToolDefault, showTitle, update, setUpdate, showComment, setShowComment } = LogicType(step, setStep, colorText);
    //edit
    const [showColors, setShowColors] = useState(false);
    const [heightV, setHeightV] = useState<string>('');
    useEffect(() => {
        setHeightV('');
        // file.map((f) => {
        //     if (f?.type.includes('image')) {
        //         var img = new Image();
        //         img.src = f.pre; // Thay đường dẫn bằng đường dẫn hình ảnh thực tế
        //         img.addEventListener('load', function (e) {
        //             var imageHeight = img.naturalHeight;
        //             var imageWidth = img.naturalWidth;
        //             console.log('mmmA Chiều cao: ' + imageHeight);
        //             console.log('mmmA Chiều rộng: ' + imageWidth);
        //             console.log('[]: ', imageWidth / imageHeight, 16 / 9);
        //         });
        //     } else {
        //     }
        // });
    }, [file]);
    const colors = [
        { id: 0, color: 'transparent', icon: <BanI /> },
        { id: 1, color: '#1b1919' },
        { id: 2, color: '#fcfcfc' },
        { id: 3, color: 'antiquewhite' },
        { id: 4, color: 'coral' },
        { id: 5, color: '#e37bb5' },
        { id: 6, color: '#7185e1' },
        { id: 7, color: '#71cbe1' },
    ];
    const Tag = link ? Div : Link;
    console.log('image here', file);

    return (
        <Div
            width="100%"
            css={`
                max-height: 100%;
                position: relative;
                gap: 2px;
                overflow: overlay;
                background-color: ${bg};
                ${file.length > 1 ? (step === 1 ? ' grid-auto-rows: unset;  display: grid;' : ' grid-auto-rows: 200px;  display: grid;') : ''}
                grid-template-columns: ${file.length === 1 ? '1fr' : file.length === 4 || file.length === 2 || file.length === 3 ? '1fr 1fr' : '1fr 1fr 1fr'};

                ${step === 1 &&
                `
                grid-template-columns: 1fr;
                @media (min-width: 400px) {
                    grid-template-columns: 1fr 1fr;
                    grid-auto-rows: 411px;  display: grid;
                }

                @media (min-width: 769px) {
                    grid-template-columns: 1fr 1fr 1fr 1fr; gap: 2px;
                }
                @media (min-width: 1240px) {
                    grid-template-columns: 1fr 1fr 1fr 1fr 1fr; gap: 3px;
                }`}
            `}
        >
            {!_id && file.length > 1 && (
                <DivFlexPosition
                    css={`
                        top: ${step === 1 ? '55px' : '15px'};
                        right: 12.5px;
                        font-size: 30px;
                        flex-direction: column;
                        z-index: 1;
                    `}
                >
                    <Div display="block" css="position: relative;">
                        <Div
                            css={`
                                position: absolute;
                                top: -5px;
                                right: -2px;
                                padding: 2px;
                                background-color: ${bg || '#4e4e4e'};
                                border-radius: 50%;
                                color: ${bg === '#fcfcfc' ? '#1e1e1e' : '#ffffff'};
                                z-index: 1;
                            `}
                            onClick={() => setShowColors(!showColors)}
                        >
                            <ColorsI />
                        </Div>
                        {colors.map((cl, index) => (
                            <Div
                                key={cl.id}
                                css={`
                                    width: 27px;
                                    height: 27px;
                                    border-radius: 5px;
                                    transition: all 0.5s linear;
                                    position: absolute;
                                    top: ${(index + 1) * 30}px;
                                    right: 2px;
                                    background-color: ${cl.color};
                                    ${index === 0 ? 'color: white;' : ''}
                                    ${!showColors && 'top: 0px; background-color: #00000000; color:#00000000; '}
                                `}
                                onClick={() => {
                                    if (setBg) setBg(cl.color);
                                }}
                            >
                                {cl?.icon}
                            </Div>
                        ))}
                    </Div>
                </DivFlexPosition>
            )}
            {cc !== null && <FullScreenSildes step={step} cc={cc} files={file} />}
            <>
                {step > 0 && ToolDefault(0)}
                {step === 2 && ToolDefault(2)}
            </>
            {file.map((f, index, arr) => {
                // if (f?.type === 'video' && !heightV) {
                //     var video = document.createElement('video');
                //     video.src = file[0].link; // Thay đường dẫn bằng đường dẫn video thực tế

                //     video.addEventListener('loadedmetadata', function () {
                //         var videoHeight = video.videoHeight;
                //         var videoWidth = video.videoWidth;
                //         if (videoHeight - videoWidth > 400) {
                //             setHeightV('550px');
                //         } else {
                //             setHeightV('auto');
                //         }
                //         console.log('Chiều cao: ' + videoHeight);
                //         console.log('Chiều rộng: ' + videoWidth);
                //     });
                // }

                // check every 6 picture
                if (step === 0 ? index < moreFile : true) {
                    return (
                        <Div
                            display="block"
                            width="100%"
                            key={f?.link || f.pre}
                            css={`
                                ${arr.length === 3 && arr.length === index + 1 ? 'grid-column: span 2' : ''}
                                ${arr.length === 5 && arr.length === index + 1 ? 'grid-column: span 2' : ''}
                                    ${arr.length === 7 && arr.length === index + 1 ? 'grid-column: span 3' : ''}
                            `}
                        >
                            <Div
                                id="baby"
                                className="aaa"
                                wrap="wrap"
                                width="100%"
                                onClick={(e) => {
                                    handleStep(e, index);
                                }}
                                css={`
                                    height: 100%;
                                    margin: auto;
                                    position: relative;
                                    justify-content: center;
                                    align-items: center;
                                    ${showTitle && step === 1 && 'padding-bottom: 24px'};
                                    color: ${colorText};
                                    height: ${heightV};
                                    ${arr.length === 1 && f.type === 'video' ? 'height: 600px;' : ''}/* ${step > 1
                                        ? `position: fixed; height: 100%; top: 0; left:0; z-index: 103; background-color: #0e0e0d; img,div.video-react-controls-enabled{object-fit: contain; margin: auto;}`
                                        : ''} */
                                `}
                            >
                                <Resize link={link} f={f} arr={arr} index={index} setUploadPre={setUploadPre} setShowComment={setShowComment} showComment={showComment} step={step} />
                                {step === 0 && index + 1 >= moreFile && arr.length > moreFile && (
                                    <Div
                                        id="more"
                                        css={`
                                            width: 100%;
                                            height: 100%;
                                            position: absolute;
                                            color: white;
                                            align-items: center;
                                            justify-content: center;
                                            background-color: #6d6f7273;
                                        `}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMoreFile((pre) => pre + 6);
                                        }}
                                    >
                                        <P>+{arr.length - moreFile}</P>
                                    </Div>
                                )}
                            </Div>
                            {step === 0 && index + 1 === file.length && file.length > 6 && (
                                <Div
                                    key={index + 1}
                                    css={`
                                        grid-column-end: 4;
                                        grid-column-start: 1;
                                        cursor: var(--pointer);
                                        width: 100%;
                                        position: absolute;
                                        color: white;
                                        align-items: center;
                                        justify-content: center;
                                        background-color: #6d6f7273;
                                    `}
                                    onClick={() => setMoreFile(6)}
                                >
                                    <P>Less</P>
                                </Div>
                            )}
                        </Div>
                    );
                }
            })}
        </Div>
    );
};
export default DefaultType;
