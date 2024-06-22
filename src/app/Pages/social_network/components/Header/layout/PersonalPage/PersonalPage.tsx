import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PropsUser, PropsUserPer } from '~/typescript/userType';
import PersonalPage from 'src/mainPage/personalPage/PersonalPage';
import { Div } from '~/reUsingComponents/styleComponents/styleDefault';
import userAPI from '~/restAPI/userAPI';
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
    colorText: string;
}> = ({ dataUser, setDataUser, setId_chats, colorText }) => {
    const [userData, setUsersData] = useState<PropsUserPer[]>([]);
    const handleCheck = useRef<boolean>(false);
    const userOnline = useSelector((state: { userOnlineRD: { userOnline: string[] } }) => state.userOnlineRD.userOnline);
    const [loading, setLoading] = useState<boolean>(false);
    const dispatch = useDispatch();

    async function fetchD(ids: string[]) {
        const res = await userAPI.getById(dispatch, ids);
        if (Array.isArray(res)) {
            setUsersData(res);
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
                    colorText={colorText}
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
                    where="social"
                />
            ))}
        </Div>
    );
};

export default Personalpage;
