export interface PropsChangeP {
    Next: React.ReactNode;
    setWhatKind: React.Dispatch<React.SetStateAction<string>>;
    phoneMail: string | number;
    setEnable: React.Dispatch<React.SetStateAction<boolean>>;
}

export type PropsAccount = {
    id: string;
    fullName: string;
    nickName: string | undefined;
    avatar: string | undefined;
    gender: number;
};
