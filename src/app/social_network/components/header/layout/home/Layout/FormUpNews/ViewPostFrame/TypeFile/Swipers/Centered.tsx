import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';

// import required modules
import { Pagination } from 'swiper';
import { Div, Img, P } from '~/reUsingComponents/styleComponents/styleDefault';
import Player from '~/reUsingComponents/Videos/Player';
import { DivPos, SwiperSlideF } from '~/reUsingComponents/styleComponents/styleComponents';
import { CloseI, LayoutI, ScreenI } from '~/assets/Icons/Icons';
import LogicType from '../logicType';
import FullScreenSildes from '../FullScreenSildes/FullScreenSildes';
import { PropsDataFileUpload } from '../../../FormUpNews';

const Centered: React.FC<{
    file: PropsDataFileUpload[];
    colorText: string;
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
    handleImageUpload: (e: any, addMore: boolean) => Promise<void>;

    ColumnCentered: boolean;
    dataCentered: {
        id: number;
        columns: number;
        data: PropsDataFileUpload[];
    }[];
    setDataCentered: React.Dispatch<
        React.SetStateAction<
            {
                id: number;
                columns: number;
                data: PropsDataFileUpload[];
            }[]
        >
    >;

    setColumnCen: React.Dispatch<React.SetStateAction<number>>;
}> = ({
    file,
    colorText,
    step,
    setStep,
    handleImageUpload,
    dataCentered,
    setDataCentered,
    ColumnCentered,
    setColumnCen,
}) => {
    let cld: number[] = [];
    for (let i = 1; i <= file.length; i++) {
        if (i >= 4) cld.push(i);
    }
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
        <Div
            width="100%"
            display="block"
            css="position: relative; height: 100%; .mySwiper{ width: 100%; img{ user-select: none;}}"
        >
            {/* <DivPos top="0" left="11px" index={2} size="22px">
                <LayoutI />
            </DivPos> */}
            {step > 0 && ToolDefault(0)}
            {step === 2 && ToolDefault(2)}
            {cc !== null && <FullScreenSildes step={step} cc={cc} files={file} />}
            {dataCentered.map((dt) => {
                let cls: number[] = [];
                for (let i = 1; i <= dt.data.length; i++) {
                    if (i >= 4) cls.push(i);
                }
                console.log(cls);

                return (
                    <Div key={dt.id} width="100%" wrap="wrap" css="   max-height: 500px;">
                        {ColumnCentered && (
                            <Div css="padding: 2px 4px;">
                                {cls.map((c) => (
                                    <P
                                        key={c}
                                        z="1.3rem"
                                        css={`
                                            padding: 1px 7px;
                                            border: 1px solid #5a5853;
                                            border-radius: 5px;
                                            margin: 0 2px;
                                            cursor: var(--pointer);
                                            ${dt.columns === c ? 'background-color: #505356;' : ''};
                                        `}
                                        onClick={() => {
                                            setColumnCen(c);
                                            setDataCentered(() =>
                                                dataCentered.map((dc) => {
                                                    if (dc.id === dt.id) {
                                                        dc.columns = c;
                                                    }
                                                    return dc;
                                                }),
                                            );
                                        }}
                                    >
                                        {c}
                                    </P>
                                ))}
                                <Div
                                    css="align-items: center; cursor: var(--pointer); font-size: 20px; padding: 1px 3px;"
                                    onClick={() => {
                                        setDataCentered(() => dataCentered.filter((d) => d.id !== dt.id));
                                    }}
                                >
                                    <CloseI />
                                </Div>
                            </Div>
                        )}
                        <Swiper
                            slidesPerView={dt.columns}
                            spaceBetween={5}
                            centeredSlides={true}
                            pagination={{
                                clickable: true,
                            }}
                            className="mySwiper"
                        >
                            {dt.data.map((f, index) => {
                                return (
                                    <SwiperSlideF
                                        key={f.link}
                                        onClick={(e) => {
                                            handleStep(e, index);
                                        }}
                                        css="width: 100px !important; height: 100px;"
                                    >
                                        {f.type.includes('image') ? (
                                            <Img src={f?.link || f.pre} alt={f?.title || f.link} radius="5px" />
                                        ) : f.type.includes('video') ? (
                                            <Player src={f?.link || f.pre} step={step} height="100%" />
                                        ) : (
                                            ''
                                        )}
                                    </SwiperSlideF>
                                );
                            })}
                        </Swiper>
                    </Div>
                );
            })}
        </Div>
    );
};
export default Centered;
