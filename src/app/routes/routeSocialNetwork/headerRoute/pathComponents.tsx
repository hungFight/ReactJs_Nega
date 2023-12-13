import { Home, Exchange, CallVideo, MakingFriends } from '~/social_network/components/Header/importLayoutComponents';
interface Routes {
    home: string;
    exchange: string;
    callVideo: string;
    people: string;
    homeSlug: string;
    exchangeSlug: string;
    callVideoSlug: string;
}

const routes: Routes = {
    home: '/sn/',
    exchange: '/sn/exchange',
    callVideo: '/sn/callVideo',
    people: '/sn/people',
    homeSlug: '/sn/:slug',
    exchangeSlug: '/sn/exchange/:slug',
    callVideoSlug: '/sn/callVideo/:slug',
};
const components = {
    Home,
    Exchange,
    CallVideo,
    MakingFriends,
};

export { routes, components };
