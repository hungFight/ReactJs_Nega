import moment from 'moment';
import React from 'react';

const moments = () => {
    const FromNow = (dateTime: string, format: string, preFormat: string, lg: string) => {
        return moment(moment(dateTime).format(format), preFormat).locale(lg).fromNow();
    };
    const Format = (dateTime: string, format: string, lg: string) => {
        return moment(dateTime).locale(lg).format(format);
    };
    return {
        FromNow,
        Format,
    };
};

export default moments;
