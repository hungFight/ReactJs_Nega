import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { A, Button, Div, H3, Img, Links, P, Smooth, Span } from '~/reUsingComponents/styleComponents/styleDefault';
import { PropsUserHome } from '../../Home';
import {
    BanI,
    Bullseye,
    CameraI,
    CheckI,
    DotI,
    EarthI,
    FriendI,
    FullScreenI,
    HeartI,
    IconI,
    ImageI,
    LikeI,
    LoadingCircleI,
    LoadingI,
    LockI,
    NextI,
    PlayI,
    PrivateI,
    ScreenI,
    ShareI,
    SliderI,
    SmileI,
    SortFileI,
    UndoI,
    UndoIRegister,
    VideoI,
} from '~/assets/Icons/Icons';
import {
    DivAction,
    DivEmoji,
    DivItems,
    DivWrapButton,
    Label,
    SpanAmount,
    TextAreaPre,
    Textarea,
} from './styleFormUpNews';
import { useCallback, useEffect, useRef, useState } from 'react';
import Coverflow from './ViewPostFrame/TypeFile/Swipers/Coverflow';
import Grid from './ViewPostFrame/TypeFile/Grid';
import DefaultType from './ViewPostFrame/TypeFile/DefaultType';
import OptionType from './ViewPostFrame/OptionType';
import HomeAPI from '~/restAPI/socialNetwork/homeAPI';
import { ButtonSubmit, DivLoading, DivPos, UpLoadForm } from '~/reUsingComponents/styleComponents/styleComponents';
import OpFeatureSetting from '~/reUsingComponents/PostOptions/OpFeature';
import Dynamic from './ViewPostFrame/TypeFile/Swipers/Dynamic';
import Fade from './ViewPostFrame/TypeFile/Swipers/Fade';
import Cards from './ViewPostFrame/TypeFile/Swipers/Cards';
import Comment from './Comment';
import Centered from './ViewPostFrame/TypeFile/Swipers/Centered';
import Circle from './ViewPostFrame/TypeFile/Circle';
import LogicPreView from './LogicPreView';
import Player from '~/reUsingComponents/Videos/Player';
import { PropsDataFileUpload } from './FormUpNews';
import handleFileUpload from '~/utils/handleFileUpload';
import EditFiles from './EditFiles.tsx/Editfiles';
export interface PropsPreViewFormHome {
    time: {
        hour: string;
        minute: string;
        second: string;
    };
    buttonFirst: string;
    buttonTwo: string;
}

