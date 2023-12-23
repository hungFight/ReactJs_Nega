import { AccountI, BackI, CloseI, EarthI, FriendI, PrivacyI, PrivateI, VerifyI } from '~/assets/Icons/Icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';

import CommonUtils from '~/utils/CommonUtils';
import { ButtonSubmit, DivPos, Hname } from '~/reUsingComponents/styleComponents/styleComponents';
import { Button, Div, H3, Input, P } from '~/reUsingComponents/styleComponents/styleDefault';
import { DivTitleP } from '../styleLayout';
import UserBar from 'src/mainPage/personalPage/layout/UserBar';
import { PropsUser, PropsUserPer } from 'src/App';
import Eyes from '~/reUsingComponents/Eys/Eye';
import Avatar from '~/reUsingComponents/Avatars/Avatar';
import LogicTitle from './LogicTitle';
import { setOpenProfile } from '~/redux/hideShow';

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
    privacy: {
        [position: string]: string;
        address: string;
        birthday: string;
        relationship: string;
        gender: string;
        schoolName: string;
        occupation: string;
        hobby: string;
        skill: string;
        language: string;
        subAccount: string;
    };
    updatedAt: string;
    createdAt: string;
}
const Title: React.FC<{
    userFirst: PropsUser;
    setUserFirst: React.Dispatch<React.SetStateAction<PropsUser>>;
    setUsersData: React.Dispatch<React.SetStateAction<PropsUserPer[]>>;
    AllArray: PropsUserPer[];
    colorText: string;
    colorBg: number;
    data: PropsUserPer;
    status: string;
    id_o: string | null;
    userRequested: string | null;
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
}> = ({
    userFirst,
    setUserFirst,
    setUsersData,
    AllArray,
    colorText,
    colorBg,
    data,
    status,
    id_o,
    userRequested,
    level,
    resTitle,
    id_loved,
    editTitle,
    setEditTitle,
}) => {
    const { mores } = data;

    const {
        srcUp,
        login,
        setLogin,
        subAccountsData,
        setSubAccountsData,
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
        itemsP,
        setEditValue,
        check,
        itemMemoryBar,
        subAccount,
        setSubAccount,
        pass,
        setPass,
        dispatch,
        handleDelSubAc,
        acPrivate,
        setAcPrivate,
        privacy,
        setPrivacy,
        whoCanSee,
    } = LogicTitle(
        colorText,
        data,
        resTitle,
        id_loved,
        editTitle,
        setEditTitle,
        setUserFirst,
        setUsersData,
        userRequested,
        level,
        userFirst,
    );

    return (
        <DivTitleP onClick={() => setAcPrivate('')}>
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
                                    color: ${i.key === 3 && [id_o, userRequested].includes(userId) && level === 2
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
                {mores[0].position && (
                    <Div
                        width="100%"
                        css={`
                            align-items: center;
                            font-size: 20px;
                            margin-bottom: 4px;
                            position: relative;
                            ${editTitle ? 'cursor: var(--pointer);' : ''}
                            &:hover {
                                ${editTitle
                                    ? 'transition: all 0.5s linear; padding-left: 3px; border-radius: 5px;'
                                    : ''}
                            }
                        `}
                    >
                        <Div width="20px" css="margin-right: 2px;">
                            <VerifyI />
                        </Div>
                        <P css="font-size: 1.4rem; margin-top: 2.5px;">{mores[0].position}</P>
                        {editTitle && (
                            <DivPos
                                top="-2px"
                                right="5px"
                                size="19px"
                                css="padding: 5px; &:hover{color: #f3f3f3;}"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (acPrivate === 'position') {
                                        setAcPrivate('');
                                    } else {
                                        setAcPrivate('position');
                                    }
                                }}
                            >
                                <Div css="position: relative;">
                                    {acPrivate === 'position' && (
                                        <Div css="position: absolute; right: 64px; top: -35px; flex-wrap: wrap; padding: 10px; border-radius: 5px; background-image: linear-gradient(45deg, #324b47, #000000eb); z-index: 1;">
                                            <H3 css="font-size: 1.8rem; width: 100%; display: flex; align-items: center;">
                                                <AccountI />
                                                {' Position'}
                                            </H3>
                                            <P
                                                z="1.3rem"
                                                css="width: 100%; text-align: center; padding: 3px 1px; &:hover{color: aliceblue;}"
                                                onClick={() => setPrivacy({ ...privacy, position: 'only' })}
                                            >
                                                Only me!
                                            </P>
                                            <P
                                                z="1.3rem"
                                                css="width: 100%; text-align: center; padding: 3px 1px; &:hover{color: aliceblue;}"
                                                onClick={() => setPrivacy({ ...privacy, position: 'friends' })}
                                            >
                                                Friend
                                            </P>
                                            <P
                                                z="1.3rem"
                                                css="width: 100%; text-align: center; padding: 3px 1px; &:hover{color: aliceblue;}"
                                                onClick={() => setPrivacy({ ...privacy, position: 'everyone' })}
                                            >
                                                Everyone
                                            </P>
                                        </Div>
                                    )}
                                    <Div
                                        css={`
                                            &:hover {
                                                color: #f3f3f3;
                                            }
                                            ${acPrivate === 'position' ? 'color: #3db972;' : ''}
                                        `}
                                    >
                                        {privacy.position === 'only' ? (
                                            <PrivateI />
                                        ) : privacy.position === 'friends' ? (
                                            <FriendI />
                                        ) : (
                                            <EarthI />
                                        )}
                                    </Div>
                                </Div>
                            </DivPos>
                        )}
                    </Div>
                )}

                {Object.keys(ObjectRender).map((key, index) => {
                    console.log(key, 'key', ObjectRender[key].val, ObjectRender[key].val + index);
                    if ((ObjectRender[key].val && !editTitle) || editTitle) {
                        return renderInfo(
                            ObjectRender[key].val,
                            ObjectRender[key].placeholder,
                            ObjectRender[key].icon,
                            key,
                            ObjectRender[key].length,
                            ObjectRender[key].private,
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
                    if ((ArrayRender[key].val?.length && !editTitle) || editTitle) {
                        return renderArrayInfo(
                            ArrayRender[key].val,
                            ArrayRender[key].placeholder,
                            ArrayRender[key].icon,
                            key,
                            ArrayRender[key].private,
                        );
                    }
                })}
                {((subAccountsData?.length && !editTitle) || editTitle) && (
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
                            if (editTitle && subAccountsData.length < 5) setEditValue(10);
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

                                    <ButtonSubmit
                                        title="Login"
                                        css="margin: 0; width: 40%;"
                                        onClick={() => handleLogin()}
                                    />
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
                                    {subAccountsData?.map((ac) => {
                                        const sub = ac.account;
                                        return (
                                            <Div
                                                key={sub.id}
                                                wrap="wrap"
                                                css="margin: 4px 5px; justify-content: center; position: relative;"
                                            >
                                                <Avatar
                                                    src={sub.avatar}
                                                    alt={sub.fullName}
                                                    gender={sub.gender}
                                                    radius="50%"
                                                    css="width: 38px; height: 38px;"
                                                />
                                                <Hname css="text-align: center;">{sub.fullName}</Hname>
                                                <DivPos
                                                    size="20px"
                                                    right="4px"
                                                    onClick={() => handleDelSubAc(sub.id, sub.phoneNumberEmail)}
                                                >
                                                    <CloseI />
                                                </DivPos>
                                            </Div>
                                        );
                                    })}
                                </Div>
                            </Div>
                        ) : (
                            <Div css="margin-top: 2.5px; display: flex; flex-wrap: wrap; ">
                                {/* display subAccounts */}
                                {subAccountsData.length ? (
                                    subAccountsData?.map((ac) => {
                                        const sub = ac.account;
                                        sub.avatar = CommonUtils.convertBase64(sub.avatar);
                                        return (
                                            <Div
                                                key={sub.id}
                                                width="min-content;"
                                                css="margin: 0 3px; position: relative;"
                                            >
                                                {subAccount && userFirst.id === data.id ? (
                                                    <Div
                                                        wrap="wrap"
                                                        css=" justify-content: center; background-color: #4c5260;  border-radius: 5px; text-align: center; padding: 5px;"
                                                    >
                                                        {pass?.id === sub.id ? (
                                                            <Div css="align-items: center;">
                                                                <Div
                                                                    width="38px"
                                                                    css="height: 38px; margin: 4px 5px; cursor: var(--pointer);"
                                                                    onClick={() => {
                                                                        if (userFirst.id === data.id)
                                                                            setSubAccount(true);
                                                                    }}
                                                                >
                                                                    <Avatar
                                                                        id={sub.id}
                                                                        src={sub.avatar}
                                                                        alt={sub.fullName}
                                                                        currentId={data.id} // just be used here when find personal page of the current id
                                                                        gender={sub.gender}
                                                                        radius="50%"
                                                                    />
                                                                </Div>
                                                                <P z="1.3rem" css="width: max-content; ">
                                                                    {sub.fullName}
                                                                </P>
                                                            </Div>
                                                        ) : (
                                                            <>
                                                                <Div
                                                                    width="38px"
                                                                    css="height: 38px; margin: 4px 5px; cursor: var(--pointer);"
                                                                    onClick={() => {
                                                                        if (userFirst.id === data.id)
                                                                            setSubAccount(true);
                                                                    }}
                                                                >
                                                                    <Avatar
                                                                        id={sub.id}
                                                                        src={sub.avatar}
                                                                        alt={sub.fullName}
                                                                        currentId={data.id}
                                                                        gender={sub.gender}
                                                                        radius="50%"
                                                                    />
                                                                </Div>
                                                                <P z="1.3rem" css="width: max-content; ">
                                                                    {sub.fullName}
                                                                </P>
                                                            </>
                                                        )}

                                                        <Div
                                                            width="100%"
                                                            css="height: 1px; background-color: #c7c7c7;"
                                                        ></Div>

                                                        {pass?.id === sub.id ? (
                                                            <Div width="100%" css="align-items: center;">
                                                                <Input
                                                                    type="text"
                                                                    placeholder="password"
                                                                    padding="8px"
                                                                    width="120px"
                                                                    value={pass.val}
                                                                    color={colorText}
                                                                    onChange={(e) =>
                                                                        setPass({ ...pass, val: e.target.value })
                                                                    }
                                                                />
                                                                <ButtonSubmit
                                                                    title="Login"
                                                                    css="width: 50px; margin: 0;"
                                                                    onClick={() =>
                                                                        handleLogin(
                                                                            sub.id,
                                                                            sub.phoneNumberEmail,
                                                                            'other',
                                                                        )
                                                                    }
                                                                />
                                                            </Div>
                                                        ) : (
                                                            <P
                                                                z="1.3rem"
                                                                css="width: 100%; cursor: var(--pointer); &:hover{color: #9bd6e2;}"
                                                                onClick={() =>
                                                                    setPass({ id: sub.id, kind: 'login', val: '' })
                                                                }
                                                            >
                                                                Login
                                                            </P>
                                                        )}
                                                        <P
                                                            z="1.3rem"
                                                            css="width: max-content; cursor: var(--pointer); &:hover{color: #9bd6e2;}"
                                                            onClick={() =>
                                                                dispatch(
                                                                    setOpenProfile({
                                                                        newProfile: [sub.id],
                                                                        currentId: userFirst.id,
                                                                    }),
                                                                )
                                                            }
                                                        >
                                                            View Profile
                                                        </P>
                                                    </Div>
                                                ) : (
                                                    <Div
                                                        width="38px"
                                                        css="height: 38px; margin: 4px 5px; cursor: var(--pointer);"
                                                        onClick={() => {
                                                            if (userFirst.id === data.id) setSubAccount(true);
                                                        }}
                                                    >
                                                        <Avatar
                                                            id={sub.id}
                                                            src={sub.avatar}
                                                            alt={sub.fullName}
                                                            currentId={data.id}
                                                            profile={
                                                                !(userFirst.id === data.id && userFirst.id === userId)
                                                            }
                                                            gender={sub.gender}
                                                            radius="50%"
                                                        />
                                                    </Div>
                                                )}
                                            </Div>
                                        );
                                    })
                                ) : (
                                    <P z="1.4rem">SubAccount</P>
                                )}
                                {subAccount && userFirst.id === data.id && (
                                    <P z="20px" css="cursor: var(--pointer);" onClick={() => setSubAccount(false)}>
                                        <BackI />
                                    </P>
                                )}
                            </Div>
                        )}
                        {editTitle && editValue !== 10 && (
                            <DivPos
                                top="-2px"
                                right="5px"
                                size="19px"
                                css="padding: 5px; &:hover{color: #f3f3f3;}"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (acPrivate === 'subAccount') {
                                        setAcPrivate('');
                                    } else {
                                        setAcPrivate('subAccount');
                                    }
                                }}
                            >
                                <Div css="position: relative;">
                                    {acPrivate === 'subAccount' && (
                                        <Div css="position: absolute; right: 64px; top: -35px; flex-wrap: wrap; padding: 10px; border-radius: 5px; background-image: linear-gradient(45deg, #324b47, #000000eb); z-index: 1;">
                                            <H3 css="font-size: 1.8rem; width: 100%; display: flex; align-items: center;">
                                                <AccountI />
                                                {' subAccount'}
                                            </H3>
                                            <P
                                                z="1.3rem"
                                                css="width: 100%; text-align: center; padding: 3px 1px; &:hover{color: aliceblue;}"
                                                onClick={() => setPrivacy({ ...privacy, subAccount: 'only' })}
                                            >
                                                Only me!
                                            </P>
                                            <P
                                                z="1.3rem"
                                                css="width: 100%; text-align: center; padding: 3px 1px; &:hover{color: aliceblue;}"
                                                onClick={() => setPrivacy({ ...privacy, subAccount: 'friends' })}
                                            >
                                                Friend
                                            </P>
                                            <P
                                                z="1.3rem"
                                                css="width: 100%; text-align: center; padding: 3px 1px; &:hover{color: aliceblue;}"
                                                onClick={() => setPrivacy({ ...privacy, subAccount: 'everyone' })}
                                            >
                                                Everyone
                                            </P>
                                        </Div>
                                    )}
                                    <Div
                                        css={`
                                            &:hover {
                                                color: #f3f3f3;
                                            }
                                            ${acPrivate === 'subAccount' ? 'color: #3db972;' : ''}
                                        `}
                                    >
                                        {privacy.subAccount === 'only' ? (
                                            <PrivateI />
                                        ) : privacy.subAccount === 'friends' ? (
                                            <FriendI />
                                        ) : (
                                            <EarthI />
                                        )}
                                    </Div>
                                </Div>
                            </DivPos>
                        )}
                    </Div>
                )}
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
                        onClick={() => {
                            if (!loading && check) handleEdit();
                        }}
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
