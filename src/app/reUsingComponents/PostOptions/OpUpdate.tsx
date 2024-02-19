import { CloseI, GarbageI } from '~/assets/Icons/Icons';
import { DivPos } from '../styleComponents/styleComponents';
import { Div, P } from '../styleComponents/styleDefault';

const OpUpdate: React.FC<{ createdAt: string; setOptions: React.Dispatch<React.SetStateAction<string>> }> = ({
    createdAt,
    setOptions,
}) => {
    const options = [{ type: "Post's data", children: [{ id: 1, name: 'Move to trash', icon: <GarbageI /> }] }];
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
                css="height: auto;padding: 5px;background-color: #fff; color: #171717; font-size: 1.5rem; border-top-left-radius: 5px; border-top-right-radius: 5px;"
            >
                {options.map((o) => (
                    <Div key={o.type} display="block" css={``}>
                        <P css="border-top-left-radius: 5px;border-top-right-radius: 5px; padding-left: 5px; background-color: #b8b8b8; font-weight: 600;">
                            {o.type}
                        </P>
                        {o.children.map((c) => (
                            <Div key={c.id} css="align-items: center;">
                                <Div>{c.icon}</Div>
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
