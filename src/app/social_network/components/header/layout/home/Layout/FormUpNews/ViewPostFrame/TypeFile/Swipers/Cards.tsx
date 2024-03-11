import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';
// import required modules
import { EffectCards } from 'swiper';
import { Div, Img } from '~/reUsingComponents/styleComponents/styleDefault';
import Player from '~/reUsingComponents/Videos/Player';
import { DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { ScreenI } from '~/assets/Icons/Icons';
import LogicType from '../logicType';
import FullScreenSildes from '../FullScreenSildes/FullScreenSildes';
import { PropsDataFileUpload } from '../../../FormUpNews';

const Cards: React.FC<{
    file: PropsDataFileUpload[];
    colorText: string;
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}> = ({ file, colorText, step, setStep }) => {
    const {
        moreFile,
        cc,
        handleStep,
        setMoreFile,
        ToolDefault,
        showTitle,
        update,
        setUpdate,
        showComment,
        setShowComment,
    } = LogicType(step, setStep, colorText);
    return (
        <>
            <Div
                display="block"
                width="42%"
                css={`
                    max-height: 500px;
                    .swiper-wrapper {
                        align-items: center;
                        img {
                            object-fit: contain;
                        }
                    }
                    height: fit-content;
                    margin: auto;
                    ${step === 1 ? '@media (min-width: 825px) {width: 350px}' : ''};
                `}
            >
                {step > 0 && ToolDefault(0)}
                {step === 2 && ToolDefault(2)} {cc !== null && <FullScreenSildes step={step} cc={cc} files={file} />}
                <Swiper effect={'cards'} loop={true} grabCursor={true} modules={[EffectCards]} className="mySwiper">
                    {file.map((f, index) => (
                        <SwiperSlide
                            key={f.link}
                            onClick={(e) => {
                                handleStep(e, index);
                            }}
                        >
                            {f.type.includes('image') ? (
                                <Img src={f?.link || f.pre} alt={f?.title || f.link} radius="5px" />
                            ) : f.type.includes('video') ? (
                                <Player src={f?.link || f.pre} step={step} height="100%" />
                            ) : (
                                ''
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Div>
        </>
    );
};
export default Cards;
