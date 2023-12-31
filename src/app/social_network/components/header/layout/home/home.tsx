import clsx from 'clsx';
import { createRef, Fragment, Key, memo, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { DivPost } from './styleHome';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import HomeAPI from '~/restAPI/socialNetwork/homeAPI';
import FormUpNews, { PropsFormHome } from './Layout/FormUpNews/FormUpNews';
import Posts from './Layout/DataPosts/Posts';
import HttpRequestUser from '~/restAPI/userAPI';
import { Div, H3, P } from '~/reUsingComponents/styleComponents/styleDefault';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { socket } from 'src/mainPage/nextWeb';
import { setTrueErrorServer } from '~/redux/hideShow';
import homeAPI from '~/restAPI/socialNetwork/homeAPI';
import fileGridFS from '~/restAPI/gridFS';
import CommonUtils from '~/utils/CommonUtils';
import Cookies from '~/utils/Cookies';
import { PropsDataPosts } from './Layout/DataPosts/interfacePosts';
import { setSession } from '~/redux/reload';
import ServerBusy from '~/utils/ServerBusy';

console.log('eeeeeeeeeeeeeeeeeeeeeeeee');

export interface PropsUserHome {
    avatar: string;
    fullName: string;
    gender: number;
}
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
    dataUser: PropsUserHome;
}

const Home: React.FC<PropsHome> = ({ home, colorBg, colorText, dataUser }) => {
    const dispatch = useDispatch();
    const { userBar, form } = home;

    const [dataPosts, setDataPosts] = useState<PropsDataPosts[]>([]);
    const offset = useRef<number>(0);
    const limit = 5;
    const handleOpenForm = () => {
        console.log('ok very good');
    };

    useEffect(() => {
        async function fetch() {
            const res: PropsDataPosts[] = await homeAPI.getPosts(limit, offset.current, 'friend');
            const data: PropsDataPosts[] = ServerBusy(res, dispatch);
            const newData: any = await new Promise(async (resolve, reject) => {
                try {
                    await Promise.all(
                        data.map(async (n, index) => {
                            n.user.map((u) => (u.Avatar = CommonUtils.convertBase64(u.Avatar)));
                            if (n.category === 0) {
                                n.content.options.default.map(async (d, index2) => {
                                    if (d.file) {
                                        const file = await fileGridFS.getFile(d.file);
                                        data[index].content.options.default[index2].file = file;
                                    }
                                });
                            }
                        }),
                    );
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
            console.log(newData, 'data post');
            setDataPosts(newData);
        }
        fetch();
    }, []);
    const minWidth1 = '400px';
    const bgAther = colorBg === 1 ? '#17181af5' : colorBg;
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
        >
            <DivPost onClick={(e) => e.stopPropagation()}>
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
                        profile={false}
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
                <FormUpNews form={form} colorBg={colorBg} colorText={colorText} user={dataUser} />
                <Div display="block" css="margin: 20px 0;">
                    {dataPosts.map((p) => (
                        <Posts key={p._id} user={dataUser} colorBg={colorBg} colorText={colorText} dataPosts={p} />
                    ))}
                </Div>
            </DivPost>
        </Div>
    );
};

export default memo(Home);
