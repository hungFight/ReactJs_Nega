import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper';
import { Div, Img } from '~/reUsingComponents/styleComponents/styleDefault';
import Player from '~/reUsingComponents/Videos/Player';
import { PropsDataFileUpload } from '../../../FormUpNews';
const FullScreenSildes: React.FC<{
    files: PropsDataFileUpload[];
    step: number;
    cc: number;
}> = ({ files, step, cc }) => {
    const pagination = {
        clickable: true,
        renderBullet: function (index: number, className: string) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
    };

    return (
        <Div
            css={`
                position: fixed;
                top: 0;
                left: 0;
                z-index: 999;
                width: 100%;
                height: 100%;
                background-color: #171718;
                img {
                    object-fit: contain;
                }
                .swiper-pagination-bullet {
                    width: 20px;
                    height: 20px;
                    text-align: center;
                    line-height: 20px;
                    font-size: 12px;
                    opacity: 1;
                    color: white;
                    background-color: #373737;
                }
                .swiper-pagination-bullet-active {
                    background-color: #219599 !important;
                }
                .swiper-pagination-bullets {
                    left: 50% !important;
                    right: 50% !important;
                    translate: -50% !important;
                    width: max-content !important;
                }
            `}
        >
            <Swiper pagination={pagination} modules={[Pagination]} initialSlide={cc} className="mySwiperFull">
                {files.map((f, index) => (
                    <SwiperSlide key={index}>
                        {f?.type === 'image' ? (
                            <Img src={f.pre || `${process.env.REACT_APP_SERVER_FILE_GET_IMG_V1}/${f?.link}`} id="baby" alt={f?.link} />
                        ) : f?.type === 'video' ? (
                            <Player src={f.pre || `${process.env.REACT_APP_SERVER_FILE_GET_VIDEO_V1}/${f?.link}`} step={step} />
                        ) : (
                            ''
                        )}
                    </SwiperSlide>
                ))}
            </Swiper>
        </Div>
    );
};

export default FullScreenSildes;
