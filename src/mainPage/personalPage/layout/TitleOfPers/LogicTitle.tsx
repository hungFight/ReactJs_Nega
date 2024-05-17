import React, { useRef, useState, ReactElement, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PropsUser, PropsUserPer } from 'src/App';
import {
    BirthI,
    CloseI,
    EarthI,
    FriendI,
    GenderFemaleI,
    GenderMaleI,
    GenderOtherI,
    HeartMI,
    HobbyI,
    LanguageI,
    LocationI,
    PeopleI,
    PrivacyI,
    PrivateI,
    SchoolI,
    StarI,
    StrengthI,
    WorkingI,
} from '~/assets/Icons/Icons';
import { ButtonAnimationSurround, DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, H3, Input, P, Span } from '~/reUsingComponents/styleComponents/styleDefault';
import authAPI from '~/restAPI/authAPI/authAPI';
import userAPI from '~/restAPI/userAPI';
import CommonUtils from '~/utils/CommonUtils';
import Gender from '~/utils/Gender';
import handleFileUpload from '~/utils/handleFileUpload';
import Cookies from '~/utils/Cookies';
import { useCookies } from 'react-cookie';
import ServerBusy from '~/utils/ServerBusy';

const LogicTitle = (
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
    setUserFirst: React.Dispatch<React.SetStateAction<PropsUser>>,
    setUsersData: React.Dispatch<React.SetStateAction<PropsUserPer[]>>,
    userRequested: string | null,
    level: number | null,
    userFirst: PropsUser,
) => {
    const { mores } = data;
    const dispatch = useDispatch();

    const [src, setSrc] = useState<{ type: string; file: string }[]>([]);
    const srcUp = useRef<{ file: Blob; type: string }[]>([]);
    const [login, setLogin] = useState<{ userName: string; password: string }>({ userName: '', password: '' });

    const [valUpdate, setValUpdate] = useState<{
        key: string;
        value: string;
    }>();
    const [subAccountsData, setSubAccountsData] = useState<
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

    const [loading, setLoading] = useState<boolean>(false); // save
    const [loadingSub, setLoadingSub] = useState<boolean>(false); // login in subAccount
    const [subAccount, setSubAccount] = useState<boolean>(false);
    const [pass, setPass] = useState<{ id: string; kind: string; val: string }>();
    const { userId } = Cookies();
    const [viewMore, setViewMore] = useState<boolean>(false); // view content

    const itemsT: { icon: React.ReactElement; key: number; qt: number; css?: string | undefined; color: string }[] = [
        { icon: <StarI />, key: 1, qt: mores[0].star, color: '#b6b836' },
        {
            icon: <HeartMI />,
            css: data.id !== userFirst.id ? (id_loved === userFirst.id ? 'color: #c73434 !important' : '') : '',
            key: 2,
            qt: resTitle.love || mores[0].loverAmount,
            color: data.id === userFirst.id ? '#b34343' : '',
        },
        { icon: <FriendI />, key: 3, qt: mores[0].friendAmount, color: data.id === userFirst.id ? '#527cc6' : '' },
        { icon: <PeopleI />, key: 4, qt: mores[0].visitorAmount, color: data.id === userFirst.id ? '#52c6a5' : '' },
    ];
    const itemsP = [
        { icon: 'Follower', key: 5, qt: mores[0].followedAmount, color: '' },
        { icon: 'Following', key: 6, qt: mores[0].followingAmount, color: '' },
    ];
    const itemMemoryBar = [
        { id: 1, name: 'Post' },
        { id: 2, name: 'Photos' },
        { id: 3, name: 'Videos' },
    ];
    const handlePosition = async (id: number) => {
        const res = await userAPI.getMore(dispatch, offset.current, limit);
        setPosition(id);
    };
    const handleAddFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files;
        if (file) {
            const { getFilesToPrePer, upLoadPer } = await handleFileUpload(file, 10, 8, 10, dispatch, 'per', false);
            setSrc(getFilesToPrePer);
            srcUp.current = upLoadPer;
        }
    };
    function whoCanSee(key: string) {
        return key === 'friends' && level === 2 ? true : key === 'only' ? false : key === 'everyone' ? true : false;
    }
    const [acPrivate, setAcPrivate] = useState<string>('');
    const [privacy, setPrivacy] = useState<{
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
    }>(mores[0].privacy);

    const [ObjectRender, setObjectRender] = useState<{
        [address: string]: {
            val: string;
            placeholder: string;
            icon: ReactElement;
            color: string;
            length: number;
            private: ReactElement;
            letPrivate: string;
        };
        gender: {
            val: string;
            placeholder: string;
            color: string;
            icon: ReactElement;
            length: number;
            private: ReactElement;
            letPrivate: string;
        };
        birthday: {
            val: string;
            placeholder: string;
            icon: ReactElement;
            length: number;
            private: ReactElement;
            color: string;
            letPrivate: string;
        };
        relationship: {
            val: string;
            placeholder: string;
            icon: ReactElement;
            length: number;
            color: string;
            private: ReactElement;
            letPrivate: string;
        };
        occupation: {
            val: string;
            placeholder: string;
            icon: ReactElement;
            color: string;
            length: number;
            private: ReactElement;
            letPrivate: string;
        };
        schoolName: {
            val: string;
            placeholder: string;
            icon: ReactElement;
            color: string;
            length: number;
            private: ReactElement;
            letPrivate: string;
        };
    }>({
        address: {
            val: data.address,
            placeholder: 'Address',
            icon: <LocationI />,
            color: '#d1a2fdc4',
            length: 240,
            private: privacy.address === 'only' ? <PrivateI /> : privacy.address === 'friends' ? <FriendI /> : <EarthI />,
            letPrivate: mores[0].privacy.address,
        },
        gender: {
            val: data.gender ? Gender(data.gender).string : '',
            placeholder: 'Gender',
            icon: <GenderMaleI />,
            color: '',
            length: 1,
            private: privacy.gender === 'only' ? <PrivateI /> : privacy.gender === 'friends' ? <FriendI /> : <EarthI />,
            letPrivate: mores[0].privacy.gender,
        },
        birthday: {
            val: data.birthday,
            placeholder: 'Birthday',
            icon: <BirthI />,
            color: 'antiquewhite',
            length: 10,
            private: privacy.birthday === 'only' ? <PrivateI /> : privacy.birthday === 'friends' ? <FriendI /> : <EarthI />,
            letPrivate: mores[0].privacy.birthday,
        },
        relationship: {
            val: mores[0].relationship,
            placeholder: 'Relationship',
            icon: <HeartMI />,
            color: '#c13b55',
            length: 20,
            private: privacy.relationship === 'only' ? <PrivateI /> : privacy.relationship === 'friends' ? <FriendI /> : <EarthI />,
            letPrivate: mores[0].privacy.relationship,
        },
        occupation: {
            val: data.occupation,
            placeholder: 'Occupation',
            icon: <WorkingI />,
            color: '#d3d859',
            length: 95,
            private: privacy.occupation === 'only' ? <PrivateI /> : privacy.occupation === 'friends' ? <FriendI /> : <EarthI />,
            letPrivate: mores[0].privacy.occupation,
        },
        schoolName: {
            val: data.schoolName,
            placeholder: 'School Name',
            color: '#2eabc0',
            icon: <SchoolI />,
            length: 95,
            private: privacy.schoolName === 'only' ? <PrivateI /> : privacy.schoolName === 'friends' ? <FriendI /> : <EarthI />,
            letPrivate: mores[0].privacy.schoolName,
        },
    });
    const [ArrayRender, setArrayRender] = useState<{
        [hobby: string]: {
            val: string[];
            placeholder: string;
            color: string;
            icon: ReactElement;
            subVal: string;
            private: ReactElement;
            letPrivate: string;
        };
        skill: {
            val: string[];
            placeholder: string;
            color: string;
            icon: ReactElement;
            subVal: string;
            private: ReactElement;
            letPrivate: string;
        };
        language: {
            val: string[];
            placeholder: string;
            color: string;
            icon: ReactElement;
            subVal: string;
            private: ReactElement;
            letPrivate: string;
        };
    }>({
        hobby: {
            val: data.hobby ?? [],
            placeholder: 'Hobbies',
            icon: <HobbyI />,
            color: '#4da15f',
            subVal: '',
            private: privacy.hobby === 'only' ? <PrivateI /> : privacy.hobby === 'friends' ? <FriendI /> : <EarthI />,
            letPrivate: mores[0].privacy.hobby,
        },
        skill: {
            val: data.skill ?? [],
            placeholder: 'Skills',
            icon: <StrengthI />,
            color: 'deeppink',
            subVal: '',
            private: privacy.skill === 'only' ? <PrivateI /> : privacy.skill === 'friends' ? <FriendI /> : <EarthI />,
            letPrivate: mores[0].privacy.skill,
        },
        language: {
            val: mores[0].language ?? [],
            placeholder: 'Languages',
            color: 'pink',
            icon: <LanguageI />,
            subVal: '',
            private: privacy.language === 'only' ? <PrivateI /> : privacy.language === 'friends' ? <FriendI /> : <EarthI />,
            letPrivate: mores[0].privacy.language,
        },
    });
    const ob = {
        address: {
            val: ObjectRender.address.val,
            placeholder: 'Address',
            color: '#d1a2fdc4',
            icon: <LocationI />,
            length: 240,
            private: privacy.address === 'only' ? <PrivateI /> : privacy.address === 'friends' ? <FriendI /> : <EarthI />,
            letPrivate: mores[0].privacy.address,
        },
        gender: {
            val: ObjectRender.gender.val,
            placeholder: 'Gender',
            icon: <GenderMaleI />,
            color: '',
            length: 1,
            private: privacy.gender === 'only' ? <PrivateI /> : privacy.gender === 'friends' ? <FriendI /> : <EarthI />,
            letPrivate: mores[0].privacy.gender,
        },
        birthday: {
            val: ObjectRender.birthday.val,
            placeholder: 'Birthday',
            color: 'antiquewhite',
            icon: <BirthI />,
            length: 10,
            private: privacy.birthday === 'only' ? <PrivateI /> : privacy.birthday === 'friends' ? <FriendI /> : <EarthI />,
            letPrivate: mores[0].privacy.birthday,
        },
        relationship: {
            val: ObjectRender.relationship.val,
            placeholder: 'Relationship',
            color: '#c13b55',
            icon: <HeartMI />,
            length: 20,
            private: privacy.relationship === 'only' ? <PrivateI /> : privacy.relationship === 'friends' ? <FriendI /> : <EarthI />,
            letPrivate: mores[0].privacy.relationship,
        },
        occupation: {
            val: ObjectRender.occupation.val,
            placeholder: 'Occupation',
            icon: <WorkingI />,
            color: '#d3d859',
            length: 95,
            private: privacy.occupation === 'only' ? <PrivateI /> : privacy.occupation === 'friends' ? <FriendI /> : <EarthI />,
            letPrivate: mores[0].privacy.occupation,
        },
        schoolName: {
            val: ObjectRender.schoolName.val,
            placeholder: 'School Name',
            icon: <SchoolI />,
            color: '#2eabc0',
            length: 95,
            private: privacy.schoolName === 'only' ? <PrivateI /> : privacy.schoolName === 'friends' ? <FriendI /> : <EarthI />,
            letPrivate: mores[0].privacy.schoolName,
        },
    };
    const ar = {
        hobby: {
            val: ArrayRender.hobby.val,
            placeholder: 'Hobbies',
            icon: <HobbyI />,
            color: '#4da15f',
            subVal: '',
            private: privacy.hobby === 'only' ? <PrivateI /> : privacy.hobby === 'friends' ? <FriendI /> : <EarthI />,
            letPrivate: mores[0].privacy.hobby,
        },
        skill: {
            val: ArrayRender.skill.val,
            placeholder: 'Skills',
            icon: <StrengthI />,
            color: 'deeppink',
            subVal: '',
            private: privacy.skill === 'only' ? <PrivateI /> : privacy.skill === 'friends' ? <FriendI /> : <EarthI />,
            letPrivate: mores[0].privacy.skill,
        },
        language: {
            val: ArrayRender.language.val,
            placeholder: 'Languages',
            color: 'pink',
            icon: <LanguageI />,
            subVal: '',
            private: privacy.language === 'only' ? <PrivateI /> : privacy.language === 'friends' ? <FriendI /> : <EarthI />,
            letPrivate: mores[0].privacy.language,
        },
    };
    console.log('title__', ObjectRender);

    const renderInfo = (res: string, placeholder: string, icon: ReactElement, key: string, length: number, privates: ReactElement, color: string) => {
        return (
            <Div
                key={key}
                width="100%"
                css={`
                    align-items: center;
                    font-size: 18px;
                    margin-bottom: 8px;
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
                    css={`
                        margin-right: 2px;
                        position: relative;
                        color: ${color};
                        ${ObjectRender[key].val === 'Female' ? 'color: #c36aca' : ObjectRender[key].val === 'Male' ? 'color: #5397c7;' : ObjectRender[key].val === 'Other' ? 'color: #4e9c8b;' : ''};

                        ${editValue === key && editTitle && key !== 'gender' ? 'position: absolute; top: 37px; z-index: 1;' : ''}
                    `}
                    onClick={(e) => e.stopPropagation()}
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
                                <ButtonAnimationSurround title="As I want" css="margin: 0; width: 20%;" onClick={() => setEditValue(undefined)} />
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
                        {editTitle && <DivPos right="0" css="padding: 6px;" onClick={(e: { stopPropagation: () => void }) => e.stopPropagation()}></DivPos>}
                    </>
                )}
                {editTitle && editValue !== key && (
                    <DivPos
                        top="0px"
                        right="5px"
                        size="19px"
                        css={`
                            border-radius: 5px;
                            box-shadow: 0 0 3px #838383;
                            padding: 3px 10px;
                            z-index: 3;
                            ${acPrivate === key ? 'box-shadow: 0 0 3px #0b78ac;' : ''}
                        `}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (acPrivate === key) {
                                setAcPrivate('');
                            } else {
                                setAcPrivate(key);
                            }
                        }}
                    >
                        <Div css="position: relative;">
                            {acPrivate === key && (
                                <Div
                                    width="140px"
                                    css=" max-width: 300px; background-color: #0a3c54; position: absolute; right: 64px; top: -35px; flex-wrap: wrap; padding: 10px; border-radius: 5px;  z-index: 1;"
                                >
                                    <H3 css="justify-content: center; border-bottom: 1px solid; margin-bottom: 5px; padding: 0 0 5px;font-size: 1.8rem; width: 100%; display: flex; align-items: center;">
                                        <Div css="margin-right: 5px; font-size: 18px;">{icon}</Div>
                                        <P z="1.4rem">{key}</P>
                                    </H3>
                                    <P
                                        z="1.3rem"
                                        css="width: 100%; background-color: #2a2a2a; margin: 2px 0; text-align: center; padding: 3px 1px; &:hover{color: aliceblue;}"
                                        onClick={() => setPrivacy({ ...privacy, [key]: 'only' })}
                                    >
                                        Only me!
                                    </P>
                                    <P
                                        z="1.3rem"
                                        css="width: 100%; text-align: center; margin: 2px 0; background-color: #0a7ba7; padding: 3px 1px; &:hover{color: aliceblue;}"
                                        onClick={() => setPrivacy({ ...privacy, [key]: 'friends' })}
                                    >
                                        Friend
                                    </P>
                                    <P
                                        z="1.3rem"
                                        css="width: 100%; background-color: #138b6f; margin: 2px 0; text-align: center; padding: 3px 1px; &:hover{color: aliceblue;}"
                                        onClick={() => setPrivacy({ ...privacy, [key]: 'everyone' })}
                                    >
                                        Everyone
                                    </P>{' '}
                                    <div style={{ position: 'relative' }}>
                                        <Div width="33px" css="height: 1px; position: absolute; background-color: #096794; left: 10px; top: -58px;"></Div>
                                    </div>{' '}
                                </Div>
                            )}
                            <Div
                                css={`
                                    &:hover {
                                        color: #3db972;
                                    }
                                    ${acPrivate === key ? 'color: #3db972;' : ''}
                                `}
                            >
                                {privates}
                            </Div>
                        </Div>
                    </DivPos>
                )}
            </Div>
        );
    };
    let check = false;
    if (
        //check previvous data has the same with new data?
        data.address !== ObjectRender.address?.val ||
        data.birthday !== ObjectRender.birthday?.val ||
        data.occupation !== ObjectRender.occupation?.val ||
        data.gender !== Gender(ObjectRender.gender?.val).number ||
        data.schoolName !== ObjectRender.schoolName?.val ||
        JSON.stringify(data.hobby) !== JSON.stringify(ArrayRender.hobby?.val) ||
        JSON.stringify(data.skill) !== JSON.stringify(ArrayRender.skill?.val) ||
        JSON.stringify(mores[0].language) !== JSON.stringify(ArrayRender.language?.val) ||
        mores[0].relationship !== ObjectRender.relationship?.val ||
        JSON.stringify(mores[0].privacy) !== JSON.stringify(privacy)
    ) {
        check = true;
    }

    useEffect(() => {
        setObjectRender(ob);
        setArrayRender(ar);
        setSubAccountsData(data.accountUser);
    }, [privacy]);
    useEffect(() => {
        const obs = {
            address: {
                val: data.address,
                placeholder: 'Address',
                icon: <LocationI />,
                color: '#d1a2fdc4',
                length: 240,
                private: mores[0].privacy.address === 'only' ? <PrivateI /> : mores[0].privacy.address === 'friends' ? <FriendI /> : <EarthI />,
                letPrivate: mores[0].privacy.address,
            },
            gender: {
                val: data.gender ? Gender(data.gender).string : '',
                placeholder: 'Gender',
                color: '',
                icon: <GenderMaleI />,
                length: 1,
                private: mores[0].privacy.gender === 'only' ? <PrivateI /> : mores[0].privacy.gender === 'friends' ? <FriendI /> : <EarthI />,
                letPrivate: mores[0].privacy.gender,
            },
            birthday: {
                val: data.birthday,
                placeholder: 'Birthday',
                color: 'antiquewhite',
                icon: <BirthI />,
                length: 10,
                private: mores[0].privacy.birthday === 'only' ? <PrivateI /> : mores[0].privacy.birthday === 'friends' ? <FriendI /> : <EarthI />,
                letPrivate: mores[0].privacy.birthday,
            },
            relationship: {
                val: mores[0].relationship,
                placeholder: 'Relationship',
                color: '#c13b55',
                icon: <HeartMI />,
                length: 20,
                private: mores[0].privacy.relationship === 'only' ? <PrivateI /> : mores[0].privacy.relationship === 'friends' ? <FriendI /> : <EarthI />,
                letPrivate: mores[0].privacy.relationship,
            },
            occupation: {
                val: data.occupation,
                placeholder: 'Occupation',
                color: '#d3d859',
                icon: <WorkingI />,
                length: 95,
                private: mores[0].privacy.occupation === 'only' ? <PrivateI /> : mores[0].privacy.occupation === 'friends' ? <FriendI /> : <EarthI />,
                letPrivate: mores[0].privacy.occupation,
            },
            schoolName: {
                val: data.schoolName,
                placeholder: 'School Name',
                icon: <SchoolI />,
                color: '#2eabc0',
                length: 95,
                private: mores[0].privacy.schoolName === 'only' ? <PrivateI /> : mores[0].privacy.schoolName === 'friends' ? <FriendI /> : <EarthI />,
                letPrivate: mores[0].privacy.schoolName,
            },
        };
        const ars = {
            hobby: {
                val: data.hobby,
                placeholder: 'Hobbies',
                icon: <HobbyI />,
                color: '#4da15f',
                subVal: '',
                private: mores[0].privacy.hobby === 'only' ? <PrivateI /> : mores[0].privacy.hobby === 'friends' ? <FriendI /> : <EarthI />,
                letPrivate: mores[0].privacy.hobby,
            },
            skill: {
                val: data.skill,
                placeholder: 'Skills',
                icon: <StrengthI />,
                color: 'deeppink',
                subVal: '',
                private: mores[0].privacy.skill === 'only' ? <PrivateI /> : mores[0].privacy.skill === 'friends' ? <FriendI /> : <EarthI />,
                letPrivate: mores[0].privacy.skill,
            },
            language: {
                val: mores[0].language,
                placeholder: 'Languages',
                icon: <LanguageI />,
                color: 'pink',
                subVal: '',
                private: mores[0].privacy.language === 'only' ? <PrivateI /> : mores[0].privacy.language === 'friends' ? <FriendI /> : <EarthI />,
                letPrivate: mores[0].privacy.language,
            },
        };
        setObjectRender(obs);
        setArrayRender(ars);
        setSubAccountsData(data.accountUser);
    }, [data]);
    const renderArrayInfo = (
        // array data
        res: string[],
        placeholder: string,
        icon: ReactElement,
        key: string,
        privates: ReactElement,
        color: string,
    ) => {
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
                        color: ${color};
                        ${editValue === key && editTitle ? 'position: absolute; top: 37px;' : ''}
                    `}
                    onClick={(e) => e.stopPropagation()}
                >
                    {icon}
                </Div>
                {editValue === key && editTitle ? (
                    <Div width="100%" wrap="wrap" css="align-items: center; border-bottom: 1px solid #517ea1;" onClick={(e) => e.stopPropagation()}>
                        <Div width="100%" css="align-items: center;">
                            <Input
                                ref={inputRef}
                                type="text"
                                className={'resetKeyss:' + key}
                                width="75%"
                                placeholder={placeholder}
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
                            <ButtonAnimationSurround
                                title="Apply"
                                css="margin: 0; width: 20%; button{ background: #135d66;}"
                                onClick={() => {
                                    if (!ArrayRender[key].val.some((s) => s === ArrayRender[key].subVal) && ArrayRender[key].subVal) {
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
                            <ButtonAnimationSurround
                                title="That's all "
                                css={`
                                    margin: 0;
                                    width: 20%;
                                    button {
                                        background: #914142;
                                    }
                                `}
                                onClick={() => {
                                    if (!ArrayRender[key].val.some((s) => s === ArrayRender[key].subVal) && ArrayRender[key].subVal) {
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
                                    {va}
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
                {editTitle && editValue !== key && (
                    <DivPos
                        top="0px"
                        right="5px"
                        size="19px"
                        css={`
                            border-radius: 5px;
                            box-shadow: 0 0 3px #838383;
                            z-index: 3;
                            padding: 3px 10px;
                            ${acPrivate === key ? 'box-shadow: 0 0 3px #0b78ac;' : ''}
                        `}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (acPrivate === key) {
                                setAcPrivate('');
                            } else {
                                setAcPrivate(key);
                            }
                        }}
                    >
                        <Div css="position: relative;">
                            {acPrivate === key && (
                                <Div
                                    width="140px"
                                    css="max-width: 300px; background-color: #0a3c54; position: absolute; right: 64px; top: -35px; flex-wrap: wrap; padding: 10px; border-radius: 5px; z-index: 1;"
                                >
                                    <H3 css="justify-content: center; border-bottom: 1px solid; margin-bottom: 5px; padding: 0 0 5px; font-size: 1.8rem; width: 100%; display: flex; align-items: center;">
                                        <Div css="margin-right: 5px; font-size: 18px;">{icon}</Div>
                                        {' ' + key}
                                    </H3>
                                    <P
                                        z="1.3rem"
                                        css="width: 100%; background-color: #2a2a2a; margin: 2px 0; text-align: center; padding: 3px 1px; &:hover{color: aliceblue;}"
                                        onClick={() => setPrivacy({ ...privacy, [key]: 'only' })}
                                    >
                                        Only me!
                                    </P>
                                    <P
                                        z="1.3rem"
                                        css="width: 100%; margin: 2px 0; background-color: #0a7ba7; text-align: center; padding: 3px 1px; &:hover{color: aliceblue;}"
                                        onClick={() => setPrivacy({ ...privacy, [key]: 'friends' })}
                                    >
                                        Friend
                                    </P>
                                    <P
                                        z="1.3rem"
                                        css="width: 100%;  background-color: #138b6f; margin: 2px 0; text-align: center; padding: 3px 1px; &:hover{color: aliceblue;}"
                                        onClick={() => setPrivacy({ ...privacy, [key]: 'everyone' })}
                                    >
                                        Everyone
                                    </P>{' '}
                                    <div style={{ position: 'relative' }}>
                                        <Div width="33px" css="height: 1px; position: absolute; background-color: #096794; left: 10px; top: -58px;"></Div>
                                    </div>{' '}
                                </Div>
                            )}
                            <Div
                                css={`
                                    &:hover {
                                        color: #3db972;
                                    }
                                    ${acPrivate === key ? 'color: #3db972;' : ''}
                                `}
                            >
                                {privates}
                            </Div>
                        </Div>
                    </DivPos>
                )}
            </Div>
        );
    };
    const handleEdit = async () => {
        setLoading(true);
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
        const privacyF: typeof privacy = privacy;
        Object.keys(privacy).map((key) => {
            if (privacy[key] !== mores[0].privacy[key]) {
                checks = true;
            }
        });

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
            const res: { countUser: number; countMores: number } = await userAPI.changesMany(dispatch, paramsUser, paramsMores, privacyF);
            if (res.countUser || res.countMores) {
                setUsersData((pre) =>
                    pre.map((us) => {
                        if (us.id === data.id) {
                            return {
                                ...data,
                                ...paramsUser,
                                mores: [{ ...data.mores[0], ...paramsMores, privacy: privacyF }],
                            };
                        }
                        return us;
                    }),
                );
                setEditTitle(false);
            }
        }
        setLoading(false);
    };
    const handleLogin = async (id?: string, phoneOrEmail?: string, other?: string) => {
        const preId = data.id;
        setError(undefined);
        if (other) {
            // login to change account here
            if (id && phoneOrEmail && pass?.val) {
                setLoadingSub(true);
                const res: typeof data = await authAPI.subLogin(phoneOrEmail, pass.val, other, id); // account's id is logging in
                if (res) {
                    res.avatar = CommonUtils.convertBase64(res.avatar);
                    res.background = CommonUtils.convertBase64(res.background);
                    setUserFirst({
                        id: res.id,
                        fullName: res.fullName,
                        gender: res.gender,
                        active: res.active,
                        avatar: res.avatar,
                        background: res.background,
                        biography: res.biography,
                        firstPage: res.firstPage,
                        secondPage: res.secondPage,
                        thirdPage: res.thirdPage,
                    });
                    setUsersData((pre) => {
                        // of personal
                        let checksF = false;
                        pre.forEach((us) => {
                            if (us.id === res.id) {
                                checksF = true; //check is it existing?
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
                            const newUs = pre.filter((us) => us.id !== data.id); // remove
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
                } else {
                    setError('false');
                }
                setLoadingSub(false);
            }
        } else {
            // add more here
            if (login.userName && login.password) {
                setLoadingSub(true);
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
                setLoadingSub(false);
                if (res) {
                    setSubAccountsData([...(subAccountsData ?? []), res]);
                    setLogin({ userName: '', password: '' });
                    setError('ok');
                } else {
                    setError(null);
                }
            }
        }
    };
    const handleDelSubAc = async (id: string, phoneOREmail: string) => {
        if (id && phoneOREmail) {
            const res = await userAPI.delSubAccount(dispatch, id, phoneOREmail);
            if (res) setSubAccountsData((pre) => pre.filter((sub) => sub.account.id !== id));
        }
    };
    return {
        srcUp,
        login,
        setLogin,
        valUpdate,
        setValUpdate,
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
    };
};
export default LogicTitle;
