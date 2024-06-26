import { Pagination } from 'swiper';
import React, { useRef, useState, useEffect } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Div, Img } from '~/reUsingComponents/styleComponents/styleDefault';
import Player from '~/reUsingComponents/Videos/Player';
import FullScreenSildes from '../FullScreenSildes/FullScreenSildes';
import LogicType from '../logicType';
import { PropsDataFileUpload } from '../../../FormUpNews';

// import required modules

const Dynamic: React.FC<{
    file: PropsDataFileUpload[];
    colorText: string;
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}> = ({ file, colorText, step, setStep }) => {
    const { moreFile, cc, handleStep, setMoreFile, ToolDefault, showTitle, update, setUpdate, showComment, setShowComment } = LogicType(step, setStep, colorText);
    const [heightV, setHeightV] = useState<{ id: number; value: string }[]>([]);
    const [heightI, setHeightI] = useState<string>('');
    useEffect(() => {
        file.forEach((f, index) => {
            if (f.type === 'video') {
                var video = document.createElement('video');
                video.src = f?.link || f.pre; // Thay đường dẫn bằng đường dẫn video thực tế
                video.addEventListener('loadedmetadata', function () {
                    var videoHeight = video.videoHeight;
                    var videoWidth = video.videoWidth;
                    console.log(videoHeight - videoWidth);
                    let check = false;
                    heightV.forEach((v) => {
                        if (v.id === index) {
                            check = true;
                        }
                    });
                    if (videoHeight - videoWidth > 400) {
                        if (!check) {
                            heightV.push({ id: index, value: '600px' });
                            setHeightV(heightV);
                        }
                    } else {
                        if (!check) {
                            heightV.push({ id: index, value: 'auto' });
                            setHeightV(heightV);
                        }
                    }
                });
            } else if (f.type === 'image') {
                if (!heightI) {
                    var img = new Image();
                    img.src = f?.link || f.pre; // Thay đường dẫn bằng đường dẫn hình ảnh thực tế
                    img.addEventListener('load', function () {
                        var imageHeight = img.naturalHeight;
                        var imageWidth = img.naturalWidth;
                        console.log(imageHeight, imageWidth, 'imageWidths');

                        if (imageHeight - imageWidth > 300) {
                            setHeightI('600px');
                        }
                    });
                }
            }
        });
    }, [file]);

    console.log(heightV, 'v');
    return (
        <>
            <Div
                width="100%"
                css={`
                    max-height: 500px;
                    img {
                        object-fit: contain;
                    }
                    .swiper-slide {
                        align-items: center;
                    }
                `}
            >
                {cc !== null && <FullScreenSildes step={step} cc={cc} files={file} />}
                {step > 0 && ToolDefault(0)}
                {step === 2 && ToolDefault(2)}

                <Swiper
                    pagination={{
                        dynamicBullets: true,
                    }}
                    modules={[Pagination]}
                    className="mySwiper"
                >
                    {file.map((f, index) => {
                        let h: string = '';
                        heightV.forEach((v) => {
                            if (v.id === index) {
                                h = v.value;
                            }
                        });

                        return (
                            <SwiperSlide
                                key={f.link}
                                onClick={(e) => {
                                    handleStep(e, index);
                                }}
                            >
                                {f.type.includes('image') ? (
                                    <Div
                                        width="100%"
                                        css={`
                                            height: 100%;
                                        `}
                                    >
                                        <Img src={f.link || f.pre} id="baby" alt={f?.title || f.link} radius="5px" />
                                    </Div>
                                ) : f.type.includes('video') ? (
                                    <Player height={step === 0 ? h : ''} src={f?.link || f.pre} step={step} />
                                ) : (
                                    ''
                                )}
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </Div>
        </>
    );
};
export default Dynamic;
