import clsx from 'clsx';
import { createRef, Fragment, Key, memo, ReactElement, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DivPost } from './styleHome';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import HomeAPI from '~/restAPI/socialNetwork/postAPI';
import FormUpNews, { PropsFormHome } from './Layout/FormUpNews/FormUpNews';
import Posts from './Layout/DataPosts/Posts';
import HttpRequestUser from '~/restAPI/userAPI';
import { Button, Div, H3, P } from '~/reUsingComponents/styleComponents/styleDefault';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { socket } from 'src/mainPage/nextWeb';
import { setTrueErrorServer } from '~/redux/hideShow';
import homeAPI from '~/restAPI/socialNetwork/postAPI';
import fileGridFS from '~/restAPI/gridFS';
import CommonUtils from '~/utils/CommonUtils';
import Cookies from '~/utils/Cookies';
import { PropsDataPosts } from './Layout/DataPosts/interfacePosts';
import { setSession } from '~/redux/reload';
import ServerBusy from '~/utils/ServerBusy';
import { PostsI, ShortStoryI, YoutubeI } from '~/assets/Icons/Icons';
import { PropsUser } from 'src/App';

console.log('eeeeeeeeeeeeeeeeeeeeeeeee');

export interface PropsTextHome {
    userBar: {
        contentFirst: string;
        contentTwo: string;
    };
    form: PropsFormHome;
}
interface PropsHome {
    colorBg: number;
    colorText: string;
    home: PropsTextHome;
    dataUser: PropsUser;
}

