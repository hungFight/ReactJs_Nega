import React, { useEffect, useRef, useState } from 'react';
import { CloseI, HashI, PlusI, ProfileI, SearchI, TagPostI } from '~/assets/Icons/Icons';
import { DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, H3, Input, P } from '~/reUsingComponents/styleComponents/styleDefault';
import peopleAPI from '~/restAPI/socialNetwork/peopleAPI';
import { PropsFriends } from '../../../../MakingFriends/Friends';
import Account from '~/social_network/Accoutns/Account';
import ServerBusy from '~/utils/ServerBusy';
import { useDispatch, useSelector } from 'react-redux';
import CommonUtils from '~/utils/CommonUtils';
import { InitialStateHideShow, setOpenProfile } from '~/redux/hideShow';

const Tags: React.FC<{ colorText: string; setOnTagU: React.Dispatch<React.SetStateAction<boolean>> }> = ({
    colorText,
    setOnTagU,
}) => {
    const offsetRef = useRef<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const { openProfile } = useSelector((state: { hideShow: InitialStateHideShow }) => state.hideShow);
    const [limit, setLimit] = useState(10);
    const eleRef = useRef<any>();
    const [data, setData] = useState<PropsFriends[]>([]);
    const dataRef = useRef<any>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchFriends() {
            const res: PropsFriends[] = await peopleAPI.getFriends(offsetRef.current, limit, 'friends');
            const dataRes = ServerBusy(res, dispatch);
            dataRes.map((f: { avatar: string | undefined }) => {
                if (f.avatar) {
                    const av = CommonUtils.convertBase64(f.avatar);
                    f.avatar = av;
                }
            });
            if (res) {
                dataRef.current = [...(dataRef.current ?? []), ...dataRes];
                setData(dataRef.current);
                offsetRef.current += limit;
                setLoading(false);
            }
        }
        fetchFriends();
    }, []);
    console.log(data, 'tags');

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = eleRef.current;
        console.log(scrollTop, clientHeight, scrollHeight);

        if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
            //  fetch(false);
        }
    };
    const [hashTag, setHashTag] = useState<string>('');
    return (
        <Div
            css={`
                position: fixed;
                width: 100%;
                height: 100%;
                z-index: ${openProfile.newProfile.length > 0 ? 8 : 9999};
                top: 0px;
                left: 0;
                align-items: center;
                @media (min-width: 400px) {
                    width: 98%;
                    height: 400px;
                    translate: unset;
                    margin-top: 11px;
                    position: unset;
                }
            `}
            onClick={(e) => {
                e.stopPropagation();
            }}
            onTouchStart={(e) => e.stopPropagation()}
        >
            <Div
                width="100%"
                display="block"
                css={`
                    height: 100%;
                    padding: 0 0 5px 0;
                    position: relative;
                    color: white;
                    background-color: #2a2a2a;
                    @media (min-width: 400px) {
                        height: 100%;
                        border-radius: 5px;
                    }
                `}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <Div width="100%" wrap="wrap" css="box-shadow: 0 0 3px #0d0d0d; margin-bottom: 5px">
                    <H3
                        css={`
                            width: 100%;
                            box-shadow: 0px 0px 5px 0px black;
                            justify-content: center;
                            padding: 5px 4px;
                            font-size: 1.4rem;
                            display: flex;
                            align-items: center;
                            position: relative;
                            color: ${colorText};
                        `}
                    >
                        tag
                        <DivPos size="20px" top="5px" left="10px" onClick={() => setOnTagU((pre) => !pre)}>
                            <CloseI />
                        </DivPos>
                    </H3>
                    <Div width="80%" css="margin: auto;">
                        <Input placeholder="Search" color={colorText} />
                    </Div>
                </Div>
                <Div width="100%" wrap="wrap">
                    {data.map((r) => (
                        <Account
                            key={r.id}
                            data={r}
                            Element={
                                <>
                                    <DivPos
                                        top="14.5px"
                                        right="57px"
                                        size="25px"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(setOpenProfile({ newProfile: [r.id], currentId: '' }));
                                        }}
                                    >
                                        <ProfileI />
                                    </DivPos>
                                    <DivPos
                                        top="17px"
                                        right="22px"
                                        width="20px"
                                        css=" border: 2px solid #a7a7a7; border-radius: 3px;"
                                    ></DivPos>
                                </>
                            }
                        />
                    ))}
                </Div>
            </Div>
        </Div>
    );
};

export default Tags;
