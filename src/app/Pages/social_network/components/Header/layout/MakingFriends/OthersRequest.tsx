import { useEffect, useRef, useState } from 'react';
import { LoadingI } from '~/assets/Icons/Icons';
import peopleAPI from '~/restAPI/socialNetwork/peopleAPI';
import TagProfile from './TagProfile';
import { useDispatch, useSelector } from 'react-redux';
import { DivLoading } from '~/reUsingComponents/styleComponents/styleComponents';
import { DivResults } from './styleMakingFriends';
import { PropsUser } from '~/typescript/userType';

interface PropsOthers {
    avatar: any;
    birthday: string;
    fullName: string;
    gender: number;
    id: string;
    nickName: string | undefined;
}
const Others: React.FC<{ userData: PropsUser }> = ({ userData }) => {
    const dispatch = useDispatch();
    const reload = useSelector((state: { reload: { people: number } }) => state.reload.people);
    const [data, setData] = useState<PropsOthers[]>();

    const [loading, setLoading] = useState<boolean>(false);
    const limit: number = 1;

    const offsetRef = useRef<number>(0);
    const cRef = useRef<number>(0);
    const eleRef = useRef<any>();
    const dataRef = useRef<any>([]);

    async function fetch(rel: boolean) {
        cRef.current = 1;
        if (rel) {
            offsetRef.current = 0;
            dataRef.current = [];
            setLoading(true);
        }

        const res = await peopleAPI.getFriends(dispatch, offsetRef.current, limit, 'others');
        if (res) {
            dataRef.current = [...(dataRef.current ?? []), ...res];
            setData(dataRef.current);
            offsetRef.current += limit;
            setLoading(false);
        }
    }

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = eleRef.current;
        console.log(scrollTop, clientHeight, scrollHeight);

        if (scrollTop + clientHeight >= scrollHeight - 20 && !loading) {
            fetch(false);
        }
    };
    useEffect(() => {
        // if (type === 'otherssent' || cRef.current === 0) fetch(true);
        eleRef.current.addEventListener('scroll', handleScroll);
        return () => {
            eleRef?.current?.removeEventListener('scroll', handleScroll);
        };
    }, [reload]);
    const handleConfirm = async (id: string, kindOf: string = 'friends') => {
        const dataR = await peopleAPI.setConfirm(dispatch, id, kindOf);
        console.log('confirm', kindOf, id);
        refresh(dataR);
        function refresh(res: any) {
            if (res.ok === 1) {
                const newData = data?.filter((x: PropsOthers) => {
                    return x.id !== res.id_fr;
                });
                console.log('newData', newData);
                setData(newData);
            }
        }
    };
    const handleRemove = async (id: string, kindOf?: string) => {
        console.log('deleted', id);
        const dataR = await peopleAPI.delete(dispatch, id, kindOf);
        if (dataR) {
            const newData: any = data?.filter((d: { id: string }) => d.id !== id);
            console.log('delete', dataR);
            setData(newData);
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
            <DivResults id="otherssent" ref={eleRef}>
                {loading && (
                    <DivLoading>
                        <LoadingI />
                    </DivLoading>
                )}

                {data?.map((vl) => {
                    const buttons = [
                        {
                            text: 'Delete',
                            css: css,
                            onClick: () => handleRemove(vl.id, 'friends'),
                        },
                        {
                            text: 'Confirm',
                            css: css + 'background-color:   #1553a1; ',
                            onClick: () => handleConfirm(vl.id),
                        },
                    ];
                    return <TagProfile key={vl.id} button={buttons} cssImage={cssImage} data={vl} />;
                })}
            </DivResults>
        </>
    );
};
export default Others;
