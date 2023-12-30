import { HeartMI } from '~/assets/Icons/Icons';
import { Div, Img } from '~/reUsingComponents/styleComponents/styleDefault';
import LogicType from './logicType';
import Player from '~/reUsingComponents/Videos/Player';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper';
const Circle: React.FC<{
    file: { link: string; type: string }[];
    colorText: string;
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}> = ({ file, colorText, step, setStep }) => {
    const pagination = {
        clickable: true,
        renderBullet: function (index: number, className: string) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        },
    };
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
            wrap="wrap"
            css={`
                max-height: 500px;
                justify-content: space-evenly;
                position: relative;
            `}
        >
            {' '}
            {step > 0 && ToolDefault(0)}
            {step === 2 && ToolDefault(2)}
            {cc !== null && (
                <Div
                    css={`
                        position: fixed;
                        top: 0;
                        left: 0;
                        z-index: 103;
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
                    `}
                >
                    <Swiper pagination={pagination} modules={[Pagination]} initialSlide={cc} className="mySwiper">
                        {file.map((f, index) => (
                            <SwiperSlide
                                key={f.link}
                                onClick={(e) => {
                                    handleStep(e, index);
                                }}
                            >
                                {f?.type.includes('image') ? (
                                    <Img src={f?.link} id="baby" alt={f?.link} />
                                ) : f?.type.includes('video') ? (
                                    <Player src={f?.link} step={step} />
                                ) : (
                                    ''
                                )}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Div>
            )}
            {step > 0 && ToolDefault(0)}
            {file.map((f, index) => {
                return (
                    <Div
                        key={f.link}
                        width="80px"
                        id="baby"
                        className="aaa"
                        wrap="wrap"
                        onClick={(e) => {
                            handleStep(e, index);
                        }}
                        css={`
                            height: 80px;
                            margin-bottom: 10px;
                            img {
                                border-radius: 50%;
                            }
                            ${(index + 1) % 2 === 0 ? 'margin-top: 25px' : ''};

                            @media (min-width: 580px) {
                                width: 100px;
                                height: 100px;
                            }
                            /* ${step > 1
                                ? `width: 100% !important; margin: 0; height: 100% !important; img {border-radius: 0} position: fixed;  top: 0; left:0; z-index: 103; background-color: #0e0e0d; img,div.video-react-controls-enabled{object-fit: contain; margin: auto;}`
                                : ''} */
                        `}
                    >
                        {f.type.includes('image') ? (
                            <Img src={f.link} alt={f.link} />
                        ) : f.type.includes('video') ? (
                            <Player src={f.link} />
                        ) : (
                            ''
                        )}
                    </Div>
                );
            })}
        </Div>
    );
};
export default Circle;
