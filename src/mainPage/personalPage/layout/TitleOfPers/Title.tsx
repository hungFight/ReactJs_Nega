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
import { useState } from 'react';

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
    colorText?: string;
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
        viewMore,
        setViewMore,
        loadingSub,
    } = LogicTitle(
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
    console.log(viewMore, 'viewMore');

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
                                        : ''};
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
                                    color: ${i.color};
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
                    ${editTitle || viewMore
                        ? `height: auto;
                        color: ${colorText};
                        background-color: #2b2c2c;
                        padding: 8px;margin-top: 15px;
                        box-shadow: 0 0 1px #949090;
                        @media (max-width: 850px) {
                            width: 100%;
                        }
                        @media (min-width: 1500px) {
                            ${AllArray.length === 2 ? 'width: 49.5%' : ''};
                        }`
                        : `height: 0;
                    overflow: hidden;
                    @media (min-width: 500px) {
                        margin-top: 15px;
                        overflow: unset;
                        height: auto;
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
                    }`}
                `}
            >
                {mores[0].position && (
                    <Div
                        width="100%"
                        css={`
                            align-items: center;
                            font-size: 20px;
                            margin-bottom: 8px;
                            position: relative;
                            ${editTitle ? 'cursor: var(--pointer);' : ''}
                            &:hover {
                                ${editTitle
                                    ? 'transition: all 0.5s linear; padding-left: 3px; border-radius: 5px;'
                                    : ''}
                            }
                        `}
                    >
                        <Div width="20px" css="margin-right: 2px; color: #1395c9;">
                            <VerifyI />
                        </Div>
                        <P css="font-size: 1.4rem; margin-top: 2.5px;">{mores[0].position}</P>
                        {editTitle && (
                            <DivPos
                                top="0px"
                                right="5px"
                                size="19px"
                                css={`
                                    border-radius: 5px;
                                    box-shadow: 0 0 3px #838383;
                                    padding: 3px 10px;
                                    ${acPrivate === 'position' ? 'box-shadow: 0 0 3px #0b78ac;' : ''}
                                `}
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
                                        <Div
                                            width="120px"
                                            css=" max-width: 300px; background-color: #0a3c54; position: absolute; right: 64px; top: -35px; flex-wrap: wrap; padding: 10px; border-radius: 5px; z-index: 1;"
                                        >
                                            <H3 css="justify-content: center; border-bottom: 1px solid; margin-bottom: 5px; padding: 0 0 5px;font-size: 1.8rem; width: 100%; display: flex; align-items: center;">
                                                <AccountI />
                                                <P z="1.4rem">Position</P>
                                            </H3>
                                            <P
                                                z="1.3rem"
                                                css="width: 100%; background-color: #2a2a2a; margin: 2px 0; text-align: center; padding: 3px 1px; &:hover{color: aliceblue;}"
                                                onClick={() => setPrivacy({ ...privacy, position: 'only' })}
                                            >
                                                Only me!
                                            </P>
                                            <P
                                                z="1.3rem"
                                                css="width: 100%; margin: 2px 0; background-color: #0a7ba7; text-align: center; padding: 3px 1px; &:hover{color: aliceblue;}"
                                                onClick={() => setPrivacy({ ...privacy, position: 'friends' })}
                                            >
                                                Friend
                                            </P>
                                            <P
                                                z="1.3rem"
                                                css="width: 100%; background-color: #138b6f; margin: 2px 0; text-align: center; padding: 3px 1px; &:hover{color: aliceblue;}"
                                                onClick={() => setPrivacy({ ...privacy, position: 'everyone' })}
                                            >
                                                Everyone
                                            </P>
                                            <div style={{ position: 'relative' }}>
                                                <Div
                                                    width="33px"
                                                    css="height: 1px; position: absolute; background-color: #096794; left: 10px; top: -58px;"
                                                ></Div>
                                            </div>
                                        </Div>
                                    )}
                                    <Div
                                        css={`
                                            &:hover {
                                                color: #3db972;
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
                    if ((ObjectRender[key].val && !editTitle) || editTitle) {
                        return renderInfo(
                            ObjectRender[key].val,
                            ObjectRender[key].placeholder,
                            ObjectRender[key].icon,
                            key,
                            ObjectRender[key].length,
                            ObjectRender[key].private,
                            ObjectRender[key].color,
                        );
                    }
                })}
            </Div>
            <Div
                width={`${AllArray.length > 1 ? '100%' : '49.5%'}`}
                display="block"
                css={`
                    ${editTitle || viewMore
                        ? ` margin-top: 15px;
                        color: ${colorText};
                        background-color: #2b2c2c;
                        padding: 8px;
                        box-shadow: 0 0 1px #949090;
                        @media (max-width: 850px) {
                            width: 100%;
                        }
                        @media (min-width: 1500px) {
                            ${AllArray.length === 2 ? 'width: 49.5%' : ''};
                        }`
                        : `height: 0;
                    overflow: hidden;
                    @media (min-width: 500px) {
                        overflow: unset;
                        height: auto;
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
                    }`}
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
                            ArrayRender[key].color,
                        );
                    }
                })}
                {((subAccountsData?.length && !editTitle) || editTitle) && (
                    <Div
                        width="100%"
                        display="block"
                        css={`
                            align-items: center;
                            font-size: 18px;
                            color: ${colorText};
                            margin-bottom: 4px;
                            position: relative;
                            z-index: 1;
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
                            width="100%"
                            css={`
                                margin-top: 2px;
                                font-size: 25px;
                                justify-content: center;
                            `}
                        >
                            <AccountI />
                        </Div>
                        {editValue === 10 && editTitle ? ( // editing
                            <Div width="100%" wrap="wrap">
                                {/*show input to add more accounts to here */}
                                <Div width="100%" wrap="wrap" css="align-items: center; position: relative;">
                                    <Div width="100%" wrap="wrap" css="margin: 10px 0;">
                                        <Div width="100%">
                                            <Div width="100%">
                                                {' '}
                                                <Input
                                                    type="text"
                                                    placeholder="Phone number or Email"
                                                    value={login.userName}
                                                    margin="0"
                                                    padding="10px 22px 10px 10px;"
                                                    color={colorText}
                                                    onChange={(e) => {
                                                        setLogin({ ...login, userName: e.target.value });
                                                    }}
                                                />
                                            </Div>
                                            <Div width="100%" css="position: relative;">
                                                <Input
                                                    type={showPass.check ? 'password' : 'text'}
                                                    placeholder="password"
                                                    padding="10px 22px 10px 10px;"
                                                    margin="0"
                                                    value={login.password}
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
                                                    top="3px"
                                                    right="3px"
                                                />
                                            </Div>
                                        </Div>
                                        {error !== undefined && (
                                            <P
                                                z="1.1rem"
                                                css={`
                                                    width: max-content;
                                                    color: ${error !== null ? '#74c196;' : '#c17474'};
                                                `}
                                            >
                                                {error === null
                                                    ? "You had logged in or your Account's name or password are already wrong! "
                                                    : 'successfully!'}
                                            </P>
                                        )}
                                    </Div>

                                    <Div width="100%" css="justify-content: center;">
                                        {' '}
                                        <ButtonSubmit
                                            loading={loadingSub}
                                            title="Login"
                                            css="margin: 0;  width: 20%; button{ background: #135d66;}"
                                            onClick={() => handleLogin()}
                                        />
                                        <ButtonSubmit
                                            title="No"
                                            css={`
                                                margin: 0;
                                                width: 20%;
                                                button {
                                                    background: #914142;
                                                }
                                            `}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditValue(undefined);
                                            }}
                                        />
                                    </Div>
                                </Div>
                                {/* list all accounts you have */}
                                <Div width="100%" wrap="wrap" css=" margin-top: 20px;">
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
                                                <Div
                                                    width="100%"
                                                    css="font-size: 23px; justify-content: center; background-color: #963c3c; border-radius: 5px; padding: 4px;"
                                                    onClick={() => handleDelSubAc(sub.id, sub.phoneNumberEmail)}
                                                >
                                                    <CloseI />
                                                </Div>
                                            </Div>
                                        );
                                    })}
                                </Div>
                            </Div>
                        ) : (
                            // display subAccounts
                            <Div css="margin-top: 2.5px; display: flex; flex-wrap: wrap; padding: 0 12px;">
                                {subAccountsData.length ? (
                                    subAccountsData?.map((ac) => {
                                        const sub = ac.account;
                                        sub.avatar = CommonUtils.convertBase64(sub.avatar);
                                        return (
                                            <Div
                                                key={sub.id}
                                                width="fit-content"
                                                css="margin: 0 3px; position: relative; margin-bottom: 10px;"
                                            >
                                                {subAccount && userFirst.id === data.id ? ( // is your
                                                    <>
                                                        <DivPos
                                                            top="5px"
                                                            right="3px"
                                                            size="25px"
                                                            css=" padding: 0 3px;height: fit-content; background-color: #292929; border-radius: 5px;"
                                                            onClick={() => setSubAccount(false)}
                                                        >
                                                            <BackI />
                                                        </DivPos>
                                                        <Div
                                                            wrap="wrap"
                                                            css=" justify-content: center; background-color: #4c5260;  border-radius: 5px; text-align: center; padding: 5px;"
                                                        >
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
                                                                        currentId={data.id} // just be used here when find more 2 personal pages, by the current page id
                                                                        gender={sub.gender}
                                                                        radius="50%"
                                                                    />
                                                                </Div>
                                                                <P z="1.3rem" css="width: max-content;">
                                                                    {sub.fullName}
                                                                </P>
                                                            </Div>
                                                            <Div // ----
                                                                width="100%"
                                                                css="height: 1px; background-color: #c7c7c7;"
                                                            ></Div>

                                                            {pass?.id === sub.id ? ( // insert value to login
                                                                <Div
                                                                    width="100%"
                                                                    wrap="wrap"
                                                                    css="align-items: center;"
                                                                >
                                                                    <Div css="align-items: center">
                                                                        <Input
                                                                            type="text"
                                                                            placeholder="password"
                                                                            padding="8px"
                                                                            width="224px"
                                                                            value={pass.val}
                                                                            color={colorText}
                                                                            onChange={(e) =>
                                                                                setPass({
                                                                                    ...pass,
                                                                                    val: e.target.value,
                                                                                })
                                                                            }
                                                                        />

                                                                        <ButtonSubmit
                                                                            loading={loadingSub}
                                                                            title="Login"
                                                                            css="width: 50px; margin: 0; button{ background: #135d66;}"
                                                                            onClick={() =>
                                                                                handleLogin(
                                                                                    sub.id,
                                                                                    sub.phoneNumberEmail,
                                                                                    'other',
                                                                                )
                                                                            }
                                                                        />
                                                                    </Div>
                                                                    {error === 'false' && (
                                                                        <P z="1.2rem" color="#c17474">
                                                                            Account's name or password are wrong!
                                                                        </P>
                                                                    )}
                                                                </Div>
                                                            ) : (
                                                                // show button login
                                                                <P
                                                                    z="1.3rem"
                                                                    css=" cursor: var(--pointer); &:hover{color: #9bd6e2;}  background-color: #0074bc; border-radius: 5px; margin-top: 10px; margin-right: 10px; padding: 4px 10px;"
                                                                    onClick={() =>
                                                                        setPass({ id: sub.id, kind: 'login', val: '' })
                                                                    }
                                                                >
                                                                    Login
                                                                </P>
                                                            )}
                                                            <P //View Profile
                                                                z="1.3rem"
                                                                css="width: max-content; cursor: var(--pointer); &:hover{color: #9bd6e2;}  background-color: #8c45c3; border-radius: 5px; margin-top: 10px; padding: 5px;"
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
                                                    </>
                                                ) : (
                                                    // others
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
                                                                    ? 'po'
                                                                    : ''
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
                            </Div>
                        )}
                        {editTitle && editValue !== 10 && (
                            <DivPos
                                top="-2px"
                                right="5px"
                                size="19px"
                                css={`
                                    border-radius: 5px;
                                    box-shadow: 0 0 3px #838383;
                                    padding: 3px 10px;
                                    ${acPrivate === 'subAccount' ? 'box-shadow: 0 0 3px #0b78ac;' : ''}
                                `}
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
                                        <Div css="max-width: 300px; background-color: #0a3c54;position: absolute; right: 64px; top: -35px; flex-wrap: wrap; padding: 10px; border-radius: 5px; background-image: linear-gradient(45deg, #324b47, #000000eb); z-index: 1;">
                                            <H3 css="justify-content: center; border-bottom: 1px solid; margin-bottom: 5px; padding: 0 0 5px; font-size: 1.8rem; width: 100%; display: flex; align-items: center;">
                                                <Div css="margin-right: 5px; font-size: 18px;">
                                                    <AccountI />
                                                </Div>
                                                {' subAccount'}
                                            </H3>
                                            <P
                                                z="1.3rem"
                                                css="background-color: #2a2a2a; margin: 2px 0; width: 100%; text-align: center; padding: 3px 1px; &:hover{color: aliceblue;}"
                                                onClick={() => setPrivacy({ ...privacy, subAccount: 'only' })}
                                            >
                                                Only me!
                                            </P>
                                            <P
                                                z="1.3rem"
                                                css="width: 100%; margin: 2px 0; background-color: #0a7ba7; text-align: center; padding: 3px 1px; &:hover{color: aliceblue;}"
                                                onClick={() => setPrivacy({ ...privacy, subAccount: 'friends' })}
                                            >
                                                Friend
                                            </P>
                                            <P
                                                z="1.3rem"
                                                css="width: 100%; background-color: #138b6f; margin: 2px 0; text-align: center; padding: 3px 1px; &:hover{color: aliceblue;}"
                                                onClick={() => setPrivacy({ ...privacy, subAccount: 'everyone' })}
                                            >
                                                Everyone
                                            </P>
                                            <div style={{ position: 'relative' }}>
                                                <Div
                                                    width="33px"
                                                    css="height: 1px; position: absolute; background-color: #096794; left: 10px; top: -58px;"
                                                ></Div>
                                            </div>{' '}
                                        </Div>
                                    )}
                                    <Div
                                        css={`
                                            &:hover {
                                                color: ${colorText};
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
            {!editTitle && (
                <Div
                    width="100%"
                    onClick={(e) => {
                        e.stopPropagation();
                        setViewMore(!viewMore);
                    }}
                    css={`
                        @media (min-width: 500px) {
                            display: none;
                        }
                        justify-content: center;
                        margin-top: 10px;
                    `}
                >
                    <P z="1.3rem" color={colorText} css="padding: 3px;">
                        {viewMore ? 'Ẩn bớt' : 'Xem thêm'}
                    </P>
                </Div>
            )}
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
                        {loading ? 'Saving...' : 'Save'}
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
                                        {f.type.includes('image')   ? (
                                            <Div width="100%" css="height: 100%">
                                                <Img src={f.file} id="baby" alt={f.file} radius="10px" />
                                            </Div>
                                        ) : f.type.includes('video')  ? (
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
                <UserBar id_loved={id_loved} colorBg={colorBg} position={position} setPosition={setPosition} />
            )}
        </DivTitleP>
    );
};
export default Title;
