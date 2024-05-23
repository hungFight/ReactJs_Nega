import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

// import required modules
import { EffectFade, Pagination } from 'swiper';
import { Div, Img } from '~/reUsingComponents/styleComponents/styleDefault';
import Player from '~/reUsingComponents/Videos/Player';
import LogicType from '../logicType';
import FullScreenSildes from '../FullScreenSildes/FullScreenSildes';
import { PropsDataFileUpload } from '../../../FormUpNews';

const Fade: React.FC<{
    file: PropsDataFileUpload[];
    colorText: string;
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}> = ({ file, colorText, step, setStep }) => {
    const { moreFile, cc, handleStep, setMoreFile, ToolDefault, showTitle, update, setUpdate, showComment, setShowComment } = LogicType(step, setStep, colorText);
    return (
        <Div
            width="100%"
            css={`
                max-height: 500px;
                .swiper-fade .swiper-slide {
                    background-color: #292a2d;
                    img {
                        object-fit: contain;
                    }
                }
            `}
        >
            {step > 0 && ToolDefault(0)}
            {step === 2 && ToolDefault(2)} {cc !== null && <FullScreenSildes step={step} cc={cc} files={file} />}
            <Swiper
                spaceBetween={30}
                effect={'fade'}
                navigation={true}
                pagination={{
                    clickable: true,
                }}
                modules={[EffectFade, Pagination]}
                className="mySwiperFade"
            >
                {file.map((f, index) => (
                    <SwiperSlide
                        key={f.link}
                        onClick={(e) => {
                            handleStep(e, index);
                        }}
                    >
                        {f.type.includes('image') ? <Img src={f?.link || f.pre} id="baby" alt={f.link} radius="5px" /> : f.type.includes('video') ? <Player src={f?.link || f.pre} step={step} /> : ''}
                    </SwiperSlide>
                ))}
            </Swiper>
        </Div>
    );
};
export default Fade;
