import moment from 'moment';
import 'moment/locale/vi';
moment.updateLocale('en', {
    relativeTime: {
        future: 'in %s',
        past: '%s',
        s: 'just now',
        ss: '%ds ago',
        m: '1m ago',
        mm: '%dms ago',
        h: '1h ago',
        hh: '%dhs ago',
        d: '1d ago',
        dd: '%dds ago',
        w: '1w ago',
        ww: '%dws ago',
        M: '1m ago',
        MM: '%dms ago',
        y: '1y ago',
        yy: '%dys ago',
    },
});
moment.updateLocale('vi', {
    relativeTime: {
        future: 'in %s',
        past: '%s',
        s: 'vừa xong',
        ss: '%d giây',
        m: '1 phút',
        mm: '%d phút',
        h: '1 giờ',
        hh: '%d giờ',
        d: '1 ngày',
        dd: '%d ngày',
        w: '1t ngày',
        ww: '%dt ngày',
        M: '1 tháng',
        MM: '%d tháng',
        y: '1 năm',
        yy: '%d năm',
    },
});