const Home: React.FC<PropsHome> = ({ home, colorBg, colorText, dataUser }) => {
    const dispatch = useDispatch();
    const { userBar, form } = home;
    const [formThat, setFormThat] = useState<ReactElement | null>(null);

    const [category, setCategory] = useState<{ id: string; icon: ReactElement }>({ id: 'post', icon: <PostsI /> });
    const [options, setOptions] = useState<string>('');
    const [openPostCreation, setOpenPostCreation] = useState<boolean>(false);
    const [topScrolling, setTopScrolling] = useState<boolean>(false);

    const [dataPosts, setDataPosts] = useState<PropsDataPosts[]>([]);
    const offset = useRef<number>(0);
    const limit = 5;
    const handleOpenForm = () => {
        console.log('ok very good');
    };
    console.log(document, 'previousDocument', colorBg);

    useEffect(() => {
        async function fetch() {
            const res = await homeAPI.getPosts(limit, offset.current, 'friend');
            const data: typeof res = ServerBusy(res, dispatch);
            setDataPosts(data);
        }
        fetch();
    }, []);
    const minWidth1 = '400px';
    const bgAther = colorBg === 1 ? '#17181af5' : colorBg;
    const handleScroll = (e: any) => {
        const { scrollTop, scrollLeft } = e.target;
        if (!openPostCreation) {
            if (scrollTop > 148) {
                setTopScrolling(true);
            } else {
                setTopScrolling(false);
            }
        }
        console.log(scrollTop, 'scrollTop');
    };
    const bgIsChosen =
        'background-image: linear-gradient(45deg,var(--yt-spec-assistive-feed-themed-gradient-1),var(--yt-spec-assistive-feed-themed-gradient-2),var(--yt-spec-assistive-feed-themed-gradient-3)),linear-gradient(45deg,var(--yt-spec-assistive-feed-vibrant-gradient-1),var(--yt-spec-assistive-feed-vibrant-gradient-2),var(--yt-spec-assistive-feed-vibrant-gradient-3)); background-clip: padding-box, border-box; background-origin: border-box, border-box; border: 1px solid transparent;';
    const post = category.id === 'post';
    const story = category.id === 'story';
    const youtube = category.id === 'youtube';
    const DivItemCss = `margin-right: 10px;padding: 5px;cursor: pointer;position: relative;font-size: 20px;padding: 5px 20px;border-radius: 5px;border: 1px solid #5e5d5c;`;
    const previousDocument = window.history.state;
    console.log(previousDocument, 'previousDocument');

    return (
        <Div
            width="100%"
            css={`
                overflow-y: overlay;
                height: 100%;
                padding-top: 50px;
                justify-content: center;
                background-color: ${bgAther};
            `}
            onScroll={handleScroll}
        >
            <DivPost onClick={(e) => e.stopPropagation()}>
                <Div
                    wrap="wrap"
                    width="100%"
                    css={`
                        overflow: overlay;
                        max-height: 93%;
                        @media (min-width: 580px) {
                            width: 580px;
                        }
                        @media (max-width: 768px) {
                            &::-webkit-scrollbar {
                                width: 0px;
                            }
                        }
                        ${topScrolling && openPostCreation
                            ? 'position: fixed; z-index: 1; background-color: #18191b;'
                            : ''}
                    `}
                >
                    <Div
                        css={`
                            width: 100%;
                            margin-top: 18px;
                            border-radius: 10px;
                            background-color: #494c54cf;
                            border: 1px solid #6a6a6a;
                            z-index: 1;
                        `}
                        onClick={handleOpenForm}
                    >
                        <Avatar
                            src={dataUser.avatar}
                            gender={dataUser.gender}
                            alt={dataUser.fullName}
                            radius="50%"
                            css={`
                                width: 38px;
                                height: 38px;
                                margin: 5px;
                                @media (min-width: ${minWidth1}) {
                                    width: 45px;
                                    height: 45px;
                                    margin: 7px 7px 7px 10px;
                                }
                            `}
                        />
                        <Div
                            css={`
                                width: 75%;
                                height: fit-content;
                                color: ${colorText};
                                margin-top: 2px;
                                @media (min-width: ${minWidth1}) {
                                    margin-top: 6px;
                                }
                            `}
                            wrap="wrap"
                        >
                            <H3
                                css={`
                                    width: 100%;
                                    font-size: 1.5rem;
                                    height: fit-content;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;
                                    overflow: hidden;
                                    @media (min-width: ${minWidth1}) {
                                        font-size: 1.6rem;
                                    }
                                `}
                            >
                                {dataUser.fullName}
                            </H3>
                            <P
                                css={`
                                    font-size: 1.2rem;
                                    height: fit-content;
                                    @media (min-width: ${minWidth1}) {
                                        font-size: 1.2rem;
                                    }
                                `}
                            >
                                {userBar.contentFirst} <span style={{ fontSize: '1rem' }}>{userBar.contentTwo}</span>
                            </P>
                        </Div>
                    </Div>
                    <Div
                        width="100%"
                        css={`
                            padding: 0 5px;
                            margin-top: 5px;
                        `}
                    >
                        <Div width="100%" css="align-items: center;">
                            <Div
                                css={`
                                    ${DivItemCss}
                                    ${post ? bgIsChosen : ''}
                                    &:hover {
                                        color: #85a5cc;
                                    }
                                `}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCategory({ id: 'post', icon: <PostsI /> });
                                }}
                            >
                                <PostsI />
                            </Div>
                            <Div
                                css={`
                                    ${DivItemCss}
                                    ${story ? bgIsChosen : ''}
                                    &:hover {
                                        color: #fde2fb;
                                    }
                                `}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCategory({ id: 'story', icon: <ShortStoryI /> });
                                }}
                            >
                                <ShortStoryI />
                            </Div>{' '}
                            <Div
                                css={`
                                    ${DivItemCss}
                                    ${youtube ? bgIsChosen : ''}
                                    &:hover {
                                        color: #fde2fb;
                                    }
                                `}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCategory({ id: 'youtube', icon: <YoutubeI /> });
                                }}
                            >
                                <YoutubeI />
                            </Div>
                        </Div>
                        <Div
                            width="190px"
                            css="font-size: 1.4rem; cursor: var(--pointerR); align-items: center; justify-content: space-evenly; border-radius: 5px;;background-image: linear-gradient(45deg,var(--yt-spec-assistive-feed-themed-gradient-1),var(--yt-spec-assistive-feed-themed-gradient-2),var(--yt-spec-assistive-feed-themed-gradient-3)),linear-gradient(45deg,var(--yt-spec-assistive-feed-vibrant-gradient-1),var(--yt-spec-assistive-feed-vibrant-gradient-2),var(--yt-spec-assistive-feed-vibrant-gradient-3)); background-clip: padding-box, border-box; background-origin: border-box, border-box; border: 1px solid transparent;"
                            onClick={() => setOpenPostCreation(true)}
                        >
                            Apply ideas {category.icon}
                        </Div>
                    </Div>
                    <Div
                        css={`
                            padding: 0 5px;
                            margin-top: 5px;
                            z-index: 1;
                            background-color: #07070759;
                            border-radius: 5px;
                            padding-top: 5px;
                            position: fixed;
                            z-index: 1;
                            top: -50px;
                            width: max-content;
                            right: 50%;
                            left: 50%;
                            translate: -50%;
                            ${!openPostCreation ? 'padding-bottom: 41px;' : ''}
                            ${topScrolling && !openPostCreation
                                ? ' @media (min-width: 768px) {top: 50px;}top: 34px;'
                                : ''}
                        `}
                        wrap="wrap"
                    >
                        <Div width="100%" css="align-items: center;">
                            <Div
                                css={`
                                    ${DivItemCss}
                                    ${post ? bgIsChosen : ''}
                                    &:hover {
                                        color: #85a5cc;
                                    }
                                `}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCategory({ id: 'post', icon: <PostsI /> });
                                }}
                            >
                                <PostsI />
                            </Div>
                            <Div
                                css={`
                                    ${DivItemCss}
                                    ${story ? bgIsChosen : ''}
                                    &:hover {
                                        color: #fde2fb;
                                    }
                                `}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCategory({ id: 'story', icon: <ShortStoryI /> });
                                }}
                            >
                                <ShortStoryI />
                            </Div>{' '}
                            <Div
                                css={`
                                    ${DivItemCss}
                                    ${youtube ? bgIsChosen : ''}
                                    &:hover {
                                        color: #fde2fb;
                                    }
                                `}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCategory({ id: 'youtube', icon: <YoutubeI /> });
                                }}
                            >
                                <YoutubeI />
                            </Div>
                        </Div>
                    </Div>
                    <Div></Div>
                    {openPostCreation ? (
                        <FormUpNews
                            form={form}
                            colorBg={colorBg}
                            colorText={colorText}
                            user={dataUser}
                            setOpenPostCreation={() => setOpenPostCreation(false)}
                        />
                    ) : (
                        formThat
                    )}
                </Div>
                {post && (
                    <Div display="block" width="100%" css="margin: 20px 0;@media(min-width: 768px){width:100%}">
                        {dataPosts.map((p) => (
                            <Posts
                                setDataPosts={setDataPosts}
                                setFormThat={setFormThat}
                                form={form}
                                setOptions={setOptions}
                                options={options}
                                key={p._id}
                                user={dataUser}
                                colorBg={colorBg}
                                colorText={colorText}
                                dataPosts={p}
                            />
                        ))}
                    </Div>
                )}
            </DivPost>
        </Div>
    );
};

export default memo(Home);
