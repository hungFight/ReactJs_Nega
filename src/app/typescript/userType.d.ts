export interface PropsUser {
    readonly id: string;
    avatar: any;
    fullName: string;
    gender: number;
    background: any;
    biography: string;
    firstPage: string;
    secondPage: string;
    thirdPage: string;
    active: boolean;
}

export interface PropsUserPer {
    readonly id: string;
    avatar: any;
    fullName: string;
    address: string;
    gender: number;
    birthday: string;
    background: any;
    biography: string;
    active: boolean;
    occupation: string;
    schoolName: string;
    skill: string[];
    hobby: string[];
    firstPage: string;
    secondPage: string;
    thirdPage: string;
    mores: PropsMores[];
    userRequest:
        | {
              id: string;
              idRequest: string;
              idIsRequested: string;
              level: number;
              createdAt: string | Date;
              updatedAt: string | Date;
          }[];
    userIsRequested:
        | {
              id: string;
              idRequest: string;
              idIsRequested: string;
              level: number;
              createdAt: string | Date;
              updatedAt: string | Date;
          }[];
    isLoved:
        | {
              id: string;
              userId: string;
              idIsLoved: string;
              createdAt: string | Date;
          }[];
    loved:
        | {
              id: string;
              userId: string;
              idIsLoved: string;
              createdAt: string | Date;
          }[];
    followings:
        | {
              id: string;
              idFollowing: string;
              idIsFollowed: string;
              following: number;
              followed: number;
              createdAt: string | Date;
          }[];
    followed:
        | {
              id: string;
              idFollowing: string;
              idIsFollowed: string;
              following: number;
              followed: number;
              createdAt: string | Date;
          }[];
    accountUser: {
        account: {
            id: string;
            fullName: string;
            avatar: string | null;
            gender: number;
            phoneNumberEmail: string;
        };
    }[];
}
