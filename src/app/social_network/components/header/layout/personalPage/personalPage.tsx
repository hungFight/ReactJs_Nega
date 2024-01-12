import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PropsUser, PropsUserPer } from 'src/App';
import PersonalPage from 'src/mainPage/personalPage/PersonalPage';
import { Div } from '~/reUsingComponents/styleComponents/styleDefault';
import userAPI from '~/restAPI/userAPI';
import ServerBusy from '~/utils/ServerBusy';
const Personalpage: React.FC<{
    dataUser: PropsUser;
    setDataUser: React.Dispatch<React.SetStateAction<PropsUser>>;
    setId_chats: React.Dispatch<
        React.SetStateAction<
            {
                id_room?: string;
                id_other: string;
            }[]
        >
    >;
}> = ({ dataUser, setDataUser, setId_chats }) => {
    const [userData, setUsersData] = useState<PropsUserPer[]>([]);
    const handleCheck = useRef<boolean>(false);
    const userOnline = useSelector(
        (state: { userOnlineRD: { userOnline: string[] } }) => state.userOnlineRD.userOnline,
    );
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();

    async function fetchD(ids: string[]) {
        const res: PropsUserPer[] | PropsUser = await userAPI.getById(
            ids,
            {
                id: true,
                avatar: true,
                background: true,
                fullName: true,
                address: true,
                biography: true,
                birthday: true,
                gender: true,
                active: true,
                hobby: true,
                skill: true,
                occupation: true,
                schoolName: true,
                firstPage: true,
                secondPage: true,
                thirdPage: true,
            },
            {
                position: true,
                star: true,
                loverAmount: true,
                friendAmount: true,
                visitorAmount: true,
                followedAmount: true,
                followingAmount: true,
                relationship: true,
                language: true,
                createdAt: true,
                privacy: true,
            },
        );
        const data: typeof res = ServerBusy(res, dispatch);
        console.log('slug', data);
        if (Array.isArray(data)) {
            setUsersData(data);
        }
        setLoading(false);
    }
    useEffect(() => {
        const search = window.location.search;
        if (search) {
            const ids = search.split('id=');
            console.log('2222', ids);
            if (ids.length < 5 && ids.length > 0) {
                fetchD(ids);
            }
        }
    }, []);
    return (
        <Div width="100%" css="overflow: overlay;">
            {userData?.map((data, index, arr) => (
                <PersonalPage
                    AllArray={userData}
                    setUsersData={setUsersData}
                    setUserFirst={setDataUser}
                    userFirst={dataUser}
                    colorBg={1}
                    user={data}
                    online={userOnline}
                    key={index}
                    index={index}
                    leng={arr.length}
                    handleCheck={handleCheck}
                    setId_chats={setId_chats}
                />
            ))}
        </Div>
    );
};

export default Personalpage;
