import React, { useState, useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '../../app/reUsingComponents/Avatars/Avatar';

import { Buttons, Div, P } from '../../app/reUsingComponents/styleComponents/styleDefault';
import { DivFlexPosition, DivLoading, Hname } from '../../app/reUsingComponents/styleComponents/styleComponents';
import { DivPersonalPage } from '../styleNextWeb';
import { DivPerson, InputChangeP } from './stypePersonal';
import { setNewProfile } from '../../app/redux/hideShow';
import Title from './layout/TitleOfPers/Title';
import { CheckI, DotI, HeartI, HeartMI, UndoI } from '~/assets/Icons/Icons';
import { Label } from '~/social_network/components/Header/layout/Home/Layout/FormUpNews/styleFormUpNews';
import SettingEditPersonal from './layout/Setting/SettingEditPersonal';
import LogicView from './logicPersonal';
import SettingOtherProfile from './layout/Setting/SettingOtherProfile';
import Image from '~/reUsingComponents/Avatars/Image';
import { PropsUser, PropsUserPer } from '~/typescript/userType';

interface PropsPer {
    AllArray: PropsUserPer[];
    where?: string;
    setUsersData: React.Dispatch<React.SetStateAction<PropsUserPer[]>>;
    user: PropsUserPer;
    leng: number;
    index: number;
    colorText: string;
    colorBg: number;
    online: string[];
    setUserFirst: React.Dispatch<React.SetStateAction<PropsUser>>;
    userFirst: PropsUser;
    setId_chats: React.Dispatch<
        React.SetStateAction<
            {
                id_room?: string;
                id_other: string;
            }[]
        >
    >;
    handleCheck: React.MutableRefObject<boolean>;
}

const PersonalPage: React.FC<PropsPer> = ({ AllArray, where, setUsersData, user, leng = 1, index, colorText, colorBg, online, userFirst, setUserFirst, setId_chats, handleCheck }) => {
    const [editTitle, setEditTitle] = useState<boolean>(false);
    const {
        edit,
        setEdit,
        loading,
        valueName,
        setValueName,
        categories,
        setCategories,
        errText,
        setErrText,
        room,
        setRoom,
        resTitle,
        handleChangeAvatar,
        handleNameU,
        handleLoves,
        handleEdit,
        handleChangeText,
        handleVName,
        editDataText,
        editDataTextOther,
        lg,
        cssBg,
        cssName,
        cssBt,
        css,
        cssDivPersonalPage,
        cssAvatar,
        btss,
        btName,
        id_loved,
        userRequest,
        userRequested,
        level,
        openProfile,
        dispatch,
        loads,
        setMore,
        more,
    } = LogicView(user, userFirst, setUserFirst, leng, online, setId_chats, setUsersData, index, AllArray, colorText, where);
    console.log(colorText, 'colorText');

    const inputChange = (onEvent: (e: any) => void, value: string, holder: string) => {
        return (
            <Div width="196px" wrap="wrap" css="position: relative; @media(min-width: 600px){width: 250px}">
                <InputChangeP id="h" placeholder={holder} color={colorText} value={value} onChange={onEvent} />
                <Label
                    htmlFor="h"
                    css={`
                        font-size: 1.2rem;
                        position: absolute;
                        right: 5px;
                        top: 5px;
                        @media (min-width: 600px) {
                            top: 7px;
                        }
                    `}
                >
                    {value.length} / 30
                </Label>
            </Div>
        );
    };
    const cssMoreAva = online.includes(user.id) ? 'border: 1px solid #418a7a;' : 'border: 1px solid #696969;';
    const handleUndo = (e: { stopPropagation: () => void }) => {
        e.stopPropagation();
        handleCheck.current = true;
        setUsersData((pre) => pre.filter((us) => us.id !== user.id));
        const newPr = openProfile.newProfile.filter((op) => op !== user.id);
        dispatch(setNewProfile(newPr));
    };
    return (
        <Div
            id={`profiles${user.id}`}
            css={css}
            onClick={() => {
                if (more) setMore(false); //option's friend button
                if (edit) setEdit(false); // setting
            }}
        >
            {(room.background || room.avatar) && (
                <DivFlexPosition position="fixed" size="30px" top="20px" right="12px" css="z-index: 1;" index={8888} onClick={() => setRoom({ avatar: false, background: false })}>
                    <UndoI />
                </DivFlexPosition>
            )}

            {AllArray.length > 1 && (
                <DivFlexPosition size="30px" top="20px" right="11px" onClick={handleUndo}>
                    <UndoI />
                </DivFlexPosition>
            )}
            <DivPerson>
                <Div css={cssBg}>
                    {/* {user?.background && ( */}
                    {user.background && (
                        <Image
                            src={user.background}
                            fullName={user?.fullName}
                            onClick={() => {
                                setRoom({ ...room, background: !room.background });
                            }}
                        />
                    )}
                    {/* )} */}
                </Div>
                {/* <div className={clsx(styles.close)} onClick={handlePersonalPage}>
                <CloseI />
            </div> */}

                <DivPersonalPage width="90%" height="44px" margin="auto" css={cssDivPersonalPage}>
                    <Div
                        css={cssAvatar + cssMoreAva}
                        onClick={() => {
                            setRoom({ ...room, avatar: !room.avatar });
                        }}
                    >
                        <Avatar src={user.avatar} alt={user.fullName} gender={user?.gender} radius="50%" css="z-index: 1; cursor: var(--pointerM);" />
                        {loading && (
                            <DivLoading
                                css={`
                                    position: absolute;
                                    top: -61px;
                                    right: 50%;
                                    left: 50%;
                                    translate: -50%;
                                `}
                            >
                                <Div
                                    css={`
                                        width: 70px;
                                        height: 200px;
                                        animation: bg-color-animation 5s infinite;
                                        @keyframes bg-color-animation {
                                            0% {
                                                background-color: #f67575;
                                            }
                                            10% {
                                                background-color: #fdf982;
                                            }
                                            20% {
                                                background-color: #97ff60;
                                            }
                                            30% {
                                                background-color: #904ef3;
                                            }
                                            40% {
                                                background-color: #7360ed;
                                            }
                                            50% {
                                                background-color: #ff7cf0;
                                            }
                                            60% {
                                                background-color: #88f588;
                                            }
                                            70% {
                                                background-color: #88cff5;
                                            }
                                            80% {
                                                background-color: #eef080;
                                            }
                                            90% {
                                                background-color: #ffffff;
                                            }
                                            100% {
                                                background-color: #373937;
                                            }
                                        }
                                    `}
                                ></Div>
                            </DivLoading>
                        )}
                    </Div>

                    <Div css={cssName}>
                        <Hname
                            css={`
                                @media (min-width: 600px) {
                                    font-size: 1.6rem;
                                }
                            `}
                        >
                            {valueName || user.fullName}
                        </Hname>
                        {categories === 2 && inputChange(handleVName, valueName, user.fullName)}
                        {user.id !== userFirst.id && (
                            <DivFlexPosition
                                size="25px"
                                color={colorText}
                                bottom="4px"
                                right="10%"
                                css={`
                                    z-index: 1;
                                    @media (min-width: 600px) {
                                        bottom: 1px;
                                        font-size: 30px;
                                        p {
                                            right: 16px;
                                        }
                                    }
                                `}
                                onClick={handleLoves}
                            >
                                <HeartI />
                                <Div
                                    css={`
                                        position: absolute;
                                        color: #444646;
                                        font-size: 17px;
                                        right: 4px;
                                        @media (min-width: 600px) {
                                            font-size: 22px;
                                            right: 4px;
                                        }
                                        ${(id_loved === userFirst.id || resTitle.love === 1) && 'color: #c73434; '}
                                    `}
                                >
                                    <HeartMI />
                                </Div>
                                <P z="26px" css="position: absolute;  color: #7c8787; right: 13px; z-index: 6; top: -17px;">
                                    .
                                </P>
                            </DivFlexPosition>
                        )}
                    </Div>
                    {categories === 0 && (
                        <DivFlexPosition
                            size="25px"
                            right="0"
                            css={`
                                ${edit ? 'width: 50px; background-color: #383838; border-radius: 5px !important; border: 1px solid #4b4848;' : ''};
                                width: 50px;
                                top: 27px;
                                background-color: #383838;
                                border-radius: 5px;
                                border: 1px solid #4b4848;
                            `}
                            onClick={handleEdit}
                        >
                            <DotI />
                        </DivFlexPosition>
                    )}
                    {edit && (
                        <>
                            {userFirst.id === user.id ? (
                                <SettingEditPersonal
                                    AllArray={AllArray}
                                    userId={user.id}
                                    editP={editDataText[lg]}
                                    onClick={handleChangeAvatar}
                                    onText={handleChangeText}
                                    colorText={colorText}
                                    editTitle={editTitle}
                                    setEditTitle={setEditTitle}
                                    setEdit={setEdit}
                                />
                            ) : (
                                <SettingOtherProfile editP={editDataTextOther[lg]} setEdit={setEdit} AllArray={AllArray} userId={user.id} colorText={colorText} />
                            )}
                        </>
                    )}
                </DivPersonalPage>
                {categories === 2 && (
                    <Div width="200px" css="margin: 55px auto 0; justify-content: space-evenly;">
                        <Buttons
                            text={[
                                {
                                    text: btName[lg].del,
                                    css: cssBt + 'background-color: #781111;',
                                    onClick: () => {
                                        setCategories(0);
                                        setErrText('');
                                        setValueName('');
                                    },
                                },
                            ]}
                        />

                        <Buttons
                            text={[
                                {
                                    text: btName[lg].ok,
                                    css: cssBt + 'background-color: #214795;',
                                    onClick: handleNameU,
                                },
                            ]}
                        >
                            <CheckI />
                        </Buttons>
                    </Div>
                )}
                <P color={colorText} css="width: 100%; padding: 10px; @media (min-width: 600px) {font-size: 1.3rem;}" z="1.2rem">
                    {errText}
                </P>
                {user.id !== userFirst.id && (
                    <Div
                        width="95%"
                        css={`
                            justify-content: center;
                            margin: 46px auto 0;
                            position: relative;
                            @media (min-width: 500px) {
                                justify-content: right;
                            }
                        `}
                    >
                        <Buttons text={btss} />
                    </Div>
                )}
                <Title
                    userFirst={userFirst}
                    setUserFirst={setUserFirst}
                    setUsersData={setUsersData}
                    AllArray={AllArray}
                    id_loved={id_loved}
                    resTitle={resTitle}
                    id_o={userRequest}
                    userRequested={userRequested}
                    level={level}
                    colorText={colorText}
                    colorBg={colorBg}
                    data={user}
                    status={user.biography}
                    editTitle={editTitle}
                    setEditTitle={setEditTitle}
                />
                {/* <DivIntr>
                    <DivStories>
                        <DivOp>
                            <DivItems>post</DivItems>
                            <DivItems>
                                <Button f friend />
                            </DivItems>
                        </DivOp>
                        <Part />
                        <div className={clsx(styles.results)}>hello it's my friend</div>
                    </DivStories>
                </DivIntr> */}
            </DivPerson>
        </Div>
    );
};
export default memo(PersonalPage);
