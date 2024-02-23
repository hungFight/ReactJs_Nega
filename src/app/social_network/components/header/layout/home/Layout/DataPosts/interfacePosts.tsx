import { ReactElement } from 'react';
import { PropsUserHome } from '../../Home';
import { PropsFormHome } from '../FormUpNews/FormUpNews';

interface feel {
    amount: number;
    like: {
        act: number;
        id_user: string[];
    };
    love: {
        act: number;
        id_user: string[];
    };
    smile: {
        act: number;
        id_user: string[];
    };
    sad: {
        act: number;
        id_user: string[];
    };
    angry: {
        act: number;
        id_user: string[];
    };
    only: {
        id: number;
        icon: string;
    }[];
    act: number;
}
export interface PropsDataPosts {
    _id: string;
    user: { Avatar: Buffer; fullName: string; gender: number }[];
    category: number;
    id_user: string;
    feel: feel;
    commentsOne: {
        id_user: string;
        content: {
            text: string;
            imageOrVideos: {
                file: string[];
                feel: feel;
            };
        };
        feel: feel;
        reply: [
            {
                id_user: { type: string; maxLength: 50; required: true };
                content: { text: { type: string; text: string }; imageOrVideos: [String] };
                anonymous: { type: Boolean; defaultValue: false };
            },
        ];
    };
    amountComments: number;
    content: {
        text: string;
        fontFamily: string;
        options: {
            default: {
                comments: {
                    id_user: string;
                    content: {
                        text: string;
                        file: string[];
                    };
                    feel: feel;
                    reply: [
                        {
                            id_user: string;
                            content: {
                                text: string;
                                file: string[];
                            };
                            feel: feel;
                        },
                    ];
                };
                file: { link: string; type: string };
                love: { id_user: string[] };
                title: string;
                _id: string;
            }[];
            swiper: {
                id: number;
                name: string;
                data: {
                    file: string[];
                    data?: {
                        file: string[];
                        centered: {
                            id: number;
                            column: number;
                            data: string[];
                        };
                    };
                };
            };
            grid: {
                file: string[];
                BgColor: string;
                column: number;
            };
            onlyImage: string[];
        };
    };
    anonymous: boolean;
    private: {
        id: number;
        name: string;
    }[];
    createdAt: string;
}

export interface PropsPosts {
    user: PropsUserHome;
    colorBg: number;
    colorText: string;
    dataPosts: PropsDataPosts;
    setOptions: React.Dispatch<React.SetStateAction<string>>;
    options: string;
    setFormThat: React.Dispatch<
        React.SetStateAction<ReactElement<any, string | React.JSXElementConstructor<any>> | null>
    >;
    form: PropsFormHome;
}
