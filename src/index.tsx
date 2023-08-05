import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Globalestyle from './app/globalestyle';
import 'moment/locale/vi';
import { Provider } from 'react-redux';
import { store, persistor } from '~/redux/configStore';
import { BrowserRouter as Router } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Globalestyle>
                        <App />
                    </Globalestyle>
                    <ReactQueryDevtools initialIsOpen={false} />
                </PersistGate>
            </Provider>
        </QueryClientProvider>
    </Router>,
    //  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
