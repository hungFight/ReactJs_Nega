import Avatar from '~/reUsingComponents/Avatars/Avatar';
import { DivPos } from '~/reUsingComponents/styleComponents/styleComponents';
import { Div, P } from '~/reUsingComponents/styleComponents/styleDefault';

const MoreOption: React.FC<{
    dataMore: {
        id_room: string;
        id: string;
        avatar: string;
        fullName: string;
        gender: number;
        options: {
            name: string;
            icon: React.ReactElement;
            id: number;
            load?: boolean;
            onClick: () => any;
        }[];
    };
    colorText: string;
    setMoreBar: React.Dispatch<
        React.SetStateAction<{ id_room: string; id: string; avatar: string; fullName: string; gender: number }>
    >;
}> = ({ dataMore, colorText, setMoreBar }) => {
    return (
        <DivPos
            width="100%"
            bottom="0"
            left="0"
            css="height: 82%; background-color: #1c1d1e7d; border-radius: 0; align-items: flex-end;"
            onClick={() => setMoreBar({ id_room: '', id: '', avatar: '', fullName: '', gender: 0 })}
        >
            <Div
                display="block"
                css={`
                    width: 100%;
                    height: 60%;
                    padding-top: 8px;
                    background-color: #181919;
                    cursor: var(--pointer);
                    color: ${colorText};
                `}
                onClick={(e) => e.stopPropagation()}
            >
                <Div wrap="wrap" css="justify-content: center; padding: 5px; border-bottom: 1px solid #444848cc;">
                    <Avatar
                        src={dataMore.avatar}
                        alt={dataMore.fullName}
                        gender={dataMore.gender}
                        css="width: 45px; height: 45px; margin-bottom: 5px;"
                        radius="50%"
                    />
                    <P z="1.4rem" css="width: 100%; text-align: center;">
                        {dataMore.fullName}
                    </P>
                </Div>
                {dataMore.options.map((item) => (
                    <Div
                        key={item.id}
                        width="100%"
                        css={`
                            align-items: center;
                            padding: 8px 7px;
                            cursor: var(--pointer);
                            ${item?.load ? 'cursor: no-drop' : ''};
                        `}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!item.load) item.onClick();
                        }}
                    >
                        <Div css="margin: 0 5px;">{item.icon}</Div>
                        <P z="1.3rem">{item.name}</P>
                    </Div>
                ))}
            </Div>
        </DivPos>
    );
};
export default MoreOption;
