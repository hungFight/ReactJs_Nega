import { CloseI } from '~/assets/Icons/Icons';
import { DivPos } from '../styleComponents/styleComponents';
import { Div, P } from '../styleComponents/styleDefault';

const OpUpdate: React.FC<{ createdAt: string; setOptions: React.Dispatch<React.SetStateAction<string>> }> = ({
    createdAt,
    setOptions,
}) => {
    return (
        <Div
            width="300px"
            wrap="wrap"
            css={`
                height: 84%;
                position: absolute;
                right: 0;
                top: 30px;
                z-index: 1;
                background-color: #292a2d;
            `}
        >
            <Div
                width="100%"
                css={`
                    height: 35px;
                    justify-content: center;
                    align-items: center;
                `}
            >
                <P z="1.5rem">Optional Update</P>
                <DivPos top="8px" right="8px" size="20px" onClick={() => setOptions('')}>
                    <CloseI />
                </DivPos>
            </Div>
            <Div width="100%"></Div>
        </Div>
    );
};
export default OpUpdate;
