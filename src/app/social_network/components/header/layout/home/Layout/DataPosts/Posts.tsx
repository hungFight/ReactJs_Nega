import { DivPos, ReactQuillF } from '~/reUsingComponents/styleComponents/styleComponents';
import { useEffect, useRef, useState } from 'react';
import { Div, H3, Img, P, Smooth, Span } from '~/reUsingComponents/styleComponents/styleDefault';
import { DivAction, DivEmoji, TextAreaPre } from '../FormUpNews/styleFormUpNews';
import { DotI, HeartI, LikeI, LockI, ShareI } from '~/assets/Icons/Icons';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import moment from 'moment';
import Languages from '~/reUsingComponents/languages';
import OpUpdate from '~/reUsingComponents/PostOptions/OpUpdate';
import Cookies from '~/utils/Cookies';
import { PropsPosts } from './interfacePosts';
import FormUpNews from '../FormUpNews/FormUpNews';
import DefaultType from '../FormUpNews/ViewPostFrame/TypeFile/DefaultType';

const Posts: React.FC<PropsPosts> = ({
    user,
    colorBg,
    colorText,
    dataPosts,
    options,
    setOptions,
    setFormThat,
    form,
}) => {
    const { lg } = Languages();
    const { userId } = Cookies();
    const [showComment, setShowComment] = useState<boolean>(false);
    const [actImotion, setActImotion] = useState<boolean>(false);
    const [imotion, setImotion] = useState<{ id: number; icon: React.ReactElement | string }>({
        id: dataPosts.feel.act,
        icon: dataPosts.feel.act === 1 ? <LikeI /> : <HeartI />,
    });
    const [step, setStep] = useState<number>(0);
    const textA = useRef<any>();
    // const avatar = CommonUtils.convertBase64(dataPosts.user[0].avatar);
    let timeS: any;
    const handleShowI = (e: any) => {
        timeS = setTimeout(() => {
            setActImotion(true);
        }, 500);
    };
    const handleClearI = () => {
        clearTimeout(timeS);
    };
    console.log(dataPosts, 'dataPosts');

    const createdAt = moment(dataPosts.createdAt).format('LLLL');
    const fromNow = moment(moment(dataPosts.createdAt).format('HH:mm:ss DD-MM-YYYY'), 'HH:mm:ss DD-MM-YYYY')
        .locale(lg)
        .fromNow();
    // const postTypes = [
    //     // working in side OptionType
    //     <DefaultType
    //         colorText={colorText}
    //         file={file}
    //         step={step}
    //         setStep={setStep}
    //         upload={file}
    //         bg={bg}
    //         setBg={setBg}
    //     />,
    //     file.length > 3 ? (
    //         [
    //             <Dynamic colorText={colorText} file={file} step={step} setStep={setStep} />,
    //             <Fade colorText={colorText} file={file} step={step} setStep={setStep} />,
    //             <Cards colorText={colorText} file={file} step={step} setStep={setStep} />,
    //             <Coverflow colorText={colorText} file={file} step={step} setStep={setStep} />,
    //             <Centered
    //                 colorText={colorText}
    //                 file={file}
    //                 step={step}
    //                 setStep={setStep}
    //                 handleImageUpload={handleImageUpload}
    //                 ColumnCentered={ColumnCentered}
    //                 dataCentered={dataCentered}
    //                 setDataCentered={setDataCentered}
    //                 setColumnCen={setColumnCen}
    //             />,
    //         ][selectChild.id - 1]
    //     ) : (
    //         <P color="#bd5050">Please select at least 3 files!</P>
    //     ),
    //     <Circle colorText={colorText} file={file} step={step} setStep={setStep} />,
    // ];
    const [Imotions, setImotions] = useState<{ id: number; icon: string }[]>([
        { id: 1, icon: '👍' },
        { id: 2, icon: '❤️' },
        { id: 3, icon: '😂' },
        { id: 4, icon: '😍' },
        { id: 5, icon: '😘' },
        { id: 6, icon: '😱' },
        { id: 7, icon: '😡' },
    ]);
    return (
        <Div
            width="100%"
            css={`
                display: block;
                height: 100%;
                margin-top: 20px;
                position: relative;
                color: ${colorText};
            `}
        >
            {options === dataPosts._id && user.id === dataPosts.id_user && (
                <OpUpdate
                    createdAt={createdAt}
                    setOptions={setOptions}
                    onClick={() =>
                        setFormThat(
                            <FormUpNews
                                form={form}
                                colorBg={colorBg}
                                colorText={colorText}
                                user={user}
                                editF={true}
                                originalInputValue={dataPosts.content.text}
                                setOpenPostCreation={() => setFormThat(null)}
                            />,
                        )
                    }
                />
            )}
            <Div
                wrap="wrap"
                css={`
                    width: 100%;
                    overflow: hidden;
                    background-color: ${colorBg === 1 ? '#292a2d' : ''};
                    position: relative;
                    border: 1px solid #353535;
                    @media (min-width: 580px) {
                        border-radius: 5px;
                    }
                `}
            >
                {/* {step === 0 && file.length > 0 && (
                    <DivPos
                        size="18px"
                        top="11px"
                        right="46.5px"
                        css="z-index: 1;"
                        color={colorText}
                        onClick={() => setStep(1)}
                    >
                        <FullScreenI />
                    </DivPos>
                )} */}
                <Div width="100%" css="height: fit-content; margin-top: 5px; position: relative;">
                    <Div
                        css={`
                            width: 35px;
                            height: 35px;
                            margin: 5px;
                        `}
                    >
                        <Avatar
                            radius="50%"
                            src={dataPosts.user[0].avatar}
                            alt={dataPosts.user[0].fullName}
                            gender={dataPosts.user[0].gender}
                        />
                    </Div>
                    <Div
                        width="60%"
                        wrap="wrap"
                        css={`
                            color: ${colorText};
                            font-size: 1.2rem;
                            padding-top: 2px;
                            align-items: center;
                            margin-bottom: 4px;
                        `}
                    >
                        <H3
                            css={`
                                width: 100%;
                                color: ${colorText};
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                overflow: hidden;
                            `}
                        >
                            {dataPosts.user[0].fullName}
                        </H3>
                        <Div css="font-size: 1.1rem; color: #9a9a9a; display: flex; align-items: center; justify-content: space-around; white-space: nowrap;">
                            <LockI />
                            <Span css="padding-top: 3px; margin: 0 5px">{fromNow}</Span>
                            {/* <Span>{valueSeePost.icon}</Span> */}
                        </Div>
                    </Div>
                    <DivPos
                        size="21px"
                        top="4px"
                        right="10px"
                        color={colorText}
                        onClick={() => {
                            if (!options) {
                                setOptions(dataPosts._id);
                            } else {
                                if (options === dataPosts._id) {
                                    setOptions('');
                                } else {
                                    setOptions(dataPosts._id);
                                }
                            }
                        }}
                    >
                        <DotI />
                    </DivPos>
                </Div>

                <Div width="100%" css="padding: 5px 6px 10px 6px;" onClick={(e) => e.stopPropagation()}>
                    {dataPosts.content.text && (
                        <ReactQuillF
                            value={dataPosts.content.text}
                            modules={{
                                toolbar: false, // Tắt thanh công cụ
                            }}
                            readOnly={true}
                            css={`
                                width: 100%;
                                .ql-container.ql-snow {
                                    border: 0;
                                }
                                .ql-clipboard {
                                    display: none;
                                }
                                .ql-editor {
                                    outline: none;
                                }
                                padding: 5px;
                                color: ${colorText};
                                background-color: #292a2d;
                                font-family: ${dataPosts.content.fontFamily}, sans-serif;
                                white-space: pre-wrap;
                                word-break: break-word;
                                * {
                                    font-size: 1.5rem;
                                }
                                @media (min-width: 768px) {
                                    * {
                                        font-size: 1.38rem;
                                    }
                                }
                            `}
                        />
                    )}
                </Div>
                {dataPosts.hashTag?.length > 0 && (
                    <Div width="100%" wrap="wrap" css="padding: 6px">
                        {dataPosts.hashTag.map((tag) => (
                            <Smooth // link tag
                                key={tag._id}
                                to={`/sn/hashTags/${tag.value}`}
                                size="1.3rem"
                                css={`
                                    margin-right: 5px;
                                    color: #5ba3e2;
                                `}
                            >
                                {tag.value}
                            </Smooth>
                        ))}
                    </Div>
                )}
                <Div
                    width="100%"
                    css={`
                        justify-content: center;
                        position: relative;
                        color: ${colorText};
                        ${step === 1
                            ? 'height: 100%; overflow-y: overlay; position: fixed; top: 0; left: 0; right: 0; align-items: center;  background-color: #1f2021; z-index: 8888; @media(max-width: 769px){&::-webkit-scrollbar {width: 0px;}}'
                            : ''};
                    `}
                >
                    {/* {postTypes[selectType]} */}
                </Div>
                {/* <Div
                    css={`
                        width: 100%;
                        color: ${colorText};
                        font-size: 1.8rem;
                    `}
                >
                    <Div
                        css={`
                            width: fint-content;
                            border-radius: 11px;
                            margin: 8px;
                            @media (min-width: 768px) {
                                &:hover .emoji div {
                                    margin: 0 7px;
                                }
                                &:hover .emoji div span {
                                    display: block;
                                }
                            }
                        `}
                    ></Div>
                </Div> */}
                <DefaultType
                    colorText={colorText}
                    file={dataPosts.content.options.default.map((f) => f.file)}
                    step={step}
                    setStep={setStep}
                    bg={''}
                    link={true}
                />
                <Div
                    width="100%"
                    css={`
                        text-align: center;
                        justify-content: space-evenly;
                        font-size: 2.4rem;
                        border-radius: 5px;
                        margin-bottom: 5px;
                        color: ${colorText};
                    `}
                    onClick={(e: any) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                >
                    <Div
                        css={`
                            width: 100%;
                            color: ${colorText};
                            font-size: 1.8rem;
                        `}
                    >
                        <Div
                            css={`
                                width: fit-content;
                                border-radius: 11px;
                                margin: 8px;
                                @media (min-width: 768px) {
                                    &:hover .emoji div {
                                        margin: 0 7px;
                                    }
                                    &:hover .emoji div span {
                                        display: block;
                                    }
                                }
                            `}
                        >
                            <Div className="emoji" css="margin-left: 2px; align-items: flex-end;">
                                {Object.keys(dataPosts.feel.emo).map((key, index) => (
                                    <>
                                        {dataPosts.feel.emo[key] ? (
                                            <DivEmoji key={key}>{Imotions[index + 1].icon}</DivEmoji>
                                        ) : (
                                            ''
                                        )}
                                    </>
                                ))}
                            </Div>
                        </Div>
                    </Div>
                    <Div>
                        {dataPosts.feel.only.length > 0 && (
                            <DivAction
                                id="parent"
                                css={`
                                    @media (min-width: 768px) {
                                        &:hover {
                                            #emoBarPost {
                                                display: flex;
                                                top: -50px;
                                            }
                                        }
                                    }
                                `}
                                onTouchStart={handleShowI}
                                onTouchEnd={handleClearI}
                                onClick={() => {
                                    if (!actImotion) {
                                        if (typeof imotion.icon === 'string') {
                                            setImotion({
                                                id: dataPosts.feel.act,
                                                icon: dataPosts.feel.act === 1 ? <LikeI /> : <HeartI />,
                                            });
                                        } else {
                                            dataPosts.feel.only.map((i, index, arr) => {
                                                if (i.id === imotion.id) {
                                                    setImotion(i);
                                                }
                                            });
                                        }
                                    }
                                }}
                            >
                                {imotion.icon}
                                <Div
                                    id="emoBarPost"
                                    width="fit-content"
                                    className="showI"
                                    display="none"
                                    css={`
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        background-color: #292a2d;
                                        padding: 5px 20px 8px;
                                        border-radius: 50px;
                                        z-index: 7;
                                        div {
                                            min-width: 40px;
                                            height: 40px;
                                            padding-top: 2px;
                                            font-size: 28px;
                                            margin: 0;
                                            border-radius: 50%;
                                            cursor: var(--pointer);
                                        }
                                    `}
                                >
                                    {dataPosts.feel.only.map((i, index, arr) => (
                                        <DivEmoji
                                            key={i.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImotion({ id: i.id, icon: i.icon });
                                                setActImotion(false);
                                            }}
                                        >
                                            {i.icon}
                                        </DivEmoji>
                                    ))}
                                </Div>
                            </DivAction>
                        )}
                        {/* compare with id of option in  post's OpText */}
                        {!dataPosts.private.some((p) => p.id === 2) && (
                            <DivAction onClick={() => setShowComment(true)}>
                                <P css="font-size: 1.3rem;">...Comments</P>
                            </DivAction>
                        )}
                        {!dataPosts.private.some((p) => p.id === 3) && (
                            <DivAction>
                                <ShareI />
                            </DivAction>
                        )}
                    </Div>
                </Div>
                {/* {showComment && <Comment colorText={colorText} anony={valuePrivacy} setShowComment={setShowComment} />} */}
            </Div>
        </Div>
    );
};
export default Posts;
