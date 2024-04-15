import { memo, useEffect, useRef, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { DivPos, ReactQuillF } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, H3, Img, P, Smooth, Span } from '~/reUsingComponents/styleComponents/styleDefault';
import { DivAction, DivEmoji, TextAreaPre } from '../FormUpNews/styleFormUpNews';
import { DotI, EarthI, FriendI, HeartI, LikeI, LockI, PostCommentI, PrivacyI, ShareI } from '~/assets/Icons/Icons';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import moment from 'moment';
import Languages from '~/reUsingComponents/languages';
import OpUpdate from '~/reUsingComponents/PostOptions/OpUpdate';
import Cookies from '~/utils/Cookies';
import { PropsDataPosts, PropsPosts } from './interfacePosts';
import FormUpNews from '../FormUpNews/FormUpNews';
import DefaultType from '../FormUpNews/ViewPostFrame/TypeFile/DefaultType';
import postAPI from '~/restAPI/socialNetwork/postAPI';
import { keyframes } from 'styled-components';
import Comment from './Comment';
import { queryClient } from 'src';

const Posts: React.FC<PropsPosts> = ({ user, colorBg, colorText, dataP, options, setOptions, setFormThat, form, setShowComment, showComment }) => {
    const dataPostRef = useRef<PropsDataPosts>(dataP);
    if (!dataPostRef.current.user.length || dataPostRef.current.user[0]?.id === "It's me") dataPostRef.current.user[0] = user;
    const [d, setD] = useState<string>('');
    const { lg } = Languages();
    const [actImotion, setActImotion] = useState<boolean>(false);
    const [step, setStep] = useState<number>(0);
    // const avatar = CommonUtils.convertBase64(dataPostRef.current.user[0].avatar);
    let timeS: any;
    const handleShowI = (e: any) => {
        const divConstant = document.getElementById('emoBarPost');
        if (divConstant) divConstant.removeAttribute('style');
        document.addEventListener('touchstart', handleMouseDown);
        console.log('touchstart');

        function handleMouseDown(event: any) {
            if (event.target.getAttribute('id') === 'parent_emo') {
                // Clicked inside the div
                console.log('Clicked inside the box', e.target);
            } else {
                // Clicked outside the div
                if (actImotion) setActImotion(false);
            }
        }
        timeS = setTimeout(() => {
            setActImotion(true);
        }, 500);
    };
    const handleClearI = () => {
        clearTimeout(timeS);
    };
    console.log(dataPostRef, 'dataPost', showComment, d);
    const createdAt = moment(dataPostRef.current.createdAt).format('LLLL');
    const fromNow = moment(moment(dataPostRef.current.createdAt).format('HH:mm:ss DD-MM-YYYY'), 'HH:mm:ss DD-MM-YYYY').locale(lg).fromNow();
    useEffect(() => {
        if (showComment) {
            const divElement = document.getElementById(`${dataPostRef.current._id}_postScrolledUpAway`); // Replace 'Div' with the appropriate selector for your <Div> element
            if (divElement) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        console.log(entries, 'entries');
                        entries.forEach((entry) => {
                            if (!entry.isIntersecting) {
                                if (showComment === dataPostRef.current._id && showComment) setShowComment('');
                            }
                        });
                    },
                    {
                        threshold: 0, // Trigger the callback when the element's visibility changes to any degree
                    },
                );
                observer.observe(divElement);
                return () => {
                    observer.disconnect();
                };
            }
        }
    }, [showComment]);
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
    const emo = dataPostRef.current.feel.onlyEmo.find((o) => o.id_user.includes(user.id));
    console.log(emo, 'emo', dataPostRef.current.feel.onlyEmo);
    let amount = 0;
    dataPostRef.current.feel.onlyEmo.forEach((r) => {
        amount += r.id_user.length;
    }, {});
    const sortEmo = dataPostRef.current.feel.onlyEmo.sort((a, b) => b.id_user.length - a.id_user.length);
    const showCM = showComment === dataPostRef.current._id;
    const handleEmo = async (e: any) => {
        e.stopPropagation();
        const divConstant = document.getElementById('emoBarPost');
        console.log('above');
        let check = false;
        let oldData = dataPostRef.current.feel;
        if (divConstant) divConstant.setAttribute('style', 'display: none');
        dataPostRef.current.feel.onlyEmo.forEach((o) => {
            if (o.id_user.includes(user.id)) check = true;
        });
        setD('1');
        if (check) {
            queryClient.setQueryData(['collections_post', user.fullName], (preData: PropsDataPosts[] | undefined) => {
                return preData?.map((p) => {
                    if (p._id === dataPostRef.current._id) {
                        p.feel.onlyEmo = p.feel.onlyEmo.map((o) => {
                            o.id_user = o.id_user.filter((u) => u !== user.id);
                            return o;
                        });
                        dataPostRef.current.feel.onlyEmo = p.feel.onlyEmo;
                    }
                    return p;
                });
            });
            if (emo) {
                const res = await postAPI.setEmotion({
                    _id: dataPostRef.current._id,
                    index: emo.id,
                    id_user: user.id,
                    state: 'remove',
                });
                if (res)
                    queryClient.setQueryData(['collections_post', user.fullName], (preData: PropsDataPosts[] | undefined) => {
                        dataPostRef.current.feel = res;
                        return preData?.map((p) => {
                            if (p._id === dataPostRef.current._id) p.feel = res;
                            return p;
                        });
                    });

                if (!res)
                    queryClient.setQueryData(['collections_post', user.fullName], (preData: PropsDataPosts[] | undefined) => {
                        dataPostRef.current.feel = oldData;
                        return preData?.map((p) => {
                            if (p._id === dataPostRef.current._id) p.feel = oldData;
                            return p;
                        });
                    });
            }
        } else {
            queryClient.setQueryData(['collections_post', user.fullName], (preData: PropsDataPosts[] | undefined) => {
                return preData?.map((p) => {
                    if (p._id === dataPostRef.current._id) {
                        p.feel.onlyEmo = p.feel.onlyEmo.map((o) => {
                            if (o.id === dataPostRef.current.feel.act) o.id_user.push(user.id);
                            return o;
                        });
                        dataPostRef.current.feel.onlyEmo = p.feel.onlyEmo;
                    }
                    return p;
                });
            });
            const res = await postAPI.setEmotion({
                _id: dataPostRef.current._id,
                index: dataPostRef.current.feel.act,
                id_user: user.id,
                state: 'add',
            });
            if (res)
                queryClient.setQueryData(['collections_post', user.fullName], (preData: PropsDataPosts[] | undefined) => {
                    dataPostRef.current.feel = res;
                    return preData?.map((p) => {
                        if (p._id === dataPostRef.current._id) p.feel = res;
                        return p;
                    });
                });
            if (!res)
                queryClient.setQueryData(['collections_post', user.fullName], (preData: PropsDataPosts[] | undefined) => {
                    dataPostRef.current.feel = oldData;
                    return preData?.map((p) => {
                        if (p._id === dataPostRef.current._id) p.feel = oldData;
                        return p;
                    });
                });
        }
        setD('2');
    };
    const handleReEmo = async (
        e: any,
        i: {
            id: number;
            icon: string;
            id_user: string[];
        },
    ) => {
        e.stopPropagation();
        setD('3');
        let check = false;
        dataPostRef.current.feel.onlyEmo.forEach((o) => {
            if (o.id_user.includes(user.id)) check = true;
        });
        const divConstant = document.getElementById('emoBarPost');
        if (divConstant) divConstant.setAttribute('style', 'display: none');
        let oldData = dataPostRef.current.feel;
        if (check) {
            queryClient.setQueryData(['collections_post', user.fullName], (preData: PropsDataPosts[] | undefined) => {
                return preData?.map((p) => {
                    if (p._id === dataPostRef.current._id) {
                        const newOnly = p.feel.onlyEmo.map((o) => {
                            o.id_user = o.id_user.filter((u) => u !== user.id);
                            if (o.id === i.id) o.id_user.push(user.id);
                            return o;
                        });
                        p.feel.onlyEmo = newOnly;
                        dataPostRef.current.feel.onlyEmo = newOnly;
                    }

                    return p;
                });
            });

            const res = await postAPI.setEmotion({
                _id: dataPostRef.current._id,
                index: i.id,
                id_user: user.id,
                state: 'update',
                oldIndex: emo?.id,
            });
            if (res)
                queryClient.setQueryData(['collections_post', user.fullName], (preData: PropsDataPosts[] | undefined) => {
                    dataPostRef.current.feel = res;
                    return preData?.map((p) => {
                        if (p._id === dataPostRef.current._id) p.feel = res;
                        return p;
                    });
                });

            if (!res)
                queryClient.setQueryData(['collections_post', user.fullName], (preData: PropsDataPosts[] | undefined) => {
                    dataPostRef.current.feel = oldData;
                    return preData?.map((p) => {
                        if (p._id === dataPostRef.current._id) p.feel = oldData;
                        return p;
                    });
                });
        } else {
            queryClient.setQueryData(['collections_post', user.fullName], (preData: PropsDataPosts[] | undefined) => {
                return preData?.map((p) => {
                    if (p._id === dataPostRef.current._id) {
                        p.feel.onlyEmo = p.feel.onlyEmo.map((o) => {
                            if (o.id === i.id) o.id_user.push(user.id);
                            return o;
                        });
                        dataPostRef.current.feel.onlyEmo = p.feel.onlyEmo;
                    }
                    return p;
                });
            });

            const res = await postAPI.setEmotion({
                _id: dataPostRef.current._id,
                index: i.id,
                id_user: user.id,
                state: 'add',
            });
            if (res)
                queryClient.setQueryData(['collections_post', user.fullName], (preData: PropsDataPosts[] | undefined) => {
                    dataPostRef.current.feel = res;
                    return preData?.map((p) => {
                        if (p._id === dataPostRef.current._id) p.feel = res;
                        return p;
                    });
                });

            if (!res)
                queryClient.setQueryData(['collections_post', user.fullName], (preData: PropsDataPosts[] | undefined) => {
                    dataPostRef.current.feel = oldData;
                    return preData?.map((p) => {
                        if (p._id === dataPostRef.current._id) p.feel = oldData;
                        return p;
                    });
                });
        }
        setD('4');
        setActImotion(false);
    };
    return (
        <div id={`${dataPostRef.current._id}_postScrolledUpAway`}>
            <Div
                width="100%"
                css={`
                    display: block;
                    height: 100%;
                    margin-top: 20px;
                    position: relative;
                    color: ${colorText};
                    ${showCM ? 'z-index: 99999;' : ''}
                `}
            >
                {options === dataPostRef.current._id && user.id === dataPostRef.current.id_user && (
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
                                    originalInputValue={dataPostRef.current.content.text}
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
                            <Avatar radius="50%" src={dataPostRef.current.user[0].avatar} alt={dataPostRef.current.user[0].fullName} gender={dataPostRef.current.user[0].gender} />
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
                                {dataPostRef.current.user[0].fullName}
                            </H3>
                            <Div css="font-size: 1.1rem; color: #9a9a9a; display: flex; align-items: center; justify-content: space-around; white-space: nowrap;">
                                <Div css="color: #a3c8e6; font-size: 13px;">
                                    <LockI />
                                </Div>
                                <Span css="padding-top: 3px; margin: 0 5px;">{fromNow}</Span>
                                <Span css="font-size: 14px">
                                    {
                                        [
                                            { id: 'privacy', icon: <PrivacyI /> },
                                            { id: 'friend', icon: <FriendI />, color: '#58a3de' },
                                            { id: 'share', icon: <EarthI /> },
                                        ].find((t) => t.id === dataPostRef.current.whoCanSeePost.id)?.icon
                                    }
                                </Span>
                            </Div>
                        </Div>
                        <DivPos
                            size="21px"
                            top="4px"
                            right="10px"
                            color={colorText}
                            onClick={() => {
                                if (!options) {
                                    setOptions(dataPostRef.current._id);
                                } else {
                                    if (options === dataPostRef.current._id) {
                                        setOptions('');
                                    } else {
                                        setOptions(dataPostRef.current._id);
                                    }
                                }
                            }}
                        >
                            <DotI />
                        </DivPos>
                    </Div>

                    <Div width="100%" css="padding: 5px 6px 10px 6px;" onClick={(e) => e.stopPropagation()}>
                        {dataPostRef.current.content.text && (
                            <ReactQuillF
                                value={dataPostRef.current.content.text}
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
                                    font-family: ${dataPostRef.current.content.fontFamily}, sans-serif;
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
                    {dataPostRef.current.hashTag?.length > 0 && (
                        <Div width="100%" wrap="wrap" css="padding: 6px">
                            {dataPostRef.current.hashTag.map((tag) => (
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
                            max-height: 600px;
                        `}
                    >
                        <DefaultType
                            _id={dataPostRef.current._id}
                            colorText={colorText}
                            file={dataPostRef.current.content.default.map((f) => ({ ...f.file, pre: '' }))}
                            step={step}
                            setStep={setStep}
                            bg={dataPostRef.current.background}
                            link={true}
                        />
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

                    <Div
                        wrap="wrap"
                        width="100%"
                        css={`
                            text-align: center;
                            justify-content: space-evenly;
                            font-size: 2.4rem;
                            border-radius: 5px;
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
                                height: 32px;
                            `}
                        >
                            <Div
                                css={`
                                    width: fit-content;
                                    border-radius: 11px;
                                    margin: 5px 8px;
                                    &:hover .emoji div {
                                        margin: 0 7px;
                                    }
                                    &:hover .emoji {
                                        p {
                                            display: none;
                                        }
                                    }
                                    &:hover .emoji div span {
                                        display: block;
                                    }
                                `}
                            >
                                <Div className="emoji" onClick={(e) => e.stopPropagation()} css="margin-left: 2px; align-items: flex-end; ">
                                    {sortEmo.map((key, index) =>
                                        key.id_user.length ? (
                                            <DivEmoji key={key.id}>
                                                {key.icon}
                                                <Span css="font-size: 1.5rem;display:none;@media(min-width: 768px){font-size: 1.4rem}">{key.id_user.length}</Span>
                                            </DivEmoji>
                                        ) : (
                                            ''
                                        ),
                                    )}
                                    <P z="1.5rem" css="@media(min-width: 768px){font-size: 1.4rem}">
                                        {amount > 0 ? amount : null}
                                    </P>
                                </Div>
                            </Div>
                        </Div>
                        <Div width="100%" css="border-top: 1px solid #64625f; padding: 1px 0;">
                            {dataPostRef.current.feel.onlyEmo.length > 0 && (
                                <DivAction
                                    id="parent_emo"
                                    css={`
                                        @media (min-width: 768px) {
                                            &:hover {
                                                #emoBarPost {
                                                    display: flex;
                                                    top: -53px;
                                                }
                                            }
                                        }
                                    `}
                                    onTouchStart={handleShowI}
                                    onTouchEnd={handleClearI}
                                    // onTouchMoveCapture={() => setActImotion(false)}
                                    onMouseLeave={() => {
                                        const divConstant = document.getElementById('emoBarPost');
                                        // setActImotion(false);
                                        if (divConstant) divConstant.removeAttribute('style');
                                    }}
                                    onClick={handleEmo}
                                >
                                    {emo?.icon ? emo?.icon : dataPostRef.current.feel.act === 1 ? <LikeI /> : <HeartI />}
                                    <Div
                                        id="emoBarPost"
                                        width="fit-content"
                                        className="showI"
                                        display="none"
                                        css={`
                                            position: absolute;
                                            top: 0;
                                            left: 0;
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
                                            transition: all 1s linear;
                                        `}
                                    >
                                        {dataPostRef.current.feel.onlyEmo
                                            .sort((a, b) => a.id - b.id)
                                            .map((i, index, arr) => (
                                                <DivEmoji
                                                    key={i.id}
                                                    onClick={(e) => handleReEmo(e, i)}
                                                    css={`
                                                        position: relative;
                                                        background-color: #6f5fc4ba;
                                                    `}
                                                    nameFrame={`top_bottom_move_${index}`}
                                                >
                                                    {i.icon}
                                                </DivEmoji>
                                            ))}
                                    </Div>
                                </DivAction>
                            )}
                            {/* compare with id of option in  post's OpText */}
                            {!dataPostRef.current.private.some((p) => p.id === 'comment') && (
                                <DivAction onClick={() => setShowComment(dataPostRef.current._id)}>
                                    <Div css="font-size: 1.3rem;">
                                        <PostCommentI />
                                    </Div>
                                </DivAction>
                            )}
                            {!dataPostRef.current.private.some((p) => p.id === 'share') && (
                                <DivAction>
                                    <ShareI />
                                </DivAction>
                            )}
                        </Div>
                    </Div>
                    {showCM && <Comment setDD={setD} colorText={colorText} anony={dataPostRef.current.private} setShowComment={setShowComment} dataPost={dataPostRef.current} you={user} />}
                </Div>
            </Div>
            {showCM && (
                <DivPos
                    width="100%"
                    position="fixed"
                    top="0"
                    right="0"
                    index={999}
                    css={`
                        pointer-events: none;
                        border-radius: 0;
                        background-color: #00000085;
                    `}
                ></DivPos>
            )}
        </div>
    );
};
export default memo(Posts);
