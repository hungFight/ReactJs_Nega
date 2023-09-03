import {
    AccountI,
    AddFileI,
    BirthI,
    CloseI,
    FlowersI,
    FriendI,
    GenderFemaleI,
    GenderMaleI,
    GenderOtherI,
    HeartI,
    HeartMI,
    HobbyI,
    LanguageI,
    LocationI,
    PeopleI,
    PrivacyI,
    SchoolI,
    StarI,
    StrengthI,
    VerifyI,
    WorkingI,
} from '~/assets/Icons/Icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';

import { ButtonSubmit, DivPos, Hname, UpLoadForm } from '~/reUsingComponents/styleComponents/styleComponents';
import { Button, Div, H3, Img, Input, P, Span } from '~/reUsingComponents/styleComponents/styleDefault';
import { DivTitleP } from './styleLayout';
import { ReactElement, useEffect, useRef, useState } from 'react';
import UserBar from 'src/mainPage/personalPage/layout/UserBar';
import { useCookies } from 'react-cookie';
import userAPI from '~/restAPI/userAPI';
import Stories from '~/reUsingComponents/Stories/Stories';
import ServerBusy from '~/utils/ServerBusy';
import { useDispatch } from 'react-redux';
import { setTrueErrorServer } from '~/redux/hideShow';
import CommonUtils from '~/utils/CommonUtils';
import { Label } from '~/social_network/components/Header/layout/Home/Layout/FormUpNews/styleFormUpNews';
import Player from '~/reUsingComponents/Videos/Player';
import handleFileUpload from '~/utils/handleFileUpload';
import { PropsUserPer } from 'src/App';
import Gender from '~/utils/Gender';
import Login from '~/Authentication/Login/Login';
import Eyes from '~/reUsingComponents/Eys/Eye';
import authAPI from '~/restAPI/authAPI/authAPI';
import Avatar from '~/reUsingComponents/Avatars/Avatar';

