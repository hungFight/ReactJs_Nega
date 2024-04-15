import ReactQuill, { Quill } from 'react-quill';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { Div, DivFill, DivFlex, DivFlexPosition, DivNone, Img, Input, P, Span, Textarea } from '~/reUsingComponents/styleComponents/styleDefault';
import { DivComment, DivEmoji, Label } from '../FormUpNews/styleFormUpNews';
import { ArrowRightI, BanI, CameraI, DotI, EscalatorI, IconI, MinusI, PostCommentInI, ResetI, SendI, SendOPTI, UndoIRegister } from '~/assets/Icons/Icons';
import { DivPos, Hname } from '~/reUsingComponents/styleComponents/styleComponents';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { BsDot } from 'react-icons/bs';
import { FcReadingEbook } from 'react-icons/fc';
import QuillText from '~/reUsingComponents/Libraries/QuillText';
import { PropsValueQuill } from '../FormUpNews/FormUpNews';
import { PropsUser } from 'src/App';
import postAPI from '~/restAPI/socialNetwork/postAPI';
import { PropsComments, PropsCommentsIN, PropsDataPosts } from './interfacePosts';
import '~/reUsingComponents/Libraries/formatMoment';
import Languages from '~/reUsingComponents/languages';
import moments from '~/utils/moment';
import { queryClient } from 'src';
import { socket } from 'src/mainPage/nextWeb';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import ReplyComment from './ReplyComment';
const Comment: React.FC<{
    anony: {
        id: string;
        name: string;
    }[];
    setShowComment: React.Dispatch<React.SetStateAction<string>>;
    colorText: string;
    you: PropsUser;
    dataPost?: PropsDataPosts;
    setDD?: React.Dispatch<React.SetStateAction<string>>;
}> = ({ anony, setShowComment, colorText, you, dataPost, setDD }) => {
    const anonymousIndex = 'anonymousComment';
    const offset = useRef<number>(0);
    const limit = 15;
    //quill
    const quillRef = useRef<ReactQuill | null>(null);
    const consider = useRef<number>(0);
    const valueQuill = useRef<PropsValueQuill>({ url: '', text: '' });
    const tagDivURL = useRef<HTMLDivElement | null>(null);
    const [insertURL, setInsertURL] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [anonymous, setAnonymous] = useState<boolean>(false);
    const activate = you.gender === 0 ? 'anonymousMale' : you.gender === 1 ? 'anonymousFemale' : '';
    const [reply, setReply] = useState<{ id: string; name: string; id_user: string; title: string; text: string; file?: string }[]>([]);
    const [d, setD] = useState<string>('');
    const [onAc, setOnAC] = useState<boolean>(false);
    const handleAnonymousComment = () => {
        setAnonymous(!anonymous);
        if (setDD) setDD('525');
    };
    const { lg } = Languages();
    const noData = useRef<boolean>(false);
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['Comment', dataPost?._id],
        staleTime: 0, // 5m
        cacheTime: 0, // 6m
        enabled: dataPost?._id ? true : false,
        queryFn: async () => {
            try {
                if (dataPost?._id) {
                    if (data && data.offset && offset.current === 0) {
                        offset.current = data.offset;
                    }
                    const res = await postAPI.getComments(dataPost?._id, offset.current, limit);
                    if (res.length) {
                        offset.current += limit;
                    } else {
                        noData.current = true;
                    }
                    if (data) {
                        const d: any = data;
                        const newD: PropsComments[] | undefined = [...d.comments, ...res];
                        return { offset: offset.current, comments: newD };
                    }
                    return { offset: offset.current, comments: res };
                }
            } catch (error) {
                return { offset: 0, comments: [] };
            }
        },
    });
    useEffect(() => {
        socket.on(`comment_post_${dataPost?._id}`, (data) => {
            if (data) {
                console.log(data, you.id, 'yeee');
                if (you.id !== data?.data[0]?.id_user) {
                    queryClient.setQueryData(['Comment', dataPost?._id], (prevData: { comments: PropsComments[] } | undefined) => {
                        // Update the data by adding newValue to the existing data
                        prevData?.comments.map((p) => {
                            if (p._id === data._id) {
                                p.count = data.count;
                                p.full = data.full;
                                p.data.unshift(data.data[0]);
                            }
                            return p;
                        });
                        return prevData;
                    });
                }
            }
        });
    }, []);
    const handleComment = async (reply_com?: { id: string; name: string; id_user: string; title: string; text: string; file?: string | undefined }) => {
        if (dataPost?._id) {
            if (reply_com) {
                const emos = {
                    act: dataPost.feel.act,
                    onlyEmo: dataPost.feel.onlyEmo.map((r) => {
                        r.id_user = [];
                        return r;
                    }),
                };
                const newValue = await postAPI.sendComment({ postId: dataPost._id, text: reply_com.text, anonymousC: onAc, emos, commentId: reply_com.id, repliedId: reply_com.id_user });
                if (newValue) {
                    queryClient.setQueryData(['Comment', dataPost?._id], (prevData: { comments: PropsComments[] } | undefined) => {
                        // Update the data by adding newValue to the existing data
                        prevData?.comments.map((p) => {
                            if (p._id === newValue._id) {
                                p.count = newValue.count;
                                p.full = newValue.full;
                                p.data.unshift(newValue.data[0]);
                            }
                            return p;
                        });
                        return prevData;
                    });
                }
            } else {
                if (inputValue) {
                    const emos = {
                        act: dataPost.feel.act,
                        onlyEmo: dataPost.feel.onlyEmo.map((r) => {
                            return { ...r, id_user: [] };
                        }),
                    };
                    const newValue = await postAPI.sendComment({ postId: dataPost._id, text: inputValue, anonymousC: onAc, emos });
                    if (newValue) {
                        queryClient.setQueryData(['Comment', dataPost?._id], (prevData: any) => {
                            // Update the data by adding newValue to the existing data
                            return { ...(prevData ?? {}), comments: [newValue, ...prevData.comments] };
                        });
                    }
                    setInputValue('');
                }
            }
        }
    };
    const iconDatas = [
        { id: 1, icon: 'Mới nhất' },
        { id: 2, icon: 'Cũ nhất' },
        { id: 3, icon: 'Nhiều lượt thích nhất' },
        { id: 4, icon: 'Bạn bè' },
    ];

    const handleOnKeyDown = (e: any) => {
        console.log(e.key);
        if (e.key === 'Enter') e.preventDefault();
        if (e.key === 'Alt') {
            e.preventDefault();
            e.target.value += '\n';
        }
    };

    const onChange = (value: string, placeholder: string, isReply?: boolean, id_comment?: string) => {
        console.log('value', value);
        if (value.length <= 10000) {
            // Define a regex pattern to match URLs
            const hashTagRegex = /#([^]+?)\s*#@/g; // #...#@
            let dp = false; //dis is displayed
            // Use the match method to find all matches in the text
            if (quillRef.current && quillRef.current.editor) {
                const delta = quillRef.current.editor.clipboard.convert(value); // Convert HTML to Delta object

                // Apply formatting using regex
                if (delta.ops) {
                    delta.ops.map((op, index, arr) => {
                        if (typeof op.insert === 'string') {
                            op.insert = op.insert.replace(hashTagRegex, (match: any, group: any) => {
                                dp = true;
                                return `<a href="/sn/hashTags/${group}" style='color: #66a6de;'>#${group}</a>`;
                            });
                        }
                    });
                    if (dp) {
                        var tempCont = document.createElement('div');
                        if (delta.ops)
                            delta.ops.map((op) => {
                                if (op.attributes)
                                    if (op.attributes.link) {
                                        op.insert = `<a href="${op.attributes.link}" style='color: ${op.attributes.color}'>${op.insert}</a>`;
                                    }
                                return op;
                            });
                        new Quill(tempCont).setContents(delta);
                        if (tempCont) {
                            if (isReply && id_comment) {
                                setReply((pre) => {
                                    pre.map((r) => {
                                        if (r.id === id_comment) {
                                            r.text = tempCont.getElementsByClassName('ql-editor')[0].innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
                                        }
                                        return r;
                                    });
                                    return pre;
                                });
                            } else {
                                setInputValue(tempCont.getElementsByClassName('ql-editor')[0].innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
                            }
                        }
                    } else {
                        if (isReply && id_comment) {
                            setReply((pre) => {
                                pre.map((r) => {
                                    if (r.id === id_comment) {
                                        r.text = value;
                                    }
                                    return r;
                                });
                                return pre;
                            });
                        } else {
                            setInputValue(value);
                        }
                    }
                }
                if (delta.ops?.length) {
                    const tag = document.getElementById(placeholder);
                    if (tag) tag.style.display = 'none';
                } else {
                    const tag = document.getElementById(placeholder);
                    if (tag) tag.style.display = 'flex';
                    if (isReply && id_comment) {
                        setReply((pre) => {
                            pre.map((r) => {
                                if (r.id === id_comment) {
                                    r.text = '';
                                }
                                return r;
                            });
                            return pre;
                        });
                    } else {
                        setInputValue('');
                    }
                }
            }
        }
    };
    // dataPost.feel.onlyEmo.map((r) => {
    //     amount += r.id_user.length;
    // }, {});
    // const fa = dataPost.feel.onlyEmo;
    // const sortEmo = fa.sort((a, b) => b.id_user.length - a.id_user.length);
    const handleEmo = async (
        e: any,
        c: PropsCommentsIN,
        emo: {
            id: number;
            icon: string;
            id_user: string[];
        },
        index: number,
        groupCommentId: string,
    ) => {
        e.stopPropagation();
        const divConstant = document.getElementById('emoBarPost');
        console.log('above');
        let check = false;
        let oldData = c.feel;
        if (divConstant) divConstant.setAttribute('style', 'display: none');
        c.feel.onlyEmo.forEach((o) => {
            if (o.id_user.includes(you.id)) check = true;
        });
        setD('1');
        if (dataPost) {
            if (check) {
                queryClient.setQueryData(['Comment', dataPost?._id], (preData: { comments: PropsComments[] } | undefined) => {
                    preData?.comments[index].data.map((p) => {
                        if (p._id === c._id) {
                            p.feel.onlyEmo = p.feel.onlyEmo.map((o) => {
                                o.id_user = o.id_user.filter((u) => u !== you.id);
                                return o;
                            });
                            c.feel.onlyEmo = p.feel.onlyEmo;
                        }
                        return p;
                    });
                    return preData;
                });
                const res = await postAPI.setEmotion({
                    _id: dataPost._id,
                    index: emo.id,
                    id_user: you.id,
                    state: 'remove',
                    id_comment: c._id,
                    groupCommentId,
                });
                if (res)
                    queryClient.setQueryData(['Comment', dataPost?._id], (preData: { comments: PropsComments[] } | undefined) => {
                        c.feel = res;
                        preData?.comments[index].data.map((p) => {
                            if (p._id === c._id) p.feel = res;
                            return p;
                        });
                        return preData;
                    });

                if (!res)
                    queryClient.setQueryData(['Comment', dataPost?._id], (preData: { comments: PropsComments[] } | undefined) => {
                        c.feel = oldData;
                        preData?.comments[index].data.map((p) => {
                            if (p._id === c._id) p.feel = oldData;
                            return p;
                        });
                        return preData;
                    });
            } else {
                queryClient.setQueryData(['Comment', dataPost?._id], (preData: { comments: PropsComments[] } | undefined) => {
                    preData?.comments[index].data.map((p) => {
                        if (p._id === c._id) {
                            p.feel.onlyEmo = p.feel.onlyEmo.map((o) => {
                                if (o.id === c.feel.act) o.id_user.push(you.id);
                                return o;
                            });
                            c.feel.onlyEmo = p.feel.onlyEmo;
                        }
                        return p;
                    });
                    return preData;
                });
                const res = await postAPI.setEmotion({
                    _id: dataPost._id,
                    index: c.feel.act,
                    id_user: you.id,
                    state: 'add',
                    id_comment: c._id,
                    groupCommentId,
                });
                if (res)
                    queryClient.setQueryData(['Comment', dataPost?._id], (preData: { comments: PropsComments[] } | undefined) => {
                        c.feel = res;
                        preData?.comments[index].data.map((p) => {
                            if (p._id === c._id) p.feel = res;
                            return p;
                        });
                        return preData;
                    });
                if (!res)
                    queryClient.setQueryData(['Comment', dataPost?._id], (preData: { comments: PropsComments[] } | undefined) => {
                        c.feel = oldData;
                        preData?.comments[index].data.map((p) => {
                            if (p._id === c._id) p.feel = oldData;
                            return p;
                        });
                        return preData;
                    });
            }
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
        c: PropsCommentsIN,
        emo: {
            id: number;
            icon: string;
            id_user: string[];
        },
        index: number,
        groupCommentId: string,
    ) => {
        e.stopPropagation();
        const divConstant = document.getElementById('emoBarPost');
        let check = false;
        let oldData = c.feel;
        if (divConstant) divConstant.setAttribute('style', 'display: none');
        c.feel.onlyEmo.forEach((o) => {
            if (o.id_user.includes(you.id)) check = true;
        });
        if (dataPost) {
            setD('1');
            if (check) {
                queryClient.setQueryData(['Comment', dataPost?._id], (preData: { comments: PropsComments[] } | undefined) => {
                    console.log(preData, 'preData', index);

                    preData?.comments[index].data.map((p) => {
                        if (p._id === c._id) {
                            p.feel.onlyEmo = p.feel.onlyEmo.map((o) => {
                                o.id_user = o.id_user.filter((u) => u !== you.id);
                                if (o.id === i.id) o.id_user.push(you.id);

                                return o;
                            });
                            c.feel.onlyEmo = p.feel.onlyEmo;
                        }
                        return p;
                    });
                    return preData;
                });
                const res = await postAPI.setEmotion({
                    _id: dataPost._id,
                    index: i.id,
                    id_user: you.id,
                    state: 'update',
                    id_comment: c._id,
                    oldIndex: emo?.id,
                    groupCommentId,
                });
                if (res)
                    queryClient.setQueryData(['Comment', dataPost?._id], (preData: { comments: PropsComments[] } | undefined) => {
                        c.feel = res;
                        preData?.comments[index].data.map((p) => {
                            if (p._id === c._id) p.feel = res;
                            return p;
                        });
                        return preData;
                    });

                if (!res)
                    queryClient.setQueryData(['Comment', dataPost?._id], (preData: { comments: PropsComments[] } | undefined) => {
                        c.feel = oldData;
                        preData?.comments[index].data.map((p) => {
                            if (p._id === c._id) p.feel = oldData;
                            return p;
                        });
                        return preData;
                    });
            } else {
                queryClient.setQueryData(['Comment', dataPost?._id], (preData: { comments: PropsComments[] } | undefined) => {
                    preData?.comments[index].data.map((p) => {
                        if (p._id === c._id) {
                            p.feel.onlyEmo = p.feel.onlyEmo.map((o) => {
                                if (o.id === i.id) o.id_user.push(you.id);
                                return o;
                            });
                            c.feel.onlyEmo = p.feel.onlyEmo;
                        }
                        return p;
                    });
                    return preData;
                });
                const res = await postAPI.setEmotion({
                    _id: dataPost._id,
                    index: i.id,
                    id_user: you.id,
                    state: 'add',
                    id_comment: c._id,
                    groupCommentId,
                });
                if (res)
                    queryClient.setQueryData(['Comment', dataPost?._id], (preData: { comments: PropsComments[] } | undefined) => {
                        c.feel = res;
                        preData?.comments[index].data.map((p) => {
                            if (p._id === c._id) p.feel = res;
                            return p;
                        });
                        return preData;
                    });
                if (!res)
                    queryClient.setQueryData(['Comment', dataPost?._id], (preData: { comments: PropsComments[] } | undefined) => {
                        c.feel = oldData;
                        preData?.comments[index].data.map((p) => {
                            if (p._id === c._id) p.feel = oldData;
                            return p;
                        });
                        return preData;
                    });
            }
            setD('2');
        }
    };
    const coms = useRef<HTMLDivElement | null>(null);
    const handleScrollMore = (e: any) => {
        if (coms.current) {
            const { scrollTop, clientHeight, scrollHeight } = coms.current;
            const scrollBottom = scrollTop + clientHeight;
            console.log(scrollTop + clientHeight, 'scrollBottom', scrollHeight, 'scrollHeight');
            if (scrollTop + clientHeight >= scrollHeight - 20 && !isLoading && !noData.current) {
                // wait for another request
                refetch();
            }
        }
    };
    console.log('comment here', '' && 'ds');

    return (
        <DivComment onClick={(e) => e.stopPropagation()}>
            <DivFill
                css={`
                    height: 100%;
                    background-color: #24262a;
                    position: relative;
                    @media (min-width: 550px) {
                        background-color: #18191b6b;
                    }
                `}
            >
                <Div
                    width="100%"
                    css={`
                        height: 40px;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        border-bottom: 1px solid #494949;
                    `}
                >
                    <DivPos size="22px" top="10px" left="8px" onClick={() => setShowComment('')}>
                        <UndoIRegister />
                    </DivPos>
                    <P z="1.4rem">Comment</P>{' '}
                    <Div css="margin-right: 5px;">
                        <FcReadingEbook />
                    </Div>{' '}
                    <DivPos size="22px" top="10px" right="8px">
                        <ResetI />
                    </DivPos>
                </Div>

                <DivFill css=" padding: 10px 14px">
                    <DivFill css="heigh: 100%; border-top: 1px solid #545454; border-left: 1px solid #545454;border-right: 1px solid #545454; border-top-right-radius: 5px;border-top-left-radius: 5px">
                        <DivFlex justify="start" css="padding: 9px">
                            {iconDatas.map((i) => (
                                <P
                                    z="1.3rem"
                                    key={i.id}
                                    css={`
                                        padding: 0 5px;
                                        cursor: var(--pointer);
                                        ${i.id === 1 ? 'border-bottom: 1px solid;' : ''}
                                    `}
                                >
                                    {i.icon}
                                </P>
                            ))}
                        </DivFlex>
                        <DivFill css="border-top: 1px solid #494848;">
                            <Div
                                width="100%"
                                css={`
                                    align-items: flex-start;
                                    justify-content: space-around;
                                    padding: 5px;
                                    margin: 11px 0;
                                    input {
                                        padding: 8px 14px;
                                    }
                                    @media (max-width: 550px) {
                                        input {
                                            padding: 8px;
                                        }
                                        position: absolute;
                                        bottom: 2px;
                                        left: 0;
                                        margin: 0;
                                        z-index: 2;
                                        background-color: #4e4e4e;
                                    }
                                `}
                            >
                                <Avatar
                                    src={!onAc ? you.avatar : ''}
                                    alt="son-tung"
                                    staticI={onAc}
                                    gender={activate}
                                    radius="50%"
                                    css={`
                                        width: 30px;
                                        height: 30px;
                                    `}
                                    onClick={handleAnonymousComment}
                                >
                                    {anonymous && anony.some((a) => a.id === anonymousIndex) ? ( // anonymous comment
                                        <Div
                                            css={`
                                                position: absolute;
                                                top: 40px;
                                                width: fit-content;
                                                padding: 4px 10px;
                                                background-color: #1c5689;
                                                border-radius: 5px;
                                                left: 14px;
                                                cursor: var(--pointer);
                                            `}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOnAC(!onAc);
                                            }}
                                        >
                                            <Avatar css="width: 30px; height: 30px; min-width: 30px; margin-right: 3px;" src={onAc ? you.avatar : ''} staticI={!onAc} radius="50%" gender={activate} />
                                            <P z="1.5rem">{onAc ? you.fullName : 'Anonymous'}</P>
                                        </Div>
                                    ) : (
                                        <></>
                                    )}
                                </Avatar>
                                <Div css="font-size: 20px; margin-top: 5px;">
                                    <input
                                        id="uploadC"
                                        type="file"
                                        name="file[]"
                                        // onChange={handleImageUpload}
                                        multiple
                                        hidden
                                    />
                                    <Label htmlFor="uploadC">
                                        <CameraI />
                                    </Label>
                                </Div>
                                <Div width="70%" css="position: relative;">
                                    <QuillText
                                        consider={consider}
                                        css={`
                                            width: 100%;
                                            background-color: #373737;
                                            border-radius: 10px;
                                            padding: 5px 10px;
                                            .ql-editor {
                                                outline: none;
                                            }
                                            .ql-container.ql-snow {
                                                border: 0;
                                            }
                                            * {
                                                font-size: 1.3rem;
                                            }
                                        `}
                                        insertURL={insertURL}
                                        setInsertURL={setInsertURL}
                                        onChange={(e) => onChange(e, 'placeholder_comment_post')}
                                        quillRef={quillRef}
                                        tagDivURL={tagDivURL}
                                        valueQuill={valueQuill}
                                        valueText={inputValue}
                                    />
                                    <DivPos id="placeholder_comment_post" css="cursor: auto !important; pointer-events: none;" top="5px" left="11px" size="1.3rem">
                                        comment
                                    </DivPos>
                                </Div>
                                <Div css="font-size: 20px; cursor: var(--pointer); margin-top: 5px;" onClick={() => handleComment()}>
                                    <SendOPTI />
                                </Div>
                            </Div>
                        </DivFill>
                        <DivFill
                            ref={coms}
                            css={`
                                margin-top: 5px;
                                overflow: overlay;
                                padding-top: 32px;
                                max-height: 528px;
                                &::-webkit-scrollbar-thumb {
                                    border-radius: 3px;
                                    cursor: grabbing;
                                }
                                &::-webkit-scrollbar {
                                    width: 9px;
                                }
                            `}
                            onScroll={handleScrollMore}
                        >
                            {isLoading ? (
                                <SkeletonTheme baseColor="#414141" highlightColor="#7c7c7c" borderRadius={50}>
                                    <DivFlex css="margin-bottom: 68px;" justify="left">
                                        <DivNone width="40px" css="border-bottom: 1px solid #4f4f4f; @media(min-width: 550px){width: 70px}"></DivNone>
                                        <DivFlex width="72%" justify="left" wrap="wrap" css="margin: 0 5px;">
                                            <Div>
                                                <Skeleton circle height="35px" width="35px" duration={1} />
                                                <DivNone width="80%" margin="0 10px">
                                                    <Skeleton height="16px" width="200px" duration={1} />
                                                    <Skeleton height="13px" width="150px" duration={1} />
                                                </DivNone>
                                            </Div>
                                            <Skeleton height="10px" width="250px" duration={1} />
                                        </DivFlex>
                                        <DivNone>
                                            <Skeleton circle height="20px" width="20px" duration={1} />
                                        </DivNone>
                                    </DivFlex>
                                </SkeletonTheme>
                            ) : (
                                data?.comments.map((comment, indexR) =>
                                    comment.data.map((c) => {
                                        const emo = c.feel.onlyEmo.filter((o) => o.id_user.includes(you.id))[0];
                                        let amount = 0;
                                        c.feel.onlyEmo.map((r) => {
                                            amount += r.id_user.length;
                                        }, {});
                                        const hasEmo = c.feel.onlyEmo.some((o) => o.id_user.length);
                                        return (
                                            <DivFlex key={c._id} justify="start" align="start" css="margin-bottom: 40px; position: relative;">
                                                <DivPos top="-3px" right="55px" index={1} css="text-wrap: nowrap; ">
                                                    <Div
                                                        css="font-weight: 600; width: 20px; height: 20px; justify-content: center;align-items: center;} @media (min-width: 768px) {
                                                    &:hover {#emoBarPost {display: flex;top: -33px;}}}position: relative;"
                                                        onClick={(e) => handleEmo(e, c, emo, indexR, comment._id)}
                                                    >
                                                        {!emo ? <IconI /> : emo.icon}

                                                        <DivPos top="19px" right="50%" left="50%" translateT="-50%">
                                                            <P z="1.3rem"> {amount} </P>
                                                        </DivPos>
                                                        <Div
                                                            id="emoBarPost"
                                                            width="fit-content"
                                                            className="showI"
                                                            display="none"
                                                            css={`
                                                                position: absolute;
                                                                top: 0;
                                                                right: -25px;
                                                                padding: 0 37px 33px;
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
                                                                transition: all 1s linear;
                                                            `}
                                                        >
                                                            {c.feel.onlyEmo
                                                                .sort((a, b) => a.id - b.id)
                                                                .map((i, index, arr) => (
                                                                    <DivEmoji
                                                                        key={i.id}
                                                                        onClick={(e) => handleReEmo(e, i, c, emo, indexR, comment._id)}
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
                                                    </Div>
                                                </DivPos>

                                                <DivNone width="40px" css="border-bottom: 1px solid #4f4f4f; @media(min-width: 550px){width: 70px}"></DivNone>
                                                <DivFlexPosition wrap="wrap" position="relative" width="79%">
                                                    <DivFlex wrap="wrap" justify="start" css="margin-top: -18px;" width="100%">
                                                        <DivFlex>
                                                            <Avatar
                                                                src={c.user.avatar}
                                                                alt={c.user.fullName}
                                                                gender={c.user.gender}
                                                                css="min-width: 30px; width: 30px; height: 30px; margin: 0 5px;"
                                                                radius="50%"
                                                            />
                                                            <DivFlex wrap="wrap" justify="start">
                                                                <Hname>{c.user.fullName}</Hname>
                                                                <Div>
                                                                    <Div css="margin-right: 5px;">
                                                                        <FcReadingEbook />
                                                                    </Div>{' '}
                                                                    <Div css="*{font-size: 1.3rem;}" dangerouslySetInnerHTML={{ __html: c.content.text }}></Div>
                                                                </Div>
                                                            </DivFlex>
                                                        </DivFlex>
                                                        <DivFlex justify="start">
                                                            <BsDot />
                                                            <P z="1.1rem">{moments().FromNow(c.createdAt, 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD HH:mm:ss', lg)}</P>{' '}
                                                            <P
                                                                z="1.1rem"
                                                                css={`
                                                                    margin: 0 5px;
                                                                `}
                                                            >
                                                                -
                                                            </P>
                                                            <DivNone
                                                                display="flex"
                                                                css={`
                                                                    div:first-child {
                                                                        margin: 0 !important;
                                                                    }
                                                                `}
                                                            >
                                                                {hasEmo ? (
                                                                    c.feel.onlyEmo.map((key, index, arr) => (key.id_user.length ? <DivEmoji key={key.id}>{key.icon}</DivEmoji> : ''))
                                                                ) : (
                                                                    <P z="1.1rem" css="cursor: var(--pointer); &:hover{text-decoration: underline;}font-weight: 600;">
                                                                        Cảm xúc
                                                                    </P>
                                                                )}
                                                            </DivNone>
                                                            <P z="1.1rem" css="margin: 0 5px">
                                                                -
                                                            </P>
                                                            <P
                                                                z="1.1rem"
                                                                css="cursor: var(--pointer); &:hover{text-decoration: underline;}font-weight: 600;"
                                                                onClick={(e: any) => {
                                                                    if (reply.some((r) => r.id === c._id)) {
                                                                        e.target.removeAttribute('style');
                                                                        setReply((pre) => pre.filter((f) => f.id !== c._id));
                                                                    } else {
                                                                        e.target.setAttribute('style', 'text-decoration: underline;');
                                                                        setReply((pre) => [...pre, { id: c._id, name: c.user.fullName, text: '', id_user: c.id_user, title: 'Trả lời' }]);
                                                                    }
                                                                }}
                                                            >
                                                                trả lời
                                                            </P>{' '}
                                                            <P z="1.1rem" css="margin: 0 5px">
                                                                -
                                                            </P>
                                                            <P z="1.1rem" css="cursor: var(--pointer); &:hover{text-decoration: underline;}font-weight: 600;">
                                                                Nhắc đến
                                                            </P>{' '}
                                                            <P z="1.1rem" css="margin: 0 5px">
                                                                -
                                                            </P>
                                                            <Div css="cursor: var(--pointer); font-size: 25px;">
                                                                <DotI />
                                                            </Div>
                                                        </DivFlex>
                                                        {/* {c.reply.} */}
                                                        {/* {reply.map((r) => {
                                                            if (r.id === c._id)
                                                                return (
                                                                    <ReplyComment
                                                                        key={r.id}
                                                                        r={r}
                                                                        activate={activate}
                                                                        anony={anony}
                                                                        anonymous={anonymous}
                                                                        anonymousIndex={anonymousIndex}
                                                                        handleAnonymousComment={handleAnonymousComment}
                                                                        handleComment={handleComment}
                                                                        onAc={onAc}
                                                                        onChange={onChange}
                                                                        setOnAC={setOnAC}
                                                                        you={you}
                                                                    />
                                                                );
                                                            return null;
                                                        })} */}
                                                    </DivFlex>
                                                </DivFlexPosition>
                                            </DivFlex>
                                        );
                                    }),
                                )
                            )}
                        </DivFill>
                    </DivFill>
                </DivFill>
            </DivFill>
        </DivComment>
    );
};
export default Comment;
