import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Globalestyle from './app/globalestyle';
import jwt_decode from 'jwt-decode';
import 'moment/locale/vi';
import { Provider } from 'react-redux';
import { onError } from '@apollo/client/link/error';
import { store, persistor } from '~/redux/configStore';
import { BrowserRouter as Router } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const client = new ApolloClient({
    uri: process.env.REACT_APP_SPACESHIP,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
    cache: new InMemoryCache(),
    credentials: 'include',
    link: onError(({ networkError, operation, forward }) => {
        console.log('check Refresh', document.cookie);
        const date = new Date();
        // const decodeToken: any = await jwt_decode(tokenN);

        // if (decodeToken.exp < date.getTime() / 1000 + 5) {
        //     console.log(decodeToken.exp, date.getTime() / 1000 + 2, token, 'hhhh');

        //     const data = await authHttpRequest.refreshToken();

        //     console.log(data.newAccessToken, 'newAccessToken');

        //     if (data) {
        //         const newToken = 'Bearer ' + data.newAccessToken;
        //         tokenN = newToken;
        //         Cookies.set('tks', newToken, {
        //             path: '/',
        //             secure: false,
        //             sameSite: 'strict',
        //             expires: new Date(new Date().getTime() + 30 * 86409000),
        //         });
        //     }
        // }
    }),
});
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false, // default: true
        },
    },
});
root.render(
    //<React.StrictMode>
    <Router>
        <ApolloProvider client={client}>
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <ReactQueryDevtools />
                        <Globalestyle>
                            <App />
                        </Globalestyle>
                    </PersistGate>
                </Provider>
            </QueryClientProvider>
        </ApolloProvider>
    </Router>,
    //  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
