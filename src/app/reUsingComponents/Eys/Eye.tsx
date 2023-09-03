import { useState } from 'react';
import { EyedI, EyemI } from '~/assets/Icons/Icons';
import { Peye } from '../styleComponents/styleComponents';
interface PropsEye {
    value: string;
    setShow: React.Dispatch<
        React.SetStateAction<{
            icon: boolean;
            check: number;
        }>
    >;
    show: {
        icon: boolean;
        check: number;
    };
    top: string;
    right?: string;
}
const Eyes: React.FC<PropsEye> = ({ value, setShow, show, top, right }) => {
    console.log('eye', value);

    return (
        <>
            {show.icon && (
                <>
                    {show.check && value ? (
                        <Peye onClick={() => setShow({ ...show, check: 0 })} top={top} right={right}>
                            <EyemI />
                        </Peye>
                    ) : (
                        <Peye onClick={() => setShow({ ...show, check: 1 })} top={top} right={right}>
                            <EyedI />
                        </Peye>
                    )}
                </>
            )}
        </>
    );
};
export default Eyes;
