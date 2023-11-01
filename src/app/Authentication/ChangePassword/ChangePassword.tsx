/* eslint-disable array-callback-return */
import { DivChangePass } from './styleChangePassword';
import { DivAccount } from '../Login/styleLogin';
import { ButtonSubmit, Hname, Htitle } from '~/reUsingComponents/styleComponents/styleComponents';
import Eyes from '~/reUsingComponents/Eys/Eye';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Div, Input, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { Pmessage } from '../Register/styleRegister';
import accountRequest from '~/restAPI/accounAPI';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { PropsAccount, PropsChangeP } from './typeChangePassword';
import { useQuery } from '@tanstack/react-query';
import { PropsBgRD } from '~/redux/background';
import { useDispatch, useSelector } from 'react-redux';
import ServerBusy from '~/utils/ServerBusy';
import { useCookies } from 'react-cookie';

const ChangePassword: React.FC<PropsChangeP> = ({ phoneMail, Next, setWhatKind, setEnable }) => {
    const dispatch = useDispatch();
    const { colorBg, colorText } = useSelector((state: PropsBgRD) => state.persistedReducer.background);

    const [id, setId] = useState<string>('');
    const [messageStatus, setMessageStatus] = useState<{ status: boolean; message: string }>({
        status: false,
        message: '',
    });
    const [success, setSuccess] = useState<boolean>(false);
    const [show1, setShow1] = useState<{ icon: boolean; check: number }>({ icon: false, check: 1 });
    const [show2, setShow2] = useState<{ icon: boolean; check: number }>({ icon: false, check: 1 });
    const [value1, setValue1] = useState<string>('');
    const [value2, setValue2] = useState<string>('');

    const valueRef = useRef<{ value1: boolean; value2: boolean }>({
        value1: false,
        value2: false,
    });
    const messageRef = useRef<{ value1: boolean; value2: boolean }>({ value1: false, value2: false });
    const [checkValue, setCheckValue] = useState<{ value1: boolean; value2: boolean; message: string }>({
        value1: false,
        value2: false,
        message: '',
    });
    const handleInputChangeP1 = (e: { target: { value: string } }) => {
        setValue1(e.target.value);
        valueRef.current.value1 = false;
        if (e.target.value) {
            setShow1({ ...show1, icon: true });
        } else {
            setShow1({ ...show1, icon: false });
        }
        if (e.target.value === value2) {
            console.log('sdw');
            setCheckValue({ value1: valueRef.current.value1, value2: false, message: '' });
        } else {
            setCheckValue({
                value1: valueRef.current.value1,
                value2: false,
                message: 'The Password is Incorrect!',
            });
        }
    };
    const handleInputChangeP2 = (e: { target: { value: string } }) => {
        setValue2(e.target.value);
        valueRef.current.value2 = false;
        setShow2({ ...show2, icon: true });
        if (e.target.value === value1) {
            setCheckValue({ ...checkValue, value2: valueRef.current.value2, message: '' });
        } else {
            setCheckValue({ ...checkValue, value2: valueRef.current.value2, message: 'The Password is Incorrect!' });
        }
        if (e.target.value === '') {
            setShow2({ ...show2, icon: false });
        }
    };
    const type = ['text', 'password'];
    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (!success) {
            if (value1 && value2) {
                if (!checkValue.value1 && !checkValue.value2) {
                    if (value1.length > 5) {
                        if (value1 === value2) {
                            console.log('ok');
                            const params = {
                                id,
                                password: value1,
                            };
                            const res = await accountRequest.changePassword(params);
                            const data = ServerBusy(res, dispatch);

                            console.log(data);

                            if (data?.status === 1 || data?.status === 3) {
                                if (data?.status === 1) setSuccess(true);
                                setMessageStatus({ status: data.status === 1 ? true : false, message: data.message });
                            } else {
                                window.location.reload();
                            }
                        } else {
                            setCheckValue({
                                ...checkValue,
                                value2: true,
                                message: 'The Passwords 1 and 1 are incorrect!',
                            });
                        }
                    } else {
                        setCheckValue({
                            ...checkValue,
                            message: 'The length Password must than 6 character!',
                        });
                    }
                }
            }
            messageRef.current.value1 = !value1 ? true : false;
            messageRef.current.value2 = !value2 ? true : false;
            const mes = value1.length > 5 ? '' : 'The length Password must than 6 character!';
            setCheckValue({ ...messageRef.current, message: mes || checkValue.message });
        }
    };
    const params = { phoneMail: phoneMail };
    const { data, isLoading } = useQuery({
        queryKey: ['changePassword', 1],
        enabled: phoneMail ? true : false,
        queryFn: () => accountRequest.getPhoneMail(params),
    });
    console.log(data, isLoading, params);
    const datas: PropsAccount[] | undefined = ServerBusy(data, dispatch);

    const handleChangePass = useCallback((id: string) => {
        setId(id);
    }, []);
    useEffect(() => {
        if (success) {
            const time = setTimeout(() => {
                setWhatKind('');
                setEnable(false);
            }, 2000);
            return () => clearTimeout(time);
        }
    }, [success]);
    return (
        <>
            <form action="" onSubmit={handleSubmit}>
                <DivChangePass>
                    <Htitle>Change Password</Htitle>
                    {datas?.map((data) => {
                        if (data.id === id)
                            return (
                                <div key={data.id}>
                                    <Div css="justify-content: center;">
                                        <Div
                                            wrap="wrap"
                                            css="width: 183px; height: 150px; margin: 5px 15px; justify-content: center; color: #cbcbcb;background-color: #454646; background-image: linear-gradient(177deg, #789382, #4e4242);"
                                        >
                                            <Avatar
                                                css="width: 100px; height: 100px;"
                                                src={data.avatar}
                                                alt={data.fullName}
                                                gender={data.gender}
                                                onClick={handleChangePass}
                                            />
                                            <Div width="100%">
                                                <Hname>{data.fullName}</Hname>
                                                <P>{data.nickName}</P>
                                            </Div>
                                        </Div>
                                    </Div>
                                    <DivAccount>
                                        <Input
                                            type={type[show1.check]}
                                            placeholder="Enter New Password"
                                            onChange={handleInputChangeP1}
                                            color={checkValue.value1 ? 'rgb(255 97 97 / 83%)' : colorText}
                                        />
                                        <Eyes value={value1} setShow={setShow1} show={show1} top="15px" />
                                        <Input
                                            type={type[show2.check]}
                                            placeholder="Enter Repeat New Password"
                                            onChange={handleInputChangeP2}
                                            color={checkValue.value2 ? 'rgb(255 97 97 / 83%)' : colorText}
                                        />
                                        <Pmessage
                                            color={messageStatus.status ? ' rgb(124, 245, 122)' : 'rgb(255, 142, 142)'}
                                        >
                                            {checkValue.message || messageStatus.message}
                                        </Pmessage>
                                        <Eyes value={value2} setShow={setShow2} show={show2} top="73px" />
                                    </DivAccount>
                                    <ButtonSubmit title="Change" />
                                </div>
                            );
                    })}
                    {Next}
                </DivChangePass>
            </form>

            <Div css="justify-content: center; margin: auto">
                {datas?.map((data) => (
                    <Div
                        key={data.id}
                        wrap="wrap"
                        css="width: 183px; height: 150px;margin: 5px 15px; cursor: pointer; text-align: center; justify-content: center; color: #cbcbcb;background-color: #454646; background-image: linear-gradient(177deg, #789382, #4e4242);"
                        onClick={() => handleChangePass(data.id)}
                    >
                        <Avatar
                            css="width: 100px; height: 100px;"
                            src={data.avatar}
                            alt={data.fullName}
                            gender={data.gender}
                        />
                        <Div width="100%" wrap="wrap" css="justify-content: center;">
                            <Hname>{data.fullName}</Hname>
                            <P z="1.2rem">{data.nickName}</P>
                        </Div>
                    </Div>
                    // <TagProfle
                    //     cssImage="width: 100px"
                    //     data={data}
                    //     key={data.id}
                    //     onClick={handleChangePass}
                    //     button={[
                    //         { text: 'Hide', css: '' },
                    //         { text: 'Show', css: 't' },
                    //     ]}
                    //     margin="5px"
                    //     bg="#595959e0"
                    // />
                ))}
            </Div>
        </>
    );
};
export default ChangePassword;
