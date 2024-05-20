import { useEffect, useRef, useState } from 'react';

import { Div, DivFlex, P } from '~/reUsingComponents/styleComponents/styleDefault';
import TagProfile from './TagProfile';
import peopleAPI from '~/restAPI/socialNetwork/peopleAPI';
import { useCookies } from 'react-cookie';
import { DotI, LoadingI } from '~/assets/Icons/Icons';
import CommonUtils from '~/utils/CommonUtils';
import { useDispatch, useSelector } from 'react-redux';
import { DivResults } from './styleMakingFriends';
import { ButtonAnimationSurround, DivLoading } from '~/reUsingComponents/styleComponents/styleComponents';
import ServerBusy from '~/utils/ServerBusy';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from 'src';
import { io } from 'socket.io-client';
import { PropsUser } from 'src/App';
import { socket } from 'src/mainPage/NextWeb';
export interface PropsDataStranger {
    avatar: any;
    birthday: string;
    fullName: string;
    gender: number;
    id: string;
    userRequest:
        | {
              id: string;
              idRequest: string;
              idIsRequested: string;
              level: number;
              createdAt: string;
              updatedAt?: string;
          }[]
        | [];
    userIsRequested:
        | {
              id: string;
              idRequest: string;
              idIsRequested: string;
              level: number;
              createdAt: string;
              updatedAt?: string;
          }[]
        | [];
}
type PropsQueryItem = { offset: number; data: PropsDataStranger[] } | undefined;
const Strangers: React.FC<{
    cRef: React.MutableRefObject<number>;
    userData: PropsUser;
}> = ({ cRef, userData }) => {
    const dispatch = useDispatch();
    const reload = useSelector((state: { reload: { people: number } }) => state.reload.people);

    const [cookies, setCookies] = useCookies(['tks', 'k_user']);
    const [loading, setLoading] = useState<boolean>(false);
    const offsetRef = useRef<number>(0);
    const limit: number = 3;
    const eleRef = useRef<any>();
    const isRefetch = useRef<boolean>(false);
    const dataRef = useRef<any>([]);
    const {
        data: asNew,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ['getStrangers'],
        staleTime: 15 * 60 * 60 * 1000,
        cacheTime: 15 * 60 * 60 * 1000,
        // enabled:
        queryFn: async () => {
            cRef.current = 1;
            const preData: PropsQueryItem = queryClient.getQueryData(['getStrangers']);
            const res = await peopleAPI.getStrangers(dispatch, preData?.offset ?? 0, limit, preData ? 'ok' : undefined);
            if (res) {
                if (preData) {
                    if (isRefetch.current)
                        // for scroll
                        return { offset: preData.offset + limit, data: [...preData.data, ...res] };
                }
                return { offset: 0, data: res };
            }
        },
    });
    console.log(asNew, 'asNew');

    const data = asNew?.data;
    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = eleRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 20 && !isFetching) {
            refetch();
        }
    };
    const updateData = useMutation(
        async (newData: any) => {
            return newData;
        },
        {
            onMutate: (newData) => {
                // Trả về dữ liệu cũ trước khi thêm mới để lưu trữ tạm thời
                const previousData = data ?? [];
                // Cập nhật cache tạm thời với dữ liệu mới
                console.log(newData, 'newData_1');

                queryClient.setQueryData(['getStrangers'], (preData: PropsQueryItem) => {
                    if (data && preData) {
                        if (newData.type === 'add') {
                            data?.map((x) => {
                                if (x.id === newData.id_friend) {
                                    if (newData.data.idIsRequested === newData.data.idRequest) {
                                        x.userRequest[0] = {
                                            id: newData.data.id,
                                            idRequest: newData.data.idRequest,
                                            idIsRequested: userData.id,
                                            createdAt: newData.data.createdAt,
                                            level: 1,
                                        };
                                    } else {
                                        x.userRequest[0] = {
                                            id: newData.data.id,
                                            idRequest: newData.data.idRequest,
                                            idIsRequested: newData.data.idIsRequested,
                                            createdAt: newData.data.createdAt,
                                            level: 1,
                                        };
                                    }
                                }
                                return x;
                            });
                        } else if (newData.type === 'abolish') {
                            data?.map((x) => {
                                if ((x.userRequest.length || x.userIsRequested.length) && (x.userRequest[0]?.id === newData.ok?.id || x.userIsRequested[0]?.id === newData.ok?.id)) {
                                    x.userRequest = [];
                                    x.userIsRequested = [];
                                }
                                return x;
                            });
                        } else if (newData.type === 'deleteReal') {
                            const newDa = data?.filter((d: { id: string }) => d.id !== newData?.id);
                            return { ...preData, data: newDa };
                        } else if (newData.type === 'confirm') {
                            data?.map((x) => {
                                if ((x.userRequest.length || x.userIsRequested.length) && (x.userRequest[0]?.id === newData.ok?.id || x.userIsRequested[0]?.id === newData.ok?.id)) {
                                    if (x.userRequest[0]?.level) x.userRequest[0].level = 2;
                                    if (x.userIsRequested[0]?.level) x.userIsRequested[0].level = 2;
                                }
                                return x;
                            });
                        }
                        return { ...preData, data };
                    }
                    return preData;
                });
                return { previousData };
            },
            onError: (error, newData, context) => {
                // Xảy ra lỗi, khôi phục dữ liệu cũ từ cache tạm thời
                queryClient.setQueryData(['getStrangers'], context?.previousData);
            },
            onSettled: () => {
                // Dọn dẹp cache tạm thời sau khi thực hiện mutation
                // queryClient.invalidateQueries(['getStrangers']);
            },
        },
    );
    useEffect(() => {
        eleRef.current.addEventListener('scroll', handleScroll);
        socket.on(
            `Request others?id=${userData.id}`,
            (res: {
                id_friend: string;
                user: {
                    id: string;
                    fullName: string;
                    avatar: string | null;
                    gender: number;
                };
                data: {
                    id: string;
                    idRequest: string;
                    idIsRequested: string;
                    level: number;
                    createdAt: Date;
                    updatedAt: Date;
                };
                quantity: number;
            }) => {
                console.log(res, 'resresres');
                res.data.idIsRequested = res.data.idRequest;
                if (res && res.user.id !== userData.id) updateData.mutate({ ...res, type: 'add' });
            },
        );
        socket.on(
            `Del request others?id=${userData.id}`,
            (res: {
                userId: string;
                data: {
                    id: string;
                    idRequest: string;
                    idFriend: null;
                    createdAt: null;
                };
            }) => {
                if (res) updateData.mutate({ ok: { id: res.data?.id }, type: 'abolish' });
            },
        );
        socket.on(
            `Confirmed_friend_${userData.id}`,
            (res: {
                ok: {
                    id: string;
                    idRequest: string;
                    idIsRequested: string;
                    level: number;
                    createdAt: Date;
                    updatedAt: Date;
                };
            }) => {
                console.log(res, 'Confirmed_friend_');

                if (res) updateData.mutate({ ...res, type: 'confirm' });
            },
        );
        return () => {
            eleRef.current?.removeEventListener('scroll', handleScroll);
        };
    }, [reload]);
    console.log('hello friend');

    const handleAdd = async (id: string, kindOf: string = 'friend') => {
        const dataR: {
            id_friend: string;
            data: {
                createdAt: string;
                id: 79;
                idIsRequested: string;
                idRequest: string;
            };
        } = await peopleAPI.setFriend(dispatch, id);
        // const newStranger = data?.filter((x) => {
        //     if (x.id === dataR.data.idIsRequested) {
        //         x.userRequest[0] = {
        //             id: dataR.data.id,
        //             idRequest: dataR.data.idRequest,
        //             idIsRequested: dataR.data.idIsRequested,
        //             createdAt: dataR.data.createdAt,
        //             level: 1,
        //         };
        //         return x;
        //     } else {
        //         return x;
        //     }
        // });
        updateData.mutate({ ...dataR, type: 'add' });
    };
    const handleAbolish = async (id: string, kindOf: string = 'friends') => {
        const dataR = await peopleAPI.delete(dispatch, id, undefined, undefined, kindOf);
        if (dataR) updateData.mutate({ ...dataR, type: 'abolish' });
    };
    const handleMessenger = (id: string) => {
        console.log('messenger', id);
    };
    const handleConfirm = async (id: string, kindOf: string = 'friends') => {
        const dataR: {
            ok: {
                id: string;
                idRequest: string;
                idIsRequested: string;
                level: number;
                createdAt: Date;
                updatedAt: Date;
            };
        } = await peopleAPI.setConfirm(dispatch, id, undefined, undefined, kindOf);
        if (dataR) updateData.mutate({ ...dataR, type: 'confirm' });
    };
    const handleRemove = async (id: string, of: string = 'yes', kindOf?: string) => {
        if (of === 'no' && id) {
            updateData.mutate({ id, type: 'deleteReal' }); // just remove
        } else {
            const dataR = await peopleAPI.delete(dispatch, id, undefined, undefined, kindOf);
            if (dataR) updateData.mutate({ id, type: 'deleteReal' }); // delete friend
        }
    };

    const css = `    display: flex;
            align-items: center;
            padding: 4px 6px;
           background-color: #5e5e5e;
            color: #cbcbcb;
            cursor: var(--pointer);
            border-radius: 5px;
            font-size: 1.3rem;
            font-weight: 400;
            justify-content: center;
              @media (min-width: 769px){
                padding: 6px;
              }
          `;
    const cssImage = `
                    min-width: 40px;
                    width: 40px;
                    height: 40px;
                    margin-right: 5px;
                    cursor: var(--pointer); 
                    @media (min-width: 769px){
                            width: 100%;
                            height: 170px;
                            margin-right: 0;
                            img{border-radius: 5px 5px 0 0 !important; }
                    }
                    img{border-radius: 50% ;}`;
    return (
        <>
            <DivResults ref={eleRef} id="strangers">
                {isFetching ? (
                    <DivLoading>
                        <LoadingI />
                    </DivLoading>
                ) : data?.length ? (
                    data?.map((vl) => {
                        console.log(vl, 'vlllll');
                        const buttons = [];
                        if (vl?.userIsRequested || vl?.userRequest) {
                            const idU = vl?.userIsRequested[0]?.idRequest ?? vl?.userRequest[0]?.idRequest;
                            const idFr = vl?.userRequest[0]?.idIsRequested ?? vl?.userIsRequested[0]?.idIsRequested;
                            const level = vl?.userIsRequested[0]?.level ?? vl?.userRequest[0]?.level;
                            if (level === 2) {
                                buttons.push({
                                    text: 'Messenger',
                                    css: css + ' background-color: #366ab3; ',
                                    onClick: () => handleMessenger(vl.id),
                                });
                            } else {
                                if (idU === userData.id) {
                                    buttons.push(
                                        {
                                            text: 'Delete',
                                            css: css,
                                            onClick: () => handleRemove(vl.id, 'yes', 'friends'),
                                        },
                                        {
                                            text: 'Abolish',
                                            css: css + 'background-color: #af2c48; ',
                                            onClick: () => handleAbolish(vl.id),
                                        },
                                    );
                                } else if (idFr === userData.id) {
                                    console.log('friend --others');
                                    buttons.push(
                                        {
                                            text: 'Delete',
                                            css: css,
                                            onClick: () => handleRemove(vl.id, 'yes', 'friends'),
                                        },
                                        {
                                            text: 'Confirm',
                                            css: css + 'background-color:   #1553a1; ',
                                            onClick: () => handleConfirm(vl.id),
                                        },
                                    );
                                } else {
                                    console.log('else');
                                    buttons.push(
                                        {
                                            text: 'Remove',
                                            css: css,
                                            onClick: () => handleRemove(vl.id, 'no'),
                                        },
                                        {
                                            text: 'Add friend',
                                            css: css + ' background-color: #366ab3;',
                                            onClick: () => handleAdd(vl.id),
                                        },
                                    );
                                }
                            }
                        } else {
                            console.log('else');
                            buttons.push(
                                {
                                    text: 'Remove',
                                    css: css,
                                    onClick: () => handleRemove(vl.id, 'no'),
                                },
                                {
                                    text: 'Add friend',
                                    css: css + ' background-color: #366ab3;',
                                    onClick: () => handleAdd(vl.id),
                                },
                            );
                        }
                        return <TagProfile key={vl.id} button={buttons} cssImage={cssImage} data={vl} />;
                    })
                ) : (
                    <DivFlex wrap="wrap">
                        <P css="width:100% ;text-align: center">Không có dữ liệu</P> <ButtonAnimationSurround title="Refetch" onClick={() => refetch()} />
                    </DivFlex>
                )}
                <ButtonAnimationSurround title="Refetch" onClick={() => refetch()} />
            </DivResults>
        </>
    );
};
export default Strangers;
