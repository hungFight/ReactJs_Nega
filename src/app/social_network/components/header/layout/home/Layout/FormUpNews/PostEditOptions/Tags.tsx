import React, { useEffect, useRef, useState } from 'react';
import { CloseI, HashI, PlusI, SearchI, TagPostI } from '~/assets/Icons/Icons';
import { DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, H3, Input, P } from '~/reUsingComponents/styleComponents/styleDefault';
import peopleAPI from '~/restAPI/socialNetwork/peopleAPI';
import { PropsFriends } from '../../../../MakingFriends/Friends';
import Account from '~/social_network/Accoutns/Account';
import ServerBusy from '~/utils/ServerBusy';
import { useDispatch } from 'react-redux';
import CommonUtils from '~/utils/CommonUtils';

const Tags: React.FC = () => {
    const offsetRef = useRef<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
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
                height: 660px;
                background-color: #84848475;
                z-index: 9999;
                top: 42px;
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
                    height: 80%;
                    padding: 5px 0;
                    position: relative;
                    color: white;
                    background-color: #292929;
                    @media (min-width: 400px) {
                        height: 100%;
                        box-shadow: 0 0 3px #60a6c7;
                        border-radius: 5px;
                    }
                `}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
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
                        color: white;
                    `}
                >
                    <HashI /> Hashtag
                    <DivPos size="20px" top="3px" left="10px">
                        <CloseI />
                    </DivPos>
                </H3>
                <Div width="100%" wrap="wrap">
                    <Account data={data} />
                </Div>
            </Div>
        </Div>
    );
};

export default Tags;
