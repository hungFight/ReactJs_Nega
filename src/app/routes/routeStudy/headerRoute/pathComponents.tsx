import { Home, Personalpage } from '~/Pages/study/components/header/importLayoutComponents';
interface Routes {
    home: string;
    Personalpage: string;
}

const routes: Routes = {
    home: '/SD',
    Personalpage: '/SD/personalPage',
};
const components = {
    Home,
    Personalpage,
};

export { routes, components };
