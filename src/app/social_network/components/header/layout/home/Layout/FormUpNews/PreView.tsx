import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { A, Button, Div, H3, P, Smooth, Span } from '~/reUsingComponents/styleComponents/styleDefault';
import { DotI, FullScreenI, IconI, ImageI, LoadingCircleI, LockI, MinusI, PrivateI, ShareI, SliderI, TagPostI, VideoI } from '~/assets/Icons/Icons';
import { DivAction, DivEmoji, DivItems, DivWrapButton, Label } from './styleFormUpNews';
import { useEffect, useState } from 'react';
import OptionType from './ViewPostFrame/OptionType';
import { DivLoading, DivPos, ReactQuillF } from '~/reUsingComponents/styleComponents/styleComponents';
import OpFeatureSetting from '~/reUsingComponents/PostOptions/OpFeature';
import Comment from '../DataPosts/Comment';
import LogicPreView from './LogicPreView';
import { PropsDataFileUpload, PropsValueQuill } from './FormUpNews';
import EditFiles from './EditFiles.tsx/Editfiles';
import ReactQuill from 'react-quill';
import { PropsUser } from 'src/App';
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
    onChangeQuill: (value: string) => void;
    quillRef: React.RefObject<ReactQuill>;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    user: PropsUser;
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
    hashTags: { _id: string; value: string }[];
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
    editForm: boolean;
    setUploadPre: React.Dispatch<React.SetStateAction<PropsDataFileUpload[]>>;
    setTags: React.Dispatch<
        React.SetStateAction<
            {
                id: string;
                avatar: string;
                gender: number;
                fullName: string;
            }[]
        >
    >;
    tags: {
        id: string;
        avatar: string;
        gender: number;
        fullName: string;
    }[];
    valueQuill: React.MutableRefObject<PropsValueQuill>;
    insertURL: boolean;
    setInsertURL: React.Dispatch<React.SetStateAction<boolean>>;
    valueSelected: React.MutableRefObject<boolean>;
    consider: React.MutableRefObject<number>;
    tagDivURL: React.MutableRefObject<HTMLDivElement | null>;
}> = ({
    onChangeQuill,
    setInputValue,
    quillRef,
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
    tags,
    setTags,
    valueQuill,
    insertURL,
    setInsertURL,
    valueSelected,
    consider,
    tagDivURL,
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
    } = LogicPreView(user, colorText, colorBg, file, valueText, fontFamily, dataText, token, userId, handleImageUpload, dataCentered, setDataCentered, handleClear, hashTags, tags);
    const swiperType = 1;
    const GridColumns = 1;
    const Circle = 1;

    const [editFile, setEditFile] = useState<boolean>(false);
    useEffect(() => {
        if (quillRef.current) {
            const quill = quillRef.current.editor;
            if (quill) {
                const bt = document.getElementById('applyUrlButton');
                const btCancel = document.getElementById('cancelUrlButton');
                if (bt)
                    bt.addEventListener('click', function (e) {
                        e.stopPropagation();
                        const ip: any = document.getElementById('urlInput');
                        if (ip) {
                            const url = ip.value.trim();
                            const urlRegex = /https:\/\/(?!<a>)[^\s]+/g;
                            if (url) {
                                if (url.match(urlRegex)) {
                                    // Apply link with URL to the selected text
                                    quill.format('link', url);
                                    // Update the Quill editor's content
                                    const updatedHTMLContent = quill.root.innerHTML;
                                    setInputValue(updatedHTMLContent);
                                } else {
                                    alert('Please enter a URL correctly.');
                                }
                            } else {
                                alert('Please enter a URL.');
                            }
                        }
                    });
                if (btCancel) {
                    btCancel.addEventListener('click', (e) => {
                        e.stopPropagation();
                        console.log('cancel');
                        if (quillRef.current && quillRef.current.editor) {
                            quillRef.current.editor.format('background', null);
                            quillRef.current.editor.format('color', null);
                        }
                        setInsertURL(false);
                        valueQuill.current.text = '';
                        valueSelected.current = false;
                        valueQuill.current.quill = null;
                        const urlInputDiv = document.getElementById('urlInputDiv');
                        if (urlInputDiv) {
                            urlInputDiv.style.display = 'none';
                        }
                    });
                }
            }
        }
    }, []);
    return (
        <>
            <Div
                width="100%"
                css={`
                    display: block;
                    height: 100%;
                    margin-top: 13px;
                    position: relative;
                `}
            >
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
                {file.length > 0 && (
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
                {editFile && <EditFiles colorText={colorText} dispatch={dispatch} file={file} setEditFile={setEditFile} setUploadPre={setUploadPre} step={step} />}
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
                                                background-image: linear-gradient(36deg, black, #a33a3ac2, #195c86bd, #ac10b0);
                                            `}
                                            color={colorText}
                                        >
                                            <DivItems>
                                                <input id="uploadCen" type="file" name="file[]" onChange={(e) => handleImageUpload(e, true)} multiple hidden />
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
                        <DivPos size="18px" top="11px" right="46.5px" css="z-index: 1;" color={colorText} onClick={() => setStep(1)}>
                            <FullScreenI />
                        </DivPos>
                    )}
                    <Div width="100%" css="height: fit-content; margin-top: 5px; position: relative;">
                        <Div
                            css={`
                                width: 40px;
                                height: 40px;
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
                                font-size: 1.3rem;
                                padding-top: 2px;
                                align-items: center;
                                margin-bottom: 4px;
                            `}
                        >
                            <H3
                                css={`
                                    width: 100%;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                `}
                            >
                                {user?.fullName}
                            </H3>
                            <P css=" width: 52px; font-size: 1.2rem; color: #9a9a9a; display: flex; align-items: center; justify-content: space-around;">
                                <LockI />
                                <Span css="padding-top: 3px;">3h</Span>
                                <Span>{valueSeePost.icon}</Span>
                            </P>
                            {valuePrivacy.length > 0 && (
                                <Div css="margin-left: 2px;font-size: 15px">
                                    <PrivateI />
                                </Div>
                            )}
                        </Div>
                        <DivPos size="25px" top="4px" right="15px" color={colorText} onClick={() => setOptions(!options)}>
                            <DotI />
                        </DivPos>
                    </Div>

                    <Div
                        width="100%"
                        css="padding: 5px 6px 10px 6px; position: relative;"
                        onMouseUp={() => {
                            if (valueQuill.current?.quill) {
                                const quill = valueQuill.current.quill;
                                // Get the current selection range
                                if (quill) {
                                    const selectionRange = quill.getSelection();
                                    if (selectionRange && selectionRange.length > 0) {
                                        // Get the selected text
                                        const selectedText = quill.getText(selectionRange.index, selectionRange.length);
                                        if (!selectedText) {
                                            valueQuill.current.quill = null;
                                            valueQuill.current.url = '';
                                            valueQuill.current.text = '';
                                        }
                                    }
                                }
                            }
                        }}
                    >
                        <Div id="urlInputDiv" display="none">
                            <input type="text" id="urlInput" placeholder="Enter URL" />
                            <Div id="applyUrlButton">Apply URL</Div>
                            <Div id="cancelUrlButton">Huỷ bỏ</Div>
                        </Div>
                        <ReactQuillF
                            ref={quillRef}
                            onChange={onChangeQuill}
                            value={valueText}
                            onChangeSelection={(range) => {
                                if (quillRef.current) {
                                    const quill = quillRef.current.editor;
                                    // Apply bold style to selected text or at the cursor position
                                    if (quill) {
                                        const selectionRange = quill.getSelection();
                                        if (selectionRange) {
                                            const selectedText = quill.getText(selectionRange.index, selectionRange.length);
                                            const urlRegex = /https:\/\/(?!<a>)[^\s]+/g;
                                            if (selectedText) {
                                                consider.current = 0;
                                                console.log(consider.current, 'consider.current 1');
                                                valueQuill.current.text = selectedText;
                                                if (selectedText.match(urlRegex)?.length) valueQuill.current.url = selectedText;
                                                valueQuill.current.quill = quill;
                                            } else {
                                                valueQuill.current.url = '';
                                                valueQuill.current.quill = null;
                                                valueQuill.current.text = '';
                                                if (insertURL) setInsertURL(false);
                                            }
                                        } else {
                                            consider.current += 1;
                                            // valueQuill.current.url = '';
                                            // valueQuill.current.quill = null;
                                            // valueQuill.current.text = '';
                                            // if (insertURL) setInsertURL(false);
                                        }
                                    }
                                }
                                if (tagDivURL) {
                                    tagDivURL.current?.addEventListener('click', (e) => {
                                        if (consider.current !== 1) {
                                            valueQuill.current.quill = null;
                                            valueQuill.current.text = '';
                                            if (insertURL) setInsertURL(false);
                                        }
                                    });
                                }
                                console.log(consider.current, 'consider.current 2');
                            }}
                            modules={{
                                toolbar: false, // Tắt thanh công cụ
                            }}
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
                                font-family: ${font}, sans-serif;
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
                    </Div>
                    {tags.length > 0 && (
                        <Div width="100%" css="padding: 0px 10px">
                            <Div css="margin-right: 5px; height: 100%">
                                <TagPostI />
                            </Div>
                            <Div width="100%" wrap="wrap">
                                {tags.map((t, index, arr) => (
                                    <Div css="margin-bottom: 5px;" key={t.id}>
                                        <Avatar src={t.avatar} alt={t.fullName} gender={t.gender} css="width: 20px; height: 20px; margin-right: 5px;" radius="50%" />
                                        <Smooth to={`/social/profile?id=${t.id}`} css="display: flex; align-items: center; font-size: 1.3rem; &:hover{color:#5f9cd1}">
                                            {t.fullName}
                                        </Smooth>
                                        {!(index + 1 === arr.length) && (
                                            <Div css="font-size: 24px; align-items: center; margin:0 5px;">
                                                <MinusI />
                                            </Div>
                                        )}
                                    </Div>
                                ))}
                            </Div>
                        </Div>
                    )}
                    {hashTags.length > 0 && (
                        <Div width="100%" wrap="wrap" css="padding: 6px">
                            {hashTags.map((tag) => (
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
                                <Div css="font-size: 15px; position: absolute; right: 5px;" onClick={() => setShowAc(true)}>
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
                                <Div // icons are showed when hover
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
                                                ${showI?.id === i.id ? 'border-bottom: 1px solid #b3eef5;' : ''}
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
                        {!valuePrivacy.some((t) => t.id === 'comment') && (
                            <DivAction onClick={() => setShowComment('ok')}>
                                <P css="font-size: 1.3rem;">...Comments</P>
                            </DivAction>
                        )}
                        {!valuePrivacy.some((t) => t.id === 'share') && (
                            <DivAction>
                                <ShareI />
                            </DivAction>
                        )}
                    </Div>
                    {showComment && <Comment colorText={colorText} anony={valuePrivacy} setShowComment={setShowComment} you={user} />}
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
                                    color="#fff"
                                    onClick={() => {
                                        handleClear();
                                    }}
                                >
                                    {dataText.buttonFirst}
                                </Button>
                                <Button type="button" size="1.5rem" padding="5px 14px" color="#fff" bg="#2e54c6" onClick={handlePost}>
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
