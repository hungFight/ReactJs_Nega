import React, { useRef, useState, ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PropsUser, PropsUserPer } from 'src/App';
import {
    BirthI,
    CloseI,
    FriendI,
    GenderFemaleI,
    GenderMaleI,
    GenderOtherI,
    HeartMI,
    HobbyI,
    LanguageI,
    LocationI,
    PeopleI,
    SchoolI,
    StarI,
    StrengthI,
    WorkingI,
} from '~/assets/Icons/Icons';
import { ButtonSubmit, DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, Input, P, Span } from '~/reUsingComponents/styleComponents/styleDefault';
import authAPI from '~/restAPI/authAPI/authAPI';
import userAPI from '~/restAPI/userAPI';
import CommonUtils from '~/utils/CommonUtils';
import Gender from '~/utils/Gender';
import handleFileUpload from '~/utils/handleFileUpload';
import Cookies from '~/utils/Cookies';
import { useCookies } from 'react-cookie';

const LogicTitle = (
    colorText: string,
    data: PropsUserPer,
    resTitle: {
        star: number;
        love: number;
        visitor: number;
        followed: number;
        following: number;
    },
    id_loved: string,
    editTitle: boolean,
    setEditTitle: React.Dispatch<React.SetStateAction<boolean>>,
    setUserFirst: React.Dispatch<React.SetStateAction<PropsUser | undefined>>,
    setUsersData: React.Dispatch<React.SetStateAction<PropsUserPer[]>>,
) => {
    const { mores } = data;
    const dispatch = useDispatch();
    const [_, setCookies] = useCookies();

    const [src, setSrc] = useState<{ type: string; file: string }[]>([]);
    const srcUp = useRef<{ file: Blob; type: string }[]>([]);
    const [login, setLogin] = useState<{ userName: string; password: string }>({ userName: '', password: '' });

    const [valUpdate, setValUpdate] = useState<{
        key: string;
        value: string;
    }>();
    const [userData, setUserData] = useState<
        | {
              account: {
                  id: string;
                  fullName: string;
                  avatar: string | null;
                  gender: number;
                  phoneNumberEmail: string;
              };
          }[]
    >(data.accountUser);
    const [error, setError] = useState<null | undefined | string>();
    const [showPass, setShowPass] = useState<{ icon: boolean; check: number }>({ icon: false, check: 1 });
    const [editValue, setEditValue] = useState<number | string | undefined>();
    const [position, setPosition] = useState<number>(0); // show interacts

    const offset = useRef<number>(0);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const limit = 2;

    const [loading, setLoading] = useState<boolean>(false);
    const [subAccount, setSubAccount] = useState<boolean>(false);
    const [pass, setPass] = useState<{ id: string; kind: string; val: string }>();
    const { userId } = Cookies();
    const itemsT: { icon: React.ReactElement; key: number; qt: number; css?: string | undefined }[] = [
        { icon: <StarI />, key: 1, qt: mores[0].star },
        {
            icon: <HeartMI />,
            css: id_loved === userId ? 'color: #c73434 !important' : '',
            key: 2,
            qt: resTitle.love || mores[0].loverAmount,
        },
        { icon: <FriendI />, key: 3, qt: mores[0].friendAmount },
        { icon: <PeopleI />, key: 4, qt: mores[0].visitorAmount },
    ];
    const itemsP = [
        { icon: 'Followed', key: 5, qt: mores[0].followedAmount },
        { icon: 'Following', key: 6, qt: mores[0].followingAmount },
    ];
    const itemMemoryBar = [
        { id: 1, name: 'Post' },
        { id: 2, name: 'Photos' },
        { id: 3, name: 'Videos' },
    ];
    const handlePosition = async (id: number) => {
        const res = await userAPI.getMore(offset.current, limit);

        setPosition(id);
    };
    const handleAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files;
        if (file) {
            const { getFilesToPre, upLoad } = await handleFileUpload(file, 10, 8, 10, dispatch);
            setSrc(getFilesToPre);
            srcUp.current = upLoad;
        }
    };
    const ob = {
        address: { val: data.address, placeholder: 'Address', icon: <LocationI />, length: 240 },
        gender: { val: Gender(data.gender).string, placeholder: 'Gender', icon: <GenderMaleI />, length: 1 },
        birthday: { val: data.birthday, placeholder: 'Birthday', icon: <BirthI />, length: 10 },
        relationship: { val: mores[0].relationship, placeholder: 'Relationship', icon: <HeartMI />, length: 20 },
        occupation: { val: data.occupation, placeholder: 'Occupation', icon: <WorkingI />, length: 95 },
        schoolName: { val: data.schoolName, placeholder: 'School Name', icon: <SchoolI />, length: 95 },
    };
    const ar = {
        hobby: { val: data.hobby ?? [], placeholder: 'Hobbies', icon: <HobbyI />, subVal: '' },
        skill: { val: data.skill ?? [], placeholder: 'Skills', icon: <StrengthI />, subVal: '' },
        language: { val: mores[0].language ?? [], placeholder: 'Languages', icon: <LanguageI />, subVal: '' },
    };
    const [ObjectRender, setObjectRender] = useState<{
        [address: string]: { val: string; placeholder: string; icon: ReactElement; length: number };
        gender: { val: string; placeholder: string; icon: ReactElement; length: number };
        birthday: { val: string; placeholder: string; icon: ReactElement; length: number };
        relationship: { val: string; placeholder: string; icon: ReactElement; length: number };
        occupation: { val: string; placeholder: string; icon: ReactElement; length: number };
        schoolName: { val: string; placeholder: string; icon: ReactElement; length: number };
    }>(ob);
    const [ArrayRender, setArrayRender] = useState<{
        [hobby: string]: { val: string[]; placeholder: string; icon: ReactElement; subVal: string };
        skill: { val: string[]; placeholder: string; icon: ReactElement; subVal: string };
        language: { val: string[]; placeholder: string; icon: ReactElement; subVal: string };
    }>(ar);

    console.log('title', data, ArrayRender, ObjectRender);

    const renderInfo = (res: string, placeholder: string, icon: ReactElement, key: string, length: number) => {
        return (
            <Div
                key={key}
                width="100%"
                css={`
                    align-items: center;
                    font-size: 18px;
                    margin-bottom: 4px;
                    position: relative;
                    ${editTitle ? 'cursor: var(--pointer);' : ''}
                    &:hover {
                        ${editTitle ? 'transition: all 0.5s linear; padding-left: 3px; border-radius: 5px;' : ''}
                    }
                `}
                onClick={() => {
                    if (editTitle) {
                        setError(undefined);
                        if (editValue === key) {
                            setEditValue(undefined);
                        } else {
                            setEditValue(key);
                        }
                    }
                }}
            >
                <Div
                    width="20px"
                    css={`
                        margin-right: 2px;
                        position: relative;
                        ${ObjectRender[key].val === 'Female'
                            ? 'color: #c36aca'
                            : ObjectRender[key].val === 'Male'
                            ? 'color: #5397c7;'
                            : ObjectRender[key].val === 'Other'
                            ? 'color: #4e9c8b;'
                            : ''};
                        ${editValue === key && editTitle && key !== 'gender'
                            ? 'position: absolute; top: 37px; z-index: 1;'
                            : ''}
                    `}
                >
                    {icon}
                </Div>
                {editValue === key && editTitle ? (
                    <Div width="100%" css="align-items: center;" onClick={(e) => e.stopPropagation()}>
                        {key !== 'gender' ? (
                            <>
                                <Div width="75%" css="position: relative;">
                                    <Input
                                        type="text"
                                        width="100%"
                                        placeholder={res || placeholder}
                                        color={colorText}
                                        value={ObjectRender[key].val ?? ''}
                                        onChange={(e) => {
                                            if (e.target.value.length <= length) {
                                                setObjectRender({
                                                    ...ObjectRender,
                                                    [key]: { ...ObjectRender[key], val: e.target.value },
                                                });
                                            }
                                        }}
                                    />
                                    <DivPos size="1.3rem" right="10px" top="18.5px">
                                        {ObjectRender[key].val?.length ?? 0}
                                        {'/' + length}
                                    </DivPos>
                                </Div>
                                <ButtonSubmit
                                    title="As I want"
                                    css="margin: 0; width: 20%;"
                                    onClick={() => setEditValue(undefined)}
                                />
                            </>
                        ) : (
                            <>
                                <P
                                    z="1.4rem"
                                    css="padding: 5px 10px; margin: 0 3px; background-image: linear-gradient(75deg, #1b1b1b, #3c3b3b); border-radius: 20px;"
                                    onClick={() => {
                                        setObjectRender({
                                            ...ObjectRender,
                                            [key]: { ...ObjectRender[key], val: 'Male', icon: <GenderFemaleI /> },
                                        });
                                        setEditValue(undefined);
                                    }}
                                >
                                    Male
                                </P>
                                <P
                                    z="1.4rem"
                                    css="padding: 5px 10px; margin: 0 3px; background-image: linear-gradient(75deg,#854c88,#3c3b3b); border-radius: 20px;"
                                    onClick={() => {
                                        setObjectRender({
                                            ...ObjectRender,
                                            [key]: { ...ObjectRender[key], val: 'Female', icon: <GenderMaleI /> },
                                        });
                                        setEditValue(undefined);
                                    }}
                                >
                                    Female
                                </P>
                                <P
                                    z="1.4rem"
                                    css="padding: 5px 10px; margin: 0 3px; background-image: linear-gradient(75deg,#2a8076,#702323); border-radius: 20px;"
                                    onClick={() => {
                                        setObjectRender({
                                            ...ObjectRender,
                                            [key]: { ...ObjectRender[key], val: 'Other', icon: <GenderOtherI /> },
                                        });
                                        setEditValue(undefined);
                                    }}
                                >
                                    Other
                                </P>
                            </>
                        )}
                    </Div>
                ) : (
                    <>
                        <P css="font-size: 1.4rem; margin-top: 2.5px;">{res || placeholder}</P>
                        {editTitle && (
                            <DivPos
                                right="0"
                                css="padding: 6px;"
                                onClick={(e: { stopPropagation: () => void }) => e.stopPropagation()}
                            ></DivPos>
                        )}
                    </>
                )}
            </Div>
        );
    };
    let check = false;
    if (data.address !== ObjectRender.address?.val) {
        check = true;
    }
    if (data.birthday !== ObjectRender.birthday?.val) {
        check = true;
    }
    if (data.occupation !== ObjectRender.occupation?.val) {
        check = true;
    }
    if (data.gender !== Gender(ObjectRender.gender?.val).number) {
        check = true;
    }
    if (data.schoolName !== ObjectRender.schoolName?.val) {
        check = true;
    }
    if (JSON.stringify(data.hobby) !== JSON.stringify(ArrayRender.hobby?.val)) {
        check = true;
    }
    if (JSON.stringify(data.skill) !== JSON.stringify(ArrayRender.skill?.val)) {
        check = true;
    }
    if (JSON.stringify(mores[0].language) !== JSON.stringify(ArrayRender.language?.val)) {
        check = true;
    }
    if (mores[0].relationship !== ObjectRender.relationship?.val) {
        check = true;
    }
    useEffect(() => {
        setObjectRender(ob);
        setArrayRender(ar);
        setUserData(data.accountUser);
    }, [data]);
    const renderArrayInfo = (res: string[], placeholder: string, icon: ReactElement, key: string) => {
        return (
            <Div
                key={key}
                width="100%"
                css={`
                    align-items: center;
                    font-size: 20px;
                    margin-bottom: 4px;
                    position: relative;
                    ${editTitle ? 'cursor: var(--pointer);' : ''}
                    &:hover {
                        ${editTitle ? 'transition: all 0.5s linear; padding-left: 3px; border-radius: 5px;' : ''}
                    }
                `}
                onClick={() => {
                    if (editTitle) {
                        setError(undefined);
                        if (editValue === key) {
                            setEditValue(undefined);
                        } else {
                            setEditValue(key);
                        }
                    }
                }}
            >
                <Div
                    width="20px"
                    css={`
                        margin-right: 2px;
                        ${editValue === key && editTitle ? 'position: absolute; top: 37px;' : ''}
                    `}
                >
                    {icon}
                </Div>
                {editValue === key && editTitle ? (
                    <Div
                        width="100%"
                        wrap="wrap"
                        css="align-items: center; border-bottom: 1px solid #517ea1;"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Div width="100%" css="align-items: center;">
                            <Input
                                ref={inputRef}
                                type="text"
                                className={'resetKeyss:' + key}
                                width="75%"
                                placeholder={placeholder}
                                color={colorText}
                                value={ArrayRender[key].subVal}
                                onChange={(e) => {
                                    setArrayRender({
                                        ...ArrayRender,
                                        [key]: {
                                            ...ArrayRender[key],
                                            subVal: e.target.value,
                                        },
                                    });
                                }}
                            />
                            <ButtonSubmit
                                title="Apply"
                                css="margin: 0; width: 20%;"
                                onClick={() => {
                                    if (
                                        !ArrayRender[key].val.some((s) => s === ArrayRender[key].subVal) &&
                                        ArrayRender[key].subVal
                                    ) {
                                        setArrayRender({
                                            ...ArrayRender,
                                            [key]: {
                                                ...ArrayRender[key],
                                                val: [...ArrayRender[key].val, ArrayRender[key].subVal],
                                                subVal: '',
                                            },
                                        });
                                    }
                                }}
                            />
                            <ButtonSubmit
                                title="That's all"
                                css={`
                                    margin: 0;
                                    width: 20%;
                                `}
                                onClick={() => {
                                    if (
                                        !ArrayRender[key].val.some((s) => s === ArrayRender[key].subVal) &&
                                        ArrayRender[key].subVal
                                    ) {
                                        setArrayRender({
                                            ...ArrayRender,
                                            [key]: {
                                                ...ArrayRender[key],
                                                val: [...ArrayRender[key].val, ArrayRender[key].subVal],
                                                subVal: '',
                                            },
                                        });
                                        setEditValue(undefined);
                                    } else {
                                        setEditValue(undefined);
                                    }
                                }}
                            />
                        </Div>
                        <Div wrap="wrap" css="font-size: 1.3rem; margin: 3px 0;">
                            {res?.map((va) => (
                                <Span
                                    key={va}
                                    css="display: flex; border-radius: 30px; padding: 5px 9px; position: relative; background-image: linear-gradient(45deg, #39614ccc, #393162de); margin: 3px 2px; margin-right: 10px; color: #f0f0f0;"
                                >
                                    {va}
                                    <DivPos
                                        size="20px"
                                        top="-5px"
                                        right="-13px"
                                        onClick={() => {
                                            console.log(va, ArrayRender[key].val);
                                            const d = ArrayRender[key].val.filter((v) => v !== va);

                                            setArrayRender({
                                                ...ArrayRender,
                                                [key]: {
                                                    ...ArrayRender[key],
                                                    val: d,
                                                },
                                            });
                                        }}
                                    >
                                        <CloseI />
                                    </DivPos>
                                </Span>
                            ))}
                        </Div>
                    </Div>
                ) : (
                    <Div wrap="wrap" css="font-size: 1.3rem; margin-top: 2.5px; ">
                        {res?.length ? (
                            res?.map((va) => (
                                <Span
                                    key={va}
                                    css="display: flex; border-radius: 30px; padding: 5px 9px; background-image: linear-gradient(45deg, #39614ccc, #393162de); margin: 3px 2px; color: #f0f0f0;"
                                >
                                    {va}
                                </Span>
                            ))
                        ) : (
                            <Span css="display: flex; border-radius: 30px; padding: 5px 9px; background-image: linear-gradient(45deg, #39614ccc, #393162de); margin: 3px 2px; color: #f0f0f0;">
                                {placeholder}
                            </Span>
                        )}
                    </Div>
                )}
            </Div>
        );
    };
    const handleEdit = async () => {
        let checks = false;
        const paramsUser: {
            address?: string;
            birthday?: string;
            occupation?: string;
            gender?: number;
            schoolName?: string;
            hobby?: string[];
            skill?: string[];
        } = {};
        if (data.address !== ObjectRender.address?.val) {
            paramsUser.address = ObjectRender.address?.val;
            checks = true;
        }
        if (data.birthday !== ObjectRender.birthday?.val) {
            paramsUser.birthday = ObjectRender.birthday?.val;
            checks = true;
        }
        if (data.occupation !== ObjectRender.occupation?.val) {
            paramsUser.occupation = ObjectRender.occupation?.val;
            checks = true;
        }
        if (data.gender !== Gender(ObjectRender.gender?.val).number) {
            paramsUser.gender = Gender(ObjectRender.gender?.val).number;
            checks = true;
        }
        if (data.schoolName !== ObjectRender.schoolName?.val) {
            paramsUser.schoolName = ObjectRender.schoolName?.val;
            checks = true;
        }
        if (JSON.stringify(data.hobby) !== JSON.stringify(ArrayRender.hobby?.val)) {
            paramsUser.hobby = ArrayRender.hobby?.val;
            checks = true;
        }
        if (JSON.stringify(data.skill) !== JSON.stringify(ArrayRender.skill?.val)) {
            paramsUser.skill = ArrayRender.skill?.val;
            checks = true;
        }
        const paramsMores: { language?: string[]; relationship?: string } = {};
        if (JSON.stringify(mores[0].language) !== JSON.stringify(ArrayRender.language?.val)) {
            paramsMores.language = ArrayRender.language?.val;
            checks = true;
        }
        if (mores[0].relationship !== ObjectRender.relationship?.val) {
            paramsMores.relationship = ObjectRender.relationship?.val;
            checks = true;
        }
        if (checks && check) {
            const res: { countUser: number; countMores: number } = await userAPI.changesMany(paramsUser, paramsMores);
            if (res.countUser || res.countMores) {
                setUsersData((pre) =>
                    pre.map((us) => {
                        if (us.id === data.id) {
                            return {
                                ...data,
                                ...paramsUser,
                                mores: [{ ...data.mores[0], ...paramsMores }],
                            };
                        }
                        return us;
                    }),
                );
                setEditTitle(false);
            }
        }
    };
    const handleLogin = async (id?: string, phoneOrEmail?: string, other?: string) => {
        const preId = data.id;
        if (other) {
            if (id && phoneOrEmail && pass?.val) {
                const res = await authAPI.subLogin(phoneOrEmail, pass.val, other, id);
                if (res) {
                    setUserFirst(res);
                    setUsersData((pre) => {
                        let checksF = false;
                        pre.forEach((us) => {
                            if (us.id === res.id) {
                                checksF = true;
                            }
                        });
                        if (!checksF) {
                            return pre.map((us) => {
                                if (us.id === preId) {
                                    return res;
                                }
                                return us;
                            });
                        } else {
                            const newUs = pre.filter((us) => us.id !== data.id);
                            const newUsss = newUs.filter((us) => us.id !== res.id);
                            if (newUsss.length) {
                                return newUsss.map((us) => {
                                    if (us.id === res.id) {
                                        return res;
                                    }
                                    return us;
                                });
                            } else {
                                return [res];
                            }
                        }
                    });
                }
            }
        } else {
            if (login.userName && login.password) {
                const res: {
                    account: {
                        id: string;
                        fullName: string;
                        avatar: string | null;
                        gender: number;
                        phoneNumberEmail: string;
                    };
                } = await authAPI.subLogin(login.userName, login.password);
                if (res?.account.avatar) {
                    res.account.avatar = CommonUtils.convertBase64(res.account.avatar);
                }
                console.log(res, 'sub');
                if (res) setUserData([...(userData ?? []), res]);
                if (!res) {
                    setError(res);
                } else {
                    setError('ok');
                }
                console.log(userData, 'login');
            }
        }
    };
    console.log(userData, 'login');
    const handleSubAccounts = (id: string) => {
        setSubAccount(true);
        // handleLogin(sub.id, sub.phoneNumberEmail, 'other')
    };
    return {
        srcUp,
        login,
        setLogin,
        valUpdate,
        setValUpdate,
        userData,
        setUserData,
        error,
        setError,
        showPass,
        setShowPass,
        editValue,
        position,
        setPosition,
        inputRef,
        loading,
        setLoading,
        userId,
        itemsT,
        handlePosition,
        handleAddFile,
        ObjectRender,
        ArrayRender,
        renderInfo,
        renderArrayInfo,
        handleEdit,
        handleLogin,
        handleSubAccounts,
        itemsP,
        setEditValue,
        check,
        itemMemoryBar,
        subAccount,
        setSubAccount,
        pass,
        setPass,
        dispatch,
    };
};
export default LogicTitle;
