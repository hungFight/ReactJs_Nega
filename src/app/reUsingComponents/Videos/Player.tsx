import { ReactElement, useEffect, useRef, useState } from 'react';
import { Div, DivFlex, Img, P } from '../styleComponents/styleDefault';
import { DivControls, Input, Progress, Video } from './styleVideos';
import {
    FastBackI,
    FastForwardI,
    ForwardI,
    FullScreenI,
    GroupPeopleI,
    PauseI,
    PlayI,
    ScreenI,
    SettingI,
    SpeedI,
    VolumeOffI,
    VolumeOnI,
} from '~/assets/Icons/Icons';

const Player: React.FC<{ src: string; step?: number; height?: string; radius?: string }> = ({
    src,
    step,
    height,
    radius,
}) => {
    const video = useRef<any>();
    const progress = useRef<any>();
    const [showTime, setShowTime] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const playRef = useRef<boolean>(false);
    const [play, setPlay] = useState<boolean>(false);
    const [volume, setVolume] = useState<boolean>(true);
    const [fullScreen, setFullScreen] = useState<boolean>(false);
    const [opt, setOpt] = useState<boolean>(false);

    const [showControls, setShowControls] = useState<boolean>(false);
    useEffect(() => {
        if (progress.current) progress.current.value = 0;
        console.log(progress.current, 'progress.current');

        video.current.volume = 1;
        video.current.addEventListener('loadedmetadata', function () {
            // Once the metadata is loaded, you can get the video duration
            setShowTime(Math.round(video.current.duration));
            // video.current.playbackRate = 0.5;
            // Now you have the duration of the video in seconds
            console.log('Video duration: ' + video.current.duration + ' seconds');
        });

        video.current.addEventListener('timeupdate', function () {
            const currentTime = video.current.currentTime;
            const duration = video.current.duration;
            setCurrentTime(Math.round(currentTime));
            const prog = (currentTime / duration) * 100;
            progress.current.value = prog;
            const min = progress.current.min;
            const max = progress.current.max;
            const val = progress.current.value;
            console.log(val, 'val');

            progress.current.style.backgroundSize = ((val - min) * 100) / (max - min) + '% 100%';
            if (prog === 100) setPlay(false);
        });
    }, []);

    useEffect(() => {
        if (step === 0 || step === 1) {
            if (play) {
                video.current.pause();
                playRef.current = false;
                setPlay(false);
            }
        }
    }, [step]);
    const handlePlay = () => {
        const videoALl = document.querySelectorAll('video');
        Array.from(videoALl).forEach((video) => {
            video.pause();
        });
        setShowControls(true);
        if (play) {
            video.current.pause();
            playRef.current = false;
            setPlay(false);
        } else {
            video.current.play();
            playRef.current = true;
            setPlay(true);
        }
    };
    const handleProgressChange = (e: any) => {
        const min = e.target.min;
        const max = e.target.max;
        const val = e.target.value;
        if (video.current) {
            const duration = video.current.duration;
            const currentTime = (val / 100) * duration;
            video.current.currentTime = currentTime;
        }
        e.target.style.backgroundSize = ((val - min) * 100) / (max - min) + '% 100%';
    };
    const handleMouseDown = () => {
        if (play) {
            video.current.pause();
            setPlay(false);
        }
    };
    const handleMouseUp = () => {
        if (!play && playRef.current) {
            video.current.play();
            setPlay(true);
        }
        if (Image.current) {
            Image.current.src = '';
            Image.current.style.display = 'none';
        }
    };
    const handleVolume = () => {
        if (video.current) {
            if (volume) {
                video.current.volume = 0;
                setVolume(false);
            } else {
                video.current.volume = 0.5;
                setVolume(true);
            }
        }
    };
    const handleProgressVolume = (e: any) => {
        const min = e.target.min;
        const max = e.target.max;
        const val = e.target.value;
        if (val > 0) {
            setVolume(true);
        } else {
            setVolume(false);
        }
        if (video.current) {
            const newVol = val / 100;
            video.current.volume = newVol;
            e.target.style.backgroundSize = ((val - min) * 100) / (max - min) + '% 100%';
        }
    };
    const [speed, setSpeed] = useState<{ id: number; val: number; text?: string }>({ id: 3, val: 1, text: 'Normal' });
    const [forward, setForward] = useState<{ id: number; val: number }>({ id: 2, val: 10 });
    const options: {
        id: number;
        name: string;
        title: ReactElement | string;
        value?: {
            id: number;
            val: number;
            text?: string;
        };
        icon: ReactElement;
        type?: string;
        onClick: (v: { id: number; val: number }) => void;
        data: { id: number; val: number; text?: string }[];
    }[] = [
        {
            id: 1,
            title: <SpeedI />,
            name: 'Speed',
            value: speed,
            icon: <SpeedI />,
            onClick: (v: { id: number; val: number; text?: string }) => {
                video.current.playbackRate = v.val;
                setSpeed(v);
            },
            data: [
                { id: 1, val: 0.5 },
                { id: 2, val: 0.75 },
                { id: 3, val: 1, text: 'Normal' },
                { id: 4, val: 1.25 },
                { id: 5, val: 1.5 },
                { id: 6, val: 1.75 },
                { id: 7, val: 2 },
            ],
        },
        {
            id: 2,
            name: 'Forward',
            value: forward,
            onClick: (v: { id: number; val: number }) => setForward(v),
            title: (
                <DivFlex width="auto" css="margin-right: 5px;">
                    <DivFlex width="auto" css="font-size: 20px; cursor: var(--pointer)">
                        <FastBackI />
                    </DivFlex>
                    <DivFlex width="auto" css="font-size: 20px; cursor: var(--pointer)">
                        <FastForwardI />
                    </DivFlex>
                </DivFlex>
            ),
            icon: <ForwardI />,
            type: 's',
            data: [
                { id: 1, val: 5 },
                { id: 2, val: 10 },
                { id: 3, val: 15 },
                { id: 4, val: 20 },
                { id: 5, val: 25 },
                { id: 6, val: 30 },
            ],
        },
        { id: 3, onClick: () => {}, name: 'Group', title: 'Group', icon: <GroupPeopleI />, data: [] },
    ];
    console.log(speed, forward);
    const [picture, setPicture] = useState<string>('');
    const Image = useRef<HTMLImageElement | null>(null);
    const handleHover = (e: any) => {
        if (Image.current) Image.current.alt = '';

        const progressBar = e.target;
        const mouseX = e.clientX - progressBar.getBoundingClientRect().left;
        const progressBarWidth = progressBar.clientWidth;
        const value = (mouseX / progressBarWidth) * 100; // Calculate the value as a percentage
        const second = Math.ceil((value * showTime) / 100);
        const canvas = document.createElement('canvas');
        const vid = document.createElement('video');
        vid.src = src;
        vid.currentTime = second;
        vid.addEventListener('seeked', () => {
            if (!(Image.current?.getAttribute('alt') === 'remove')) {
                // Draw the frame on the canvas
                canvas.width = vid.videoWidth;
                canvas.height = vid.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(vid, 0, 0, canvas.width, canvas.height);
                const imageSrc = canvas.toDataURL('image/jpeg');
                if (imageSrc)
                    if (Image.current) {
                        Image.current.src = imageSrc;
                        Image.current.style.display = 'block';
                    }

                console.log(second, 'value', mouseX, progressBarWidth, ctx);
            }
            // Now, ctx contains the frame at the specified time
        });

        //  setHoverValue(value);
    };
    const handleMouseLeave = () => {
        if (Image.current) {
            Image.current.src = '';
            Image.current.alt = 'remove';
            Image.current.style.display = 'none';
        }
    };
    return (
        <Div
            width="100%"
            css={`
                height: ${height || '100%'};
                justify-content: center;
                position: relative;
                overflow: hidden;
                z-index: 1;
                user-select: none;
                &:hover {
                    .controls {
                        bottom: 10px;
                    }
                }
                ${fullScreen ? 'position: fixed; top: 0; left: 0; z-index: 999; height: 100%;' : ''}
            `}
            onClick={() => setOpt(false)}
        >
            <Video
                src={src}
                ref={video}
                onClick={handlePlay}
                style={{ borderRadius: radius }}
            />
            <DivControls className="controls" onClick={(e) => e.stopPropagation()}>
                <Div
                    width="100%"
                    css={`
                        align-items: center;
                        cursor: var(--pointer);
                        position: relative;
                        @media (min-width: 768px) {
                            width: 98%;
                        }
                    `}
                >
                    <Img
                        ref={Image}
                        src=""
                        css={`
                            display: none;
                            position: absolute;
                            width: 100px;
                            height: auto;
                            border-radius: 5px;
                            bottom: 8px;
                            object-fit: contain;
                            left: 0;
                        `}
                    />
                    <DivFlex
                        width="auto"
                        css={`
                            position: absolute;
                            top: -26px;
                            right: -2px;
                            font-size: 20px;
                            cursor: var(--pointer);
                        `}
                        onClick={() => setOpt(!opt)}
                    >
                        <SettingI />
                        {opt && (
                            <Div
                                width="200px"
                                display="block"
                                css="position: absolute; top: -105px; right: 0px; background-color: #2727278a;color: white; padding: 5px 0; border-radius: 1px;"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {options.map((o) => (
                                    <DivFlex
                                        key={o.id}
                                        justify="space-between"
                                        css="padding: 5px 8px; &:hover{background-color: #3d3d3d9e;} &:active{.deep{display: block}} &:hover{.deep{display: block}}"
                                    >
                                        <DivFlex width="auto">
                                            <Div css="margin-right: 5px">{o.icon}</Div>
                                            <P z="1.3rem">{o.name}</P>
                                        </DivFlex>
                                        <P z="1.3rem">
                                            {o.value
                                                ? `${o.value.val} ${
                                                      o.id === 2 ? 's' : o.value?.text ? o.value?.text : ''
                                                  }`
                                                : null}
                                        </P>
                                        <Div
                                            width="9px"
                                            display="none"
                                            className="deep"
                                            css="height: 100px; position: absolute; left:-6px; top: 0;.deep{display: block}"
                                        ></Div>
                                        <Div
                                            width="100%"
                                            display="none"
                                            className="deep"
                                            css="position: absolute; bottom: 0; right: 102%; background-color: #2727278a; border-radius: 5px; padding: 5px 9px; &:hover{display: block}"
                                        >
                                            <DivFlex>{o.title}</DivFlex>
                                            {o.data?.map((x) => (
                                                <Div
                                                    key={x.id}
                                                    css={`
                                                        padding: 5px;
                                                        &:hover {
                                                            background-color: #585858ab;
                                                        }
                                                        ${o.value?.id === x.id ? 'background-color: #585858ab;' : ''}
                                                    `}
                                                    onClick={() => o.onClick(x)}
                                                >
                                                    <P z="1.2rem" css="">
                                                        {x.val}
                                                        {x?.text ? ` ( ${x?.text} )` : ''}
                                                        {o.type}
                                                    </P>
                                                </Div>
                                            ))}
                                        </Div>
                                    </DivFlex>
                                ))}
                            </Div>
                        )}
                    </DivFlex>
                    <Input
                        ref={progress}
                        type="range"
                        defaultValue={0}
                        min="0"
                        max="100"
                        bo
                        bgImage="linear-gradient(rgb(45, 108, 209), rgb(45, 108, 209))"
                        onChange={handleProgressChange}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onTouchStart={handleMouseDown}
                        onTouchEnd={handleMouseUp}
                        onMouseMove={handleHover}
                        onMouseLeave={handleMouseLeave}
                        css="background-size: 0;padding: 2px 0;"
                    />
                </Div>
                <DivFlex justify="space-between" css="padding: 0 5px; height: 100%;">
                    <Div
                        display="none"
                        width="58px"
                        css={`
                            height: 100%;

                            @media (min-width: 768px) {
                                display: flex;
                            }
                        `}
                    >
                        <Div
                            css="width: 30px; height: 100%; align-items: center; justify-content: center;  font-size: 18px;  align-items: center; cursor: var(--pointer);"
                            onClick={handlePlay}
                        >
                            {play ? <PauseI /> : <PlayI />}
                        </Div>
                        <Div
                            onClick={handleVolume}
                            css={`
                                width: 30px;
                                height: 100%;
                                align-items: center;
                                justify-content: center;
                                cursor: var(--pointer);
                                &:hover {
                                    div {
                                        display: flex;
                                    }
                                }
                                font-size: 25px;
                            `}
                        >
                            {volume ? <VolumeOnI /> : <VolumeOffI />}
                            <Div
                                display="none"
                                width="115px"
                                className="Volume"
                                css={`
                                    justify-content: center;
                                    left: 57px;
                                    margin-left: 5px;
                                    align-items: center;
                                    position: absolute;
                                    height: 32px;
                                `}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <Input
                                    id="volumeVideo"
                                    bgImage="linear-gradient(rgb(44 45 45),rgb(49 49 49))"
                                    type="range"
                                    min="0"
                                    max="100"
                                    onChange={handleProgressVolume}
                                    css={`
                                        height: 12px;
                                        border: 1px solid #acacac;
                                    `}
                                />
                            </Div>
                        </Div>
                    </Div>

                    <Div>
                        <DivFlex width="auto" css="margin-right: 5px;">
                            <DivFlex
                                width="auto"
                                css="font-size: 21px; cursor: var(--pointer)"
                                onClick={() => {
                                    video.current.currentTime =
                                        video.current.currentTime - forward.val <= 0
                                            ? 0
                                            : video.current.currentTime - forward.val;
                                }}
                            >
                                <FastBackI />
                            </DivFlex>
                            <DivFlex
                                width="auto"
                                css="font-size: 21px; cursor: var(--pointer)"
                                onClick={() => {
                                    video.current.currentTime =
                                        video.current.currentTime + forward.val >= video.current.duration
                                            ? video.current.duration
                                            : video.current.currentTime + forward.val;
                                }}
                            >
                                <FastForwardI />
                            </DivFlex>
                        </DivFlex>
                        <Div
                            display="none"
                            css="justify-content: space-around; align-items: center; @media(min-width: 768px) {display: flex;}"
                        >
                            <P
                                z="1.2rem"
                                css={`
                                    width: max-content;
                                    padding: 2px 5px;
                                `}
                            >
                                {currentTime + ' / ' + showTime}
                            </P>
                            {/* <Div css="font-size: 20px;">
                                    <FullScreenI />
                                </Div> */}
                        </Div>
                        {!fullScreen ? (
                            <DivFlex
                                width="22px"
                                css={`
                                    font-size: 20px;
                                    cursor: var(--pointer);
                                `}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFullScreen(true);
                                }}
                            >
                                {' '}
                                <FullScreenI />
                            </DivFlex>
                        ) : (
                            <DivFlex
                                width="22px"
                                css={`
                                    font-size: 20px;
                                    cursor: var(--pointer);
                                `}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFullScreen(false);
                                }}
                            >
                                <ScreenI />
                            </DivFlex>
                        )}
                    </Div>
                </DivFlex>
            </DivControls>
        </Div>
    );
};
export default Player;