export interface PropsMores {
    id: string;
    followedAmount: number;
    followingAmount: number;
    friendAmount: number;
    loverAmount: number;
    position: string;
    star: number;
    language: string[];
    relationship: string;
    visitorAmount: number;
    updatedAt: string;
    createdAt: string;
}
const Title: React.FC<{
    AllArray: PropsUserPer[];
    colorText: string;
    colorBg: number;
    data: PropsUserPer;
    status: string;
    id_o: string | null;
    id_f: string | null;
    level: number | null;
    resTitle: {
        star: number;
        love: number;
        visitor: number;
        followed: number;
        following: number;
    };
    id_loved: string;
    editTitle: boolean;
    setEditTitle: React.Dispatch<React.SetStateAction<boolean>>;
    setData: React.Dispatch<React.SetStateAction<PropsUserPer>>;
}> = ({
    AllArray,
    colorText,
    colorBg,
    data,
    setData,
    status,
    id_o,
    id_f,
    level,
    resTitle,
    id_loved,
    editTitle,
    setEditTitle,
}) => {
    const { mores } = data;

    const [src, setSrc] = useState<{ type: string; file: string }[]>([]);
    const srcUp = useRef<{ file: Blob; type: string }[]>([]);
    const dispatch = useDispatch();
    const [cookies, setCookies] = useCookies(['k_user', 'tks']);

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
    const [login, setLogin] = useState<{ userName: string; password: string }>({ userName: '', password: '' });
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [editValue, setEditValue] = useState<number | string | undefined>();
    const [position, setPosition] = useState<number>(0); // show interacts
    const offset = useRef<number>(0);
    const limit = 2;

    const [loading, setLoading] = useState<boolean>(false);

    const userId = cookies.k_user;
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
    const bjectRenderRef = useRef<{
        [address: string]: { val: string; placeholder: string; icon: ReactElement; length: number };
        gender: { val: string; placeholder: string; icon: ReactElement; length: number };
        birthday: { val: string; placeholder: string; icon: ReactElement; length: number };
        relationship: { val: string; placeholder: string; icon: ReactElement; length: number };
        occupation: { val: string; placeholder: string; icon: ReactElement; length: number };
        schoolName: { val: string; placeholder: string; icon: ReactElement; length: number };
    }>(ObjectRender);
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
                setData({
                    ...data,
                    ...paramsUser,
                    mores: [{ ...data.mores[0], ...paramsMores }],
                });
                setEditTitle(false);
            }
        }
    };
    const handleLogin = async () => {
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
    };
    console.log(userData, 'login');

    return (
        <DivTitleP>
            <Div
                width="100%"
                wrap="wrap"
                css="justify-content: space-evenly; background-color: #2b2c2c; padding: 9px 0; border-radius: 5px; box-shadow: 0 0 1px #949090;"
            >
                <Div>
                    {itemsT.map((i) => (
                        <Div
                            key={i.key}
                            width="50px"
                            wrap="wrap"
                            onClick={() => handlePosition(i.key)}
                            css={`
                                justify-content: center;
                                align-items: center;
                                font-size: 20px;
                                color: ${colorText};
                                div {
                                    color: ${i.key === 3 && [id_o, id_f].includes(userId) && level === 2
                                        ? '#257fc2'
                                        : colorText};
                                }
                                @media (min-width: 768px) {
                                    font-size: 22px;
                                }
                                @media (min-width: 1280px) {
                                    font-size: 24px;
                                }
                            `}
                        >
                            <Div
                                width="100%"
                                css={`
                                    align-items: center;
                                    justify-content: center;
                                    ${i.css};
                                    cursor: var(--pointer);
                                `}
                            >
                                {i.icon}
                            </Div>
                            <P z="1.3rem">{i.qt < 0 ? 0 : i.qt}</P>
                        </Div>
                    ))}{' '}
                </Div>
                <Div
                    css={`
                        width: 165px;
                        justify-content: space-around;
                        margin-top: 10px;
                        @media (min-width: 495px) {
                            margin: 0;
                        }
                    `}
                >
                    {itemsP.map((i) => (
                        <Div
                            key={i.key}
                            width="50px"
                            wrap="wrap"
                            css={`
                                justify-content: center;
                                align-items: center;
                                font-size: 1.5rem;
                                color: ${colorText};
                            `}
                        >
                            <Div width="100%" css="align-items: center; justify-content: center; ">
                                <H3
                                    css="font-size: 1.5rem; cursor: var(--pointer); "
                                    onClick={() => handlePosition(i.key)}
                                >
                                    <a href={`#title${i.key}`}> {i.icon}</a>
                                </H3>
                            </Div>
                            <P z="1.3rem">{i.qt}</P>
                        </Div>
                    ))}
                </Div>
            </Div>
            <Div width="100%">
                {editTitle && (
                    <Div
                        width="100% "
                        css={`
                            background-color: #2b2c2c;
                            box-shadow: 0 0 1px #949090;
                            align-items: center;
                            justify-content: right;
                            position: relative;
                            margin-top: 10px;
                            color: ${colorText};
                        `}
                    >
                        <P z="1.4rem" css="width: 100%; text-align: center; position: absolute; left: 0; top: 4px;">
                            In editing
                        </P>
                        <Button
                            css="margin: 0; cursor: var(--pointer); z-index: 1;"
                            color={colorText}
                            onClick={() => setEditTitle(false)}
                        >
                            Exit
                        </Button>
                    </Div>
                )}
            </Div>

            <Div
                width={`${AllArray.length > 1 ? '100%' : '49.5%'}`}
                display="block"
                css={`
                    margin-top: 15px;
                    color: ${colorText};
                    background-color: #2b2c2c;
                    padding: 8px;
                    box-shadow: 0 0 1px #949090;
                    @media (max-width: 850px) {
                        width: 100%;
                    }
                    @media (min-width: 1500px) {
                        ${AllArray.length === 2 ? 'width: 49.5%' : ''};
                    }
                `}
            >
                <Div
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
                >
                    <Div width="20px" css="margin-right: 2px;">
                        <VerifyI />
                    </Div>
                    <P css="font-size: 1.4rem; margin-top: 2.5px;">{mores[0].position}</P>
                </Div>
                {Object.keys(ObjectRender).map((key, index) => {
                    console.log(key, 'key', ObjectRender[key].val, ObjectRender[key].val + index);
                    if ((ObjectRender[key].val && !editTitle) || editTitle) {
                        return renderInfo(
                            ObjectRender[key].val,
                            ObjectRender[key].placeholder,
                            ObjectRender[key].icon,
                            key,
                            ObjectRender[key].length,
                        );
                    }
                })}
            </Div>
            <Div
                width={`${AllArray.length > 1 ? '100%' : '49.5%'}`}
                display="block"
                css={`
                    margin-top: 15px;
                    color: ${colorText};
                    background-color: #2b2c2c;
                    padding: 8px;
                    box-shadow: 0 0 1px #949090;
                    @media (max-width: 850px) {
                        width: 100%;
                    }
                    @media (min-width: 1500px) {
                        ${AllArray.length === 2 ? 'width: 49.5%' : ''};
                    }
                `}
            >
                {Object.keys(ArrayRender).map((key) => {
                    if ((ArrayRender[key].val.length && !editTitle) || editTitle) {
                        return renderArrayInfo(
                            ArrayRender[key].val,
                            ArrayRender[key].placeholder,
                            ArrayRender[key].icon,
                            key,
                        );
                    }
                })}
                {((userData.length && !editTitle) || editTitle) && (
                    <Div
                        width="100%"
                        css={`
                            align-items: center;
                            font-size: 18px;
                            margin-bottom: 4px;
                            position: relative;
                            ${editTitle ? 'cursor: var(--pointer);' : ''}
                            &:hover {
                                ${editTitle
                                    ? 'transition: all 0.5s linear; padding-left: 3px; border-radius: 5px;'
                                    : ''}
                            }
                        `}
                        onClick={() => {
                            if (editTitle && userData.length < 5) setEditValue(10);
                        }}
                    >
                        <Div
                            width="20px"
                            css={`
                                z-index: 1;
                                margin-right: 2px;
                                ${editValue === 10 && editTitle ? 'position: absolute; top: 37px;' : ''}
                            `}
                        >
                            <AccountI />
                        </Div>
                        {editValue === 10 && editTitle ? (
                            <Div width="100%" wrap="wrap">
                                <Div width="100%" css="align-items: center; position: relative;">
                                    <Input
                                        type="text"
                                        placeholder="Phone number or Email"
                                        padding="10px 22px 10px 10px;"
                                        color={colorText}
                                        onChange={(e) => {
                                            setLogin({ ...login, userName: e.target.value });
                                        }}
                                    />
                                    {error !== undefined && (
                                        <P
                                            z="1.1rem"
                                            css={`
                                                position: absolute;
                                                width: max-content;
                                                bottom: -10px;
                                                color: ${error !== null ? '#74c196;' : '#c17474'};
                                            `}
                                        >
                                            {error === null
                                                ? "You had logged in or your Account's name and password are already wrong! "
                                                : 'successfully!'}
                                        </P>
                                    )}
                                    <Div width="100%" css="position: relative;">
                                        <Input
                                            type={showPass.check ? 'password' : 'text'}
                                            placeholder="password"
                                            padding="10px 22px 10px 10px;"
                                            color={colorText}
                                            onChange={(e) => {
                                                setLogin({ ...login, password: e.target.value });
                                                if (e.target.value) {
                                                    setShowPass({ ...showPass, icon: true });
                                                } else {
                                                    setShowPass({ ...showPass, icon: false });
                                                }
                                            }}
                                        />

                                        <Eyes
                                            value={login?.password}
                                            setShow={setShowPass}
                                            show={showPass}
                                            top="13px"
                                            right="3px"
                                        />
                                    </Div>

                                    <ButtonSubmit title="Login" css="margin: 0; width: 40%;" onClick={handleLogin} />
                                    <ButtonSubmit
                                        title="No"
                                        css={`
                                            margin: 0;
                                            width: 20%;
                                        `}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditValue(undefined);
                                        }}
                                    />
                                </Div>
                                <Div css="margin-top: 2.5px; display: flex; flex-wrap: wrap;">
                                    {userData?.map((ac) => {
                                        const sub = ac.account;
                                        return (
                                            <Div
                                                key={sub.id}
                                                wrap="wrap"
                                                css="margin: 4px 5px; justify-content: center;"
                                            >
                                                <Avatar
                                                    src={sub.avatar}
                                                    alt={sub.fullName}
                                                    gender={sub.gender}
                                                    radius="50%"
                                                    css="width: 38px; height: 38px;"
                                                />
                                                <Hname css="text-align: center;">{sub.fullName}</Hname>
                                            </Div>
                                        );
                                    })}
                                </Div>
                            </Div>
                        ) : (
                            <Div css="margin-top: 2.5px; display: flex; flex-wrap: wrap;">
                                {userData.length ? (
                                    userData?.map((ac) => {
                                        const sub = ac.account;
                                        sub.avatar = CommonUtils.convertBase64(sub.avatar);
                                        return (
                                            <Div key={sub.id} width="38px" css="height: 38px; margin: 4px 5px;">
                                                <Avatar
                                                    id={sub.id}
                                                    src={sub.avatar}
                                                    alt={sub.fullName}
                                                    currentId={data.id}
                                                    profile
                                                    gender={sub.gender}
                                                    radius="50%"
                                                />
                                            </Div>
                                        );
                                    })
                                ) : (
                                    <P z="1.4rem">SubAccount</P>
                                )}
                            </Div>
                            // <P css="font-size: 1.4rem; margin-top: 2.5px;">Developer</P>
                        )}
                    </Div>
                )}
                {/* <Div
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
                        if (editTitle) setEditValue(11);
                    }}
                >
                    <Div width="20px" css="margin-right: 2px;">
                        <LanguageI />
                    </Div>
                    {editValue === 11 && editTitle ? (
                        <>
                            <Input type="text" width="75%" placeholder="Single" color={colorText} />{' '}
                            <ButtonSubmit title="As I want" css="margin: 0; width: 20%;" />
                        </>
                    ) : (
                        <P css="font-size: 1.3rem; margin-top: 2.5px; display: flex; flex-wrap: wrap;">
                            <Span css="padding: 3px 9px; background-image: linear-gradient(45deg,#0a0a0acc,#625e5e63); border-radius: 14px; margin: 3px 2px; color:">
                                English
                            </Span>
                            <Span css="padding: 3px 9px; background-image: linear-gradient(45deg,#0a0a0acc,#625e5e63); border-radius: 14px; margin: 3px 2px; color:">
                                Japanese
                            </Span>
                            <Span css="padding: 3px 9px; background-image: linear-gradient(45deg,#0a0a0acc,#625e5e63); border-radius: 14px; margin: 3px 2px; color:">
                                Spanish
                            </Span>
                        </P>
                    )}
                </Div> */}
            </Div>
            {editTitle && (
                <Div width="100%" css="justify-content: right;">
                    <Button
                        css=" margin-right: 10px; background-color: #9f3636; box-shadow: 0 0 1px #949090; margin-top: 7px;border-radius: 5px;"
                        onClick={() => setEditTitle(false)}
                    >
                        Exit
                    </Button>
                    <Button
                        css={`
                            background-color: #498c9b;
                            box-shadow: 0 0 1px #949090;
                            margin-top: 7px;
                            border-radius: 5px;
                            ${!check ? 'color: #ffffff61; background-color: #498c9b54; cursor: context-menu;' : ''};
                        `}
                        onClick={handleEdit}
                    >
                        Save
                    </Button>
                </Div>
            )}
            {/* <Div
                width="100%"
                css={`
                    margin-top: 15px;
                    margin-left: 1px;
                    justify-content: center;
                    padding: 15px 50px;
                    @media (max-width: 850px) {
                        width: 100%;
                    }
                    .mySwiper {
                        overflow: unset;
                    }
                    .mySwiper .swiper-wrapper {
                        width: 116px;
                        height: 150px;
                    }
                    @media (min-width: 550px) {
                        .mySwiper .swiper-wrapper {
                            width: 130px;
                            height: 170px;
                        }
                    }
                `}
            >
                {!editTitle || src.length ? (
                    <>
                        <Swiper
                            effect={'coverflow'}
                            grabCursor={true}
                            loop={true}
                            coverflowEffect={{
                                rotate: 0,
                                stretch: 0,
                                depth: 120,
                                modifier: 3,
                                slideShadows: true,
                            }}
                            slidesPerView={'auto'}
                            speed={1000}
                            autoplay={{ delay: 1000 }}
                            modules={[Autoplay, EffectCoverflow]}
                            className="mySwiper"
                        >
                            {src.map((f, index) => {
                                return (
                                    <SwiperSlide key={f.file}>
                                        {f.type === 'image' ? (
                                            <Div width="100%" css="height: 100%">
                                                <Img src={f.file} id="baby" alt={f.file} radius="10px" />
                                            </Div>
                                        ) : f.type === 'video' ? (
                                            <Player src={f.file} />
                                        ) : (
                                            ''
                                        )}
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </>
                ) : (
                    <Div
                        width="100%"
                        css=" height: 100%; border: 1px solid #504f4e; border-radius: 5px; background-image: linear-gradient(45deg, #00000099, transparent);"
                    >
                        <UpLoadForm id="uploadsInPage" colorText={colorText} submit={handleAddFile}>
                            <P
                                z="50px"
                                css="width: 100%; height: 100%; cursor: var(--pointer); color: #8a8c8f; display: flex; align-items: center; justify-content: center;"
                            >
                                <AddFileI />
                            </P>
                        </UpLoadForm>
                    </Div>
                )}
            </Div> */}
            <Div
                width="100%"
                css={`
                    height: 30px;
                    margin: 10px 0;
                    background-color: #2b2c2c;
                    box-shadow: 0 0 1px #949090;
                    color: ${colorText};
                `}
            >
                {itemMemoryBar.map((m) => (
                    <P
                        key={m.id}
                        z="1.5rem"
                        css="margin: 0 5px; padding: 5px; display: flex; align-items: center; cursor: var(--pointer);"
                    >
                        {m.name}
                    </P>
                ))}
            </Div>
            {position > 0 && (
                <UserBar
                    id_loved={id_loved}
                    colorBg={colorBg}
                    colorText={colorText}
                    position={position}
                    setPosition={setPosition}
                />
            )}
        </DivTitleP>
    );
};
export default Title;
