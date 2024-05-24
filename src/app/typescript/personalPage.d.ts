export interface PropsConFirmFriend {
    follower: {
        id: string;
        idFollowing: string;
        idIsFollowed: string;
        following: number;
        followed: number;
        createdAt: Date;
        updatedAt: Date;
    };
    ok: {
        createdAt: string;
        id: string;
        idIsRequested: string;
        idRequest: string;
        level: number;
        updatedAt: string;
        userRequest: {
            address: string;
            birthday: string;
            biography: string;
            gender: number;
            hobby: string[];
            skill: string[];
            occupation: string;
            schoolName: string;
            mores: {
                id: string;
                position: string;
                star: number;
                loverAmount: number;
                friendAmount: number;
                visitorAmount: number;
                followedAmount: number;
                followingAmount: number;
                relationship: string;
                language: string[];
                privacy: PropsPrivacy;
                createdAt: string;
                updatedAt: string;
            }[];
        };
    };
}
export interface PropsPrivacy {
    [position: string]: 'everyone' | 'friends' | 'only';
    address: 'everyone' | 'friends' | 'only';
    birthday: 'everyone' | 'friends' | 'only';
    relationship: 'everyone' | 'friends' | 'only';
    gender: 'everyone' | 'friends' | 'only';
    schoolName: 'everyone' | 'friends' | 'only';
    occupation: 'everyone' | 'friends' | 'only';
    hobby: 'everyone' | 'friends' | 'only';
    skill: 'everyone' | 'friends' | 'only';
    language: 'everyone' | 'friends' | 'only';
    subAccount: 'everyone' | 'friends' | 'only';
}
export interface PropsConFirmFriendSocket {
    ok: {
        id: string;
        idRequest: string;
        idIsRequested: string;
        level: number;
        createdAt: Date;
        updatedAt: Date;
        userIsRequested: {
            address: string;
            birthday: string;
            biography: string;
            gender: number;
            hobby: string[];
            skill: string[];
            occupation: string;
            schoolName: string;
            mores: {
                id: string;
                position: string;
                star: number;
                loverAmount: number;
                friendAmount: number;
                visitorAmount: number;
                followedAmount: number;
                followingAmount: number;
                relationship: string;
                language: string[];
                privacy: PropsPrivacy;
                createdAt: string;
                updatedAt: string;
            }[];
        };
    };
    youId: string;
    userId: string;
    count_following_other: number;
    count_followed_other: number;
    count_friends_other: number;
}
