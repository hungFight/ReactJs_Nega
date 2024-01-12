import {
    Home,
    Exchange,
    CallVideo,
    MakingFriends,
    PersonalPage,
} from '~/social_network/components/Header/importLayoutComponents';
interface Routes {
    home: string;
    exchange: string;
    callVideo: string;
    people: string;
    profile: string;
}

const routes: Routes = {
    home: '/social/',
    exchange: '/social/exchange',
    callVideo: '/social/callVideo',
    people: '/social/people',
    profile: '/social/profile',
};
const components = {
    Home,
    Exchange,
    CallVideo,
    MakingFriends,
    PersonalPage,
};

export { routes, components };
