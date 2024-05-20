import { useState } from 'react';
import { EarthI, FriendI, PrivateI } from '~/assets/Icons/Icons';

const LogicText = (
    valuePrivacy: {
        id: string;
        name: string;
    }[],
    setTypeExpire: React.Dispatch<
        React.SetStateAction<
            | {
                  cate: number;
                  name: string;
                  value: number;
              }
            | undefined
        >
    >,
    setValuePrivacy: React.Dispatch<
        React.SetStateAction<
            {
                id: string;
                name: string;
            }[]
        >
    >,

    setOpSelect: React.Dispatch<React.SetStateAction<string[]>>,
    setImotions: React.Dispatch<
        React.SetStateAction<
            {
                id: number;
                icon: string;
            }[]
        >
    >,
    Imotions: {
        id: number;
        icon: string;
    }[],

    ImotionsDel: {
        id: number;
        icon: string;
    }[],
    setImotionsDel: React.Dispatch<
        React.SetStateAction<
            {
                id: number;
                icon: string;
            }[]
        >
    >,
    valueSeePost: {
        id: string;
        name: string;
    },
    setValueSeePost: React.Dispatch<
        React.SetStateAction<{
            id: string;
            name: string;
            icon: React.ReactElement;
        }>
    >,
) => {
    const option = [
        {
            id: 1,
            title: {
                name: 'Privacy',
                backgroundImage: 'linear-gradient(47deg, #000000,#25415b,#1b6b3c, transparent)',
                children: [
                    {
                        id: 'emotion',
                        name: `Imotion ${Imotions.map((i) => i.icon).join(' ')}`,
                        icon: [
                            { id: 1, icon: '👍' },
                            { id: 2, icon: '❤️' },
                            { id: 3, icon: '😂' },
                            { id: 4, icon: '😍' },
                            { id: 5, icon: '😘' },
                            { id: 6, icon: '😱' },
                            { id: 7, icon: '😡' },
                        ],
                    },
                    { id: 'comment', name: 'Comment', icon: '' },
                    { id: 'share', name: 'Share', icon: '' },
                    { id: 'anonymousComment', name: 'Anonymous comment', icon: '' },
                ],
            },
        },
        {
            id: 2,
            title: {
                name: 'Who can see your posts',
                backgroundImage: 'linear-gradient(47deg, #000000,#853333,#328585, #161515)',
                children: [
                    { id: 'privacy', name: 'Only me', icon: <PrivateI /> },
                    { id: 'friend', name: 'Friends', icon: <FriendI /> },
                    { id: 'anyone', name: 'Anyone', icon: <EarthI /> },
                ],
            },
        },
    ];
    const privateIndex = option[0].id;
    const seenIndex = option[1].id;

    const handleReset = () => {
        setOpSelect([]);
        setTypeExpire(undefined);
        setValuePrivacy([]);
        setValueSeePost({ id: 'friend', name: 'Friend', icon: <FriendI /> });
        setImotionsDel([]);
        setImotions([
            { id: 1, icon: '👍' },
            { id: 2, icon: '❤️' },
            { id: 3, icon: '😂' },
            { id: 4, icon: '😍' },
            { id: 5, icon: '😘' },
            { id: 6, icon: '😱' },
            { id: 7, icon: '😡' },
        ]);
    };
    const handleFirst = (rs: any, child: any) => {
        // show options selected
        if (rs.id === 1) {
            //set value of Privacy
            let check = false;
            valuePrivacy.forEach((t) => {
                if (t.id === child.id) {
                    check = true;
                }
            });
            if (check) {
                setValuePrivacy(() => valuePrivacy.filter((t) => t.id !== child.id));
            } else {
                setValuePrivacy([...valuePrivacy, { name: child.name, id: child.id }]);
            }
        } else if (rs.id === 2) {
            // set value of Who can see posts
            setValueSeePost({ id: child.id, name: child.name, icon: child.icon });
        }
        //Private and Expire
    };
    const handleImotion = (s: { id: number; icon: string }) => {
        if (Imotions.some((i) => i.id === s.id)) {
            if (!ImotionsDel.some((i) => i.id === s.id)) setImotionsDel([...ImotionsDel, s]);
            setImotions(() => Imotions.filter((I) => I.id !== s.id));
        } else {
            const newID = ImotionsDel.filter((i) => i.id !== s.id);
            setImotionsDel(newID);
            setImotions(() =>
                [
                    { id: 1, icon: '👍' },
                    { id: 2, icon: '❤️' },
                    { id: 3, icon: '😂' },
                    { id: 4, icon: '😍' },
                    { id: 5, icon: '😘' },
                    { id: 6, icon: '😱' },
                    { id: 7, icon: '😡' },
                ].filter((i) => {
                    if (newID.length > 0) {
                        if (!newID.some((iD) => iD.id === i.id)) return i;
                    } else {
                        return i;
                    }
                }),
            );
        }
    };
    return {
        option,
        handleReset,
        handleFirst,
        handleImotion,
        valueSeePost,
        privateIndex,
        seenIndex,
    };
};
export default LogicText;
