import { useEffect, useRef, useState } from 'react';

import { Div } from '~/reUsingComponents/styleComponents/styleDefault';
import TagProfile from './TagProfile';
import peopleAPI from '~/restAPI/socialNetwork/peopleAPI';
import { useCookies } from 'react-cookie';
import { DotI, LoadingI } from '~/assets/Icons/Icons';
import CommonUtils from '~/utils/CommonUtils';
import { useDispatch, useSelector } from 'react-redux';
import { DivResults } from './styleMakingFriends';
import { DivLoading } from '~/reUsingComponents/styleComponents/styleComponents';
import ServerBusy from '~/utils/ServerBusy';
interface PropsData {
    avatar: any;
    birthday: string;
    fullName: string;
    gender: number;
    id: string;
    userRequest:
        | {
              id: number;
              idRequest: string;
              idIsRequested: string;
              level: number;
              createdAt: string;
              updatedAt?: string;
          }[]
        | [];
    userIsRequested:
        | {
              id: number;
              idRequest: string;
              idIsRequested: string;
              level: number;
              createdAt: string;
              updatedAt?: string;
          }[]
        | [];
}
const Strangers: React.FC<{
    type: string;
    cRef: React.MutableRefObject<number>;
}> = ({ type = 'strangers', cRef }) => {
    const dispatch = useDispatch();
    const [data, setData] = useState<PropsData[] | undefined>();
    const reload = useSelector((state: { reload: { people: number } }) => state.reload.people);

    const [cookies, setCookies] = useCookies(['tks', 'k_user']);
    const [loading, setLoading] = useState<boolean>(false);
    const offsetRef = useRef<number>(0);
    const limit: number = 3;
    const userId = cookies.k_user;
    const eleRef = useRef<any>();
    const dataRef = useRef<any>([]);

    const fetch = async (rel: string) => {
        cRef.current = 1;
        if (rel) {
            dataRef.current = [];
            cRef.current = 3;
            setLoading(true);
        }

        const res = await peopleAPI.getStrangers(limit, rel);
        const dataR = ServerBusy(res, dispatch);

        console.log(dataRef.current.length, rel, 'strangers', dataR);
        dataRef.current = [...(dataRef.current ?? []), ...dataR];
        if (!rel) {
            setData(dataRef.current);
            offsetRef.current += limit;
        } else {
            setData(dataR);
            setLoading(false);
        }
        cRef.current = 1;
        console.log(dataRef.current, rel, 'data', cRef);
    };

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = eleRef.current;
        console.log(scrollTop, clientHeight, scrollHeight);

        if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
            console.log(cRef.current);
            if (cRef.current !== 3) fetch('');
        }
    };
    useEffect(() => {
        console.log(cRef, 'cRef');

        if (type === 'strangers' && cRef.current === 0) {
            fetch('ok');
        } else {
            fetch('');
        }
        eleRef.current.addEventListener('scroll', handleScroll);
        return () => {
            eleRef.current?.removeEventListener('scroll', handleScroll);
        };
    }, [reload]);

    const handleAdd = async (id: string, kindOf: string = 'friend') => {
        const res: {
            id_friend: string;
            data: {
                createdAt: string;
                id: 79;
                idIsRequested: string;
                idRequest: string;
            };
        } = await peopleAPI.setFriend(id);
        const dataR: typeof res = ServerBusy(res, dispatch);

        const newStranger = data?.filter((x: PropsData) => {
            if (x.id === dataR.data.idIsRequested) {
                x.userRequest[0] = {
                    id: dataR.data.id,
                    idRequest: dataR.data.idRequest,
                    idIsRequested: dataR.data.idIsRequested,
                    createdAt: dataR.data.createdAt,
                    level: 1,
                };
                return x;
            } else {
                return x;
            }
        });
        setData(newStranger);
    };
    const handleAbolish = async (id: string, kindOf: string = 'friends') => {
        const res: {
            ok: {
                createdAt: string;
                id: number;
                idIsRequested: string;
                idRequest: string;
                level: number;
                updatedAt: string;
            };
        } = await peopleAPI.delete(id, kindOf);
        const dataR: typeof res = ServerBusy(res, dispatch);

        if (dataR) {
            const newStranger = data?.filter((x: PropsData) => {
                if (
                    (x.userRequest.length || x.userIsRequested.length) &&
                    ((x.userRequest[0].idRequest === dataR.ok.idRequest && x.userRequest[0].idIsRequested === dataR.ok.idIsRequested) ||
                        (x.userRequest[0].idIsRequested === dataR.ok.idRequest && x.userRequest[0].idRequest === dataR.ok.idIsRequested) ||
                        (x.userIsRequested[0].idRequest === dataR.ok.idRequest && x.userIsRequested[0].idIsRequested === dataR.ok.idRequest) ||
                        (x.userIsRequested[0].idRequest === dataR.ok.idRequest && x.userIsRequested[0].idIsRequested === dataR.ok.idIsRequested))
                ) {
                    x.userRequest = [];
                    x.userIsRequested = [];
                    return x;
                } else {
                    return x;
                }
            });
            setData(newStranger);
        }
    };
    const handleMessenger = (id: string) => {
        console.log('messenger', id);
    };
    const handleConfirm = async (id: string, kindOf: string = 'friends') => {
        const res = await peopleAPI.setConfirm(id, kindOf);
        const dataR = ServerBusy(res, dispatch);
        refresh(dataR);
        function refresh(res: any) {
            if (res.ok === 1) {
                const newStranger = data?.filter((x: PropsData) => {
                    if (
                        (x.userRequest[0].idRequest === res.id_fr && x.userRequest[0].idIsRequested === userId) ||
                        (x.userIsRequested[0].idRequest === res.id_fr && x.userIsRequested[0].idIsRequested === userId)
                    ) {
                        if (x.userRequest[0].level) x.userRequest[0].level = 2;
                        if (x.userIsRequested[0].level) x.userIsRequested[0].level = 2;
                        return x;
                    } else {
                        return x;
                    }
                });
                setData(newStranger);
            }
        }
    };
    const handleRemove = async (id: string, of: string = 'yes', kindOf?: string) => {
        if (of === 'no' && id) {
            const newData: any = data?.filter((d: { id: string }) => d.id !== id);
            setData(newData);
            console.log('newData', newData);
        } else {
            console.log('deleted', id);
            const res = await peopleAPI.delete(id, kindOf);
            const dataR = ServerBusy(res, dispatch);
            if (dataR) {
                const newData: any = data?.filter((d: { id: string }) => d.id !== id);
                setData(newData);
            }
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
                {loading && (
                    <DivLoading>
                        <LoadingI />
                    </DivLoading>
                )}

                {data?.map((vl) => {
                    const buttons = [];
                    const idU = vl.userIsRequested[0]?.idRequest || vl.userRequest[0]?.idRequest;
                    const idFr = vl.userRequest[0]?.idIsRequested || vl.userIsRequested[0]?.idIsRequested;
                    const level = vl.userIsRequested[0]?.level || vl.userRequest[0]?.level;

                    if (level === 2 || level === 2) {
                        buttons.push({
                            text: 'Messenger',
                            css: css + ' background-color: #366ab3; ',
                            onClick: () => handleMessenger(vl.id),
                        });
                    } else {
                        if (idU === userId) {
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
                        } else if (idFr === userId) {
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

                    return (
                        <Div
                            key={vl.id}
                            wrap="wrap"
                            css={`
                                width: 185px;
                                padding: 5px;
                                border: 1px solid #414141;
                                margin: 10px;
                                transition: all 0.2s linear;
                                position: relative;
                                &:hover {
                                    box-shadow: 0 0 8px #6a48bc;
                                }
                                @media (min-width: 480px) {
                                    width: 306px;
                                }
                                @media (min-width: 769px) {
                                    width: 190px;
                                    height: fit-content;
                                    flex-wrap: wrap;
                                    justify-content: center;
                                    text-align: center;
                                    background-color: #292a2c;
                                    box-shadow: 0 0 5px #7b797987;
                                    border-radius: 5px;
                                    padding: 0 0 12px;
                                }
                            `}
                        >
                            <Div
                                css={`
                                    position: absolute;
                                    right: 9px;
                                    font-size: 20px;
                                `}
                            >
                                <DotI />
                            </Div>
                            <TagProfile button={buttons} cssImage={cssImage} data={vl} />
                        </Div>
                    );
                })}
            </DivResults>
        </>
    );
};
export default Strangers;