const PreviewPost: React.FC<{
    user: PropsUserHome;
    colorText: string;
    colorBg: number;
    file: PropsDataFileUpload[];
    fontFamily: {
        name: string;
        type: string;
    };
    valueText: string;
    dataText: PropsPreViewFormHome;
    token: string;
    userId: string;
    handleImageUpload: (e: any, addMore?: boolean) => Promise<void>;
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

    handleClear: () => void;
    hashTags: string[];
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
    editForm: boolean;
    setUploadPre: React.Dispatch<React.SetStateAction<PropsDataFileUpload[]>>;
}> = ({
    user,
    colorText,
    colorBg,
    file,
    valueText,
    fontFamily,
    dataText,
    token,
    userId,
    handleImageUpload,
    dataCentered,
    setDataCentered,
    handleClear,
    hashTags,
    setEdit,
    editForm,
    setUploadPre,
}) => {
    // Select type of post
    const {
        selectType,
        setSelectType,
        selectChild,
        setSelectChild,
        ColumnCentered,
        setColumnCentered,
        column,
        setColumn,
        step,
        setStep,
        options,
        setOptions,
        showAc,
        setShowAc,
        showComment,
        setShowComment,
        showI,
        setShowI,
        acEmo,
        setAcEmo,
        textA,
        valuePrivacy,
        setValuePrivacy,
        valueSeePost,
        setValueSeePost,
        typeExpire,
        setTypeExpire,
        Imotions,
        setImotions,
        ImotionsDel,
        setImotionsDel,
        font,
        more,
        setMore,
        OpSelect,
        setOpSelect,
        images,
        videos,
        checkImg,
        handlePost,
        postTypes,
        handleShowI,
        handleClearI,
        acList,
        loading,
        setLoading,
        actImotion,
        setActImotion,
        dispatch,
    } = LogicPreView(
        user,
        colorText,
        colorBg,
        file,
        valueText,
        fontFamily,
        dataText,
        token,
        userId,
        handleImageUpload,
        dataCentered,
        setDataCentered,
        handleClear,
    );
    const swiperType = 1;
    const GridColumns = 1;
    const Circle = 1;

    const [editFile, setEditFile] = useState<boolean>(false);

    return (
        <>
            <Div
                width="100%"
                css={`
                    display: block;
                    height: 100%;
                    margin-top: 75px;
                    position: relative;
                    color: ${colorText};
                `}
            >
                <Div
                    width="100%"
                    css={`
                        display: block;
                        color: ${colorText};
                        text-align: center;
                        font-size: 1.5rem;
                        margin-bottom: 5px;
                        padding: 5px;
                        background-color: ${colorBg === 1 ? '#292a2d' : ''};
                    `}
                >
                    Pre-View your post here
                </Div>
                {file.length > 0 && !editForm && (
                    <Div
                        onClick={() => setEdit(true)}
                        css={`
                            font-size: 1.4rem;
                            padding: 6px;
                            background-color: #075395;
                            width: fit-content;
                            border-radius: 5px;
                            cursor: pointer;
                        `}
                    >
                        Tiếp tục Edit
                    </Div>
                )}
                {step < 1 && options && (
                    <OpFeatureSetting
                        more={more}
                        setMore={setMore}
                        OpSelect={OpSelect}
                        setOpSelect={setOpSelect}
                        setOptions={setOptions}
                        valuePrivacy={valuePrivacy}
                        setValuePrivacy={setValuePrivacy}
                        typeExpire={typeExpire}
                        setTypeExpire={setTypeExpire}
                        Imotions={Imotions}
                        setImotions={setImotions}
                        ImotionsDel={ImotionsDel}
                        setImotionsDel={setImotionsDel}
                        valueSeePost={valueSeePost}
                        setValueSeePost={setValueSeePost}
                    />
                )}
                {file.length > 0 && (
                    <OptionType
                        step={step}
                        selectType={selectType}
                        selectChild={selectChild}
                        setSelectChild={setSelectChild}
                        column={column}
                        setColumn={setColumn}
                        setSelectType={setSelectType}
                        colorText={colorText}
                        colorBg={colorBg}
                        file={file}
                    />
                )}
                {file.length > 0 && editForm && (
                    <Div width="100%" css="align-items: center;margin-bottom: 10px;">
                        <Div
                            width="fit-content"
                            onClick={() => setEditFile(true)}
                            css="align-items:center;font-size: 1.4rem; padding: 5px; border-radius:5px; border-bottom: 1px solid #1eacdc6b; &:hover{border-color: #1eacdc;} cursor: var(--pointer);"
                        >
                            Chỉnh sửa
                            <Div width="50px" css="font-size: 20px; justify-content: space-around; margin-left: 5px;">
                                <ImageI />
                                <VideoI />
                            </Div>
                        </Div>
                    </Div>
                )}
                {editFile && (
                    <EditFiles
                        colorText={colorText}
                        dispatch={dispatch}
                        file={file}
                        setEditFile={setEditFile}
                        setUploadPre={setUploadPre}
                        step={step}
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
                    {selectType === swiperType && (
                        <>
                            <Div css="position: absolute; top: 37px; right: 10.15px; font-size: 20px;">
                                <SliderI />
                            </Div>
                            {selectChild.id === 5 && ( //Centered
                                <>
                                    {dataCentered.length < 3 && (
                                        <DivPos
                                            size="18px"
                                            top="32px"
                                            right="19px"
                                            css={`
                                                z-index: 1;
                                                label {
                                                    font-size: 1.3rem;
                                                }
                                                div {
                                                    width: fit-content;
                                                }
                                                top: 9px;
                                                right: 74px;
                                                padding: 3px 4px;
                                                border-radius: 5px;
                                                background-image: linear-gradient(
                                                    36deg,
                                                    black,
                                                    #a33a3ac2,
                                                    #195c86bd,
                                                    #ac10b0
                                                );
                                            `}
                                            color={colorText}
                                        >
                                            <DivItems>
                                                <input
                                                    id="uploadCen"
                                                    type="file"
                                                    name="file[]"
                                                    onChange={(e) => handleImageUpload(e, true)}
                                                    multiple
                                                    hidden
                                                />
                                                <Label htmlFor="uploadCen" color={colorText}>
                                                    Thêm Hàng
                                                </Label>
                                            </DivItems>
                                        </DivPos>
                                    )}
                                    <DivPos
                                        size="18px"
                                        top="30px"
                                        right="105px"
                                        css={`
                                            z-index: 1;
                                            p {
                                                font-size: 1.3rem;
                                                padding: 2px;
                                            }
                                            top: 7px;
                                            padding: 1px 11px;
                                            border-radius: 5px;
                                            right: 165px;
                                            background-color: #0a59bb;
                                        `}
                                        color={colorText}
                                        onClick={() => setColumnCentered(!ColumnCentered)}
                                    >
                                        <P>Columns</P>
                                    </DivPos>
                                </>
                            )}
                        </>
                    )}
                    {/* view full screen */}
                    {step === 0 && file.length > 0 && (
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
                    )}
                    <Div width="100%" css="height: fit-content; margin-top: 5px; position: relative;">
                        <Div
                            css={`
                                width: 35px;
                                height: 35px;
                                margin: 5px;
                            `}
                        >
                            <Avatar radius="50%" src={user?.avatar} alt={user?.fullName} gender={user?.gender} />
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
                                {user?.fullName}
                            </H3>
                            <P css=" width: 52px; font-size: 1.1rem; color: #9a9a9a; display: flex; align-items: center; justify-content: space-around;">
                                <LockI />
                                <Span css="padding-top: 3px;">3h</Span>
                                <Span>{valueSeePost.icon}</Span>
                            </P>
                            {valuePrivacy.length > 0 && (
                                <Div css="margin-left: 2px">
                                    <PrivateI />
                                </Div>
                            )}
                        </Div>
                        <DivPos
                            size="21px"
                            top="4px"
                            right="10px"
                            color={colorText}
                            onClick={() => setOptions(!options)}
                        >
                            <DotI />
                        </DivPos>
                    </Div>

                    <Div width="100%" css="padding: 5px 6px 10px 6px;">
                        {valueText && (
                            <P
                                css={`
                                    padding: 5px;
                                    color: ${colorText};
                                    background-color: #292a2d;
                                    font-family: ${font}, sans-serif;
                                    white-space: pre-wrap;
                                    word-break: break-word;
                                    font-size: 1.4rem;
                                    @media (min-width: 500px) {
                                        font-size: 1.5rem;
                                    }
                                    @media (min-width: 768px) {
                                        font-size: 1.6rem;
                                    }
                                `}
                                dangerouslySetInnerHTML={{ __html: valueText }}
                            ></P>
                        )}
                    </Div>
                    {hashTags.length > 0 && (
                        <Div width="100%" wrap="wrap" css="padding: 5px">
                            {hashTags.map((tag) => (
                                <Smooth // link tag
                                    key={tag}
                                    to={`/sn/hashTags/${tag}`}
                                    size="1.3rem"
                                    css={`
                                        margin-right: 5px;
                                        color: #5ba3e2;
                                    `}
                                >
                                    {tag}
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
                                ? 'height: 100%;max-height: 100%;  position: fixed; top: 0; left: 0; right: 0; align-items: center;  background-color: #1f2021; z-index: 120; @media(max-width: 769px){&::-webkit-scrollbar {width: 0px;}}'
                                : ''};
                        `}
                    >
                        {postTypes[selectType]}
                    </Div>
                    {/* image, video here */}
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
                                {Imotions.map((i, index, arr) => (
                                    <DivEmoji key={i.id} index={i.id}>
                                        {i.icon}
                                    </DivEmoji>
                                ))}
                            </Div>
                        </Div>
                    </Div>
                    <Div
                        width="100%"
                        css={`
                            text-align: center;
                            justify-content: space-evenly;
                            font-size: 2.4rem;
                            border-radius: 5px;
                            margin-bottom: 15px;
                            color: ${colorText};
                        `}
                        onClick={(e: any) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                    >
                        {Imotions.length > 0 && (
                            <DivAction
                                id="parent"
                                css={`
                                    @media (min-width: 768px) {
                                        &:hover {
                                            #emoBar {
                                                display: flex;
                                                top: -50px;
                                            }
                                        }
                                    }
                                `}
                                onMouseEnter={() => {}}
                                onTouchStart={handleShowI}
                                // onMouseLeave={() => setActImotion(false)}
                                onTouchMoveCapture={() => setActImotion(false)}
                                onTouchEnd={handleClearI}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (showI) {
                                        setShowI(undefined);
                                    } else {
                                        Imotions.forEach((i) => {
                                            if (i.id === acEmo.id) {
                                                setShowI(i);
                                            }
                                        });
                                    }
                                }}
                            >
                                {showI?.icon || acEmo.icon}
                                {/* emotion is chosen */}
                                <Div
                                    css="font-size: 15px; position: absolute; right: 5px;"
                                    onClick={() => setShowAc(true)}
                                >
                                    <IconI />
                                </Div>
                                {/* change icon for display on emotion button */}
                                {showAc && (
                                    <Div
                                        css={`
                                            width: 100%;
                                            height: 100%;
                                            position: absolute;
                                            top: 3px;
                                            justify-content: space-evenly;
                                            align-items: center;
                                            background-color: #292a2d;
                                        `}
                                    >
                                        {showAc && // option icon as button like
                                            acList.map((a) => {
                                                return Imotions.some((i) => i.id === a.id) ? (
                                                    <Div
                                                        key={a.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setAcEmo(a);
                                                            setShowAc(false);
                                                        }} // is set above
                                                        css=" svg{font-size: 23px !important;}"
                                                    >
                                                        {a.icon}
                                                    </Div>
                                                ) : (
                                                    ''
                                                );
                                            })}
                                    </Div>
                                )}
                                <Div
                                    id="emoBar"
                                    width="fit-content"
                                    className="showI"
                                    display="none"
                                    css={`
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        box-shadow: 0 0 5px #2d2d2d;
                                        background-color: #181818;
                                        padding: 5px 20px 8px;
                                        border-radius: 50px;
                                        z-index: 7;
                                        ${actImotion ? 'display: flex; top: -50px;' : ''}
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
                                    {Imotions.map((i, index, arr) => (
                                        <DivEmoji
                                            key={i.id}
                                            css={`
                                                ${i.id === 1 ? 'padding-bottom: 6px;' : ''}
                                            `}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowI({ id: i.id, icon: i.icon });
                                                setActImotion(false);
                                            }}
                                        >
                                            {i.icon}
                                        </DivEmoji>
                                    ))}
                                </Div>
                            </DivAction>
                        )}
                        {!valuePrivacy.some((t) => t.id === 2) && (
                            <DivAction onClick={() => setShowComment(true)}>
                                <P css="font-size: 1.3rem;">...Comments</P>
                            </DivAction>
                        )}
                        {!valuePrivacy.some((t) => t.id === 3) && (
                            <DivAction>
                                <ShareI />
                            </DivAction>
                        )}
                    </Div>
                    {showComment && (
                        <Comment colorText={colorText} anony={valuePrivacy} setShowComment={setShowComment} />
                    )}
                    <DivWrapButton>
                        {loading ? (
                            <Div width="50%" css="position: relative;">
                                <DivLoading
                                    css={`
                                        margin: 0;
                                        font-size: 40px;
                                    `}
                                >
                                    <LoadingCircleI />
                                </DivLoading>
                                <P
                                    z="1rem"
                                    css={`
                                        width: fit-content;
                                        height: fit-content;
                                        position: absolute;
                                        top: 50%;
                                        left: 50%;
                                        right: 50%;
                                        translate: -50% -50%;
                                        bottom: 50%;
                                    `}
                                >
                                    Posting
                                </P>
                            </Div>
                        ) : (
                            <>
                                <Button
                                    type="button"
                                    size="1.5rem"
                                    padding="5px 15px;"
                                    bg="#d94755"
                                    onClick={() => {
                                        handleClear();
                                    }}
                                >
                                    {dataText.buttonFirst}
                                </Button>
                                <Button
                                    type="button"
                                    size="1.5rem"
                                    padding="5px 14px"
                                    bg="#2e54c6"
                                    onClick={handlePost}
                                >
                                    {dataText.buttonTwo}
                                </Button>
                            </>
                        )}
                    </DivWrapButton>
                </Div>
            </Div>
        </>
    );
};
export default PreviewPost;
