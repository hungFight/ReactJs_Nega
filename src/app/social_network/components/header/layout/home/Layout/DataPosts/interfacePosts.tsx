import { ReactElement } from 'react';
import { PropsFormHome } from '../FormUpNews/FormUpNews';
import { PropsUser } from '~/typescript/userType';

export interface feel {
    onlyEmo: {
        id: number;
        icon: string;
        id_user: string[];
    }[];
    act: number;
}
export interface PropsCommentsIN {
    _id: string;
    id_user: string;
    user: {
        id: string;
        fullName: string;
        avatar: string | null;
        gender: number;
    };
    content: {
        text: string;
        imageOrVideos: string[];
    };
    feel: feel;
    reply: {
        id_user: string;
        content: { text: string; imageOrVideos: string[] };
        anonymous: boolean;
    }[];
    anonymous: boolean;
    createdAt: string;
}
export interface PropsComments {
    _id: string;
    postId: string;
    count: number;
    full: boolean;
    data: PropsCommentsIN[];
}
export interface PropsDataPosts {
    _id: string;
    user: { id: string; avatar: Buffer | undefined; fullName: string; gender: number }[];
    category: number;
    background: string;
    id_user: string;
    hashTag: { _id: string; value: string }[];
    feel: feel;
    amountComments: number;
    content: {
        text: string;
        fontFamily: string;
        default: { file: { id_sort: number; link: string; type: string; width: string; height: string }; love: { id_user: string[] }; title: string; _id: string }[];
    };
    whoCanSeePost: { id: string; name: string };
    anonymous: boolean;
    private: {
        id: string;
        name: string;
    }[];
    createdAt: string;
}

export interface PropsPosts {
    user: PropsUser;
    setShowComment: React.Dispatch<React.SetStateAction<string>>;
    showComment: string;
    colorBg: number;
    colorText: string;
    dataP: PropsDataPosts;
    setOptions: React.Dispatch<React.SetStateAction<string>>;
    options: string;
    setFormThat: React.Dispatch<React.SetStateAction<ReactElement<any, string | React.JSXElementConstructor<any>> | null>>;
    form: PropsFormHome;
}
