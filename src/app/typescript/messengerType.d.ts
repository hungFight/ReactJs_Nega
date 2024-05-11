import { PropsChat } from '~/Message/Messenger/Conversation/LogicConver';

export interface PropsPinC {
    chatId: string;
    userId: string;
    createdAt: string;
    latestChatId: string;
    _id: string;
}
export interface PropsRooms {
    rooms: PropsItemRoom[];
}
export interface PropsImageOrVideosAtMessenger {
    type: string;
    tail: string;
    link?: string;
    icon: string;
    _id: string;
}
export interface PropsItemsData {
    _id: string;
    userId: string;
    text: {
        t: string;
        icon: string;
    };
    delete?: string | 'all';
    secondary?: string;
    length?: number;
    imageOrVideos: PropsImageOrVideosAtMessenger[];
    sending?: boolean;
    seenBy: { id: string; createdAt: string }[];
    updatedAt: string;
    createdAt: string;
    reply: {
        id_room: string;
        id_reply: string;
        id_replied: string;
        text: string;
        imageOrVideos: PropsImageOrVideosAtMessenger[];
    };
}

export interface PropsItemRoom {
    _id: string;
    chatId: string;
    full: boolean;
    index: number;
    createdAt: string | Date;
    count: number;
    filter: {
        _id: string;
        count: number;
        full: boolean;
        index: number;
        indexQuery: number;
        createdAt: string | Date;
        data: PropsItemsData[];
    }[];
}
export interface PropsRoom {
    rooms: PropsItemRoom;
}
export interface PropsBackground_chat {
    v: string;
    type: string;
    id: string;
    userId: string;
}
export interface PropsItemOperationsCon {
    _id: string;
    userId: string;
    createdAt: string;
    title: string;
    dataId: string;
}

export interface PropsConversationCustoms {
    _id: string;
    id_us: string[];
    miss?: number;
    user: {
        id: string;
        fullName: string;
        avatar: string | undefined;
        gender: number;
    };
    users: {
        id: string;
        fullName: string;
        avatar: string | undefined;
        gender: number;
    }[];
    status: string;
    statusOperation: PropsItemOperationsCon[];
    background?: PropsBackground_chat;
    pins: PropsPinC[];
    deleted: {
        id: string;
        createdAt: string;
        show?: boolean;
    }[];
    createdAt: string;
    lastElement: { roomId: string; filterId: string };
}
export interface PropsDataMoreConversation {
    options: {
        id: number;
        load?: boolean;
        name: string;
        device?: string;
        color?: string;
        icon: JSX.Element;
        onClick: (e?: any) => void;
    }[];
    conversationId: string | undefined;
    id: string | undefined;
    avatar: string | undefined;
    fullName: string | undefined;
    gender: number | undefined;
}
export interface PropsOldSeenBy {
    roomId: string;
    data: { filterId: string; data: { dataId: string; userId: string }[] }[];
}
export type PropsItemQueryChat = { indexRef: number; indexQuery: number; data: PropsChat; load: { id: string; status: string }[]; oldSeenBy: PropsOldSeenBy[] } | undefined;
