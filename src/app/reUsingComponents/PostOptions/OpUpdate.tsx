import { CloseI, EyedI, EyemI, GarbageI, InventionI, PinI, StorageI } from '~/assets/Icons/Icons';
import { DivPos } from '../styleComponents/styleComponents';
import { Div, P } from '../styleComponents/styleDefault';

const OpUpdate: React.FC<{
    createdAt: string;
    setOptions: React.Dispatch<React.SetStateAction<string>>;
    onClick: () => void;
}> = ({ createdAt, setOptions, onClick }) => {
    const options = [
        {
            type: 'background',
            children: [
                { id: 1, name: 'Gim on personal profile', icon: <PinI /> },
                { id: 2, name: 'Temporary of hiding', icon: <EyedI /> },
            ],
        },
        {
            type: 'data',
            children: [
                { id: 1, name: 'Update', icon: <InventionI /> },
                { id: 2, name: 'Move to repository', icon: <StorageI /> },
                { id: 3, name: 'Move to trash', icon: <GarbageI /> },
            ],
        },
    ];
    return (
        <Div
            width="100%"
            css={`
                height: 100%;
                position: fixed;
                right: 0;
                align-items: end;
                top: 0px;
                z-index: 999;
                background-color: #151515b0;
            `}
            onClick={() => setOptions('')}
        >
            {/* <Div
                width="100%"
                css={`
                    height: 35px;
                    justify-content: center;
                    align-items: center;
                `}
            >
                <DivPos top="8px" right="8px" size="20px" onClick={() => setOptions('')}>
                    <CloseI />
                </DivPos>
            </Div> */}
            <Div
                width="100%"
                display="block"
                css="height: auto;padding: 10px;background-color: #fff; color: #171717;  border-top-left-radius: 5px; border-top-right-radius: 5px;"
                onClick={(e) => e.stopPropagation()}
            >
                {options.map((o) => (
                    <Div key={o.type} display="block" css={``} onClick={onClick}>
                        <P css="border-top-left-radius: 20px;margin: 10px 0; border-top-right-radius: 20px; border: 1px solid #969696; padding: 2px; background-color: #b8b8b8; font-weight: 600;"></P>
                        {o.children.map((c) => (
                            <Div key={c.id} css="align-items: center; cursor: var(--pointerR);padding-left: 5px;">
                                <Div css="margin-right: 5px">{c.icon}</Div>
                                <P>{c.name}</P>
                            </Div>
                        ))}
                    </Div>
                ))}
            </Div>
        </Div>
    );
};
export default OpUpdate;
