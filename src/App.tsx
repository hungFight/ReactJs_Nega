import { useDispatch, useSelector } from 'react-redux';
import { InitialStateHideShow, offAll, onPersonalPage, setIdUser } from './app/redux/hideShow';

import Personalpage from './mainPage/personalPage/personalPage';
import { login } from './dataMark/dataLogin';
import { register } from './dataMark/dataRegister';
import { useCookies } from 'react-cookie';
import React, { Suspense, useEffect } from 'react';
import searchAPI from '~/restAPI/requestServers/socialNetwork/searchAPI_SN';
import { DivContainer } from '~/reUsingComponents/styleComponents/styleComponents';
import styled from 'styled-components';
import { Div } from '~/reUsingComponents/styleComponents/styleDefault';
import Progress from '~/reUsingComponents/Progress/Progress';

const Authentication = React.lazy(() => import('~/Authentication/Auth'));
const Website = React.lazy(() => import('./mainPage/nextWeb'));

function App() {
    const dispatch = useDispatch();
    const { setting, personalPage } = useSelector((state: any) => state.hideShow);
    const user = useSelector((state: { hideShow: InitialStateHideShow }) => state.hideShow?.idUser);
    useEffect(() => {
        if (user.length > 0) dispatch(onPersonalPage());
    }, [user]);
    const handleClick = (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        dispatch(offAll());
        dispatch(setIdUser([]));
    };
    const [cookies, setCookie] = useCookies(['tks', 'k_user', 'sn']);
    //   document.cookie.addListener("change", (event) => {
    //   console.log("1 change event");
    // });

    const token = cookies.tks;
    const k_user = cookies.k_user;
    // const operatingSystem = {
    //     name: 'Ubuntu',
    //     version: 18.04,
    //     license: 'Open Source',
    // };
    // // const news = Object.freeze(operatingSystem);
    // // Get the object key/value pairs
    // console.log((operatingSystem.name = 'hello world'));
    // console.log(operatingSystem);
    // const employees = ['Ron', 'April', 'Andy', 'Leslie'];

    // console.log(Object.getPrototypeOf(employees));
    useEffect(() => {
        //seach on the url of web add profile?id=id
        const search = async () => {
            const search = window.location.search;
            if (search) {
                const id = search.split('id=');
                console.log('id', id);

                if (id.length < 4 && id.length > 0) {
                    const arrayData = [];
                    for (let i = 1; i < id.length; i++) {
                        const res = await searchAPI.user(id[i], cookies.tks);
                        console.log(res, 'sss');

                        if (res.status === 1) {
                            arrayData.push(res.data);
                        }
                    }
                    if (arrayData.length > 0) {
                        dispatch(setIdUser(arrayData));
                        dispatch(onPersonalPage());
                    }
                }
            } else {
                dispatch(setIdUser([]));
                dispatch(offAll());
            }
        };
        search();
    }, []);

    // const home = {
    //     id: 0,
    //     name: 'hung',
    //     avatar: 'url',
    //     image: 'images',
    //     dis: '...',
    //     feel: {
    //         like: '1',
    //         love: '5',
    //     },
    //     comment: [
    //         {
    //             id: 1 - 0,
    //             name: 'hung',
    //             avatar: 'url',
    //             reply: [
    //                 {
    //                     id: 2 - 1,
    //                     content: '...',
    //                     reply: [
    //                         {
    //                             id: 3 - 2,
    //                             name: 'han',
    //                             avatar: 'url',
    //                             reply: [
    //                                 {
    //                                     id: 1 - 3,
    //                                     content: '...',
    //                                     reply: [
    //                                         {
    //                                             id: 4,
    //                                             name: 'han',
    //                                             avatar: 'url',
    //                                             reply: [{ content: '...' }],
    //                                         },
    //                                     ],
    //                                 },
    //                                 {
    //                                     id: 3 - 1,
    //                                     content: '...',
    //                                 },
    //                                 { content: '...' },
    //                             ],
    //                         },
    //                         {
    //                             id: 2 - 3,
    //                             name: 'han',
    //                             avatar: 'url',
    //                             reply: [{ content: '...' }],
    //                         },
    //                         {
    //                             id: 2 - 2,
    //                             content: '...',
    //                         },
    //                         {
    //                             id: 1 - 2,
    //                             content: '...',
    //                         },
    //                         {
    //                             id: 2 - 1,
    //                             content: '...',
    //                         },
    //                     ],
    //                 },
    //                 {
    //                     id: 3 - 1,
    //                     content: '...',
    //                 },
    //                 {
    //                     id: 1 - 2,
    //                     content: '...',
    //                 },
    //                 {
    //                     id: 1 - 3,
    //                     content: '...',
    //                 },
    //                 {
    //                     id: 2 - 2,
    //                     content: '...',
    //                 },
    //             ],
    //         },
    //         {
    //             id: 6,
    //             name: 'han',
    //             avatar: 'url',
    //             comment: [
    //                 {
    //                     content: '...',
    //                     reply: {},
    //                 },
    //                 {
    //                     content: '...',
    //                 },
    //                 {
    //                     content: '...',
    //                 },
    //             ],
    //         },
    //     ],
    // };
    // console.log(Math.round(Math.random() * 9573), 'heress');
    const leng = user?.length;
    const css = `
        position: fixed;
        right: 0;
        bottom: 0;
        z-index: 11;
        overflow-y: overlay;

`;
    const css2 = `
    min-width: 100%;
    height: var(--full);
    overflow-y: overlay;
     @media (min-width: 1100px){
        min-width: ${100 / leng + '%;'}
    }
    @media (max-width: 600px){
        min-width: 100%;
    }
        .personalPage{
            width: var(--full);
            height: auto;
            border-left: 1px solid;
            border-right: 1px solid;
        }
        .fullName{
            margin-bottom: 16px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: start;
            text-align: start;
            margin-left: 16px;
            @media (min-width: 600px){
                margin-bottom: 20px;
            }
        }
        .avatar{
            min-width: 80px;
            height: 80px;
            border-radius: 50%;
            padding: 5px;
            box-shadow: 0 0 1px var(--color-dark);
            background-color: rgb(231 62 62 / 67%);
            @media (min-width: 600px){
                min-width: ${150 / (leng > 1 ? leng - 0.5 : leng) + 'px;'}
                height: ${150 / (leng > 1 ? leng - 0.5 : leng) + 'px;'}
            }@media (min-width: 1000px){
                min-width: ${150 / (leng > 1 ? leng - 0.7 : leng) + 'px;'}
                height: ${150 / (leng > 1 ? leng - 0.7 : leng) + 'px;'}
            }
        }
        .background{
            width: 90%;
            height: 230px;
            margin: 15px auto;
            border-radius: 5px;
            background-color: rgb(200 200 200);
            img {
                border-radius: 5px;
            }
            @media (min-width: 400px){
                 height: 270px;
            }
            @media (min-width: 600px){
                  height: ${300 / (leng > 1 ? leng - 0.7 : leng) + 'px'};
            }
            @media (min-width: 769px){
                  height: ${400 / (leng > 1 ? leng - 0.7 : leng) + 'px'};
            }
            @media (min-width: 1201px){
                  height: ${500 / (leng > 1 ? leng - 0.7 : leng) + 'px'};
            }
        }

`;
    const DivOpacity = styled.div`
        width: 100%;
        height: 100%;
        position: fixed;
        background-color: #686767a1;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
    `;

    if (token && k_user) {
        return (
            <Suspense
                fallback={
                    <Progress
                        title={{
                            vn: 'Đang tải dữ liệu...',
                            en: 'loading data...',
                        }}
                    />
                }
            >
                <Website />
                {(setting || personalPage) && <DivOpacity onClick={handleClick} />}
                {/* <Message />  */}
                {user?.length > 0 && (
                    <DivContainer width="80%" height="100%" css={css} bg="#fff" content="start" display="flex">
                        {user?.map((data: any, index: number) => (
                            <Personalpage user={data} key={index} css={css2} />
                        ))}
                    </DivContainer>
                )}
            </Suspense>
        );
    }
    return (
        <Suspense
            fallback={
                <Progress
                    title={{
                        vn: 'Vui lòng chờ trong giây lát để thệ thông cập nhật thông tin cho bạn. Xin cảm ơn đã sử dụng dịch vụ của chúng tôi!',
                        en: 'Please wait a while to update your information. Thank you for using our services!',
                    }}
                />
            }
        >
            <Authentication
                dataLogin={{ EN: login.EN, VN: login.VN }}
                dataRegister={{ VN: register.VN, EN: register.EN }}
            />
        </Suspense>
    );
}

export default App;
