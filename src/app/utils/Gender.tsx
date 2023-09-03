import React from 'react';

const Gender = (val: number | string) => {
    return {
        string: val === 0 ? 'Male' : val === 1 ? 'Female' : 'Other',
        number: val === 'Male' ? 0 : val === 'Female' ? 1 : 2,
    };
};

export default Gender;
